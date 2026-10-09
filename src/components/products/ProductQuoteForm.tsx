"use client";

import { useMemo, useState } from "react";
import { HoneypotField, TurnstileField, useFormGuard } from "@/components/forms/FormGuard";
import {
  isValidEmail,
  isValidPhone,
  QuoteProgress,
  QuoteSuccess,
  TrackedField,
} from "@/components/forms/FormMotion";

const ducts = ["Existing ducts", "New ducts", "Ductless", "Not sure"] as const;
const warranties = ["Standard warranty", "Extended warranty", "Not sure"] as const;

export function ProductQuoteForm({
  productName,
  sizes,
}: {
  productName: string;
  sizes: string[];
}) {
  const guard = useFormGuard();
  const [size, setSize] = useState(sizes[0] ?? "Not sure yet");
  const [duct, setDuct] = useState<(typeof ducts)[number]>("Not sure");
  const [warranty, setWarranty] = useState<(typeof warranties)[number]>("Standard warranty");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [shakes, setShakes] = useState({ phone: 0, email: 0 });

  const progress = useMemo(() => {
    const fields = [firstName, lastName, phone, email, city];
    return { filled: fields.filter((value) => value.trim()).length, total: fields.length };
  }, [city, email, firstName, lastName, phone]);

  function bump(field: "phone" | "email") {
    setShakes((current) => ({ ...current, [field]: current[field] + 1 }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!isValidPhone(phone)) {
      bump("phone");
      return;
    }
    if (!isValidEmail(email)) {
      bump("email");
      return;
    }
    const notReady = guard.notReadyMessage();
    if (notReady) {
      setError(notReady);
      return;
    }

    const form = new FormData(event.currentTarget);
    const name = [firstName, lastName].map((value) => value.trim()).filter(Boolean).join(" ");
    const notes = String(form.get("notes") || "").trim();
    const message = [
      "Quote request",
      `Product: ${productName}`,
      `Size: ${size}`,
      `Ducts: ${duct}`,
      `Warranty: ${warranty}`,
      "Price: Andy confirms the price before anything is ordered.",
      notes ? `Notes: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          city: city || null,
          service: productName,
          message,
          sourcePath: window.location.pathname,
          sourceLabel: "Product quote",
          ...guard.payload(),
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Could not send that. Try again.");
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Could not send that. Try again.");
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div id="quote" className="rounded-2xl bg-white p-6 text-hm-charcoal shadow-2xl ring-1 ring-black/5 md:p-8">
        <QuoteSuccess
          title={firstName.trim() ? `Andy has this, ${firstName.trim()}` : "Andy has this"}
          detail={`${productName}, ${size}. He confirms the price before anything is ordered.`}
          portalNote
        />
      </div>
    );
  }

  return (
    <form
      id="quote"
      onSubmit={onSubmit}
      className="relative scroll-mt-28 rounded-2xl bg-white p-6 text-hm-charcoal shadow-2xl ring-1 ring-black/5 md:p-8"
    >
      <HoneypotField inputRef={guard.honeypotRef} />
      <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-hm-red">Get a quote</p>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">Build this system</h2>
      <p className="mt-2 text-sm text-hm-muted">
        {productName} is already selected. Andy confirms the price. Nothing is charged on this form.
      </p>
      <QuoteProgress filled={progress.filled} total={progress.total} />

      <fieldset className="mt-6">
        <legend className="text-xs font-semibold uppercase tracking-wide text-hm-muted">Size</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSize(option)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                size === option ? "bg-hm-red text-white" : "bg-hm-fog text-hm-charcoal"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
            Ducts
          </span>
          <select
            className="hm-input"
            value={duct}
            onChange={(event) => setDuct(event.target.value as (typeof ducts)[number])}
          >
            {ducts.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
            Warranty
          </span>
          <select
            className="hm-input"
            value={warranty}
            onChange={(event) => setWarranty(event.target.value as (typeof warranties)[number])}
          >
            {warranties.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 rounded-2xl bg-hm-ink px-4 py-4 text-white">
        <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">Your request</p>
        <p className="mt-1 font-display text-lg font-bold leading-snug">
          {productName} · {size}
        </p>
        <p className="mt-1 text-sm text-white/70">
          {duct} · {warranty}
        </p>
        <p className="mt-1 text-sm text-white/70">Andy confirms the price. Nothing is charged on this form.</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
        <TrackedField
          label="City"
          name="city"
          required
          autoComplete="address-level2"
          value={city}
          onChange={setCity}
          className="sm:col-span-2"
        />
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
            Notes
          </span>
          <textarea name="notes" rows={3} className="hm-input !h-auto min-h-[5rem] py-3" />
        </label>
      </div>

      <TurnstileField onToken={guard.setTurnstileToken} />
      {error ? <p className="mt-3 text-sm font-medium text-hm-red">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-hm-red px-6 font-display text-sm font-bold text-white disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send quote request"}
      </button>
    </form>
  );
}
