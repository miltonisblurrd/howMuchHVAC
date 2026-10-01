import Link from "next/link";
import { Check } from "lucide-react";
import { DirectPhone } from "@/components/contact/CallAndy";
import { AdminCard, AdminCardHeader } from "@/components/admin/AdminUi";
import type { Appointment } from "@/lib/db-types";
import { formatWhen } from "@/lib/db-types";
import { APPOINTMENT_TYPE_LABELS } from "@/lib/job-stages";

export function RescheduleNote() {
  return (
    <p className="mt-4 text-sm text-hm-muted">
      Need a different day?{" "}
      <Link href="/portal/messages" className="font-semibold text-hm-red">
        Message Andy
      </Link>{" "}
      or call <DirectPhone className="font-semibold text-hm-red" />.
    </p>
  );
}

function isUpcoming(appointment: Appointment) {
  return (
    new Date(appointment.starts_at).getTime() >= Date.now() &&
    (appointment.status === "confirmed" || appointment.status === "pending")
  );
}

export function VisitCard({ appointment }: { appointment: Appointment | null }) {
  const upcoming = appointment ? isUpcoming(appointment) : false;
  const done = appointment && !upcoming;

  return (
    <AdminCard>
      <AdminCardHeader
        title="Appointment"
        caption="Andy comes out to look at the job first. Pricing comes after this visit."
      />
      {!appointment ? (
        <p className="mt-4 text-sm text-hm-muted">
          Andy will set the day to come look. You don&apos;t pick the time here.
        </p>
      ) : (
        <div
          className={
            done
              ? "mt-4 rounded-xl border border-hm-line bg-hm-fog px-4 py-3"
              : appointment.status === "pending"
                ? "mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
                : "mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
          }
        >
          <p className="font-display text-lg font-bold text-hm-charcoal">
            {formatWhen(appointment.starts_at)}
          </p>
          <p className="mt-1 text-sm text-hm-muted">
            {APPOINTMENT_TYPE_LABELS[appointment.type] ?? "Look / estimate visit"}
            {appointment.tech_name ? ` with ${appointment.tech_name}` : ""}
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-hm-charcoal">
            {done ? (
              <>
                <Check className="h-4 w-4 text-emerald-700" /> Done
              </>
            ) : appointment.status === "pending" ? (
              "Waiting on Andy to confirm"
            ) : (
              "On the calendar"
            )}
          </p>
        </div>
      )}
      {appointment && upcoming && <RescheduleNote />}
      {done && (
        <p className="mt-4 text-sm text-hm-muted">
          Questions about this visit?{" "}
          <Link href="/portal/messages" className="font-semibold text-hm-red">
            Message Andy
          </Link>{" "}
          or call <DirectPhone className="font-semibold text-hm-red" />.
        </p>
      )}
    </AdminCard>
  );
}
