"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SchedulePace } from "@/lib/db-types";
import { SCHEDULE_PACES } from "@/lib/schedule-pace";
import { cn } from "@/lib/cn";

export function SchedulePacePicker({
  jobId,
  pace,
}: {
  jobId: string;
  pace: SchedulePace | null;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState<SchedulePace | null>(pace);
  const [saving, setSaving] = useState<SchedulePace | null>(null);
  const [error, setError] = useState("");

  async function choose(next: SchedulePace) {
    setSaving(next);
    setError("");
    const res = await fetch("/api/portal/schedule-pace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, pace: next }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(null);
    if (!res.ok) {
      setError(data.error || "Could not save that. Try again.");
      return;
    }
    setCurrent(next);
    router.refresh();
  }

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-hm-charcoal">How soon do you want the work?</p>
      <p className="mt-1 text-sm text-hm-muted">
        You pick the pace. Andy puts the actual day on the calendar.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {SCHEDULE_PACES.map((item) => {
          const selected = current === item.id;
          return (
            <button
              key={item.id}
              type="button"
              disabled={Boolean(saving)}
              onClick={() => choose(item.id)}
              className={cn(
                "rounded-xl border px-4 py-3 text-left",
                selected ? "border-hm-red bg-hm-red/5" : "border-hm-line bg-white hover:border-hm-charcoal/30",
              )}
            >
              <span className="block font-display text-sm font-bold">{item.label}</span>
              <span className="mt-0.5 block text-xs text-hm-muted">
                {saving === item.id ? "Saving?" : item.detail}
              </span>
            </button>
          );
        })}
      </div>
      {current && (
        <p className="mt-3 text-sm text-hm-muted">Andy has this as {SCHEDULE_PACES.find((item) => item.id === current)?.label}. He?ll set the day.</p>
      )}
      {error && <p className="mt-2 text-sm text-hm-red">{error}</p>}
    </div>
  );
}
