"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ServiceOptions } from "@/components/forms/ServiceOptions";
import { StreetAddressField } from "@/components/forms/StreetAddressField";
import { cn } from "@/lib/cn";
import { HoneypotField, TurnstileField, useFormGuard } from "@/components/forms/FormGuard";
import { pacificVisit } from "@/lib/pacific";

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function toDateInput(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
}

const TIMES: { value: string; label: string }[] = [];
for (let h = 7; h <= 18; h++) {
  for (const m of [0, 30]) {
    if (h === 18 && m === 30) continue;
    const value = `${pad(h)}:${pad(m)}`;
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    TIMES.push({ value, label: `${hour12}:${pad(m)} ${h < 12 ? "AM" : "PM"}` });
  }
}

export function PhoneIntakeForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [service, setService] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(toDateInput(tomorrow()));
  const guard = useFormGuard();
  const [time, setTime] = useState("09:00");
  const [tech, setTech] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const visit = pacificVisit(date, time, 2);
    if (Number.isNaN(visit.start.getTime())) {
      setSaving(false);
      setMsg({ ok: false, text: "Pick a real day and time for the first visit." });
      return;
    }

    const notReady = guard.notReadyMessage();
    if (notReady) {
      setSaving(false);
      setMsg({ ok: false, text: notReady });
      return;
    }

    const res = await fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        address: address || null,
        city: city || null,
        service: service || null,
        notes: notes || null,
        startsAt: visit.startsAt,
        ...guard.payload(),
        endsAt: visit.endsAt,
        visitType: "diagnostic",
        techName: tech.trim() || null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok || !data.jobId) {
      setMsg({ ok: false, text: data.error || "Couldn't save. Check the email and try again." });
      return;
    }

    setMsg({
      ok: true,
      text: data.emailSent
        ? data.scheduled
          ? `They're in. First visit booked ${data.whenLabel}. Portal email sent.`
          : "They're in. Portal email sent — tell them to check their inbox."
        : "They're in the system, but the email didn't send. You can resend from the job later.",
    });
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setCity("");
    setService("");
    setNotes("");
    setDate(toDateInput(tomorrow()));
    setTime("09:00");
    setTech("");
  }

  return (
    <form onSubmit={submit} className="relative space-y-5">
      <HoneypotField inputRef={guard.honeypotRef} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">Name</span>
          <input
            className="hm-input mt-1 h-12 bg-white"
            required
            autoFocus
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First and Last"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">Phone</span>
          <input
            className="hm-input mt-1 h-12 bg-white"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(562) 555-1234"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">Email</span>
          <input
            className="hm-input mt-1 h-12 bg-white"
            required
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Needed to start your account"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">
            Street address
          </span>
          <StreetAddressField address={address} onAddress={setAddress} onCity={setCity} />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">City</span>
          <input
            className="hm-input mt-1 h-12 bg-white"
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Costa Mesa"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">Service</span>
          <select
            className="hm-input mt-1 h-12 bg-white"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <ServiceOptions blankLabel="Not sure yet" />
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">
          Notes from the call
        </span>
        <textarea
          className="hm-input mt-1 min-h-[96px] resize-y bg-white py-2.5 text-sm"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="AC down, upstairs only, wants a visit this week"
        />
      </label>

      <div className="rounded-xl bg-hm-fog p-4">
        <p className="font-display text-sm font-bold text-hm-charcoal">First visit</p>
        <p className="mt-1 text-xs leading-relaxed text-hm-muted">
          Book the look-over while you&apos;re still on the phone. Pricing comes after Andy has seen
          the job.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">Day</span>
            <input
              type="date"
              required
              className="hm-input mt-1 h-11 bg-white"
              value={date}
              min={toDateInput(new Date())}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">
              Arrive at
            </span>
            <select
              required
              className="hm-input mt-1 h-11 bg-white"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {TIMES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">
              Who&apos;s going (optional)
            </span>
            <input
              className="hm-input mt-1 h-11 bg-white"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              placeholder="Andy, Marcos"
            />
          </label>
        </div>
      </div>

      <TurnstileField onToken={guard.setTurnstileToken} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={saving} arrow={false} className="w-full sm:w-auto">
          {saving ? "Saving..." : "Add lead and send portal email"}
        </Button>
        <p className="text-xs text-hm-muted sm:max-w-xs">
          Tell them: &quot;Check your email - your portal is there. Click the button to sign in.&quot;
        </p>
      </div>

      {msg && (
        <div
          className={cn(
            "rounded-xl border px-4 py-3 text-sm font-medium",
            msg.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-hm-red/25 bg-hm-red/5 text-hm-red",
          )}
        >
          <p>{msg.text}</p>
        </div>
      )}
    </form>
  );
}
