"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MIN_PASSWORD_LENGTH, validateNewPassword } from "@/lib/passwords";
import { markSkipDashboardSkeleton, markSkipPortalSkeleton } from "@/lib/admin-dashboard-skel";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const mismatch = validateNewPassword(password, confirm);
    if (mismatch) {
      setError(mismatch);
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, confirm }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not update password.");
      return;
    }
    const next = data.next === "/admin" ? "/admin" : "/portal";
    if (next === "/admin") markSkipDashboardSkeleton();
    else markSkipPortalSkeleton();
    window.location.href = next;
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
          New password
        </span>
        <input
          type="password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="hm-input"
          autoComplete="new-password"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
          Confirm password
        </span>
        <input
          type="password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="hm-input"
          autoComplete="new-password"
        />
      </label>
      {error && <p className="text-sm text-hm-red">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving?" : "Save password and sign in"}
      </Button>
    </form>
  );
}
