import { AdminShell } from "@/components/admin/AdminShell";
import { invoices, invoiceTotals, money } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-session";

const statusStyles: Record<string, string> = {
  Paid: "bg-emerald-100 text-emerald-800",
  Unpaid: "bg-amber-100 text-amber-900",
  Overdue: "bg-red-100 text-red-800",
  Draft: "bg-slate-100 text-slate-700",
};

export default async function AdminInvoicesPage() {
  const admin = await requireAdmin();
  const totals = invoiceTotals();

  return (
    <AdminShell userName={admin.name}>
      <h1 className="font-display text-3xl font-bold tracking-tight text-hm-charcoal">
        Invoices
      </h1>
      <p className="mt-2 text-hm-muted">Paid, unpaid, and overdue ? demo ledger for walkthrough.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Paid", value: money(totals.paid) },
          { label: "Outstanding", value: money(totals.unpaid) },
          { label: "Overdue", value: money(totals.overdue) },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-hm-line bg-white px-5 py-4">
            <p className="text-sm text-hm-muted">{c.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-hm-line bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-hm-fog font-display text-xs uppercase tracking-wide text-hm-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Invoice</th>
                <th className="px-4 py-3 font-semibold">Client</th>
                <th className="px-4 py-3 font-semibold">Project</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Due</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-hm-line">
                  <td className="px-4 py-3 font-semibold text-hm-charcoal">{inv.number}</td>
                  <td className="px-4 py-3">
                    {inv.client}
                    <span className="mt-0.5 block text-xs text-hm-muted">{inv.city}</span>
                  </td>
                  <td className="px-4 py-3 text-hm-muted">{inv.project}</td>
                  <td className="px-4 py-3 font-semibold">{money(inv.amount)}</td>
                  <td className="px-4 py-3 text-hm-muted">{inv.dueAt}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyles[inv.status]}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
