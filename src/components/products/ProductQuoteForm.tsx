"use client";

import { useEffect, useState } from "react";
import { HoneypotField, TurnstileField, useFormGuard } from "@/components/forms/FormGuard";

const packages = [
  { id: "good", name: "Good" },
  { id: "better", name: "Better" },
  { id: "best", name: "Best" },
] as const;

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
  const [intent, setIntent] = useState<"quote" | "buy">("quote");
  const [size, setSize] = useState(sizes[0] ?? "Not sure yet");
  const [duct, setDuct] = useState<(typeof ducts)[number]>("Not sure");
  const [warranty, setWarranty] = useState<(typeof warranties)[number]>("Standard warranty");
  const [tier, setTier] = useState<(typeof packages)[number]["id"]>("better");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const applyHash = () => {
      if (window.location.hash === "#buy") setIntent("buy");
      if (window.location.hash === "#quote") setIntent("quote");
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const tierName = packages.find((item) => item.id === tier)?.name ?? "Better";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const notReady = guard.notReadyMessage();
    if (notReady) {
      setError(notReady);
      return;
    }

    const form = new FormData(event.currentTarget);
    const name = [form.get("firstName"), form.get("lastName")]
      .map((value) => String(value || "").trim())
      .filter(Boolean)
      .join(" ");
    const intentLine = intent === "buy" ? "Ready to purchase" : "Quote request";
    const notes = String(form.get("notes") || "").trim();
    const message = [
      intentLine,
      `Product: ${productName}`,
      `Size: ${size}`,
      `Ducts: ${duct}`,
      `Warranty: ${warranty}`,
      `Package: ${tierName}`,
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
          email: form.get("email"),
          phone: form.get("phone"),
          city: form.get("city") || null,
          service: productName,
          message,
          sourcePath: window.location.pathname,
          sourceLabel: intent === "buy" ? "Product buy request" : "Product quote",
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
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-hm-red">
          Sent
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">Andy has this request.</h2>
        <p className="mt-3 text-hm-muted">
          {productName}, {size}, {tierName}. He will confirm the price before any equipment is
          ordered.
        </p>
      </div>
    );
  }

  return (
    <form
      id="quote"
      onSubmit={onSubmit}
      className="relative rounded-2xl bg-white p-6 text-hm-charcoal shadow-2xl ring-1 ring-black/5 md:p-8"
    >
      <HoneypotField inputRef={guard.honeypotRef} />
      <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-hm-red">
        {intent === "buy" ? "Buy now" : "Get a quote"}
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">Build this system</h2>
      <p className="mt-2 text-sm text-hm-muted">
        {productName} is already selected. Andy confirms the price. Nothing is charged on this form.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setIntent("quote")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            intent === "quote" ? "bg-hm-ink text-white" : "bg-hm-fog text-hm-charcoal"
          }`}
        >
          Get a quote
        </button>
        <button
          type="button"
          onClick={() => setIntent("buy")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            intent === "buy" ? "bg-hm-ink text-white" : "bg-hm-fog text-hm-charcoal"
          }`}
        >
          Buy now
        </button>
      </div>

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

      <fieldset className="mt-5">
        <legend className="text-xs font-semibold uppercase tracking-wide text-hm-muted">
          Package
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {packages.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTier(item.id)}
              className={`rounded-2xl px-3 py-4 text-left ${
                tier === item.id ? "bg-hm-ink text-white" : "bg-hm-fog text-hm-charcoal"
              }`}
            >
              <span className="block font-display text-sm font-bold">{item.name}</span>
              <span className={`mt-1 block text-xs ${tier === item.id ? "text-white/70" : "text-hm-muted"}`}>
                Andy confirms the price
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
            First name
          </span>
          <input name="firstName" required autoComplete="given-name" className="hm-input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
            Last name
          </span>
          <input name="lastName" required autoComplete="family-name" className="hm-input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
            Phone
          </span>
          <input name="phone" type="tel" required autoComplete="tel" className="hm-input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
            Email
          </span>
          <input name="email" type="email" required autoComplete="email" className="hm-input" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
            City
          </span>
          <input name="city" required autoComplete="address-level2" className="hm-input" />
        </label>
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
        {loading ? "Sending?" : intent === "buy" ? "Send buy request" : "Send quote request"}
      </button>
    </form>
  );
}
