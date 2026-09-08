import {
  getAdminInbox,
  getAdminInvoices,
  getAdminJobs,
  getAdminKpis,
  getAdminLeads,
  getAdminSchedule,
} from "@/lib/admin-queries";
import { getLeadInsights, type Bucket } from "@/lib/lead-insights";
import { JOB_STATUS_LABELS, money, type JobStatus } from "@/lib/db-types";

export type HomeAlert = {
  href: string;
  label: string;
  detail: string;
  tone: "urgent" | "wait" | "ok";
};

export async function getAdminHomeSnapshot() {
  const [kpis, jobs, invoices, schedule, inbox, leads, insights] = await Promise.all([
    getAdminKpis(),
    getAdminJobs(100),
    getAdminInvoices(),
    getAdminSchedule(),
    getAdminInbox(),
    getAdminLeads(80),
    getLeadInsights("30d"),
  ]);

  const jobRows = jobs as {
    id: string;
    title: string;
    status: JobStatus;
    city?: string | null;
    service?: string | null;
    profiles?: { name?: string; email?: string } | null;
  }[];

  const jobStatusOrder: JobStatus[] = [
    "quote_request",
    "scheduled",
    "estimate_ready",
    "in_progress",
    "completed",
  ];
  const jobTotal = jobRows.filter((j) => j.status !== "cancelled").length;
  const jobsByStatus: Bucket[] = jobStatusOrder.map((status) => {
    const count = jobRows.filter((j) => j.status === status).length;
    return {
      key: JOB_STATUS_LABELS[status],
      count,
      pct: jobTotal ? Math.round((count / jobTotal) * 100) : 0,
    };
  });

  const invRows = invoices as {
    id: string;
    number: string;
    status: string;
    amount_cents: number;
    job_id: string;
    profiles?: { name?: string } | null;
    jobs?: { title?: string } | null;
  }[];
  const unpaid = invRows.filter((i) => i.status === "unpaid" || i.status === "overdue");
  const overdue = invRows.filter((i) => i.status === "overdue");
  const paid = invRows.filter((i) => i.status === "paid");
  const invoiceBuckets: Bucket[] = [
    { key: "Unpaid", count: unpaid.length, pct: 0 },
    { key: "Overdue", count: overdue.length, pct: 0 },
    { key: "Paid", count: paid.length, pct: 0 },
  ];
  const invCount = unpaid.length + overdue.length + paid.length;
  for (const b of invoiceBuckets) {
    b.pct = invCount ? Math.round((b.count / invCount) * 100) : 0;
  }

  const appts = schedule.appointments as {
    id: string;
    starts_at: string;
    status: string;
    type: string;
    job_id: string;
    tech_name?: string | null;
    jobs?: { title?: string; profiles?: { name?: string } | null } | null;
  }[];
  const pendingVisits = appts.filter((a) => a.status === "pending");
  const confirmedVisits = appts.filter((a) => a.status === "confirmed");
  const weekFrom = Date.now();
  const weekTo = Date.now() + 7 * 86400000;
  const thisWeek = confirmedVisits.filter((a) => {
    const t = new Date(a.starts_at).getTime();
    return t >= weekFrom && t <= weekTo;
  });

  const unreadThreads = inbox.filter((t) => t.unreadFromCustomer > 0);
  const unreadCount = unreadThreads.reduce((s, t) => s + t.unreadFromCustomer, 0);

  const newLeads = leads.filter((l) => l.status === "new");

  const alerts: HomeAlert[] = [];
  if (pendingVisits.length) {
    alerts.push({
      href: "/admin/schedule",
      label: `${pendingVisits.length} time request${pendingVisits.length === 1 ? "" : "s"} waiting`,
      detail: "Customer picked a day. Confirm or decline.",
      tone: "urgent",
    });
  }
  if (unreadCount) {
    alerts.push({
      href: "/admin/messages",
      label: `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}`,
      detail: `${unreadThreads.length} conversation${unreadThreads.length === 1 ? "" : "s"} need a reply.`,
      tone: "urgent",
    });
  }
  if (overdue.length) {
    alerts.push({
      href: "/admin/invoices",
      label: `${overdue.length} overdue invoice${overdue.length === 1 ? "" : "s"}`,
      detail: `${money(overdue.reduce((s, i) => s + i.amount_cents, 0))} past due.`,
      tone: "urgent",
    });
  }
  if (newLeads.length) {
    alerts.push({
      href: "/admin/leads",
      label: `${newLeads.length} new lead${newLeads.length === 1 ? "" : "s"}`,
      detail: "Haven't been marked contacted yet.",
      tone: "wait",
    });
  }
  if (unpaid.length && !overdue.length) {
    alerts.push({
      href: "/admin/invoices",
      label: `${money(unpaid.reduce((s, i) => s + i.amount_cents, 0))} open`,
      detail: `${unpaid.length} unpaid invoice${unpaid.length === 1 ? "" : "s"}.`,
      tone: "wait",
    });
  }
  if (!alerts.length) {
    alerts.push({
      href: "/admin/schedule",
      label: "Nothing blocking you",
      detail: "No pending times, unread threads, or overdue invoices.",
      tone: "ok",
    });
  }

  return {
    kpis,
    alerts,
    jobsByStatus,
    invoiceBuckets,
    unpaidCents: unpaid.reduce((s, i) => s + i.amount_cents, 0),
    overdueCents: overdue.reduce((s, i) => s + i.amount_cents, 0),
    paidCount: paid.length,
    unpaidCount: unpaid.length,
    pendingVisits,
    confirmedVisits: confirmedVisits.slice(0, 5),
    thisWeekCount: thisWeek.length,
    openSlots: schedule.windows.length,
    unreadCount,
    unreadThreads: unreadThreads.slice(0, 4),
    newLeadCount: newLeads.length,
    recentLeads: leads.slice(0, 5),
    recentJobs: jobRows.slice(0, 5),
    insights,
  };
}
