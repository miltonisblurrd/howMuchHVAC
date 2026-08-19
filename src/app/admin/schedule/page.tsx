import { AdminShell } from "@/components/admin/AdminShell";
import { AvailabilityForm } from "@/components/admin/AvailabilityForm";
import { ConfirmAppointmentActions } from "@/components/admin/ConfirmAppointmentActions";
import { requireAdmin } from "@/lib/auth";
import { getAdminSchedule } from "@/lib/admin-queries";
import { formatWhen } from "@/lib/db-types";
import type { Appointment } from "@/lib/db-types";
import Link from "next/link";

export default async function AdminSchedulePage() {
  const admin = await requireAdmin();
  const { appointments, windows } = await getAdminSchedule();
  const pending = appointments.filter((row) => (row as { status?: string }).status === "pending");

  return (
    <AdminShell
      userName={admin.name || admin.email}
      title="Schedule"
      description="Confirm time requests, publish slots, or assign visits from a job."
    >

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
