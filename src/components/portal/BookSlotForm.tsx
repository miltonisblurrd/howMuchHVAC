"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { AvailabilityWindow } from "@/lib/db-types";
import { formatWhen } from "@/lib/db-types";

export function BookSlotForm({
  jobId,
  slots,
}: {
  jobId: string;
  slots: AvailabilityWindow[];
}) {
  const router = useRouter();
  const [windowId, setWindowId] = useState(slots[0]?.id || "");
  const [startsAt, setStartsAt] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function bookSlot() {
    if (!windowId) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/portal/book-slot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, availabilityWindowId: windowId }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not book slot");
      return;
    }
    setOk("Slot booked");
    router.refresh();
  }

  async function requestTime() {
    if (!startsAt) return;
    setLoading(true);
    setError("");
    const start = new Date(startsAt);
    const res = await fetch("/api/portal/request-time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId,
        startsAt: start.toISOString(),
        note,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not request that time");
      return;
    }
    setOk("Time requested — Andy will confirm");
    setStartsAt("");
    setNote("");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {slots.length > 0 && (
        <div className="rounded-xl border border-hm-line bg-hm-fog/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-hm-muted">
            Open slots (instant book)
          </p>
          <select
            className="hm-input mt-2"
            value={windowId}
            onChange={(e) => setWindowId(e.target.value)}
          >
            {slots.map((s) => (
              <option key={s.id} value={s.id}>
                {formatWhen(s.starts_at)}
                {s.label ? ` — ${s.label}` : ""}
              </option>
            ))}
          </select>
          <Button
            type="button"
            className="mt-3 w-full"
            onClick={bookSlot}
            disabled={loading || Boolean(ok)}
          >
            {loading ? "Booking…" : "Book this slot"}
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-hm-line bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-hm-muted">
          Request a day and time
        </p>
        <p className="mt-1 text-xs text-hm-muted">
          This stays pending until Andy confirms. He may assign a tech after.
        </p>
        <input
          type="datetime-local"
          className="hm-input mt-3"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
        />
        <textarea
          className="hm-input mt-2 min-h-[72px]"
          placeholder="Gate code, preferred tech, anything Andy should know…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button
          type="button"
          variant="secondary"
          className="mt-3 w-full"
          onClick={requestTime}
          disabled={loading || !startsAt}
          arrow={false}
        >
          {loading ? "Sending…" : "Request this time"}
        </Button>
      </div>

      {ok && <p className="text-sm font-semibold text-emerald-700">{ok}</p>}
      {error && <p className="text-sm text-hm-red">{error}</p>}
    </div>
  );
}
