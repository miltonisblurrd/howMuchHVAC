"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { CLIENT_STEPS, type ClientStage } from "@/lib/client-stages";
import { cn } from "@/lib/cn";

export function ClientJobStepper({ stage }: { stage: ClientStage }) {
  const cancelled = stage.phase === "cancelled";
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const frame = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="hm-admin-card p-5">
      <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-hm-muted">
        Where this job is
      </p>
      <p className="mt-1 text-sm text-hm-muted">
        Andy moves the job. You always see the same steps he does.
      </p>

      {cancelled ? (
        <div className="mt-4 rounded-xl border border-hm-line bg-hm-fog px-4 py-3 text-sm font-semibold text-hm-charcoal">
          This job is cancelled. Message Andy if you want to start again.
        </div>
      ) : (
        <>
          <ol className="mt-5 grid gap-2 sm:grid-cols-5">
            {CLIENT_STEPS.map((step, idx) => {
              const done = idx < stage.stepIndex;
              const active = idx === stage.stepIndex;
              return (
                <li key={step.key} className="relative">
                  {idx < CLIENT_STEPS.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute top-[1.35rem] left-[calc(50%+1.25rem)] hidden h-[2px] w-[calc(100%-2.5rem)] overflow-hidden bg-hm-line sm:block"
                    >
                      <span
                        className={cn(
                          "hm-step-fill block h-full w-full bg-hm-red",
                          drawn && idx < stage.stepIndex && "is-on",
                        )}
                        style={{ transitionDelay: `${idx * 140}ms` }}
                      />
                    </span>
                  )}
                  <div
                    aria-current={active ? "step" : undefined}
                    className={cn(
                      "flex w-full flex-row items-center gap-3 rounded-xl px-3 py-2.5 sm:flex-col sm:items-center sm:gap-2 sm:py-3 sm:text-center",
                      active && "bg-[color-mix(in_oklab,var(--hm-red)_8%,white)]",
                    )}
                  >
                    <span
                      className={cn(
                        "relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-bold",
                        done && "border-hm-red bg-hm-red text-white",
                        active && "hm-pulse-once border-hm-red bg-white text-hm-red shadow-[0_0_0_4px_rgba(255,29,37,0.15)]",
                        !done && !active && "border-hm-line bg-white text-hm-muted",
                      )}
                    >
                      {done ? <Check className="h-4 w-4" strokeWidth={3} /> : idx + 1}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block font-display text-sm font-bold",
                          active || done ? "text-hm-charcoal" : "text-hm-muted",
                        )}
                      >
                        {step.label}
                      </span>
                      {active && idx === 2 && stage.substep ? (
                        <span className="mt-2 flex flex-col gap-1.5 text-left sm:items-center sm:text-center">
                          <Substep
                            label="Pick an option"
                            state={stage.substep === "pick" ? "active" : "done"}
                          />
                          <Substep
                            label="Pay the deposit"
                            state={
                              stage.substep === "pay" ? "active" : stage.substep === "paid" ? "done" : "wait"
                            }
                          />
                        </span>
                      ) : active ? (
                        <span className="mt-0.5 block text-xs leading-snug text-hm-muted">{stage.hint}</span>
                      ) : null}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </section>
  );
}

function Substep({
  label,
  state,
}: {
  label: string;
  state: "wait" | "active" | "done";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs",
        state === "active" && "font-semibold text-hm-charcoal",
        state === "done" && "font-semibold text-hm-charcoal",
        state === "wait" && "text-hm-muted",
      )}
    >
      <span
        className={cn(
          "inline-flex h-4 w-4 items-center justify-center rounded-full",
          state === "done" && "bg-hm-red text-white",
          state === "active" && "bg-white text-hm-red ring-2 ring-hm-red",
          state === "wait" && "bg-hm-fog text-hm-muted ring-1 ring-hm-line",
        )}
      >
        {state === "done" ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : null}
      </span>
      {label}
    </span>
  );
}

/** Five-segment bar for a job that isn't the one open on screen. */
export function ClientStageBar({ stage }: { stage: ClientStage }) {
  if (stage.phase === "cancelled") {
    return <p className="mt-3 text-sm font-semibold text-hm-muted">Cancelled</p>;
  }
  return (
    <div className="mt-3">
      <ol className="flex gap-1.5" aria-label={`Progress: ${stage.label}`}>
        {CLIENT_STEPS.map((step, idx) => (
          <li key={step.key} className="flex-1">
            <span
              className={cn(
                "block h-1.5 rounded-full",
                idx <= stage.stepIndex ? "bg-hm-red" : "bg-hm-line",
              )}
            />
            <span className="sr-only">{step.label}</span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-sm font-semibold text-hm-charcoal">{stage.label}</p>
    </div>
  );
}
