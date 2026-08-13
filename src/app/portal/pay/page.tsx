import { PortalShell } from "@/components/portal/PortalShell";
import { PayInvoiceButton } from "@/components/portal/PayInvoiceButton";
import { requirePortalUser } from "@/lib/auth";
import { getCustomerInvoices } from "@/lib/portal-queries";
import { formatWhen, money } from "@/lib/db-types";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";

export default async function PortalPayPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const user = await requirePortalUser();
  const invoices = await getCustomerInvoices(user.id);
  const { success, canceled } = await searchParams;

  return (
    <PortalShell userName={user.name || user.email}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Payments</h1>
          <p className="mt-2 text-hm-muted">Review invoices and pay securely online.</p>
        </div>
        <Button href={site.phones.direct.href} variant="secondary" arrow={false}>
          Questions? Call Andy
        </Button>
      </div>

      {success && (
        <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Payment received ? thank you. A receipt will show as Paid below once Stripe confirms.
        </p>
      )}
      {canceled && (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Checkout canceled. Your invoice is still open whenever you&apos;re ready.
        </p>
      )}

      {invoices.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-hm-line bg-white p-8 text-center text-hm-muted">
          No invoices yet.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {invoices.map((inv) => (
            <li
              key={inv.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-hm-line bg-white px-5 py-4"
            >
              <div>
                <p className="font-display text-lg font-bold text-hm-charcoal">{inv.number}</p>
                <p className="text-sm text-hm-muted">{inv.description || "Invoice"}</p>
                <p className="mt-1 text-xs text-hm-muted">
                  {inv.due_at ? `Due ${formatWhen(inv.due_at)}` : `Created ${formatWhen(inv.created_at)}`}
                  {" ? "}
                  <span className="capitalize">{inv.status}</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-display text-2xl font-bold">{money(inv.amount_cents)}</p>
                {(inv.status === "unpaid" || inv.status === "overdue") && (
                  <PayInvoiceButton invoiceId={inv.id} />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
