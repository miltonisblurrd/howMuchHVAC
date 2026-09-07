import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getAdminInvoices } from "@/lib/admin-queries";
import { formatWhen, money } from "@/lib/db-types";
import { InvoiceAdminActions } from "@/components/admin/InvoiceAdminActions";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { INVOICE_STATUS_LABELS } from "@/lib/job-stages";

export default async function AdminInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const admin = await requireAdmin();
  const { q: qParam } = await searchParams;
  const q = (qParam || "").trim().toLowerCase();
  const invoices = (await getAdminInvoices()).filter((row) => {
    if (!q) return true;
    const inv = row as {
      number: string;
      status: string;
      profiles?: { name?: string; email?: string } | null;
      jobs?: { title?: string } | null;
    };
    return [inv.number, inv.status, inv.profiles?.name, inv.profiles?.email, inv.jobs?.title]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  return (
    <AdminShell
      userName={admin.name || admin.email}
      title="Invoices"
      description="Create invoices from a job. Customers pay in the portal."
    >
      <div className="hm-admin-card overflow-hidden p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-hm-fog/80 font-display text-[11px] font-semibold uppercase tracking-wide text-hm-muted">
            <tr>
              <th className="px-5 py-3">Invoice</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Job</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Due</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((row) => {
              const inv = row as {
                id: string;
                number: string;
                description: string;
                amount_cents: number;
                status: string;
                due_at: string | null;
                job_id: string;
                profiles?: { name?: string; email?: string } | null;
                jobs?: { title?: string } | null;
              };
              return (
                <tr key={inv.id} className="border-t border-hm-line/80">
                  <td className="px-5 py-3.5">
                    <p className="font-display font-bold text-hm-charcoal">{inv.description || "Payment"}</p>
                    <p className="text-xs text-hm-muted">{inv.number}</p>
                  </td>
                  <td className="px-5 py-3.5 text-hm-muted">
                    {inv.profiles?.name || inv.profiles?.email || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/jobs/${inv.job_id}`} className="font-semibold text-hm-red hover:underline">
                      {inv.jobs?.title || "Job"}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 font-semibold">{money(inv.amount_cents)}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-bold",
                        inv.status === "paid"
                          ? "bg-emerald-500/12 text-emerald-800"
                          : inv.status === "overdue"
                            ? "bg-hm-red/12 text-hm-red"
                            : "bg-amber-500/12 text-amber-900",
                      )}
                    >
                      {INVOICE_STATUS_LABELS[inv.status] ?? inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-hm-muted">
                    {inv.due_at ? formatWhen(inv.due_at) : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <InvoiceAdminActions invoice={inv} />
                  </td>
                </tr>
              );
            })}
            {!invoices.length && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-hm-muted">
                  {q ? "No invoices match that search." : "No invoices yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
