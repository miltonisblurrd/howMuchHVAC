"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export type CalendarItem = {
  id: string;
  day: string;
  time: string;
  title: string;
  href?: string;
  kind: "visit" | "block" | "slot";
};

function monthLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function shiftMonth(year: number, month: number, delta: number) {
  const next = new Date(year, month + delta, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
}

export function ScheduleBoard({
  year,
  month,
  items,
  blocks,
  feedUrl,
}: {
  year: number;
  month: number;
  items: CalendarItem[];
  blocks: { id: string; label: string }[];
  feedUrl: string | null;
}) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  async function blockDays(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate, endDate: endDate || startDate, reason }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setMsg(data.error || "Couldn't block those days.");
      return;
    }
    setStartDate("");
    setEndDate("");
    setReason("");
    setMsg("Blocked. New bookings can't land on those days.");
    router.refresh();
  }

  async function removeBlock(id: string) {
    await fetch(`/api/admin/blocks?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="mt-6 space-y-5">
      <section className="hm-admin-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">{monthLabel(year, month)}</h2>
          <div className="flex gap-2">
            <Link
              href={`/admin/schedule?month=${shiftMonth(year, month, -1)}`}
              className="rounded-lg border border-hm-line px-3 py-1.5 text-sm font-semibold"
            >
              Prev
            </Link>
            <Link
              href="/admin/schedule"
              className="rounded-lg border border-hm-line px-3 py-1.5 text-sm font-semibold"
            >
              Today
            </Link>
            <Link
              href={`/admin/schedule?month=${shiftMonth(year, month, 1)}`}
              className="rounded-lg border border-hm-line px-3 py-1.5 text-sm font-semibold"
            >
              Next
            </Link>
          </div>
        </div>
        <div className="mt-4 -mx-1 overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-hm-muted">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {cells.map((day, index) => {
                const key = day
                  ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  : `empty-${index}`;
                const dayItems = day ? items.filter((item) => item.day === key) : [];
                return (
                  <div
                    key={key}
                    className={cn(
                      "min-h-24 rounded-lg border p-1.5",
                      day ? "border-hm-line bg-white" : "border-transparent",
                    )}
                  >
                    {day ? <p className="text-xs font-semibold text-hm-muted">{day}</p> : null}
                    <ul className="mt-1 space-y-1">
                      {dayItems.map((item) => {
                        const className = cn(
                          "block truncate rounded px-1 py-0.5 text-[11px] font-semibold",
                          item.kind === "block" && "bg-hm-charcoal text-white",
                          item.kind === "visit" && "bg-hm-red/10 text-hm-red",
                          item.kind === "slot" && "bg-hm-fog text-hm-muted",
                        );
                        const label = `${item.time} ${item.title}`;
                        return (
                          <li key={item.id}>
                            {item.href ? (
                              <Link href={item.href} className={className} title={label}>
                                {label}
                              </Link>
                            ) : (
                              <span className={className} title={label}>
                                {label}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="hm-admin-card p-5">
          <h2 className="font-display text-lg font-bold">Block days</h2>
          <p className="mt-1 text-sm text-hm-muted">
            Out of town or not working. Website requests and phone bookings cannot land on these days.
          </p>
          <form onSubmit={blockDays} className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">From</span>
              <input
                required
                type="date"
                className="hm-input mt-1 h-11 bg-white"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">Through</span>
              <input
                type="date"
                className="hm-input mt-1 h-11 bg-white"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">Reason</span>
              <input
                className="hm-input mt-1 h-11 bg-white"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Out of town"
              />
            </label>
            <Button type="submit" disabled={saving} arrow={false} className="sm:col-span-2 w-full sm:w-auto">
              {saving ? "Saving..." : "Block these days"}
            </Button>
          </form>
          {msg ? <p className="mt-3 text-sm font-medium">{msg}</p> : null}
          <ul className="mt-4 space-y-2 text-sm">
            {blocks.map((block) => (
              <li key={block.id} className="flex items-center justify-between gap-3 rounded-lg bg-hm-fog px-3 py-2">
                <span>{block.label}</span>
                <button type="button" className="font-semibold text-hm-red" onClick={() => removeBlock(block.id)}>
                  Remove
                </button>
              </li>
            ))}
            {!blocks.length && <li className="text-hm-muted">No days blocked.</li>}
          </ul>
        </section>

        <section className="hm-admin-card p-5">
          <h2 className="font-display text-lg font-bold">Google Calendar</h2>
          <p className="mt-1 text-sm leading-relaxed text-hm-muted">
            Add this address in Google Calendar under Other calendars, then From URL. Visits and blocked days show up on your phone. Google refreshes the link on its own.
          </p>
          {feedUrl ? (
            <p className="mt-4 break-all rounded-xl bg-hm-fog px-3 py-3 font-mono text-xs">{feedUrl}</p>
          ) : (
            <p className="mt-4 text-sm text-hm-red">
              The calendar link needs the server environment before it can be copied.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
