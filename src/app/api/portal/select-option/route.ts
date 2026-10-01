import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { money } from "@/lib/db-types";
import { lockInDepositCents } from "@/lib/deposits";

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

  const { data: invoiceRows } = await admin
    .from("invoices")
    .select("id, description, status")
    .eq("job_id", job.id);

  const deposits = (invoiceRows || []).filter(
    (row) => /deposit/i.test(row.description || "") && row.status !== "void",
  );
  if (deposits.some((row) => row.status === "paid")) {
    return NextResponse.json(
      {
        ok: false,
        error: "Your deposit is paid, so this choice is locked. Message Andy to change it.",
      },
      { status: 409 },
    );
  }

  const switched = Boolean(job.selected_option_id && job.selected_option_id !== option.id);

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
    title: switched ? `Switched to ${option.name}` : `Selected ${option.name}`,
    detail: `Customer chose ${option.name} at ${money(option.price_cents)}.`,
  });

  // Lock-in deposit: 10% of the chosen price, capped at $1,000.
  // Switching the pick updates the open deposit instead of leaving the old amount.
  const deposit = lockInDepositCents(option.price_cents);
  const description = `Deposit to lock the price and install date — ${option.name} (${job.title})`;
  const open = deposits.filter((row) => row.status === "unpaid" || row.status === "overdue" || row.status === "draft");
  if (open.length && deposit > 0) {
    await admin
      .from("invoices")
      .update({
        amount_cents: deposit,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", open[0].id);
    if (open.length > 1) {
      await admin
        .from("invoices")
        .update({ status: "void", updated_at: new Date().toISOString() })
        .in(
          "id",
          open.slice(1).map((row) => row.id),
        );
    }
  } else if (deposit > 0) {
    const number = `HM-D-${Date.now().toString().slice(-8)}`;
    await admin.from("invoices").insert({
      job_id: job.id,
      customer_id: profile.id,
      number,
      description,
      amount_cents: deposit,
      status: "unpaid",
      due_at: new Date(Date.now() + 7 * 86400000).toISOString(),
    });
  }

  return NextResponse.json({ ok: true });
}
