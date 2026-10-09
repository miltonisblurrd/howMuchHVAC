import Link from "next/link";
import { History, MessageSquare, CircleDollarSign } from "lucide-react";
import { ClientJobStepper, ClientStageBar } from "@/components/portal/ClientJobStepper";
import { ClientNextStep } from "@/components/portal/ClientNextStep";
import { Button } from "@/components/ui/Button";
import { getClientStage, type ClientStage } from "@/lib/client-stages";
import {
  countUnreadForCustomer,
  getAppointmentsForJobs,
  getCustomerInvoices,
  getCustomerJobs,
  getOptionsForJobs,
} from "@/lib/portal-queries";
import { money, type Invoice, type Job } from "@/lib/db-types";
import { JobDoneBanner } from "@/components/portal/JobDoneBanner";

function openCents(invoices: Invoice[]) {
  return invoices
    .filter((i) => i.status === "unpaid" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount_cents, 0);
}

function buildStages(
  jobs: Job[],
  options: Awaited<ReturnType<typeof getOptionsForJobs>>,
  invoices: Invoice[],
  appointments: Awaited<ReturnType<typeof getAppointmentsForJobs>>,
  unread: number,
): ClientStage[] {
  return jobs.map((job) =>
    getClientStage({
      job,
      options: options.filter((o) => o.job_id === job.id),
      invoices,
      appointments: appointments.filter((a) => a.job_id === job.id),
      unreadCount: unread,
      otherOpenCents: openCents(invoices.filter((i) => i.job_id !== job.id)),
    }),
  );
}

export async function PortalDashboardHome({ userId }: { userId: string }) {
  const [jobs, invoices, unread] = await Promise.all([
    getCustomerJobs(userId),
    getCustomerInvoices(userId),
    countUnreadForCustomer(userId),
  ]);
  const ids = jobs.map((j) => j.id);
  const [options, appointments] = await Promise.all([
    getOptionsForJobs(ids),
    getAppointmentsForJobs(ids),
  ]);
  const stages = buildStages(jobs, options, invoices, appointments, unread);
  const active = stages.filter((s) => s.phase !== "done" && s.phase !== "cancelled");
  const past = stages.filter((s) => s.phase === "done" || s.phase === "cancelled");
  const finishedCount = past.filter((stage) => stage.phase === "done").length;
  const due = openCents(invoices);
  const featured = active.length === 1 ? active[0] : null;

  if (jobs.length === 0) {
    return (
      <section className="hm-admin-card p-6 sm:p-8">
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-hm-red">
          No job yet
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-hm-charcoal">
          Request service when you need Andy
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-hm-muted">
          He comes out to look first, then sends options here. You pick one and pay a deposit to lock it in.
        </p>
        <div className="mt-5">
          <Button href="/portal/request" size="sm">
            Request service
          </Button>
        </div>
      </section>
    );
  }

  const finished = past.find((stage) => stage.phase === "done");

  return (
    <div className="space-y-6">
      {finished ? <JobDoneBanner jobTitle={finished.title} jobId={finished.jobId} /> : null}
      {featured && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-hm-muted">
                Your job
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-hm-charcoal">
                <Link href={`/portal/projects/${featured.jobId}`} className="hover:text-hm-red">
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-hm-muted">
                {[featured.service, featured.city].filter(Boolean).join(" · ")}
              </p>
            </div>
            <Button href={`/portal/projects/${featured.jobId}`} size="sm" variant="secondary">
              Open job details
            </Button>
          </div>
          <ClientJobStepper stage={featured} />
          <ClientNextStep stage={featured} onDashboard />
        </section>
      )}

      {active.length > 1 && (
        <section>
          <h2 className="font-display text-[15px] font-bold tracking-tight text-hm-charcoal">Your jobs</h2>
          <ul className="mt-3 space-y-3">
            {active.map((stage) => (
              <li key={stage.jobId}>
                <Link
                  href={`/portal/projects/${stage.jobId}`}
                  className="hm-admin-card hm-admin-click block p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg font-bold tracking-tight text-hm-charcoal">
                        {stage.title}
                      </p>
                      <p className="mt-0.5 text-sm text-hm-muted">
                        {[stage.service, stage.city].filter(Boolean).join(" · ") || stage.next.title}
                      </p>
                    </div>
                    <span className="rounded-full bg-hm-red/10 px-3 py-1 text-sm font-bold text-hm-red">
                      {stage.label}
                    </span>
                  </div>
                  <ClientStageBar stage={stage} />
                  <p className="mt-2 text-sm text-hm-muted">{stage.next.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/portal/messages" className="hm-admin-card hm-admin-click flex items-center gap-3 px-4 py-3">
          <MessageSquare className="h-4 w-4 text-hm-red" />
          <span>
            <span className="block text-sm font-semibold text-hm-charcoal">Message Andy</span>
            <span className="block text-xs text-hm-muted">
              {unread ? `${unread} unread` : "Inbox clear"}
            </span>
          </span>
        </Link>
        <Link href="/portal/past-services" className="hm-admin-card hm-admin-click flex items-center gap-3 px-4 py-3">
          <History className="h-4 w-4 text-hm-muted" />
          <span>
            <span className="block text-sm font-semibold text-hm-charcoal">Your Past Services</span>
            <span className="block text-xs text-hm-muted">
              {finishedCount ? `${finishedCount} finished` : "None yet"}
            </span>
          </span>
        </Link>
        <Link href="/portal/pay" className="hm-admin-card hm-admin-click flex items-center gap-3 px-4 py-3">
          <CircleDollarSign className="h-4 w-4 text-emerald-700" />
          <span>
            <span className="block text-sm font-semibold text-hm-charcoal">Amount due</span>
            <span className="block text-xs text-hm-muted">{due ? money(due) : "Caught up"}</span>
          </span>
        </Link>
      </div>

      {past.length > 0 && (
        <details className="hm-admin-card p-5">
          <summary className="cursor-pointer font-display text-[15px] font-bold text-hm-charcoal">
            Past jobs ({past.length})
          </summary>
          <ul className="mt-4 space-y-2">
            {past.map((stage) => (
              <li key={stage.jobId}>
                <Link
                  href={`/portal/projects/${stage.jobId}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-hm-line px-4 py-3"
                >
                  <span className="font-semibold text-hm-charcoal">{stage.title}</span>
                  <span className="text-sm text-hm-muted">{stage.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
