"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/services";
import { AndyName, DirectPhone } from "@/components/contact/CallAndy";

export function RequestForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [service, setService] = useState(services[0]?.name || "HVAC service");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/portal/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service, city, message }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not submit request");
      return;
    }
    router.push(`/portal/projects/${data.jobId}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="hm-admin-card mx-auto max-w-xl space-y-4 p-6">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
          Service
        </span>
        <select className="hm-input" value={service} onChange={(e) => setService(e.target.value)}>
          {services.map((s) => (
            <option key={s.slug} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
          City
        </span>
        <input className="hm-input" value={city} onChange={(e) => setCity(e.target.value)} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
          What do you need?
        </span>
        <textarea
          className="hm-input min-h-[120px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </label>
      {error && <p className="text-sm text-hm-red">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending…" : "Submit request"}
      </Button>
      <p className="text-center text-sm text-hm-muted">
        Or call <AndyName /> at{" "}
        <DirectPhone className="font-semibold text-hm-red" />
      </p>
    </form>
  );
}
