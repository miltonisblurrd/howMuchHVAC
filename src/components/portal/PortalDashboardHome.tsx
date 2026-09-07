import Link from "next/link";
import { Briefcase, MessageSquare, FileText, CircleDollarSign } from "lucide-react";
import { AdminEmpty, AdminKpi } from "@/components/admin/AdminUi";
import { CountUp } from "@/components/admin/CountUp";
import { customerNextAction, jobCardCta } from "@/lib/portal-next-action";
import {
  countUnreadForCustomer,
  getCustomerDocuments,
  getCustomerInvoices,
  getCustomerJobs,
  getNextAppointmentForCustomer,
} from "@/lib/portal-queries";
import { JOB_STATUS_LABELS, formatWhen, money, type JobStatus } from "@/lib/db-types";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

const statusColor: Record<JobStatus, string> = {
  quote_request: "bg-sky-500/12 text-sky-800",
  estimate_ready: "bg-hm-red/12 text-hm-red",
  scheduled: "bg-violet-500/12 text-violet-800",
  in_progress: "bg-amber-500/12 text-amber-900",
  completed: "bg-emerald-500/12 text-emerald-800",
  cancelled: "bg-hm-fog text-hm-muted",
};

export async function PortalDashboardHome({ userId }: { userId: string }) {
  const [jobs, invoices, docs, unread, nextAppt] = await Promise.all([
    getCustomerJobs(userId),
    getCustomerInvoices(userId),
    getCustomerDocuments(userId),
    countUnreadForCustomer(userId),
    getNextAppointmentForCustomer(userId),
  ]);

  const unpaid = invoices.filter((i) => i.status === "unpaid" || i.status === "overdue");
  const active = jobs.filter((j) => j.status !== "completed" && j.status !== "cancelled");
  const dueCents = unpaid.reduce((s, i) => s + i.amount_cents, 0);
  const action = customerNextAction({ jobs, unpaid, unread, nextAppt });

  return (
    <>
      <section className="mb-6 grid gap-3 sm:grid-cols-2">
        <Link
          href={action.href}
          className={cn(
            "hm-admin-card hm-admin-click px-5 py-5",
            action.tone === "pay" && "border-amber-200/80 bg-amber-50/80",
            action.tone === "act" && "border-hm-red/20 bg-hm-red/[0.04]",
          )}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-hm-red">
            What to do next
          </p>
          <p className="mt-2 font-display text-xl font-bold tracking-tight text-hm-charcoal">
            {action.title}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-hm-muted">{action.body}</p>
          <p className="mt-4 text-sm font-semibold text-hm-red">{action.cta} ?</p>
        </Link>

        {nextAppt ? (
          <Link
            href={active[0] ? `/portal/projects/${active[0].id}` : "/portal"}
            className={cn(
              "hm-admin-card hm-admin-click px-5 py-5",
              nextAppt.status === "pending"
                ? "border-amber-200/80 bg-amber-50/80"
                : "border-hm-red/20 bg-hm-red/[0.04]",
            )}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-hm-red">
              {nextAppt.status === "pending" ? "Requested visit" : "Next visit"}
            </p>
            <p className="mt-2 font-display text-xl font-bold tracking-tight text-hm-charcoal">
              {formatWhen(nextAppt.starts_at)}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-hm-muted">
              {nextAppt.status === "pending"
                ? "Waiting on Andy to confirm this time."
                : nextAppt.tech_name
                  ? `Tech: ${nextAppt.tech_name}`
                  : "You're on the calendar."}
            </p>
          </Link>
        ) : (
          <Link href="/portal/request" className="hm-admin-card hm-admin-click px-5 py-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-hm-red">Schedule</p>
            <p className="mt-2 font-display text-xl font-bold tracking-tight text-hm-charcoal">
              No visit booked
            </p>
            <p className="mt-1 text-sm leading-relaxed text-hm-muted">
              Request service when you need Andy on site.
            </p>
          </Link>
        )}
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AdminKpi
          href={active[0] ? `/portal/projects/${active[0].id}` : "/portal/request"}
          icon={Briefcase}
          tone="blue"
          label="Active jobs"
          value={String(active.length)}
          hint={active.length === 1 ? "In motion" : undefined}
        />
        <AdminKpi
          href="/portal/messages"
          icon={MessageSquare}
          tone="red"
          label="Unread"
          value={String(unread)}
          hint={unread ? "Needs a look" : "Inbox clear"}
          hintTone={unread ? "down" : "up"}
        />
        <AdminKpi
          href="/portal/documents"
          icon={FileText}
          tone="slate"
          label="Documents"
          value={String(docs.length)}
          hint={docs.length ? "On file" : "None yet"}
        />
        <AdminKpi
          href="/portal/pay"
          icon={CircleDollarSign}
          tone="green"
          label="Amount due"
          value={unpaid.length ? money(dueCents) : "$0"}
          hint={unpaid.length ? "Pay now" : "Caught up"}
          hintTone={unpaid.length ? "down" : "up"}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="hm-admin-card p-5">
          <h2 className="font-display text-[15px] font-bold tracking-tight text-hm-charcoal">
            Your jobs
          </h2>
          {jobs.length === 0 ? (
            <div className="mt-4">
              <AdminEmpty>No jobs yet. Use Request service when you need Andy.</AdminEmpty>
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {jobs.map((job) => {
                const cta = jobCardCta(
                  job.status,
                  job.id,
                  unpaid.some((i) => i.job_id === job.id),
                );
                return (
                  <li key={job.id}>
                    <Link
                      href={cta.href}
                      className="hm-admin-click flex items-center justify-between gap-4 rounded-xl border border-hm-line px-4 py-4"
                    >
                      <span className="min-w-0 font-display text-lg font-bold tracking-tight text-hm-charcoal">
                        {job.title}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-3 py-1 text-sm font-bold",
                          statusColor[job.status],
                        )}
                      >
                        {JOB_STATUS_LABELS[job.status]}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="hm-admin-card flex flex-col p-5">
          <h2 className="font-display text-[15px] font-bold tracking-tight text-hm-charcoal">
            {dueCents > 0 ? "Amount due" : "Payments"}
          </h2>
          <p className="mt-6 font-display text-4xl font-bold tracking-tight text-hm-charcoal sm:text-5xl">
            <CountUp value={money(dueCents)} />
          </p>
          {dueCents > 0 ? (
            <p className="mt-3 text-base font-semibold text-hm-red">Open balance</p>
          ) : (
            <p className="mt-3 text-base font-semibold text-emerald-700">You&apos;re all caught up</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/portal/pay"
              className="inline-flex h-10 items-center rounded-lg bg-hm-red px-4 font-display text-sm font-semibold text-white"
            >
              {dueCents > 0 ? "Pay in full" : "View payments"}
            </Link>
            <a
              href={site.synchrony.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-lg border border-hm-charcoal/20 px-4 font-display text-sm font-semibold text-hm-charcoal hover:bg-hm-fog"
            >
              Finance with Synchrony
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
