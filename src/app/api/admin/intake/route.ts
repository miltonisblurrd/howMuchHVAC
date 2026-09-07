import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createPortalSetupLink, provisionPortalFromLead } from "@/lib/portal-provision";
import { sendPhoneIntakeEmail } from "@/lib/email";
import { sendAppointmentSms } from "@/lib/sms";
import { formatWhen } from "@/lib/db-types";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(40),
  address: z.string().trim().max(200).optional().nullable(),
  city: z.string().trim().max(120).optional().nullable(),
  service: z.string().trim().max(120).optional().nullable(),
  notes: z.string().trim().max(4000).optional().nullable(),
  startsAt: z.string().optional().nullable(),
  endsAt: z.string().optional().nullable(),
  visitType: z.enum(["diagnostic", "install", "maintenance", "follow_up"]).optional(),
  techName: z.string().trim().max(80).optional().nullable(),
});

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Name, a real email, and a phone number are required." },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const admin = getSupabaseAdmin();
  const city = input.city?.trim() || null;
  const address = input.address?.trim() || null;
  const noteParts = [
    address ? `Address: ${address}` : null,
    input.notes?.trim() || null,
    "Added by Andy from a phone call.",
  ].filter(Boolean);
  const message = noteParts.join("\n\n");

  const { data: lead, error: leadError } = await admin
    .from("leads")
    .insert({
      name: input.name,
      email: input.email.trim().toLowerCase(),
      phone: input.phone,
      city,
      service: input.service || null,
      message,
      source_path: "/admin/intake",
      source_label: "Phone call",
      status: "new",
    })
    .select("id")
    .single();

  if (leadError || !lead) {
    return NextResponse.json(
      { ok: false, error: leadError?.message || "Could not save the lead." },
      { status: 500 },
    );
  }

  let provisioned;
  try {
    provisioned = await provisionPortalFromLead({
      name: input.name,
      email: input.email,
      phone: input.phone,
      city,
      service: input.service,
      message,
      leadId: lead.id,
    });
  } catch (err) {
    console.error("[intake] provision failed", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Could not create the portal account." },
      { status: 500 },
    );
  }

  let whenLabel: string | null = null;
  if (input.startsAt && input.endsAt) {
    const insert = {
      job_id: provisioned.job.id,
      type: input.visitType || "diagnostic",
      starts_at: input.startsAt,
      ends_at: input.endsAt,
      status: "confirmed",
      booked_by: "admin",
      tech_name: input.techName || null,
    };
    let { error: apptError } = await admin.from("appointments").insert(insert);
    if (apptError) {
      const retry = await admin.from("appointments").insert({
        job_id: insert.job_id,
        type: insert.type,
        starts_at: insert.starts_at,
        ends_at: insert.ends_at,
        status: insert.status,
        booked_by: insert.booked_by,
      });
      apptError = retry.error;
    }
    if (!apptError) {
      whenLabel = formatWhen(input.startsAt);
      await admin
        .from("jobs")
        .update({ status: "scheduled", updated_at: new Date().toISOString() })
        .eq("id", provisioned.job.id);
      await admin.from("job_events").insert({
        job_id: provisioned.job.id,
        title: "Visit scheduled by Andy",
        detail: `${whenLabel}${input.techName ? ` ? ${input.techName}` : ""}`,
      });
      await sendAppointmentSms({
        toPhone: input.phone,
        whenLabel,
        jobTitle: provisioned.job.title,
      });
    }
  }

  const setupLink =
    (await createPortalSetupLink(provisioned.profile.email)) || provisioned.loginUrl;

  const emailResult = await sendPhoneIntakeEmail({
    name: input.name,
    email: provisioned.profile.email,
    service: input.service,
    city,
    whenLabel,
    inviteUrl: setupLink,
  });

  if (emailResult.sent) {
    await admin
      .from("profiles")
      .update({
        invited_at: new Date().toISOString(),
        invite_count: (provisioned.profile.invite_count || 0) + 1,
      })
      .eq("id", provisioned.profile.id);
    await admin
      .from("leads")
      .update({ portal_invited_at: new Date().toISOString() })
      .eq("id", lead.id);
  }

  return NextResponse.json({
    ok: true,
    leadId: lead.id,
    jobId: provisioned.job.id,
    emailSent: emailResult.sent,
    scheduled: Boolean(whenLabel),
    whenLabel,
  });
}
