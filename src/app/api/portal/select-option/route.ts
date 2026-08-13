import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { money } from "@/lib/db-types";

const schema = z.object({
  jobId: z.string().uuid(),
  optionId: z.string().uuid(),
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

  const { data: option } = await admin
    .from("job_options")
    .select("*")
    .eq("id", parsed.data.optionId)
    .eq("job_id", job.id)
    .maybeSingle();
  if (!option || !option.selectable) {
    return NextResponse.json({ ok: false, error: "Option not available" }, { status: 400 });
  }

  await admin
    .from("jobs")
    .update({
      selected_option_id: option.id,
      status: job.status === "quote_request" ? "estimate_ready" : job.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", job.id);

  await admin.from("job_events").insert({
    job_id: job.id,
    title: `Selected ${option.name}`,
    detail: `Customer chose ${option.name} at ${money(option.price_cents)}.`,
  });

  // Create a 20% deposit invoice if none unpaid exists for this job
  const { data: existing } = await admin
    .from("invoices")
    .select("id")
    .eq("job_id", job.id)
    .in("status", ["unpaid", "overdue", "draft"])
    .limit(1);

  if (!existing?.length) {
    const deposit = Math.round(option.price_cents * 0.2);
    const number = `HM-D-${Date.now().toString().slice(-8)}`;
    await admin.from("invoices").insert({
      job_id: job.id,
      customer_id: profile.id,
      number,
      description: `Deposit ? ${option.name} (${job.title})`,
      amount_cents: deposit,
      status: "unpaid",
      due_at: new Date(Date.now() + 7 * 86400000).toISOString(),
    });
  }

  return NextResponse.json({ ok: true });
}
