import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendAppointmentEmail } from "@/lib/email";
import { sendPortalInvite } from "@/lib/portal-provision";
import { sendAppointmentSms } from "@/lib/sms";
import { formatWhen } from "@/lib/db-types";

const createSchema = z.object({
  jobId: z.string().uuid(),
  startsAt: z.string(),
  endsAt: z.string(),
  type: z.enum(["diagnostic", "install", "maintenance", "follow_up"]).default("diagnostic"),
  techName: z.string().trim().max(80).optional(),
});

const patchSchema = z.object({
  appointmentId: z.string().uuid(),
  action: z.enum(["confirm", "decline"]),
  techName: z.string().trim().max(80).optional(),
});

async function requireAdminProfile() {
  const user = await getSessionUser();
  if (!user) return { error: NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 }) };
  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") {
    return { error: NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 }) };
  }
  return { profile };
}

export async function POST(request: Request) {
  const auth = await requireAdminProfile();
  if ("error" in auth) return auth.error;

  const parsed = createSchema.safeParse(await request.json());
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

  const insert = {
    job_id: job.id,
    type: parsed.data.type,
    starts_at: parsed.data.startsAt,
    ends_at: parsed.data.endsAt,
    status: "confirmed",
    booked_by: "admin",
    tech_name: parsed.data.techName || null,
  };

  let { data: appt, error } = await admin.from("appointments").insert(insert).select("*").single();
  if (error) {
    const fallback = {
      job_id: insert.job_id,
      type: insert.type,
      starts_at: insert.starts_at,
      ends_at: insert.ends_at,
      status: insert.status,
      booked_by: insert.booked_by,
    };
    const retry = await admin.from("appointments").insert(fallback).select("*").single();
    if (retry.error) {
      return NextResponse.json({ ok: false, error: retry.error.message }, { status: 500 });
    }
    appt = retry.data;
  }

  await admin
    .from("jobs")
    .update({ status: "scheduled", updated_at: new Date().toISOString() })
    .eq("id", job.id);

  await admin.from("job_events").insert({
    job_id: job.id,
    title: "Visit scheduled by Andy",
    detail: `${formatWhen(parsed.data.startsAt)}${parsed.data.techName ? ` · ${parsed.data.techName}` : ""}`,
  });

  await notifyCustomer(
    admin,
    {
      title: String(job.title ?? "Job"),
      customer_id: String(job.customer_id),
      profiles: job.profiles as {
        name?: string;
        email?: string;
        phone?: string | null;
      } | null,
    },
    parsed.data.startsAt,
  );
  return NextResponse.json({ ok: true, appointment: appt, invitePrompted: true });
}

export async function PATCH(request: Request) {
  const auth = await requireAdminProfile();
  if ("error" in auth) return auth.error;

  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid update" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: appt } = await admin
    .from("appointments")
    .select("*, jobs(*, profiles!customer_id(name, email, phone))")
    .eq("id", parsed.data.appointmentId)
    .maybeSingle();
  if (!appt) return NextResponse.json({ ok: false, error: "Appointment not found" }, { status: 404 });

  const job = appt.jobs as {
    id: string;
    title: string;
    customer_id: string;
    profiles?: { name?: string; email?: string; phone?: string | null } | null;
  } | null;
  if (!job) return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });

  if (parsed.data.action === "decline") {
    await admin.from("appointments").update({ status: "cancelled" }).eq("id", appt.id);
    await admin.from("job_events").insert({
      job_id: job.id,
      title: "Requested time declined",
      detail: formatWhen(appt.starts_at),
    });
    return NextResponse.json({ ok: true });
  }

  const update: Record<string, string | null> = { status: "confirmed" };
  if (parsed.data.techName) update.tech_name = parsed.data.techName;

  const { error } = await admin.from("appointments").update(update).eq("id", appt.id);
  if (error && parsed.data.techName) {
    await admin.from("appointments").update({ status: "confirmed" }).eq("id", appt.id);
  }

  await admin
    .from("jobs")
    .update({ status: "scheduled", updated_at: new Date().toISOString() })
    .eq("id", job.id);

  await admin.from("job_events").insert({
    job_id: job.id,
    title: "Visit confirmed",
    detail: `${formatWhen(appt.starts_at)}${parsed.data.techName ? ` · ${parsed.data.techName}` : ""}`,
  });

  await notifyCustomer(admin, { ...job, profiles: job.profiles }, appt.starts_at);
  return NextResponse.json({ ok: true });
}

async function notifyCustomer(
  admin: ReturnType<typeof getSupabaseAdmin>,
  job: {
    id?: string;
    title: string;
    customer_id: string;
    profiles?: { name?: string; email?: string; phone?: string | null } | null;
  },
  startsAt: string,
) {
  const customer = job.profiles;
  if (customer?.email) {
    await sendAppointmentEmail({
      name: customer.name || "there",
      email: customer.email,
      whenLabel: formatWhen(startsAt),
      jobTitle: job.title,
    });
    await sendAppointmentSms({
      toPhone: customer.phone,
      whenLabel: formatWhen(startsAt),
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
}
