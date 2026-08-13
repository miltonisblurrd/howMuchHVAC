import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getAdminJobs } from "@/lib/admin-queries";
import { JOB_STATUS_LABELS, type JobStatus } from "@/lib/db-types";

export default async function AdminJobsPage() {
  const admin = await requireAdmin();
  const jobs = await getAdminJobs(100);

  return (
    <AdminShell userName={admin.name || admin.email}>
      <h1 className="font-display text-3xl font-bold tracking-tight">Jobs</h1>
      <p className="mt-2 text-hm-muted">Manage quotes, options, docs, and scheduling.</p>

      <ul className="mt-8 space-y-3">
        {jobs.map((row) => {
          const j = row as {
            id: string;
            title: string;
            status: JobStatus;
            city: string | null;
            service: string | null;
            profiles?: { name?: string; email?: string } | null;
          };
          return (
            <li key={j.id}>
              <Link
                href={`/admin/jobs/${j.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hm-line bg-white px-5 py-4 hover:border-hm-red/40"
              >
                <div>
                  <p className="font-display text-lg font-bold">{j.title}</p>
                  <p className="text-sm text-hm-muted">
                    {j.profiles?.name || j.profiles?.email || "Customer"}
                    {j.city ? ` ? ${j.city}` : ""}
                    {j.service ? ` ? ${j.service}` : ""}
                  </p>
                </div>
                <span className="rounded-full bg-hm-fog px-3 py-1 text-xs font-bold">
                  {JOB_STATUS_LABELS[j.status]}
                </span>
              </Link>
            </li>
          );
        })}
        {!jobs.length && (
          <p className="rounded-2xl border border-dashed border-hm-line bg-white p-8 text-center text-hm-muted">
            No jobs yet ? they appear when leads come in.
          </p>
        )}
      </ul>
    </AdminShell>
  );
}
