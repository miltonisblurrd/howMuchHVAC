import Link from "next/link";
import { AdminCard, AdminCardHeader } from "@/components/admin/AdminUi";
import { RescheduleNote } from "@/components/portal/VisitCard";
import type { Appointment } from "@/lib/db-types";
import { formatWhen, money } from "@/lib/db-types";
import { LOCK_IN_COPY } from "@/lib/deposits";

export function InstallCard({
  appointment,
  hasSelection,
  depositPaid,
  depositCents,
  phase,
}: {
  appointment: Appointment | null;
  hasSelection: boolean;
  depositPaid: boolean;
  depositCents: number;
  phase: string;
}) {
  const upcoming =
    appointment &&
    new Date(appointment.starts_at).getTime() >= Date.now() &&
    appointment.status !== "completed" &&
    appointment.status !== "cancelled";
  const finished = appointment && !upcoming;

  const choosing = phase === "request" || phase === "visit" || phase === "pick" || phase === "cancelled" || !hasSelection;

  let caption = "Andy sets this date. It is the day the work happens.";
  if (choosing) caption = "Andy sets the install day after you choose an option.";
  else if (!depositPaid) caption = "A date can be held, and it is confirmed once the deposit is paid.";
  else if (!appointment) caption = "Your deposit is in. Andy will put the install day on the calendar.";

  return (
    <section id="install">
      <AdminCard>
        <AdminCardHeader title="Install day" caption={caption} />

        {!appointment && choosing && (
          <p className="mt-4 rounded-xl border border-hm-line bg-hm-fog px-4 py-3 text-sm text-hm-muted">
            Andy will set this after you choose.
          </p>
        )}

        {!appointment && !choosing && (
          <p className="mt-4 rounded-xl border border-hm-line bg-hm-fog px-4 py-3 text-sm text-hm-muted">
            {depositPaid
              ? "No install day yet. Andy will put it on the calendar."
              : "No install day yet. Andy will set it, and it stays held until you pay the deposit."}
          </p>
        )}

        {appointment && !depositPaid && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-900">
              Held. Pay the deposit to confirm
            </p>
            <p className="mt-1 font-display text-lg font-bold text-hm-charcoal">
              {formatWhen(appointment.starts_at)}
            </p>
            {appointment.tech_name && (
              <p className="mt-1 text-sm text-hm-muted">{appointment.tech_name}</p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-amber-950">{LOCK_IN_COPY}</p>
            {depositCents > 0 && (
              <Link
                href="/portal/pay"
                className="mt-3 inline-flex text-sm font-semibold text-hm-red"
              >
                Pay {money(depositCents)} deposit
              </Link>
            )}
          </div>
        )}

        {appointment && depositPaid && (
          <div
            className={
              finished
                ? "mt-4 rounded-xl border border-hm-line bg-hm-fog px-4 py-3"
                : "mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
            }
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-800">
              {finished ? "Done" : appointment.status === "pending" ? "Waiting on Andy to confirm" : "Confirmed"}
            </p>
            <p className="mt-1 font-display text-lg font-bold text-hm-charcoal">
              {formatWhen(appointment.starts_at)}
            </p>
            {appointment.tech_name && (
              <p className="mt-1 text-sm text-hm-muted">{appointment.tech_name}</p>
            )}
          </div>
        )}

        {appointment && !finished && <RescheduleNote />}
      </AdminCard>
    </section>
  );
}
