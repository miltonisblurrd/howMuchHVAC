import { AdminShell } from "@/components/admin/AdminShell";
import { leads, money } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-session";

const statusStyles: Record<string, string> = {
  New: "bg-sky-100 text-sky-800",
  Contacted: "bg-violet-100 text-violet-800",
  Quoted: "bg-amber-100 text-amber-900",
  Won: "bg-emerald-100 text-emerald-800",
  Lost: "bg-slate-100 text-slate-600",
};

export default async function AdminLeadsPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell userName={admin.name}>
      <h1 className="font-display text-3xl font-bold tracking-tight text-hm-charcoal">
        Leads
      </h1>
      <p className="mt-2 text-hm-muted">
        Website, ads, Google, and referral pipeline ? demo CRM board.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-hm-line bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-hm-fog font-display text-xs uppercase tracking-wide text-hm-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Lead</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Est. value</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-hm-line">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-hm-charcoal">{lead.name}</p>
                    <p className="text-xs text-hm-muted">{lead.city}</p>
                  </td>
                  <td className="px-4 py-3 text-hm-muted">{lead.service}</td>
                  <td className="px-4 py-3">{lead.source}</td>
                  <td className="px-4 py-3 font-semibold">{money(lead.value)}</td>
                  <td className="px-4 py-3 text-hm-muted">{lead.createdAt}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyles[lead.status]}`}
                    >
                      {lead.status}
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
