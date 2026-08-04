"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

export function QuoteForm({
  compact = false,
  className,
  elevated = false,
}: {
  compact?: boolean;
  className?: string;
  /** Stronger elevation for hero placement */
  elevated?: boolean;
}) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div
        className={cn(
          "rounded-2xl bg-white p-7 text-hm-charcoal md:p-8",
          elevated ? "shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)] ring-1 ring-black/5" : "shadow-xl",
          className,
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <p className="mt-4 font-display text-[11px] font-bold uppercase tracking-[0.22em] text-hm-red">
          Request received
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">
          Thanks — we&apos;ll be in touch.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-hm-muted">
          Prefer to talk now? Call Andy direct at{" "}
          <a href={site.phones.direct.href} className="font-semibold text-hm-charcoal underline">
            {site.phones.direct.display}
          </a>
          .
        </p>
        <Button className="mt-6" onClick={() => setSubmitted(false)} variant="outline" tone="light">
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form
      className={cn(
        "rounded-2xl bg-white p-6 text-hm-charcoal md:p-8",
        elevated
          ? "shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)] ring-1 ring-black/5"
          : "shadow-xl ring-1 ring-black/5",
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-hm-red">
            Free quote
          </p>
          <h3 className="mt-1.5 font-display text-xl font-bold tracking-tight md:text-2xl">
            So, how much for your home?
          </h3>
        </div>
        <div className="hidden shrink-0 items-center gap-1 rounded-full bg-hm-fog px-2.5 py-1 text-[11px] font-semibold text-hm-charcoal sm:flex">
          <span className="text-amber-500">?</span> {site.google.rating}
        </div>
      </div>

      <div className={`mt-5 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Field label="First name" name="firstName" required autoComplete="given-name" />
        <Field label="Last name" name="lastName" required autoComplete="family-name" />
        <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        {!compact && (
          <>
            <Field label="City" name="city" autoComplete="address-level2" />
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                Service needed
              </span>
              <select
                name="service"
                className="hm-input"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select a service
                </option>
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
                <option value="second-opinion">Second opinion</option>
                <option value="not-sure">Not sure yet</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                What&apos;s going on?
              </span>
              <textarea
                name="message"
                rows={2}
                className="hm-input !h-auto min-h-[4.5rem] py-3"
                placeholder="AC not cooling, install quote, second opinion?"
              />
            </label>
          </>
        )}
      </div>

      <Button type="submit" className="mt-5 w-full" size="lg" tone="light">
        Get my quote
      </Button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-hm-muted">
        <ShieldCheck className="h-3.5 w-3.5 text-hm-red" />
        {site.license} ? No pressure — Same-day callbacks
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="hm-input"
      />
    </label>
  );
}
