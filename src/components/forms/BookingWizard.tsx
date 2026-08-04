"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

const steps = ["Your info", "Services", "Schedule", "Confirm"];

export function BookingWizard() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-2xl border border-hm-line bg-white p-8 md:p-12">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-hm-red">
          You're booked (demo)
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
          We've got your request.
        </h2>
        <p className="mt-4 max-w-xl text-hm-muted">
          In the live version, Andy gets this instantly. For now, this confirms the experience ?
          call direct anytime at {site.phones.direct.display}.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/portal/login">Preview client portal</Button>
          <Button href="/" variant="outline">
            Back home
          </Button>
        </div>
      </div>
    );
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
            <Field label="Full name" />
            <Field label="Phone" type="tel" />
            <Field label="Email" type="email" />
            <Field label="City / ZIP" />
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
              <span className="mb-1.5 block text-sm font-medium text-hm-muted">Preferred timing</span>
              <select className="h-12 w-full rounded-md border border-hm-line bg-hm-fog px-3">
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
                className="w-full rounded-md border border-hm-line bg-hm-fog px-3 py-3"
                placeholder="Anything we should know before we arrive?"
              />
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-hm-muted">
            <p>
              Ready to send? We'll review your request and follow up with next steps — options
              first, then we make a deal.
            </p>
            <ul className="space-y-2 text-sm">
              <li>· Direct line: {site.phones.direct.display}</li>
              <li>· Office: {site.phones.office.display}</li>
              <li>· {site.license}</li>
            </ul>
          </div>
        )}
      </div>

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
            disabled={step === 1 && selected.length === 0}
          >
            Continue
          </Button>
        ) : (
          <Button type="button" onClick={() => setDone(true)}>
            Confirm request
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-hm-muted">{label}</span>
      <input
        type={type}
        required
        className="h-12 w-full rounded-md border border-hm-line bg-hm-fog px-3 outline-none ring-hm-red/30 focus:ring-2"
      />
    </label>
  );
}
