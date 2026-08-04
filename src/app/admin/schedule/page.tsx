import { AdminShell } from "@/components/admin/AdminShell";
import { schedule } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-session";

const statusStyles: Record<string, string> = {
  Confirmed: "bg-emerald-100 text-emerald-800",
  "En route": "bg-sky-100 text-sky-800",
  "Needs confirm": "bg-amber-100 text-amber-900",
};

const typeStyles: Record<string, string> = {
  Diagnostic: "text-sky-700",
  Install: "text-hm-red",
  Maintenance: "text-emerald-700",
  "Follow-up": "text-violet-700",
};

export default async function AdminSchedulePage() {
  const admin = await requireAdmin();

  return (
    <AdminShell userName={admin.name}>
      <h1 className="font-display text-3xl font-bold tracking-tight text-hm-charcoal">
        Schedule
      </h1>
      <p className="mt-2 text-hm-muted">
        Upcoming jobs, techs, and confirmation status ? demo board.
      </p>

      <div className="mt-8 space-y-3">
        {schedule.map((job) => (
          <article
            key={job.id}
            className="rounded-2xl border border-hm-line bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className={`text-xs font-bold uppercase tracking-wide ${typeStyles[job.type]}`}>
                  {job.type}
                </p>
                <h2 className="mt-1 font-display text-lg font-bold text-hm-charcoal">
                  {job.title}
                </h2>
                <p className="mt-1 text-sm text-hm-muted">
                  {job.client} ? {job.city}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyles[job.status]}`}
              >
                {job.status}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <p>
                <span className="text-hm-muted">When ? </span>
                <span className="font-semibold text-hm-charcoal">{job.when}</span>
              </p>
              <p>
                <span className="text-hm-muted">Tech ? </span>
                <span className="font-semibold text-hm-charcoal">{job.tech}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
