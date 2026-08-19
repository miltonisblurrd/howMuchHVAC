import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendNewMessageEmail } from "@/lib/email";
import { sendLeadSmsAlert } from "@/lib/sms";
import { formatWhen } from "@/lib/db-types";
import { site } from "@/lib/site";
import { getBusinessSettings } from "@/lib/business";

const schema = z.object({
  jobId: z.string().uuid(),
  startsAt: z.string(),
  note: z.string().trim().max(500).optional().default(""),
});

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Pick a valid day and time" }, { status: 400 });
  }

  const start = new Date(parsed.data.startsAt);
  if (Number.isNaN(start.getTime()) || start.getTime() < Date.now() - 5 * 60 * 1000) {
    return NextResponse.json({ ok: false, error: "Pick a future time" }, { status: 400 });
  }
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const admin = getSupabaseAdmin();
  const { data: job } = await admin
    .from("jobs")
    .select("*")
    .eq("id", parsed.data.jobId)
    .eq("customer_id", profile.id)
    .maybeSingle();
  if (!job) return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });

  const row = {
    job_id: job.id,
    type: "diagnostic" as const,
    starts_at: start.toISOString(),
    ends_at: end.toISOString(),
    status: "pending",
    booked_by: "customer",
    notes: parsed.data.note || null,
    customer_note: parsed.data.note || null,
  };

  const { data: appt, error } = await admin.from("appointments").insert(row).select("*").single();

  if (error) {
    const fallback = {
      job_id: row.job_id,
      type: row.type,
      starts_at: row.starts_at,
      ends_at: row.ends_at,
      status: row.status,
      booked_by: row.booked_by,
      notes: row.notes,
    };
    const retry = await admin.from("appointments").insert(fallback).select("*").single();
    if (retry.error) {
      return NextResponse.json({ ok: false, error: retry.error.message }, { status: 500 });
    }
    await afterRequest(
      admin,
      {
        id: String(job.id),
        title: String(job.title ?? "Job"),
        city: (job.city as string | null) ?? null,
        service: (job.service as string | null) ?? null,
      },
      profile,
      start,
    );
    return NextResponse.json({ ok: true, appointment: retry.data });
  }

  await afterRequest(
    admin,
    {
      id: String(job.id),
      title: String(job.title ?? "Job"),
      city: (job.city as string | null) ?? null,
      service: (job.service as string | null) ?? null,
    },
    profile,
    start,
  );
  return NextResponse.json({ ok: true, appointment: appt });
}

async function afterRequest(
  admin: ReturnType<typeof getSupabaseAdmin>,
  job: { id: string; title: string; city: string | null; service: string | null },
  profile: { name: string; email: string; phone: string | null },
  start: Date,
) {
  await admin.from("job_events").insert({
    job_id: job.id,
    title: "Visit time requested",
    detail: `${profile.name || profile.email} asked for ${formatWhen(start.toISOString())}. Waiting on Andy to confirm.`,
  });

  const settings = await getBusinessSettings();
  const notify = settings.notifyEmail || process.env.LEAD_NOTIFY_EMAIL || site.email;
  await Promise.allSettled([
    sendNewMessageEmail({
      toEmail: notify,
      toName: settings.displayName,
      fromLabel: profile.name || profile.email,
      preview: `Requested visit: ${formatWhen(start.toISOString())} ? ${job.title}`,
      portalUrl: `${site.url}/admin/schedule`,
    }),
    sendLeadSmsAlert({
      name: `Time request: ${profile.name || profile.email}`,
      phone: profile.phone,
      city: job.city,
      service: job.service,
    }),
  ]);
}
