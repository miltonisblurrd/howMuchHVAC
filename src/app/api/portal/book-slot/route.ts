import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendAppointmentEmail } from "@/lib/email";
import { sendAppointmentSms } from "@/lib/sms";
import { formatWhen } from "@/lib/db-types";

const schema = z.object({
  jobId: z.string().uuid(),
  availabilityWindowId: z.string().uuid(),
});

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: job } = await admin
    .from("jobs")
    .select("*")
    .eq("id", parsed.data.jobId)
    .eq("customer_id", profile.id)
    .maybeSingle();
  if (!job) return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });

  const { data: window } = await admin
    .from("availability_windows")
    .select("*")
    .eq("id", parsed.data.availabilityWindowId)
    .eq("active", true)
    .maybeSingle();
  if (!window) {
    return NextResponse.json({ ok: false, error: "Slot unavailable" }, { status: 400 });
  }

  // Overlap check
  const { data: conflicts } = await admin
    .from("appointments")
    .select("id")
    .neq("status", "cancelled")
    .lt("starts_at", window.ends_at)
    .gt("ends_at", window.starts_at)
    .limit(1);

  if (conflicts?.length) {
    return NextResponse.json(
      { ok: false, error: "That slot was just taken. Pick another." },
      { status: 409 },
    );
  }

  const { data: appt, error } = await admin
    .from("appointments")
    .insert({
      job_id: job.id,
      availability_window_id: window.id,
      type: "diagnostic",
      starts_at: window.starts_at,
      ends_at: window.ends_at,
      status: "confirmed",
      booked_by: "customer",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  await admin.from("availability_windows").update({ active: false }).eq("id", window.id);
  await admin
    .from("jobs")
    .update({ status: "scheduled", updated_at: new Date().toISOString() })
    .eq("id", job.id);
  await admin.from("job_events").insert({
    job_id: job.id,
    title: "Visit scheduled",
    detail: `Customer booked ${formatWhen(window.starts_at)}.`,
  });

  await sendAppointmentEmail({
    name: profile.name || "there",
    email: profile.email,
    whenLabel: formatWhen(window.starts_at),
    jobTitle: job.title,
  });
  await sendAppointmentSms({
    toPhone: profile.phone,
    whenLabel: formatWhen(window.starts_at),
    jobTitle: job.title,
  });

  return NextResponse.json({ ok: true, appointment: appt });
}
