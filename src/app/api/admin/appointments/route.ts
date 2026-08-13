import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendAppointmentEmail } from "@/lib/email";
import { sendPortalInvite } from "@/lib/portal-provision";
import { sendAppointmentSms } from "@/lib/sms";
import { formatWhen } from "@/lib/db-types";

const schema = z.object({
  jobId: z.string().uuid(),
  startsAt: z.string(),
  endsAt: z.string(),
  type: z.enum(["diagnostic", "install", "maintenance", "follow_up"]).default("diagnostic"),
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
    return NextResponse.json({ ok: false, error: "Invalid appointment" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: job } = await admin
    .from("jobs")
    .select("*, profiles!customer_id(name, email, phone)")
    .eq("id", parsed.data.jobId)
    .maybeSingle();
  if (!job) return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });

  const { data: appt, error } = await admin
    .from("appointments")
    .insert({
      job_id: job.id,
      type: parsed.data.type,
      starts_at: parsed.data.startsAt,
      ends_at: parsed.data.endsAt,
      status: "confirmed",
      booked_by: "admin",
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  await admin
    .from("jobs")
    .update({ status: "scheduled", updated_at: new Date().toISOString() })
    .eq("id", job.id);

  await admin.from("job_events").insert({
    job_id: job.id,
    title: "Visit scheduled by Andy",
    detail: formatWhen(parsed.data.startsAt),
  });

  const customer = job.profiles as {
      id: string;
      name?: string;
      email?: string;
      phone?: string | null;
    } | null;
  if (customer?.email) {
    await sendAppointmentEmail({
      name: customer.name || "there",
      email: customer.email,
      whenLabel: formatWhen(parsed.data.startsAt),
      jobTitle: job.title,
    });
    await sendAppointmentSms({
      toPhone: customer.phone,
      whenLabel: formatWhen(parsed.data.startsAt),
      jobTitle: job.title,
    });

    const { data: authUser } = await admin.auth.admin.getUserById(job.customer_id);
    if (!authUser.user?.last_sign_in_at) {
      try {
        await sendPortalInvite(job.customer_id, "scheduled_resend");
      } catch (err) {
        console.error("[admin] schedule invite resend failed", err);
      }
    }
  }

  return NextResponse.json({ ok: true, appointment: appt, invitePrompted: true });
}
