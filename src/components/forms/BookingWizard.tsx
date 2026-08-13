"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

const steps = ["Your info", "Services", "Schedule", "Confirm"];

export function BookingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    timing: "As soon as possible",
    notes: "",
  });

  async function confirm() {
    setLoading(true);
    setError("");

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
          sourcePath: "/booking",
          sourceLabel: "Booking wizard",
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };
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
    <div className="rounded-2xl border border-hm-line bg-white p-6 md:p-10">
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
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => {
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
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
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
              <li>· Timing: {info.timing}</li>
              <li>· Direct line: {site.phones.direct.display}</li>
              <li>· {site.license}</li>
            </ul>
          </div>
        )}
      </div>

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
              (step === 0 && (!info.name || !info.email || !info.phone)) ||
              (step === 1 && selected.length === 0)
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
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-hm-muted">{label}</span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="hm-input"
      />
    </label>
  );
}
