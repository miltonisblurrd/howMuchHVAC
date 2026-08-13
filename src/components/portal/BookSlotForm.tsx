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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  if (slots.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-hm-line bg-white p-4 text-sm text-hm-muted">
        No self-serve slots are open right now. Call Andy and he?ll schedule you.
      </p>
    );
  }

  async function book() {
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
    setOk(true);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-hm-line bg-white p-4">
      <label className="block text-xs font-semibold uppercase tracking-wide text-hm-muted">
        Open slots
      </label>
      <select
        className="hm-input mt-2"
        value={windowId}
        onChange={(e) => setWindowId(e.target.value)}
      >
        {slots.map((s) => (
          <option key={s.id} value={s.id}>
            {formatWhen(s.starts_at)}
            {s.label ? ` ? ${s.label}` : ""}
          </option>
        ))}
      </select>
      <Button type="button" className="mt-3 w-full" onClick={book} disabled={loading || ok}>
        {ok ? "Booked" : loading ? "Booking?" : "Book this slot"}
      </Button>
      {error && <p className="mt-2 text-xs text-hm-red">{error}</p>}
    </div>
  );
}
