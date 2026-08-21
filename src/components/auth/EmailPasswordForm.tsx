"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { markSkipDashboardSkeleton, markSkipPortalSkeleton } from "@/lib/admin-dashboard-skel";
import { MIN_PASSWORD_LENGTH } from "@/lib/passwords";

export function EmailPasswordForm({
  next,
  defaultEmail = "",
}: {
  next: "/portal" | "/admin";
  defaultEmail?: string;
}) {
  const params = useSearchParams();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(
    params.get("error") ? "Sign-in expired. Enter your email and password." : "",
  );

  async function onLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/password-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
        next,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not sign in.");
      return;
    }
    if (next === "/admin") markSkipDashboardSkeleton();
    else markSkipPortalSkeleton();
    window.location.href = data.next || next;
  }

  async function onForgot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not send reset email.");
      return;
    }
    setSent(true);
  }

  if (forgot && sent) {
    return (
      <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="font-semibold">Check your email</p>
        <p className="mt-1">
          If an account exists for <strong>{email}</strong>, we sent a link to set a new password.
        </p>
        <button
          type="button"
          className="mt-3 text-sm font-semibold text-hm-red"
          onClick={() => {
            setForgot(false);
            setSent(false);
          }}
        >
          Back to sign in
        </button>
      </div>
    );
  }

  if (forgot) {
    return (
      <form className="mt-6 space-y-4" onSubmit={onForgot}>
        <p className="text-sm text-hm-muted">
          We?ll email a link to set a new password. Use the same address you quoted with.
        </p>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="hm-input"
            autoComplete="email"
          />
        </label>
        {error && <p className="text-sm text-hm-red">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending?" : "Email reset link"}
        </Button>
        <button
          type="button"
          className="w-full text-sm font-semibold text-hm-red"
          onClick={() => setForgot(false)}
        >
          Back to sign in
        </button>
      </form>
    );
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onLogin}>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
          Email
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="hm-input"
          autoComplete="email"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
          Password
        </span>
        <input
          type="password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="hm-input"
          autoComplete="current-password"
        />
      </label>
      {error && <p className="text-sm text-hm-red">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in?" : "Sign in"}
      </Button>
      <button
        type="button"
        className="w-full text-sm font-semibold text-hm-red"
        onClick={() => {
          setError("");
          setForgot(true);
        }}
      >
        Forgot password?
      </button>
    </form>
  );
}
