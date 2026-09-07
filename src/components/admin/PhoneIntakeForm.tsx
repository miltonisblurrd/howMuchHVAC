"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/services";
import { cn } from "@/lib/cn";

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
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [service, setService] = useState("");
  const [notes, setNotes] = useState("");
  const [bookVisit, setBookVisit] = useState(false);
  const [date, setDate] = useState(toDateInput(tomorrow()));
  const [time, setTime] = useState("09:00");
  const [tech, setTech] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string; jobId?: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const start = bookVisit ? new Date(`${date}T${time}:00`) : null;
    const end = start ? new Date(start.getTime() + 2 * 60 * 60 * 1000) : null;

    const res = await fetch("/api/admin/intake", {
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
        startsAt: start && !Number.isNaN(start.getTime()) ? start.toISOString() : null,
        endsAt: end && !Number.isNaN(end.getTime()) ? end.toISOString() : null,
        visitType: "diagnostic",
        techName: tech.trim() || null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setMsg({ ok: false, text: data.error || "Couldn't save. Check the email and try again." });
      return;
    }

    setMsg({
      ok: true,
      jobId: data.jobId,
      text: data.emailSent
        ? data.scheduled
          ? `They're in. Visit booked ${data.whenLabel}. Portal email sent.`
          : "They're in. Portal email sent ? tell them to check their inbox."
        : "They're in the system, but the email didn't send. Open the job and tap Email password setup.",
    });
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setCity("");
    setService("");
    setNotes("");
    setBookVisit(false);
    setTech("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">
            Name
          </span>
          <input
            className="hm-input mt-1 h-12 bg-white"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First and last"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">
            Phone
          </span>
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
          <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">
            Email
          </span>
          <input
            className="hm-input mt-1 h-12 bg-white"
            required
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="They need this for the portal"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">
            Street address
          </span>
          <input
            className="hm-input mt-1 h-12 bg-white"
            autoComplete="street-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St"
          />
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
          <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">
            Service
          </span>
          <select
            className="hm-input mt-1 h-12 bg-white"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">Not sure yet</option>
            {services.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
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
          placeholder="AC down, upstairs only, wants a visit this week?"
        />
      </label>

      <div className="rounded-xl bg-hm-fog p-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4 accent-hm-red"
            checked={bookVisit}
            onChange={(e) => setBookVisit(e.target.checked)}
          />
          <span className="font-display text-sm font-bold text-hm-charcoal">
            I already booked a visit on this call
          </span>
        </label>

        {bookVisit && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">
                Day
              </span>
              <input
                type="date"
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
                placeholder="Andy, Marcos?"
              />
            </label>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={saving} arrow={false} className="w-full sm:w-auto">
          {saving ? "Saving?" : "Add lead & send portal email"}
        </Button>
        <p className="text-xs text-hm-muted sm:max-w-xs">
          Tell them: &quot;Check your email ? your portal is there. Click the button to sign in.&quot;
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
          {msg.ok && msg.jobId && (
            <button
              type="button"
              className="mt-2 font-semibold underline underline-offset-2"
              onClick={() => router.push(`/admin/jobs/${msg.jobId}`)}
            >
              Open the job
            </button>
          )}
        </div>
      )}
    </form>
  );
}
