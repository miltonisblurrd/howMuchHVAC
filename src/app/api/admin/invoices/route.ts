import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendInvoiceEmail } from "@/lib/email";
import { money } from "@/lib/db-types";
import { site } from "@/lib/site";

const schema = z.object({
  jobId: z.string().uuid(),
  amountCents: z.number().int().positive(),
  description: z.string().trim().min(1).max(300),
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
    return NextResponse.json({ ok: false, error: "Invalid invoice" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: job } = await admin
    .from("jobs")
    .select("*, profiles!customer_id(*)")
    .eq("id", parsed.data.jobId)
    .maybeSingle();
  if (!job) return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });

  const customer = job.profiles as { name?: string; email?: string } | null;
  const number = `HM-${Date.now().toString().slice(-8)}`;

  const { data: invoice, error } = await admin
    .from("invoices")
    .insert({
      job_id: job.id,
      customer_id: job.customer_id,
      number,
      description: parsed.data.description,
      amount_cents: parsed.data.amountCents,
      status: "unpaid",
      due_at: new Date(Date.now() + 7 * 86400000).toISOString(),
    })
    .select("*")
    .single();

  if (error || !invoice) {
    return NextResponse.json({ ok: false, error: error?.message || "Failed" }, { status: 500 });
  }

  if (customer?.email) {
    await sendInvoiceEmail({
      name: customer.name || "there",
      email: customer.email,
      invoiceNumber: number,
      amountLabel: money(parsed.data.amountCents),
      payUrl: `${site.url}/portal/pay`,
      description: parsed.data.description,
    });
  }

  return NextResponse.json({ ok: true, invoice });
}

const patchSchema = z.object({
  invoiceId: z.string().uuid(),
  action: z.enum(["mark_paid", "resend"]),
});

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid invoice update" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: invoice } = await admin
    .from("invoices")
    .select("*, profiles!customer_id(name, email), jobs(title)")
    .eq("id", parsed.data.invoiceId)
    .maybeSingle();
  if (!invoice) return NextResponse.json({ ok: false, error: "Invoice not found" }, { status: 404 });

  const customer = invoice.profiles as { name?: string; email?: string } | null;

  if (parsed.data.action === "mark_paid") {
    const { error } = await admin
      .from("invoices")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoice.id);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    await admin.from("job_events").insert({
      job_id: invoice.job_id,
      title: "Invoice marked paid",
      detail: `${invoice.number} · cash / check`,
    });
    return NextResponse.json({ ok: true });
  }

  if (!customer?.email) {
    return NextResponse.json({ ok: false, error: "Customer has no email" }, { status: 400 });
  }

  await sendInvoiceEmail({
    name: customer.name || "there",
    email: customer.email,
    invoiceNumber: invoice.number,
    amountLabel: money(invoice.amount_cents),
    payUrl: `${site.url}/portal/pay`,
    description: invoice.description,
  });

  return NextResponse.json({ ok: true });
}
