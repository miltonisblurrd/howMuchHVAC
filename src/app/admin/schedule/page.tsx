import { AdminShell } from "@/components/admin/AdminShell";
import { AvailabilityForm } from "@/components/admin/AvailabilityForm";
import { requireAdmin } from "@/lib/auth";
import { getAdminSchedule } from "@/lib/admin-queries";
import { formatWhen } from "@/lib/db-types";
import Link from "next/link";

export default async function AdminSchedulePage() {
  const admin = await requireAdmin();
  const { appointments, windows } = await getAdminSchedule();

  return (
    <AdminShell userName={admin.name || admin.email}>
      <h1 className="font-display text-3xl font-bold tracking-tight">Schedule</h1>
      <p className="mt-2 text-hm-muted">
        Publish open slots for customer self-booking, or assign visits from each job.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-hm-line bg-white p-5">
          <h2 className="font-display text-lg font-bold">Upcoming visits</h2>
          <ul className="mt-4 space-y-3">
            {appointments.map((row) => {
              const a = row as {
                id: string;
                starts_at: string;
                type: string;
                status: string;
                job_id: string;
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
                  </p>
                  <Link href={`/admin/jobs/${a.job_id}`} className="mt-1 inline-block text-hm-red">
                    Open job →
                  </Link>
                </li>
              );
            })}
            {!appointments.length && <p className="text-sm text-hm-muted">No upcoming visits.</p>}
          </ul>
        </section>

        <section className="rounded-2xl border border-hm-line bg-white p-5">
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
