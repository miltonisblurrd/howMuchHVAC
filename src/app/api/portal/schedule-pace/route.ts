import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SCHEDULE_PACE_LABELS } from "@/lib/schedule-pace";
import type { SchedulePace } from "@/lib/db-types";

const schema = z.object({
  jobId: z.string().uuid(),
  pace: z.enum(["asap", "this_week", "this_weekend", "no_rush"]),
});

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "customer") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Pick ASAP, this week, this weekend, or no rush." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: job } = await admin
    .from("jobs")
    .select("id, customer_id")
    .eq("id", parsed.data.jobId)
    .eq("customer_id", profile.id)
    .maybeSingle();
  if (!job) return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });

  const pace = parsed.data.pace as SchedulePace;
  await admin.from("job_events").insert({
    job_id: job.id,
    title: "Install pace",
    detail: `${profile.name || "Customer"} asked for ${SCHEDULE_PACE_LABELS[pace]}. Andy sets the date.`,
  });
  await admin
    .from("jobs")
    .update({ schedule_pace: pace, updated_at: new Date().toISOString() })
    .eq("id", job.id);

  return NextResponse.json({ ok: true, pace });
}
