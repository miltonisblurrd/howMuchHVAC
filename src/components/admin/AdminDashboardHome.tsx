import { Suspense } from "react";
import {
  CircleDollarSign,
  FileWarning,
  Briefcase,
  CalendarDays,
  Users,
  MessageSquare,
} from "lucide-react";
import { AdminDashboardToolbar } from "@/components/admin/AdminDashboardToolbar";
import { parseDashboardView } from "@/lib/admin-dashboard";
import {
  AdminCard,
  AdminCardHeader,
  AdminKpi,
  AdminQuietLink,
} from "@/components/admin/AdminUi";
import { CountUp } from "@/components/admin/CountUp";
import { InsightBars } from "@/components/admin/InsightBars";
import { PipelineBar } from "@/components/admin/PipelineBar";
import { ColumnChart } from "@/components/admin/ColumnChart";
import { getAdminHomeSnapshot } from "@/lib/admin-home";
import { JOB_STATUS_LABELS, formatWhen, money } from "@/lib/db-types";
import { parseMessagePhoto } from "@/lib/uploads";
import { cn } from "@/lib/cn";
import Link from "next/link";

function matches(q: string, ...parts: Array<string | null | undefined>) {
  if (!q) return true;
  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(q);
}

export async function AdminDashboardHome({
  q: qParam,
  view: viewParam,
}: {
  q?: string;
  view?: string;
}) {
  const q = (qParam || "").trim().toLowerCase();
  const view = parseDashboardView(viewParam);
  const home = await getAdminHomeSnapshot();

  const showAttention = view === "all" || view === "attention";
  const showMoney = view === "all" || view === "money";
  const showSchedule = view === "all" || view === "schedule";
  const showRest = view === "all";

  const recentJobs = home.recentJobs.filter((job) =>
    matches(q, job.profiles?.name, job.title, job.city, job.service),
  );
  const recentLeads = home.recentLeads.filter((l) => matches(q, l.name, l.email, l.city, l.service));
  const unreadThreads = home.unreadThreads.filter((t) => matches(q, t.customerName, t.title));

  return (
    <>
      <Suspense fallback={<div className="mb-6 h-9" />}>
        <AdminDashboardToolbar />
      </Suspense>

      {showAttention && (
        <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {home.alerts.map((alert) => (
            <Link
              key={alert.href + alert.label}
              href={alert.href}
              className={cn(
                "hm-admin-card hm-admin-click px-4 py-4",
                alert.tone === "urgent" && "border-amber-200/80 bg-amber-50/80",
                alert.tone === "ok" && "border-emerald-200/80 bg-emerald-50/70",
              )}
            >
              <p className="font-display text-sm font-bold text-hm-charcoal">
                <CountUp value={alert.label} />
              </p>
              <p className="mt-1 text-xs leading-relaxed text-hm-muted">{alert.detail}</p>
            </Link>
          ))}
        </section>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <AdminKpi
          href="/admin/invoices"
          icon={CircleDollarSign}
          tone="green"
          label="Paid this month"
          value={money(home.kpis.monthRevenue)}
          hint="Collected"
          hintTone="up"
        />
        <AdminKpi
          href="/admin/invoices"
          icon={FileWarning}
          tone="amber"
          label="Open invoices"
          value={money(home.unpaidCents)}
          hint={home.unpaidCount ? `${home.unpaidCount} waiting` : "Caught up"}
          hintTone={home.unpaidCount ? "down" : "up"}
        />
        <AdminKpi
          href="/admin/jobs"
          icon={Briefcase}
          tone="blue"
          label="Active jobs"
          value={String(home.kpis.activeJobs)}
          hint="In motion"
        />
        <AdminKpi
          href="/admin/schedule"
          icon={CalendarDays}
          tone="slate"
          label="Visits this week"
          value={String(home.thisWeekCount)}
          hint={`${home.pendingVisits.length} to confirm`}
          hintTone={home.pendingVisits.length ? "down" : "muted"}
        />
        <AdminKpi
          href="/admin/leads"
          icon={Users}
          tone="red"
          label="New leads"
          value={String(home.newLeadCount)}
          hint="Need a first touch"
          hintTone={home.newLeadCount ? "down" : "muted"}
        />
        <AdminKpi
          href="/admin/messages"
          icon={MessageSquare}
          tone="red"
          label="Unread"
          value={String(home.unreadCount)}
          hint={home.unreadCount ? "Needs a reply" : "Inbox clear"}
          hintTone={home.unreadCount ? "down" : "up"}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {showRest && (
          <AdminCard>
            <AdminCardHeader
              title="Jobs pipeline"
              caption="Where every live job sits right now."
              action={<AdminQuietLink href="/admin/jobs">Jobs</AdminQuietLink>}
            />
            <div className="mt-4">
              <PipelineBar rows={home.jobsByStatus} />
            </div>
            <ul className="mt-5 space-y-1.5">
              {recentJobs.map((job) => (
                <li key={job.id}>
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-hm-fog"
                  >
                    <span className="min-w-0 truncate font-semibold text-hm-charcoal">
                      {job.profiles?.name || job.title}
                    </span>
                    <span className="shrink-0 text-xs text-hm-muted">
                      {JOB_STATUS_LABELS[job.status]}
                    </span>
                  </Link>
                </li>
              ))}
              {!recentJobs.length && <p className="px-3 text-sm text-hm-muted">No jobs yet.</p>}
            </ul>
          </AdminCard>
        )}

        {showMoney && (
          <AdminCard>
            <AdminCardHeader
              title="Money"
              caption={`${home.unpaidCount} open · ${home.paidCount} paid · ${money(home.overdueCents)} overdue`}
              action={<AdminQuietLink href="/admin/invoices">Invoices</AdminQuietLink>}
            />
            <div className="mt-4">
              <PipelineBar rows={home.invoiceBuckets} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-hm-fog/80 px-3.5 py-3">
                <p className="text-xs font-semibold text-hm-muted">Outstanding</p>
                <p className="mt-1 font-display text-xl font-bold tracking-tight">
                  <CountUp value={money(home.kpis.outstanding)} />
                </p>
              </div>
              <div className="rounded-xl bg-hm-fog/80 px-3.5 py-3">
                <p className="text-xs font-semibold text-hm-muted">Month collected</p>
                <p className="mt-1 font-display text-xl font-bold tracking-tight">
                  <CountUp value={money(home.kpis.monthRevenue)} />
                </p>
              </div>
            </div>
          </AdminCard>
        )}

        {showSchedule && (
          <AdminCard>
            <AdminCardHeader
              title="Schedule"
              caption={`${home.pendingVisits.length} pending · ${home.thisWeekCount} this week · ${home.openSlots} open slots`}
              action={<AdminQuietLink href="/admin/schedule">Calendar</AdminQuietLink>}
            />
            <ul className="mt-4 space-y-2">
              {home.pendingVisits.slice(0, 3).map((a) => (
                <li key={a.id} className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-2.5 text-sm">
                  <p className="font-semibold text-amber-950">Needs confirm · {formatWhen(a.starts_at)}</p>
                  <p className="text-amber-900/80">
                    {a.jobs?.profiles?.name || "Customer"} · {a.jobs?.title}
                  </p>
                </li>
              ))}
              {home.confirmedVisits.map((a) => (
                <li key={a.id} className="rounded-xl bg-hm-fog/80 px-3 py-2.5 text-sm">
                  <p className="font-semibold text-hm-charcoal">{formatWhen(a.starts_at)}</p>
                  <p className="text-hm-muted">
                    {a.jobs?.profiles?.name || "Customer"}
                    {a.tech_name ? ` · ${a.tech_name}` : ""}
                  </p>
                </li>
              ))}
              {!home.pendingVisits.length && !home.confirmedVisits.length && (
                <p className="text-sm text-hm-muted">No upcoming visits.</p>
              )}
            </ul>
          </AdminCard>
        )}

        {showAttention && (
          <AdminCard>
            <AdminCardHeader
              title="Messages"
              caption={home.unreadCount ? `${home.unreadCount} waiting on you` : "You're caught up"}
              action={<AdminQuietLink href="/admin/messages">Inbox</AdminQuietLink>}
            />
            <ul className="mt-4 space-y-2">
              {unreadThreads.map((t) => {
                const last = t.last as { body?: string; created_at?: string };
                const preview = parseMessagePhoto(last.body || "").text || "Photo attached";
                return (
                  <li key={t.jobId}>
                    <Link
                      href={`/admin/jobs/${t.jobId}`}
                      className="block rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-2.5 text-sm transition hover:border-hm-red/40"
                    >
                      <p className="font-semibold text-amber-950">
                        {t.customerName} · {t.unreadFromCustomer} unread
                      </p>
                      <p className="line-clamp-1 text-amber-900/80">{preview}</p>
                    </Link>
                  </li>
                );
              })}
              {!unreadThreads.length && <p className="text-sm text-hm-muted">No unread customer threads.</p>}
            </ul>
          </AdminCard>
        )}
      </div>

      {showRest && (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <AdminCard>
            <AdminCardHeader
              title="Leads"
              caption={`${home.insights.total} in the last 30 days · ${home.newLeadCount} still marked new`}
              action={<AdminQuietLink href="/admin/leads">All leads</AdminQuietLink>}
            />
            <div className="mt-4">
              <ColumnChart rows={home.insights.weekdays} />
            </div>
            <ul className="mt-5 space-y-1.5">
              {recentLeads.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm"
                >
                  <span className="min-w-0 truncate">
                    <span className="font-semibold text-hm-charcoal">{l.name}</span>
                    <span className="text-hm-muted">
                      {" "}
                      ? {[l.service, l.city].filter(Boolean).join(" · ") || l.email}
                    </span>
                  </span>
                  <span className="shrink-0 capitalize text-xs font-semibold text-hm-muted">
                    {l.status}
                  </span>
                </li>
              ))}
              {!recentLeads.length && <p className="px-3 text-sm text-hm-muted">No leads yet.</p>}
            </ul>
          </AdminCard>

          <div className="space-y-5">
            <Link
              href="/admin/insights"
              className="hm-admin-card hm-admin-click block border-hm-red/20 bg-hm-red/[0.04] px-5 py-4"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-hm-red">
                Ads · 30 days
              </p>
              <p className="mt-2 font-display text-xl font-bold tracking-tight text-hm-charcoal">
                {home.insights.recommendation.headline}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-hm-muted">
                {home.insights.recommendation.detail}
              </p>
            </Link>
            <InsightBars
              title="What they're asking for"
              caption="Top services from real quote forms."
              rows={home.insights.services.slice(0, 5)}
            />
          </div>
        </div>
      )}
    </>
  );
}
