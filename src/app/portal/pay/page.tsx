import { PortalChrome } from "@/components/portal/PortalChrome";
import { PayInvoiceButton } from "@/components/portal/PayInvoiceButton";
import { AdminEmpty } from "@/components/admin/AdminUi";
import { CountUp } from "@/components/admin/CountUp";
import { requirePortalUser } from "@/lib/auth";
import { getCustomerInvoices } from "@/lib/portal-queries";
import { formatWhen, money } from "@/lib/db-types";

export default async function PortalPayPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const user = await requirePortalUser();
  const invoices = await getCustomerInvoices(user.id);
  const { success, canceled } = await searchParams;

  return (
    <PortalChrome
      userId={user.id}
      userName={user.name || user.email}
      title="Payments"
      description="Review invoices and pay securely online."
    >
      {success && (
        <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Payment received — thank you. A receipt will show as Paid below once Stripe confirms.
        </p>
      )}
      {canceled && (
        <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Checkout canceled. Your invoice is still open whenever you&apos;re ready.
        </p>
      )}

      {invoices.length === 0 ? (
        <AdminEmpty>No invoices yet.</AdminEmpty>
      ) : (
        <ul className="space-y-2.5">
          {invoices.map((inv) => {
            const open = inv.status === "unpaid" || inv.status === "overdue";
            return (
              <li
                key={inv.id}
                className="hm-admin-card flex flex-wrap items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <p className="font-display text-[17px] font-bold tracking-tight text-hm-charcoal">
                    {inv.number}
                  </p>
                  <p className="text-sm text-hm-muted">{inv.description || "Invoice"}</p>
                  <p className="mt-1 text-xs text-hm-muted">
                    {inv.due_at ? `Due ${formatWhen(inv.due_at)}` : `Created ${formatWhen(inv.created_at)}`}
                    {" · "}
                    <span className="capitalize">{inv.status}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-display text-2xl font-bold tracking-tight">
                    <CountUp value={money(inv.amount_cents)} />
                  </p>
                  {open && <PayInvoiceButton invoiceId={inv.id} />}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </PortalChrome>
  );
}
