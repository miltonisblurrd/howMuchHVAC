"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { servicesInGroup, type Service } from "@/lib/services";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { DirectPhone } from "@/components/contact/CallAndy";
import { HoneypotField, TurnstileField, useFormGuard } from "@/components/forms/FormGuard";
import { pacificVisit } from "@/lib/pacific";

const steps = ["Your info", "Services", "Schedule", "Confirm"];

export function BookingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const guard = useFormGuard();
  const [info, setInfo] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    timing: "As soon as possible",
    notes: "",
    date: "",
    time: "09:00",
  });

  async function confirm() {
    setLoading(true);
    setError("");

    const notReady = guard.notReadyMessage();
    if (notReady) {
      setError(notReady);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: info.name,
          email: info.email,
          phone: info.phone,
          city: info.city,
          service: selected.join(", "),
          message: [`Preferred timing: ${info.timing}`, info.notes].filter(Boolean).join("\n\n"),
          startsAt: pacificVisit(info.date, info.time, 2).startsAt,
          endsAt: pacificVisit(info.date, info.time, 2).endsAt,
          sourcePath: "/booking",
          sourceLabel: "Booking wizard",
          ...guard.payload(),
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string; id?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please call us or try again.");
        setLoading(false);
        return;
      }

      const first = info.name.trim().split(/\s+/)[0] || "";
      router.push(`/thank-you?name=${encodeURIComponent(first)}`);
    } catch {
      setError("Something went wrong. Please call us or try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative rounded-2xl border border-hm-line bg-white p-6 md:p-10">
      <HoneypotField inputRef={guard.honeypotRef} />
      <div className="flex flex-wrap gap-2">
        {steps.map((label, i) => (
          <div
            key={label}
            className={cn(
              "rounded-full px-3 py-1 font-display text-xs font-semibold tracking-wide",
              i === step
                ? "bg-hm-red text-white"
                : i < step
                  ? "bg-hm-charcoal text-white"
                  : "bg-hm-fog text-hm-muted",
            )}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>

      <div className="mt-8">
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              value={info.name}
              onChange={(v) => setInfo((s) => ({ ...s, name: v }))}
            />
            <Field
              label="Phone"
              type="tel"
              value={info.phone}
              onChange={(v) => setInfo((s) => ({ ...s, phone: v }))}
            />
            <Field
              label="Email"
              type="email"
              value={info.email}
              onChange={(v) => setInfo((s) => ({ ...s, email: v }))}
            />
            <Field
              label="City / ZIP"
              value={info.city}
              onChange={(v) => setInfo((s) => ({ ...s, city: v }))}
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            {(
              [
                ["Services", servicesInGroup("service")],
                ["Installation", servicesInGroup("installation")],
              ] as const
            ).map(([label, items]) => (
              <div key={label}>
                <p className="mb-2 font-display text-xs font-bold uppercase tracking-[0.16em] text-hm-muted">
                  {label}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map((service: Service) => {
                    const active = selected.includes(service.slug);
                    return (
                      <button
                        key={service.slug}
                        type="button"
                        onClick={() =>
                          setSelected((prev) =>
                            active
                              ? prev.filter((s) => s !== service.slug)
                              : [...prev, service.slug],
                          )
                        }
                        className={cn(
                          "rounded-xl border px-4 py-4 text-left transition",
                          active
                            ? "border-hm-red bg-hm-red/5"
                            : "border-hm-line bg-hm-fog hover:border-hm-muted/30",
                        )}
                      >
                        <span className="font-display font-semibold">{service.shortName}</span>
                        <span className="mt-1 block text-sm text-hm-muted">{service.summary}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-hm-muted">Day</span>
              <input
                required
                type="date"
                className="hm-input"
                value={info.date}
                onChange={(e) => setInfo((s) => ({ ...s, date: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-hm-muted">Arrive at</span>
              <input
                required
                type="time"
                className="hm-input"
                value={info.time}
                onChange={(e) => setInfo((s) => ({ ...s, time: e.target.value }))}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-hm-muted">
                Preferred timing
              </span>
              <select
                className="hm-input"
                value={info.timing}
                onChange={(e) => setInfo((s) => ({ ...s, timing: e.target.value }))}
              >
                <option>As soon as possible</option>
                <option>This week</option>
                <option>Next week</option>
                <option>Just exploring options</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-hm-muted">Notes</span>
              <textarea
                rows={4}
                className="hm-input !h-auto min-h-[7rem] py-3"
                placeholder="Anything we should know before we arrive?"
                value={info.notes}
                onChange={(e) => setInfo((s) => ({ ...s, notes: e.target.value }))}
              />
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-hm-muted">
            <p>
              Ready to send? We&apos;ll review your request and follow up with next steps — options
              first, then we make a deal.
            </p>
            <ul className="space-y-2 text-sm">
              <li>· {info.name || "Your name"} · {info.phone || "Phone"} · {info.email || "Email"}</li>
              <li>· Services: {selected.length ? selected.join(", ") : "None selected"}</li>
              <li>· Visit: {info.date || "Pick a day"} at {info.time} · {info.timing}</li>
              <li>
                · Direct line: <DirectPhone className="font-semibold text-hm-charcoal" />
              </li>
              <li>· {site.license}</li>
            </ul>
          </div>
        )}
      </div>

      <TurnstileField onToken={guard.setTurnstileToken} />

      {error && <p className="mt-4 text-sm text-hm-red">{error}</p>}

      <div className="mt-8 flex flex-wrap gap-3">
        {step > 0 && (
          <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        )}
        {step < steps.length - 1 ? (
          <Button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={
              (step === 0 &&
                (!info.name ||
                  !info.email ||
                  !info.phone)) ||
              (step === 1 && selected.length === 0) ||
              (step === 2 && !info.date)
            }
          >
            Continue
          </Button>
        ) : (
          <Button type="button" onClick={confirm} disabled={loading}>
            {loading ? "Sending…" : "Confirm request"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  minLength,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-hm-muted">{label}</span>
      <input
        type={type}
        required
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="hm-input"
      />
    </label>
  );
}
