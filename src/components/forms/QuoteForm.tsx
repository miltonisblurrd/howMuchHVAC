"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  isValidEmail,
  isValidPhone,
  QuoteProgress,
  QuoteSuccess,
  TrackedField,
} from "@/components/forms/FormMotion";
import { ServiceOptions } from "@/components/forms/ServiceOptions";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { MIN_PASSWORD_LENGTH, validateNewPassword } from "@/lib/passwords";
import { markSkipPortalSkeleton } from "@/lib/admin-dashboard-skel";
import { HoneypotField, TurnstileField, useFormGuard } from "@/components/forms/FormGuard";

export function QuoteForm({
  compact = false,
  className,
  elevated = false,
  sourceLabel = "Quote form",
  portalSignup = false,
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
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shakes, setShakes] = useState({ phone: 0, email: 0, service: 0 });
  const [serviceShake, setServiceShake] = useState(false);
  const guard = useFormGuard();

  useEffect(() => {
    if (!shakes.service) return;
    setServiceShake(true);
    const timer = window.setTimeout(() => setServiceShake(false), 450);
    return () => window.clearTimeout(timer);
  }, [shakes.service]);

  const cardClass = cn(
    "relative rounded-2xl bg-white p-6 text-hm-charcoal md:p-8",
    elevated
      ? "shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)] ring-1 ring-black/5"
      : "shadow-xl ring-1 ring-black/5",
    className,
  );

  const progress = useMemo(() => {
    const fields = [firstName, lastName, phone, email];
    if (portalSignup) fields.push(password, confirmPassword);
    if (!compact) fields.push(service);
    const filled = fields.filter((value) => value.trim()).length;
    return { filled, total: fields.length };
  }, [compact, confirmPassword, email, firstName, lastName, password, phone, portalSignup, service]);

  function bump(field: "phone" | "email" | "service") {
    setShakes((current) => ({ ...current, [field]: current[field] + 1 }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!isValidPhone(phone)) {
      bump("phone");
      setLoading(false);
      return;
    }
    if (!isValidEmail(email)) {
      bump("email");
      setLoading(false);
      return;
    }
    if (!compact && !service) {
      bump("service");
      setLoading(false);
      return;
    }

    const passwordValue = portalSignup ? password : "";
    const confirm = portalSignup ? confirmPassword : "";
    if (portalSignup) {
      const passwordError = validateNewPassword(passwordValue, confirm);
      if (passwordError) {
        setError(passwordError);
        return;
      }
    }

    const notReady = guard.notReadyMessage();
    if (notReady) {
      setError(notReady);
      return;
    }

    setLoading(true);
    const name = [firstName, lastName].map((value) => value.trim()).filter(Boolean).join(" ");
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          city: city || null,
          service: service || null,
          message: message || null,
          ...(portalSignup ? { password: passwordValue } : {}),
          sourcePath: pathname || "/",
          sourceLabel,
          utmSource: params?.get("utm_source"),
          utmMedium: params?.get("utm_medium"),
          utmCampaign: params?.get("utm_campaign"),
          ...guard.payload(),
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string; id?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please call us or try again.");
        setLoading(false);
        return;
      }

      if (portalSignup && data.id) {
        const login = await fetch("/api/auth/password-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: passwordValue,
            next: "/portal",
          }),
        });
        if (login.ok) markSkipPortalSkeleton();
      }

      setDone(true);
      setLoading(false);
    } catch {
      setError("Something went wrong. Please call us or try again.");
      setLoading(false);
    }
  }

  if (done) {
    const who = firstName.trim();
    return (
      <div className={cardClass}>
        <QuoteSuccess
          title={who ? `Andy has this, ${who}` : "Andy has this"}
          detail={
            stayOnSuccess
              ? `Prefer the phone? Call ${site.phones.direct.display}.`
              : "Your request is in. Here is what happens next."
          }
          portalNote={sourceLabel !== "Coming soon"}
        />
      </div>
    );
  }

  return (
    <form className={cardClass} onSubmit={onSubmit}>
      <HoneypotField inputRef={guard.honeypotRef} />
      <div>
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-hm-red">Free quote</p>
        <h3 className="mt-1.5 whitespace-nowrap font-display text-base font-bold leading-tight tracking-tight sm:text-lg">
          What Can We Help You With Today?
        </h3>
      </div>

      <QuoteProgress filled={progress.filled} total={progress.total} />

      <div className={`mt-5 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        <TrackedField label="First name" name="firstName" required autoComplete="given-name" value={firstName} onChange={setFirstName} />
        <TrackedField label="Last name" name="lastName" required autoComplete="family-name" value={lastName} onChange={setLastName} />
        <TrackedField
          label="Phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          value={phone}
          onChange={setPhone}
          validate={isValidPhone}
          shakeSignal={shakes.phone}
        />
        <TrackedField
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={setEmail}
          validate={isValidEmail}
          shakeSignal={shakes.email}
        />
        {portalSignup && (
          <>
            <TrackedField
              label="Portal password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={MIN_PASSWORD_LENGTH}
              value={password}
              onChange={setPassword}
            />
            <TrackedField
              label="Confirm password"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              minLength={MIN_PASSWORD_LENGTH}
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </>
        )}
        {!compact && (
          <>
            <TrackedField label="City" name="city" autoComplete="address-level2" value={city} onChange={setCity} />
            <label className={cn("block", serviceShake && "hm-shake")}>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                Service needed
              </span>
              <select
                name="service"
                className="hm-input"
                value={service}
                required
                onChange={(event) => setService(event.target.value)}
              >
                <ServiceOptions blankLabel="Select a service" blankDisabled valueKey="slug" />
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
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="hm-input !h-auto min-h-[4.5rem] py-3"
                placeholder="AC not cooling, install quote, second opinion?"
              />
            </label>
          </>
        )}
      </div>

      {portalSignup && (
        <p className="mt-3 text-xs text-hm-muted">
          Already a customer? Use the portal password you already have. New here? Pick one you can remember —
          you&apos;ll use it to sign in next time, no email link.
        </p>
      )}

      <TurnstileField onToken={guard.setTurnstileToken} />

      {error && <p className="mt-3 text-sm text-hm-red">{error}</p>}

      <Button type="submit" className="mt-5 w-full" size="lg" tone="light" disabled={loading}>
        {loading ? "Sending…" : "Get My Quote"}
      </Button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-hm-muted">
        <ShieldCheck className="h-3.5 w-3.5 text-hm-red" />
        {site.license} · {portalSignup ? "Creates your portal login · " : ""}No pressure — same-day callbacks
      </p>
    </form>
  );
}
