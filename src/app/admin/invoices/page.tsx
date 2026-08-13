import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getAdminInvoices } from "@/lib/admin-queries";
import { formatWhen, money } from "@/lib/db-types";
import Link from "next/link";

export default async function AdminInvoicesPage() {
  const admin = await requireAdmin();
  const invoices = await getAdminInvoices();

  return (
    <AdminShell userName={admin.name || admin.email}>
      <h1 className="font-display text-3xl font-bold tracking-tight">Invoices</h1>
      <p className="mt-2 text-hm-muted">Create invoices from a job page. Customers pay in the portal.</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-hm-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-hm-fog text-xs uppercase tracking-wide text-hm-muted">
            <tr>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Due</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((row) => {
              const inv = row as {
                id: string;
                number: string;
                amount_cents: number;
                status: string;
                due_at: string | null;
                job_id: string;
                profiles?: { name?: string; email?: string } | null;
                jobs?: { title?: string } | null;
              };
              return (
                <tr key={inv.id} className="border-t border-hm-line">
                  <td className="px-4 py-3 font-semibold">{inv.number}</td>
                  <td className="px-4 py-3 text-hm-muted">
                    {inv.profiles?.name || inv.profiles?.email || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/jobs/${inv.job_id}`} className="text-hm-red hover:underline">
                      {inv.jobs?.title || "Job"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-semibold">{money(inv.amount_cents)}</td>
                  <td className="px-4 py-3 capitalize">{inv.status}</td>
                  <td className="px-4 py-3 text-hm-muted">
                    {inv.due_at ? formatWhen(inv.due_at) : "—"}
                  </td>
                </tr>
              );
            })}
            {!invoices.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-hm-muted">
                  No invoices yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
