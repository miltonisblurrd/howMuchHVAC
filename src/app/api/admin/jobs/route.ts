import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { JOB_STATUS_LABELS, type JobStatus } from "@/lib/db-types";

const STATUS_EVENT_TITLES: Record<JobStatus, string> = {
  quote_request: "Back to new request",
  scheduled: "First visit booked",
  estimate_ready: "Pricing sent",
  in_progress: "Install / project date set",
  completed: "Job completed",
  cancelled: "Job cancelled",
};

const optionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1),
  price_cents: z.number().int().min(0),
  description: z.string(),
  recommended: z.boolean().optional(),
});

const schema = z.object({
  jobId: z.string().uuid(),
  status: z
    .enum([
      "quote_request",
      "estimate_ready",
      "scheduled",
      "in_progress",
      "completed",
      "cancelled",
    ])
    .optional(),
  summary: z.string().optional(),
  options: z.array(optionSchema).optional(),
});

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: before } = await admin
    .from("jobs")
    .select("status")
    .eq("id", parsed.data.jobId)
    .maybeSingle();
  if (!before) return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (parsed.data.status) updates.status = parsed.data.status;
  if (parsed.data.summary !== undefined) updates.summary = parsed.data.summary;

  const { error } = await admin.from("jobs").update(updates).eq("id", parsed.data.jobId);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  if (parsed.data.status && parsed.data.status !== before.status) {
    await admin.from("job_events").insert({
      job_id: parsed.data.jobId,
      title: STATUS_EVENT_TITLES[parsed.data.status],
      detail: `Updated by Andy · ${JOB_STATUS_LABELS[parsed.data.status]}`,
    });
  }

  if (parsed.data.options) {
    await admin.from("job_options").delete().eq("job_id", parsed.data.jobId);
    if (parsed.data.options.length) {
      await admin.from("job_options").insert(
        parsed.data.options.map((o, i) => ({
          job_id: parsed.data.jobId,
          name: o.name,
          price_cents: o.price_cents,
          description: o.description,
          recommended: Boolean(o.recommended),
          selectable: true,
          sort_order: i,
        })),
      );
    }
    if (parsed.data.options.length && !parsed.data.status) {
      await admin
        .from("jobs")
        .update({ status: "estimate_ready" })
        .eq("id", parsed.data.jobId)
        .in("status", ["quote_request", "scheduled"]);
    }
    await admin.from("job_events").insert({
      job_id: parsed.data.jobId,
      title: "Options updated",
      detail: "Andy posted or updated Good / Better / Best packages.",
    });
  }

  return NextResponse.json({ ok: true });
}
