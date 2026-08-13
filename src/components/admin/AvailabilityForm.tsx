"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function AvailabilityForm() {
  const router = useRouter();
  const [startsAt, setStartsAt] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    if (!startsAt) return;
    setLoading(true);
    setError("");
    const start = new Date(startsAt);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const res = await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startsAt: start.toISOString(),
        endsAt: end.toISOString(),
        label: label || null,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed");
      return;
    }
    setStartsAt("");
    setLabel("");
    router.refresh();
  }

  return (
    <form onSubmit={publish} className="mt-4 space-y-2">
      <input
        type="datetime-local"
        className="hm-input"
        value={startsAt}
        onChange={(e) => setStartsAt(e.target.value)}
        required
      />
      <input
        className="hm-input"
        placeholder="Label (optional)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      {error && <p className="text-sm text-hm-red">{error}</p>}
      <Button type="submit" size="sm" disabled={loading} arrow={false}>
        {loading ? "Publishing?" : "Publish 2-hour slot"}
      </Button>
    </form>
  );
}
