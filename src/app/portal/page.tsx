import Link from "next/link";
import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/Button";
import { requirePortalUser } from "@/lib/auth";
import {
  countUnreadForCustomer,
  getCustomerDocuments,
  getCustomerInvoices,
  getCustomerJobs,
  getNextAppointmentForCustomer,
} from "@/lib/portal-queries";
import { JOB_STATUS_LABELS, formatWhen, money, type JobStatus } from "@/lib/db-types";
import { site } from "@/lib/site";

const statusColor: Record<JobStatus, string> = {
  quote_request: "bg-sky-100 text-sky-800",
  estimate_ready: "bg-red-100 text-red-800",
  scheduled: "bg-violet-100 text-violet-800",
  in_progress: "bg-amber-100 text-amber-900",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-slate-100 text-slate-600",
};

export default async function PortalDashboardPage() {
  const user = await requirePortalUser();
  const [jobs, invoices, docs, unread, nextAppt] = await Promise.all([
    getCustomerJobs(user.id),
    getCustomerInvoices(user.id),
    getCustomerDocuments(user.id),
    countUnreadForCustomer(user.id),
    getNextAppointmentForCustomer(user.id),
  ]);

  const unpaid = invoices.filter((i) => i.status === "unpaid" || i.status === "overdue");
  const active = jobs.filter((j) => j.status !== "completed" && j.status !== "cancelled");

  return (
    <PortalShell userName={user.name || user.email}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-hm-red">
            Client portal
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-hm-charcoal">
            Welcome back, {(user.name || "there").split(" ")[0]}
          </h1>
          <p className="mt-2 text-hm-muted">
            {user.address || "Your jobs, messages, and invoices in one place."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href="/portal/request">Request service</Button>
          <Button href={site.phones.direct.href} variant="secondary" arrow={false}>
            Call Andy
          </Button>
        </div>
      </div>

      {nextAppt && (
        <div className="mt-6 rounded-2xl border border-hm-red/25 bg-hm-red/5 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wide text-hm-red">Next visit</p>
          <p className="mt-1 font-display text-lg font-bold text-hm-charcoal">
            {formatWhen(nextAppt.starts_at)}
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-4">
        {[
          { label: "Active jobs", value: String(active.length) },
          { label: "Unread messages", value: String(unread) },
          { label: "Documents", value: String(docs.length) },
          {
            label: "Amount due",
            value: unpaid.length ? money(unpaid.reduce((s, i) => s + i.amount_cents, 0)) : "$0",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-hm-line bg-white px-5 py-4 shadow-sm"
          >
            <p className="text-sm text-hm-muted">{stat.label}</p>
            <p className="mt-1 font-display text-3xl font-bold text-hm-charcoal">{stat.value}</p>
          </div>
        ))}
      </div>

      {unpaid.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm font-semibold text-amber-950">
            You have {unpaid.length} open invoice{unpaid.length === 1 ? "" : "s"}.
          </p>
          <Button href="/portal/pay" size="sm">
            Pay now →
          </Button>
        </div>
      )}

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-hm-charcoal">Your jobs</h2>
        {jobs.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-hm-line bg-white p-8 text-center">
            <p className="text-hm-muted">No jobs yet. Request service or call Andy to get started.</p>
            <Button href="/portal/request" className="mt-4">
              Request service
            </Button>
          </div>
        ) : (
          <div className="mt-4 grid gap-4">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/portal/projects/${job.id}`}
                className="group rounded-2xl border border-hm-line bg-white p-5 shadow-sm transition hover:border-hm-red/35 hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-hm-charcoal group-hover:text-hm-red">
                      {job.title}
                    </h3>
                    <p className="mt-1 text-sm text-hm-muted">
                      {[job.service, job.city].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor[job.status]}`}
                  >
                    {JOB_STATUS_LABELS[job.status]}
                  </span>
                </div>
                {job.summary && (
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-hm-muted">
                    {job.summary}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </PortalShell>
  );
}
