import { AdminShell } from "@/components/admin/AdminShell";
import { AvailabilityForm } from "@/components/admin/AvailabilityForm";
import { ConfirmAppointmentActions } from "@/components/admin/ConfirmAppointmentActions";
import { ScheduleBoard, type CalendarItem } from "@/components/admin/ScheduleBoard";
import { requireAdmin } from "@/lib/auth";
import { getAdminSchedule } from "@/lib/admin-queries";
import { calendarFeedUrl } from "@/lib/calendar-feed";
import { formatWhen } from "@/lib/db-types";
import type { Appointment } from "@/lib/db-types";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";

function pacificDay(iso: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function pacificTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function daysCovered(startsAt: string, endsAt: string) {
  const days = new Set<string>();
  let cursor = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();
  while (cursor < end) {
    days.add(pacificDay(new Date(cursor).toISOString()));
    cursor += 12 * 60 * 60 * 1000;
  }
  return [...days];
}

export default async function AdminSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const admin = await requireAdmin();
  const { month: monthParam } = await searchParams;
  const now = new Date();
  const parsed = /^(\d{4})-(\d{2})$/.exec(monthParam || "");
  const year = parsed ? Number(parsed[1]) : now.getFullYear();
  const month = parsed ? Number(parsed[2]) - 1 : now.getMonth();
  const rangeStart = new Date(year, month, 1);
  rangeStart.setDate(rangeStart.getDate() - 2);
  const rangeEnd = new Date(year, month + 1, 1);
  rangeEnd.setDate(rangeEnd.getDate() + 2);

  const db = getSupabaseAdmin();
  const { data: monthVisits } = await db
    .from("appointments")
    .select("id, starts_at, ends_at, type, status, job_id, jobs(title, profiles!customer_id(name))")
    .gte("starts_at", rangeStart.toISOString())
    .lt("starts_at", rangeEnd.toISOString())
    .neq("status", "cancelled");
  const { data: monthBlocks } = await db
    .from("availability_windows")
    .select("id, starts_at, ends_at, label")
    .like("label", "block:%")
    .lt("starts_at", rangeEnd.toISOString())
    .gt("ends_at", rangeStart.toISOString());

  const items: CalendarItem[] = [];
  for (const visit of monthVisits || []) {
    const jobRaw = visit.jobs as
      | { title?: string; profiles?: { name?: string } | { name?: string }[] | null }
      | { title?: string; profiles?: { name?: string } | { name?: string }[] | null }[]
      | null;
    const job = Array.isArray(jobRaw) ? jobRaw[0] : jobRaw;
    const profile = Array.isArray(job?.profiles) ? job?.profiles[0] : job?.profiles;
    items.push({
      id: visit.id,
      day: pacificDay(visit.starts_at),
      time: pacificTime(visit.starts_at),
      title: profile?.name || job?.title || (visit.type === "install" ? "Install" : "Visit"),
      href: `/admin/jobs/${visit.job_id}`,
      kind: "visit",
    });
  }
  for (const block of monthBlocks || []) {
    for (const day of daysCovered(block.starts_at, block.ends_at)) {
      items.push({
        id: `${block.id}-${day}`,
        day,
        time: "All day",
        title: (block.label || "").replace(/^block:/, "").trim() || "Blocked",
        kind: "block",
      });
    }
  }

  const { appointments, windows } = await getAdminSchedule();
  const pending = appointments.filter((row) => (row as { status?: string }).status === "pending");

  return (
    <AdminShell
      userName={admin.name || admin.email}
      title="Schedule"
      description="Confirm time requests, block days you're out, and keep the same schedule on your phone."
    >
      <ScheduleBoard
        year={year}
        month={month}
        items={items}
        feedUrl={calendarFeedUrl()}
        blocks={(monthBlocks || []).map((block) => ({
          id: block.id,
          label: `${pacificDay(block.starts_at)} – ${pacificDay(new Date(new Date(block.ends_at).getTime() - 1).toISOString())}${(block.label || "").replace(/^block:/, "").trim() ? ` · ${(block.label || "").replace(/^block:/, "").trim()}` : ""}`,
        }))}
      />

      {pending.length > 0 && (
        <section className="hm-admin-card border-amber-200/80 bg-amber-50/70 p-5">
          <h2 className="font-display text-lg font-bold text-amber-950">
            Pending customer requests ({pending.length})
          </h2>
          <ul className="mt-4 space-y-3">
            {pending.map((row) => {
              const a = row as Appointment & {
                jobs?: {
                  title?: string;
                  city?: string;
                  profiles?: { name?: string; phone?: string } | null;
                } | null;
              };
              return (
                <li key={a.id} className="rounded-xl bg-white px-4 py-3 text-sm">
                  <p className="font-semibold">{formatWhen(a.starts_at)}</p>
                  <p className="text-hm-muted">
                    {a.jobs?.profiles?.name || "Customer"} · {a.jobs?.title} · {a.type}
                  </p>
                  <ConfirmAppointmentActions appointment={a} />
                  <Link href={`/admin/jobs/${a.job_id}`} className="mt-2 inline-block text-hm-red">
                    Open job →
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="hm-admin-card p-5">
          <h2 className="font-display text-lg font-bold">Upcoming visits</h2>
          <ul className="mt-4 space-y-3">
            {appointments
              .filter((row) => (row as { status?: string }).status !== "pending")
              .map((row) => {
                const a = row as {
                  id: string;
                  starts_at: string;
                  type: string;
                  status: string;
                  job_id: string;
                  tech_name?: string | null;
                  jobs?: {
                    title?: string;
                    city?: string;
                    profiles?: { name?: string; phone?: string } | null;
                  } | null;
                };
                return (
                  <li key={a.id} className="rounded-xl bg-hm-fog px-4 py-3 text-sm">
                    <p className="font-semibold">{formatWhen(a.starts_at)}</p>
                    <p className="text-hm-muted">
                      {a.jobs?.profiles?.name || "Customer"} · {a.jobs?.title} · {a.type}
                      {a.tech_name ? ` · ${a.tech_name}` : ""}
                    </p>
                    <Link href={`/admin/jobs/${a.job_id}`} className="mt-1 inline-block text-hm-red">
                      Open job →
                    </Link>
                  </li>
                );
              })}
            {!appointments.filter((row) => (row as { status?: string }).status !== "pending").length && (
              <p className="text-sm text-hm-muted">No upcoming confirmed visits.</p>
            )}
          </ul>
        </section>

        <section className="hm-admin-card p-5">
          <h2 className="font-display text-lg font-bold">Open slots (customer bookable)</h2>
          <AvailabilityForm />
          <ul className="mt-4 space-y-2 text-sm">
            {windows.map((w) => (
              <li key={w.id} className="rounded-lg bg-hm-fog px-3 py-2">
                {formatWhen(w.starts_at)}
                {w.label ? ` — ${w.label}` : ""}
              </li>
            ))}
            {!windows.length && <p className="text-hm-muted">No open slots published.</p>}
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}
