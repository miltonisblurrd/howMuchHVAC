import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getAdminKpis, getAdminLeads, getAdminJobs } from "@/lib/admin-queries";
import { money, JOB_STATUS_LABELS, type JobStatus } from "@/lib/db-types";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const [kpis, leads, jobs] = await Promise.all([
    getAdminKpis(),
    getAdminLeads(8),
    getAdminJobs(8),
  ]);

  return (
    <AdminShell userName={admin.name || admin.email}>
      <h1 className="font-display text-3xl font-bold tracking-tight text-hm-charcoal">
        Dashboard
      </h1>
      <p className="mt-2 text-hm-muted">Live snapshot of leads, jobs, and cash.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Month paid", value: money(kpis.monthRevenue) },
          { label: "Outstanding", value: money(kpis.outstanding) },
          { label: "Overdue", value: money(kpis.overdue) },
          { label: "Visits (7 days)", value: String(kpis.jobsThisWeek) },
          { label: "New leads (month)", value: String(kpis.newLeads) },
          { label: "Active jobs", value: String(kpis.activeJobs) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-hm-line bg-white px-5 py-4">
            <p className="text-sm text-hm-muted">{s.label}</p>
            <p className="mt-1 font-display text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Recent leads</h2>
            <Link href="/admin/leads" className="text-sm font-semibold text-hm-red">
              View all →
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {leads.map((l) => (
              <li
                key={l.id}
                className="rounded-xl border border-hm-line bg-white px-4 py-3 text-sm"
              >
                <p className="font-semibold">{l.name}</p>
                <p className="text-hm-muted">
                  {[l.service, l.city].filter(Boolean).join(" · ") || l.email}
                </p>
              </li>
            ))}
            {!leads.length && <p className="text-sm text-hm-muted">No leads yet.</p>}
          </ul>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Recent jobs</h2>
            <Link href="/admin/jobs" className="text-sm font-semibold text-hm-red">
              View all →
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {jobs.map((j) => {
              const job = j as { id: string; title: string; status: JobStatus };
              return (
                <li key={job.id}>
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    className="block rounded-xl border border-hm-line bg-white px-4 py-3 text-sm hover:border-hm-red/40"
                  >
                    <p className="font-semibold">{job.title}</p>
                    <p className="text-hm-muted">{JOB_STATUS_LABELS[job.status]}</p>
                  </Link>
                </li>
              );
            })}
            {!jobs.length && <p className="text-sm text-hm-muted">No jobs yet.</p>}
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}
