"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { markSkipDashboardSkeleton, markSkipPortalSkeleton } from "@/lib/admin-dashboard-skel";

export function DevPasswordLogin({ next }: { next: "/portal" | "/admin" }) {
  const [email, setEmail] = useState(next === "/admin" ? "howmuchandy@gmail.com" : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), next }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Sign-in failed");
      return;
    }
    if (next === "/admin") markSkipDashboardSkeleton();
    if (next === "/portal") markSkipPortalSkeleton();
    window.location.href = data.next || next;
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3 rounded-xl border border-dashed border-hm-line bg-hm-fog p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-hm-muted">Local testing</p>
      <p className="text-xs text-hm-muted">
        No email sent. Password is <code className="text-hm-charcoal">howmuch-dev</code>. Use the
        same email you submitted on a quote.
      </p>
      <input
        type="email"
        required
        className="hm-input"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p className="text-xs text-hm-red">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading} arrow={false}>
        {loading ? "Signing in…" : "Sign in locally"}
      </Button>
    </form>
  );
}
