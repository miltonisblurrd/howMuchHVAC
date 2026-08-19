"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { DevPasswordLogin } from "@/components/auth/DevPasswordLogin";
import { AndyName, DirectPhone } from "@/components/contact/CallAndy";

export function PortalLoginForm({
  authEmailsEnabled,
  devLoginEnabled,
}: {
  authEmailsEnabled: boolean;
  devLoginEnabled: boolean;
}) {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(
    params.get("error") ? "Sign-in link expired. Request a new one." : "",
  );
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), next: "/portal" }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not send sign-in link.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hm-ink px-5 py-16 text-white">
      <div className="absolute inset-0 hm-gradient-hero opacity-80" />
      <div className="absolute inset-0 hm-noise opacity-40" />
      <div className="relative w-full max-w-md">
        <div className="flex justify-center">
          <Logo variant="white" height={56} href="/" priority />
        </div>
        <div className="mt-8 rounded-2xl bg-white p-8 text-hm-charcoal shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)] ring-1 ring-black/5">
          <h1 className="font-display text-2xl font-bold tracking-tight">Client portal</h1>
          <p className="mt-2 text-sm text-hm-muted">
            Sign in with a magic link — no password needed. We&apos;ll email you a secure link.
          </p>

          {!authEmailsEnabled && (
            <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">
              <p className="font-semibold">Email sign-in is paused</p>
              <p className="mt-1">
                {devLoginEnabled
                  ? "Magic-link emails stay off until DNS and Resend are connected. Use local sign-in below to test the portal."
                  : (
                    <>
                      Portal login emails are off until Resend is connected. Call <AndyName /> and we’ll follow up directly.
                    </>
                  )}
              </p>
            </div>
          )}

          {authEmailsEnabled &&
            (sent ? (
              <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
                <p className="font-semibold">Check your email</p>
                <p className="mt-1">
                  We sent a sign-in link to <strong>{email}</strong>. Open it on this device to enter
                  your portal.
                </p>
                <button
                  type="button"
                  className="mt-3 text-sm font-semibold text-hm-red"
                  onClick={() => setSent(false)}
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="hm-input"
                  />
                </label>
                {error && <p className="text-sm text-hm-red">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending…" : "Email me a sign-in link"}
                </Button>
              </form>
            ))}

          {devLoginEnabled && <DevPasswordLogin next="/portal" />}

          <div className="mt-6 rounded-xl bg-hm-fog p-4 text-xs text-hm-muted">
            <p className="font-semibold text-hm-charcoal">Prefer to talk?</p>
            <p className="mt-1">
              Call <AndyName /> direct at{" "}
              <DirectPhone className="font-semibold text-hm-red" />
              .
            </p>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-white/50">
          <a href="/" className="hover:text-white">
            ← Back to site
          </a>
        </p>
      </div>
    </div>
  );
}

export function PortalLoginFormBoundary({
  authEmailsEnabled,
  devLoginEnabled,
}: {
  authEmailsEnabled: boolean;
  devLoginEnabled: boolean;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-hm-ink" />}>
      <PortalLoginForm authEmailsEnabled={authEmailsEnabled} devLoginEnabled={devLoginEnabled} />
    </Suspense>
  );
}
