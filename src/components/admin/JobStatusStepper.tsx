"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import type { JobStatus } from "@/lib/db-types";
import { JOB_STAGES, stageIndex } from "@/lib/job-stages";
import { cn } from "@/lib/cn";

/**
 * Where is this job? Click a step to move it. Saves instantly.
 */
export function JobStatusStepper({ jobId, status }: { jobId: string; status: JobStatus }) {
  const router = useRouter();
  const [current, setCurrent] = useState<JobStatus>(status);
  const [saving, setSaving] = useState<JobStatus | null>(null);
  const [msg, setMsg] = useState("");

  const currentIdx = stageIndex(current);
  const cancelled = current === "cancelled";

  async function move(next: JobStatus) {
    if (next === current || saving) return;
    if (next === "cancelled" && !window.confirm("Cancel this job? The customer will see it as cancelled.")) {
      return;
    }
    const previous = current;
    setCurrent(next);
    setSaving(next);
    setMsg("");
    const res = await fetch("/api/admin/jobs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, status: next }),
    });
    setSaving(null);
    if (!res.ok) {
      setCurrent(previous);
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "Couldn't update. Try again.");
      return;
    }
    const label = JOB_STAGES.find((s) => s.status === next)?.label ?? "Cancelled";
    setMsg(`Moved to “${label}”. Customer's portal is updated.`);
    router.refresh();
  }

  return (
    <section className="hm-admin-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-hm-muted">
            Where this job is
          </p>
          <p className="mt-1 text-sm text-hm-muted">
            Tap a step to move the job. It saves right away and the customer sees it.
          </p>
        </div>
        {!cancelled ? (
          <button
            type="button"
            onClick={() => move("cancelled")}
            className="text-xs font-semibold text-hm-muted underline-offset-4 hover:text-hm-red hover:underline"
          >
            Cancel job
          </button>
        ) : (
          <button
            type="button"
            onClick={() => move("quote_request")}
            className="inline-flex items-center gap-1.5 rounded-full border border-hm-line px-3 py-1.5 text-xs font-semibold text-hm-charcoal hover:bg-hm-fog"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reopen job
          </button>
        )}
      </div>

      {cancelled ? (
        <div className="mt-4 rounded-xl border border-hm-line bg-hm-fog px-4 py-3 text-sm font-semibold text-hm-charcoal">
          This job is cancelled. Reopen it if the customer comes back.
        </div>
      ) : (
        <ol className="mt-5 grid gap-2 sm:grid-cols-5">
          {JOB_STAGES.map((stage, idx) => {
            const done = idx < currentIdx;
            const active = idx === currentIdx;
            const isSaving = saving === stage.status;
            return (
              <li key={stage.status} className="relative">
                {idx < JOB_STAGES.length - 1 && (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-[1.35rem] left-[calc(50%+1.25rem)] hidden h-[2px] w-[calc(100%-2.5rem)] sm:block",
                      done ? "bg-hm-red" : "bg-hm-line",
                    )}
                  />
                )}
                <button
                  type="button"
                  onClick={() => move(stage.status)}
                  disabled={Boolean(saving)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "flex w-full flex-row items-center gap-3 rounded-xl px-3 py-2.5 text-left transition sm:flex-col sm:items-center sm:gap-2 sm:py-3 sm:text-center",
                    active
                      ? "bg-[color-mix(in_oklab,var(--hm-red)_8%,white)]"
                      : "hover:bg-hm-fog",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-bold transition",
                      done && "border-hm-red bg-hm-red text-white",
                      active && "border-hm-red bg-white text-hm-red shadow-[0_0_0_4px_rgba(255,29,37,0.15)]",
                      !done && !active && "border-hm-line bg-white text-hm-muted",
                      isSaving && "animate-pulse",
                    )}
                  >
                    {done ? <Check className="h-4 w-4" strokeWidth={3} /> : idx + 1}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block font-display text-sm font-bold",
                        active ? "text-hm-charcoal" : done ? "text-hm-charcoal/80" : "text-hm-muted",
                      )}
                    >
                      {stage.label}
                    </span>
                    {active && (
                      <span className="mt-0.5 block text-xs leading-snug text-hm-muted">{stage.hint}</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}

      {msg && <p className="mt-3 text-sm font-medium text-hm-charcoal">{msg}</p>}
    </section>
  );
}
