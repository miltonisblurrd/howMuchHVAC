"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmAppointmentActions } from "@/components/admin/ConfirmAppointmentActions";
import { cn } from "@/lib/cn";
import type { Appointment, AppointmentType } from "@/lib/db-types";
import { formatWhen } from "@/lib/db-types";
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_TYPE_LABELS } from "@/lib/job-stages";

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function toDateInput(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
}

const TIMES: { value: string; label: string }[] = [];
for (let h = 7; h <= 18; h++) {
  for (const m of [0, 30]) {
    if (h === 18 && m === 30) continue;
    const value = `${pad(h)}:${pad(m)}`;
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    TIMES.push({ value, label: `${hour12}:${pad(m)} ${h < 12 ? "AM" : "PM"}` });
  }
}

const LENGTHS = [
  { hours: 1, label: "1 hr" },
  { hours: 2, label: "2 hrs" },
  { hours: 4, label: "Half day" },
  { hours: 8, label: "Full day" },
];

function VisitList({
  items,
  customerFirstName,
}: {
  items: Appointment[];
  customerFirstName: string;
}) {
  if (!items.length) return null;
  return (
    <ul className="mt-3 space-y-2">
      {items.map((a) => (
        <li
          key={a.id}
          className={cn(
            "rounded-xl border px-4 py-3",
            a.status === "pending" ? "border-amber-200 bg-amber-50" : "border-hm-line bg-white",
          )}
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <CalendarDays className="h-4 w-4 text-hm-red" />
            <p className="font-display font-bold text-hm-charcoal">{formatWhen(a.starts_at)}</p>
            <span className="text-sm text-hm-muted">{APPOINTMENT_TYPE_LABELS[a.type] ?? a.type}</span>
            <span
              className={cn(
                "ml-auto rounded-full px-2.5 py-1 text-[11px] font-bold",
                a.status === "pending"
                  ? "bg-amber-500/15 text-amber-900"
                  : a.status === "confirmed"
                    ? "bg-emerald-500/12 text-emerald-800"
                    : "bg-hm-fog text-hm-muted",
              )}
            >
              {APPOINTMENT_STATUS_LABELS[a.status] ?? a.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-hm-muted">
            {a.booked_by === "admin" ? "Booked by you" : `Requested by ${customerFirstName}`}
          </p>
          <ConfirmAppointmentActions appointment={a} />
        </li>
      ))}
    </ul>
  );
}

function ScheduleFields({
  type,
  buttonLabel,
  doneLabel,
  jobId,
  customerFirstName,
}: {
  type: AppointmentType;
  buttonLabel: string;
  doneLabel: string;
  jobId: string;
  customerFirstName: string;
}) {
  const router = useRouter();
  const [date, setDate] = useState(toDateInput(tomorrow()));
  const [time, setTime] = useState("09:00");
  const [hours, setHours] = useState(type === "install" ? 8 : 2);
  const [tech, setTech] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const start = new Date(`${date}T${time}:00`);
  const validStart = !Number.isNaN(start.getTime());

  async function schedule() {
    if (!validStart) return;
    setSaving(true);
    setMsg(null);
    const end = new Date(start.getTime() + hours * 3600 * 1000);
    const res = await fetch("/api/admin/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId,
        startsAt: start.toISOString(),
        endsAt: end.toISOString(),
        type,
        techName: tech.trim() || undefined,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg({ ok: false, text: data.error || "Couldn't schedule." });
      return;
    }
    setMsg({
      ok: true,
      text: `Booked ${formatWhen(start.toISOString())}. ${customerFirstName} got an email and text. ${doneLabel}`,
    });
    router.refresh();
  }

  return (
    <div className="mt-3 rounded-xl bg-hm-fog p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">Day</span>
          <input
            type="date"
            className="hm-input mt-1 h-11 bg-white"
            value={date}
            min={toDateInput(new Date())}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">Arrive at</span>
          <select className="hm-input mt-1 h-11 bg-white" value={time} onChange={(e) => setTime(e.target.value)}>
            {TIMES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setDate(toDateInput(tomorrow()));
            setTime("09:00");
          }}
          className="h-8 rounded-full border border-hm-line bg-white px-3 text-xs font-semibold hover:border-hm-charcoal/40"
        >
          Tomorrow 9 AM
        </button>
        <button
          type="button"
          onClick={() => {
            setDate(toDateInput(tomorrow()));
            setTime("13:00");
          }}
          className="h-8 rounded-full border border-hm-line bg-white px-3 text-xs font-semibold hover:border-hm-charcoal/40"
        >
          Tomorrow 1 PM
        </button>
      </div>
      <div className="mt-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">How long</span>
        <div className="mt-1 flex flex-wrap gap-2">
          {LENGTHS.map((l) => (
            <button
              key={l.hours}
              type="button"
              onClick={() => setHours(l.hours)}
              className={cn(
                "h-9 rounded-full border px-3.5 text-sm font-semibold transition",
                hours === l.hours
                  ? "border-hm-charcoal bg-hm-charcoal text-white"
                  : "border-hm-line bg-white text-hm-charcoal hover:border-hm-charcoal/40",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <label className="mt-3 block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">
          Who&apos;s going (optional)
        </span>
        <input
          className="hm-input mt-1 h-11 bg-white"
          placeholder="Andy, Marcos"
          value={tech}
          onChange={(e) => setTech(e.target.value)}
        />
      </label>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="button" onClick={schedule} disabled={saving || !validStart} arrow={false}>
          {saving ? "Booking..." : buttonLabel}
        </Button>
        {validStart && <span className="text-sm text-hm-muted">{formatWhen(start.toISOString())}</span>}
      </div>
      {msg && (
        <p className={cn("mt-3 text-sm font-medium", msg.ok ? "text-emerald-700" : "text-hm-red")}>{msg.text}</p>
      )}
    </div>
  );
}

export function JobVisitCard({
  jobId,
  customerFirstName,
  appointments,
}: {
  jobId: string;
  customerFirstName: string;
  appointments: Appointment[];
}) {
  const look = appointments.filter((a) => a.status !== "cancelled" && a.type !== "install");
  const install = appointments.filter((a) => a.status !== "cancelled" && a.type === "install");

  return (
    <section className="hm-admin-card scroll-mt-24 space-y-8 p-5">
      <div id="visit" className="scroll-mt-24">
        <h2 className="font-display text-lg font-bold">1. First visit</h2>
        <p className="mt-1 text-sm text-hm-muted">
          Go look before you price. Website leads: Andy calls, then sets the day here. Phone
          leads: this is often already set from the call form.
        </p>
        <VisitList items={look} customerFirstName={customerFirstName} />
        <ScheduleFields
          type="diagnostic"
          buttonLabel="Schedule first visit"
          doneLabel="Job moved to Appointment scheduled."
          jobId={jobId}
          customerFirstName={customerFirstName}
        />
      </div>

      <div id="install" className="scroll-mt-24 border-t border-hm-line pt-6">
        <h2 className="font-display text-lg font-bold">2. Install / project date</h2>
        <p className="mt-1 text-sm text-hm-muted">
          After pricing is ready. This is the day you come back to do the work.
        </p>
        <VisitList items={install} customerFirstName={customerFirstName} />
        <ScheduleFields
          type="install"
          buttonLabel="Set install date"
          doneLabel="Job moved to Install / Project Date."
          jobId={jobId}
          customerFirstName={customerFirstName}
        />
      </div>
    </section>
  );
}
