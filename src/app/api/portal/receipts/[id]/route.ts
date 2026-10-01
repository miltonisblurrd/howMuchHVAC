import { NextResponse } from "next/server";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { formatWhen, money } from "@/lib/db-types";
import { site } from "@/lib/site";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const admin = getSupabaseAdmin();
  const { data: invoice } = await admin
    .from("invoices")
    .select("*, jobs(title)")
    .eq("id", id)
    .eq("customer_id", profile.id)
    .maybeSingle();

  if (!invoice || invoice.status !== "paid") {
    return NextResponse.json({ ok: false, error: "Receipt not found" }, { status: 404 });
  }

  const jobTitle = (invoice.jobs as { title?: string } | null)?.title || "Job";
  const paid = invoice.paid_at ? formatWhen(invoice.paid_at) : "Paid";
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Receipt ${escapeHtml(invoice.number)}</title>
  <style>
    body { font-family: Georgia, serif; color: #1c1c1c; max-width: 640px; margin: 48px auto; padding: 0 24px; }
    h1 { font-size: 28px; margin-bottom: 0; }
    p { line-height: 1.5; }
    .muted { color: #5c5c5c; }
    .amount { font-size: 32px; font-weight: 700; }
  </style>
</head>
<body>
  <p class="muted">${escapeHtml(site.legalName)}</p>
  <h1>Receipt</h1>
  <p>${escapeHtml(invoice.number)}</p>
  <p class="amount">${escapeHtml(money(invoice.amount_cents))}</p>
  <p>${escapeHtml(invoice.description || "Payment")}</p>
  <p>Job: ${escapeHtml(jobTitle)}</p>
  <p>Paid ${escapeHtml(paid)}</p>
  <p>For: ${escapeHtml(profile.name || profile.email)}</p>
  <p class="muted">${escapeHtml(site.license)}</p>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="Receipt-${invoice.number}.html"`,
    },
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
