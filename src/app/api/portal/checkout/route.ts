import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getStripe, siteBaseUrl } from "@/lib/stripe";

const schema = z.object({
  invoiceId: z.string().uuid(),
});

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { ok: false, error: "Payments not configured yet (missing STRIPE_SECRET_KEY)" },
      { status: 503 },
    );
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid invoice" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: invoice } = await admin
    .from("invoices")
    .select("*")
    .eq("id", parsed.data.invoiceId)
    .eq("customer_id", profile.id)
    .maybeSingle();

  if (!invoice || (invoice.status !== "unpaid" && invoice.status !== "overdue")) {
    return NextResponse.json({ ok: false, error: "Invoice not payable" }, { status: 400 });
  }

  const base = siteBaseUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: profile.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: invoice.amount_cents,
          product_data: {
            name: invoice.number,
            description: invoice.description || "How Much? invoice",
          },
        },
      },
    ],
    metadata: {
      invoice_id: invoice.id,
      job_id: invoice.job_id,
      customer_id: profile.id,
    },
    success_url: `${base}/portal/pay?success=1`,
    cancel_url: `${base}/portal/pay?canceled=1`,
  });

  await admin
    .from("invoices")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", invoice.id);

  return NextResponse.json({ ok: true, url: session.url });
}
