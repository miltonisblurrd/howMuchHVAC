import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  FileText,
  MessageSquare,
  Sparkles,
  Users,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import {
  adminMessages,
  invoiceTotals,
  invoices,
  kpis,
  leads,
  money,
  schedule,
} from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-session";

const statusStyles: Record<string, string> = {
  Paid: "bg-emerald-100 text-emerald-800",
  Unpaid: "bg-amber-100 text-amber-900",
  Overdue: "bg-red-100 text-red-800",
  Draft: "bg-slate-100 text-slate-700",
  Confirmed: "bg-emerald-100 text-emerald-800",
  "En route": "bg-sky-100 text-sky-800",
  "Needs confirm": "bg-amber-100 text-amber-900",
};

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const totals = invoiceTotals();
  const unread = adminMessages.filter((m) => m.unread).length;

  return (
    <AdminShell userName={admin.name}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-hm-red">
            Admin ? demo
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-hm-charcoal">
            Good afternoon, {admin.name}
          </h1>
          <p className="mt-2 text-hm-muted">
            Here&apos;s the business at a glance ? cash, jobs, and what needs attention.
          </p>
        </div>
        <Button href="/admin/assistant">
          <Sparkles className="h-4 w-4" />
          Ask AI assistant
        </Button>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Revenue MTD",
            value: money(kpis.monthRevenue),
            hint: `? ${kpis.monthRevenueChange}% vs last month`,
          },
          {
            label: "Outstanding",
            value: money(totals.unpaid),
            hint: `${money(totals.overdue)} overdue`,
          },
          {
            label: "Jobs this week",
            value: String(kpis.jobsThisWeek),
            hint: `${kpis.jobsCompletedMonth} completed this month`,
          },
          {
            label: "New leads",
            value: String(kpis.newLeads),
            hint: `${kpis.closeRate}% close rate`,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-hm-line bg-white px-5 py-4 shadow-sm"
          >
            <p className="text-sm text-hm-muted">{card.label}</p>
            <p className="mt-1 font-display text-3xl font-bold text-hm-charcoal">
              {card.value}
            </p>
            <p className="mt-2 text-xs font-medium text-hm-muted">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <StatChip
          href="/admin/invoices"
          icon={FileText}
          label="Invoices paid"
          value={money(totals.paid)}
        />
        <StatChip
          href="/admin/messages"
          icon={MessageSquare}
          label="Unread messages"
          value={String(unread)}
        />
        <StatChip
          href="/admin/leads"
          icon={Users}
          label="Avg ticket"
          value={money(kpis.avgTicket)}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-hm-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-hm-charcoal">
              Needs attention
            </h2>
            <Link
              href="/admin/invoices"
              className="text-sm font-semibold text-hm-red hover:underline"
            >
              View invoices
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {invoices
              .filter((i) => i.status === "Overdue" || i.status === "Unpaid")
              .slice(0, 4)
              .map((inv) => (
                <li
                  key={inv.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-hm-fog px-4 py-3"
                >
                  <div>
                    <p className="font-display text-sm font-bold text-hm-charcoal">
                      {inv.client}
                    </p>
                    <p className="text-xs text-hm-muted">
                      {inv.number} ? due {inv.dueAt}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm font-bold">{money(inv.amount)}</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${statusStyles[inv.status]}`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-hm-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-hm-charcoal">
              Upcoming schedule
            </h2>
            <Link
              href="/admin/schedule"
              className="text-sm font-semibold text-hm-red hover:underline"
            >
              Full board
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {schedule.slice(0, 4).map((job) => (
              <li
                key={job.id}
                className="flex items-start justify-between gap-3 rounded-xl bg-hm-fog px-4 py-3"
              >
                <div>
                  <p className="font-display text-sm font-bold text-hm-charcoal">
                    {job.title}
                  </p>
                  <p className="mt-0.5 text-xs text-hm-muted">
                    {job.client} ? {job.city} ? {job.tech}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-hm-charcoal">{job.when}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusStyles[job.status]}`}
                >
                  {job.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-hm-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Recent messages</h2>
            <Link href="/admin/messages" className="text-sm font-semibold text-hm-red">
              Inbox
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {adminMessages.slice(0, 4).map((m) => (
              <li key={m.id} className="rounded-xl border border-hm-line px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-sm font-bold">
                    {m.unread && (
                      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-hm-red" />
                    )}
                    {m.from}
                  </p>
                  <span className="text-[11px] text-hm-muted">{m.at}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-hm-muted">{m.preview}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-hm-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Lead pipeline</h2>
            <Link href="/admin/leads" className="text-sm font-semibold text-hm-red">
              All leads
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {leads.slice(0, 4).map((lead) => (
              <li
                key={lead.id}
                className="flex items-center justify-between rounded-xl bg-hm-fog px-4 py-3"
              >
                <div>
                  <p className="font-display text-sm font-bold">{lead.name}</p>
                  <p className="text-xs text-hm-muted">
                    {lead.service} ? {lead.city} ? {lead.source}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{money(lead.value)}</p>
                  <p className="text-[11px] text-hm-muted">{lead.status}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-8 rounded-2xl bg-hm-charcoal p-6 text-white md:flex md:items-center md:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 font-display text-sm font-bold">
            <Sparkles className="h-4 w-4 text-hm-red" />
            Vision unlock
          </p>
          <p className="mt-2 max-w-xl text-sm text-white/70">
            Ask the AI to summarize cash, draft payment reminders, or brief you before
            Thursday&apos;s installs ? wired to this demo data so you can feel the power.
          </p>
        </div>
        <Button href="/admin/assistant" variant="secondary" tone="dark" className="mt-4 md:mt-0">
          Open AI assistant
        </Button>
      </div>
    </AdminShell>
  );
}

function StatChip({
  href,
  icon: Icon,
  label,
  value,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-hm-line bg-white px-4 py-3 shadow-sm transition hover:border-hm-red/35"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-hm-fog text-hm-red">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs text-hm-muted">{label}</p>
          <p className="font-display text-lg font-bold text-hm-charcoal">{value}</p>
        </div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-hm-muted" />
    </Link>
  );
}
