"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { MIN_PASSWORD_LENGTH, validateNewPassword } from "@/lib/passwords";
import { markSkipPortalSkeleton } from "@/lib/admin-dashboard-skel";

export function QuoteForm({
  compact = false,
  className,
  elevated = false,
  sourceLabel = "Quote form",
  portalSignup = true,
  stayOnSuccess = false,
}: {
  compact?: boolean;
  className?: string;
  /** Stronger elevation for hero placement */
  elevated?: boolean;
  sourceLabel?: string;
  /** When false, capture the lead only — no portal password. */
  portalSignup?: boolean;
  stayOnSuccess?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const firstName = String(form.get("firstName") || "").trim();
    const lastName = String(form.get("lastName") || "").trim();
    const name = [firstName, lastName].filter(Boolean).join(" ");

    const password = portalSignup ? String(form.get("password") || "") : "";
    const confirm = portalSignup ? String(form.get("confirmPassword") || "") : "";
    if (portalSignup) {
      const passwordError = validateNewPassword(password, confirm);
      if (passwordError) {
        setError(passwordError);
        setLoading(false);
        return;
      }
    }

    const params =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: form.get("email"),
          phone: form.get("phone"),
          city: form.get("city") || null,
          service: form.get("service") || null,
          message: form.get("message") || null,
          ...(portalSignup ? { password } : {}),
          sourcePath: pathname || "/",
          sourceLabel,
          utmSource: params?.get("utm_source"),
          utmMedium: params?.get("utm_medium"),
          utmCampaign: params?.get("utm_campaign"),
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please call us or try again.");
        setLoading(false);
        return;
      }

      if (portalSignup) {
        const login = await fetch("/api/auth/password-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: String(form.get("email") || "").trim().toLowerCase(),
            password,
            next: "/portal",
          }),
        });
        if (login.ok) markSkipPortalSkeleton();
      }

      if (stayOnSuccess) {
        setDone(true);
        setLoading(false);
        return;
      }

      router.push(`/thank-you?name=${encodeURIComponent(firstName || name)}`);
    } catch {
      setError("Something went wrong. Please call us or try again.");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div
        className={cn(
          "rounded-2xl bg-white p-8 text-center text-hm-charcoal",
          elevated
            ? "shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)] ring-1 ring-black/5"
            : "shadow-xl ring-1 ring-black/5",
          className,
        )}
      >
        <p className="font-display text-xl font-bold">Got it — Andy will follow up</p>
        <p className="mt-2 text-sm text-hm-muted">
          Same-day callback. Prefer the phone? Call {site.phones.direct.display}.
        </p>
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
      onSubmit={onSubmit}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-hm-red">
            Free quote
          </p>
          <h3 className="mt-1.5 font-display text-xl font-bold tracking-tight md:text-2xl">
            What Can We Help You With Today?
          </h3>
        </div>
        <div className="hidden shrink-0 items-center gap-1 rounded-full bg-hm-fog px-2.5 py-1 text-[11px] font-semibold text-hm-charcoal sm:flex">
          <span className="text-amber-500">★</span> {site.google.rating}
        </div>
      </div>

      <div className={`mt-5 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <Field label="First name" name="firstName" required autoComplete="given-name" />
        <Field label="Last name" name="lastName" required autoComplete="family-name" />
        <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        {portalSignup && (
          <>
            <Field
              label="Portal password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={MIN_PASSWORD_LENGTH}
            />
            <Field
              label="Confirm password"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              minLength={MIN_PASSWORD_LENGTH}
            />
          </>
        )}
        {!compact && (
          <>
            <Field label="City" name="city" autoComplete="address-level2" />
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                Service needed
              </span>
              <select name="service" className="hm-input" defaultValue="" required>
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

      {portalSignup && (
        <p className="mt-3 text-xs text-hm-muted">
          Already a customer? Use the portal password you already have. New here? Pick one you can
          remember — you&apos;ll use it to sign in next time, no email link.
        </p>
      )}

      {error && <p className="mt-3 text-sm text-hm-red">{error}</p>}

      <Button type="submit" className="mt-5 w-full" size="lg" tone="light" disabled={loading}>
        {loading ? "Sending…" : "Get My Quote"}
      </Button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-hm-muted">
        <ShieldCheck className="h-3.5 w-3.5 text-hm-red" />
        {site.license} · {portalSignup ? "Creates your portal login · " : ""}No pressure — same-day
        callbacks
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
  minLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
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
        minLength={minLength}
        className="hm-input"
      />
    </label>
  );
}
