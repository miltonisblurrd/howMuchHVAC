import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { InviteButton } from "@/components/admin/InviteButton";
import { requireAdmin } from "@/lib/auth";
import { getAdminLeads } from "@/lib/admin-queries";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export default async function AdminLeadsPage() {
  const adminUser = await requireAdmin();
  const leads = await getAdminLeads(100);

  // Enrich with last_sign_in from auth when customer_id present
  const admin = getSupabaseAdmin();
  const customerIds = [...new Set(leads.map((l) => l.customer_id).filter(Boolean))] as string[];
  const signedIn = new Map<string, boolean>();
  await Promise.all(
    customerIds.map(async (id) => {
      const { data } = await admin.auth.admin.getUserById(id);
      signedIn.set(id, Boolean(data.user?.last_sign_in_at));
    }),
  );

  return (
    <AdminShell userName={adminUser.name || adminUser.email}>
      <h1 className="font-display text-3xl font-bold tracking-tight text-hm-charcoal">Leads</h1>
      <p className="mt-2 text-hm-muted">
        Website and portal requests. Resend portal invites if they haven&apos;t signed in.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-hm-line bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-hm-fog font-display text-xs uppercase tracking-wide text-hm-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Lead</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Portal</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const hasLogin = lead.customer_id ? signedIn.get(lead.customer_id) : false;
                return (
                  <tr key={lead.id} className="border-t border-hm-line align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-hm-charcoal">{lead.name}</p>
                      <p className="text-xs text-hm-muted">{lead.email}</p>
                      <p className="text-xs text-hm-muted">{lead.city}</p>
                    </td>
                    <td className="px-4 py-3 text-hm-muted">{lead.service || "—"}</td>
                    <td className="px-4 py-3 text-hm-muted">
                      {lead.source_label || lead.source_path || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {!lead.customer_id && <span className="text-hm-muted">Not provisioned</span>}
                      {lead.customer_id && hasLogin && (
                        <span className="font-semibold text-emerald-700">Signed in</span>
                      )}
                      {lead.customer_id && !hasLogin && (
                        <span className="font-semibold text-amber-700">
                          Invited{lead.portal_invited_at ? "" : "?"} · not signed in
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 capitalize">{lead.status}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        {lead.job_id && (
                          <Link
                            href={`/admin/jobs/${lead.job_id}`}
                            className="text-sm font-semibold text-hm-red"
                          >
                            Open job →
                          </Link>
                        )}
                        {lead.customer_id && !hasLogin && (
                          <InviteButton customerId={lead.customer_id} />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!leads.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-hm-muted">
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
