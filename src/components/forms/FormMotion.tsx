"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { quoteNextSteps } from "@/lib/quote-next";
import { cn } from "@/lib/cn";

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function QuoteProgress({ filled, total }: { filled: number; total: number }) {
  const pct = total <= 0 ? 0 : Math.min(100, Math.round((filled / total) * 100));
  return (
    <div
      className="mt-4 h-1 overflow-hidden rounded-full bg-hm-fog"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label="Form progress"
    >
      <div className="hm-progress-fill h-full rounded-full bg-hm-red" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function DrawnCheck({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500",
        className,
      )}
    >
      <svg viewBox="0 0 52 52" className="h-8 w-8" aria-hidden>
        <circle className="hm-draw-circle" cx="26" cy="26" r="23" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path
          className="hm-draw-check"
          d="M15 27 l7 7 15-16"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function QuoteSuccess({
  title,
  detail,
  portalNote = false,
  className,
}: {
  title: string;
  detail?: string;
  portalNote?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("hm-animate-in text-center", className)}>
      <DrawnCheck />
      <p className="hm-step-in hm-delay-2 mt-5 font-display text-2xl font-bold tracking-tight">{title}</p>
      {detail ? <p className="hm-step-in hm-delay-3 mt-2 text-sm leading-relaxed text-hm-muted">{detail}</p> : null}
      <ol className="mt-6 grid gap-2 text-left">
        {quoteNextSteps.map((step, index) => (
          <li
            key={step.title}
            className={cn(
              "hm-step-in flex gap-3 rounded-xl bg-hm-fog px-3 py-3",
              index === 0 && "hm-delay-4",
              index === 1 && "hm-delay-5",
              index === 2 && "hm-delay-6",
            )}
          >
            <span className="font-display text-sm font-extrabold text-hm-red">{index + 1}</span>
            <span>
              <span className="block text-sm font-semibold text-hm-charcoal">{step.title}</span>
              <span className="mt-0.5 block text-xs text-hm-muted">{step.body}</span>
            </span>
          </li>
        ))}
      </ol>
      {portalNote ? (
        <p className="hm-step-in hm-delay-6 mt-4 text-xs leading-relaxed text-hm-muted">
          Check your email for a link to set your portal password. That link is the only step.
        </p>
      ) : null}
    </div>
  );
}

export function TrackedField({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  minLength,
  value,
  onChange,
  validate,
  shakeSignal = 0,
  placeholder,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
  value: string;
  onChange: (value: string) => void;
  validate?: (value: string) => boolean;
  shakeSignal?: number;
  placeholder?: string;
  className?: string;
}) {
  const [shake, setShake] = useState(false);
  const [touched, setTouched] = useState(false);
  const trimmed = value.trim();
  const formatOk = validate ? validate(value) : true;
  const showCheck = Boolean(validate && touched && trimmed && formatOk);

  useEffect(() => {
    if (!shakeSignal) return;
    setShake(true);
    setTouched(true);
    const timer = window.setTimeout(() => setShake(false), 450);
    return () => window.clearTimeout(timer);
  }, [shakeSignal]);

  return (
    <label className={cn("block", shake && "hm-shake", className)}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">{label}</span>
      <span className="relative block">
        <input
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          minLength={minLength}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onBlur={() => {
            setTouched(true);
            if (validate && trimmed && !formatOk) setShake(true);
          }}
          onAnimationEnd={() => setShake(false)}
          className={cn("hm-input", showCheck && "pr-10")}
        />
        {showCheck ? (
          <Check
            aria-hidden
            className="hm-pop pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600"
          />
        ) : null}
      </span>
    </label>
  );
}

