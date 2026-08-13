"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("andy@trusthowmuch.com");
  const [error, setError] = useState(
    params.get("error") ? "Sign-in link expired or you are not an admin." : "",
  );
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/admin`;
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: redirectTo },
    });
    setLoading(false);
    if (err) {
      setError(err.message || "Could not send sign-in link.");
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
          <div className="mb-1 inline-flex rounded-full bg-hm-red/10 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-hm-red">
            Admin portal
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight">
            Welcome back, Andy
          </h1>
          <p className="mt-2 text-sm text-hm-muted">
            Sign in with a magic link. Your account must have the admin role in Supabase.
          </p>

          {sent ? (
            <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-semibold">Check your email</p>
              <p className="mt-1">
                We sent a sign-in link to <strong>{email}</strong>.
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
                  className="hm-input"
                />
              </label>
              {error && <p className="text-sm text-hm-red">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending…" : "Email me a sign-in link"}
              </Button>
            </form>
          )}

          <div className="mt-6 rounded-xl bg-hm-fog p-4 text-xs text-hm-muted">
            <p className="font-semibold text-hm-charcoal">First time?</p>
            <p className="mt-1">
              Sign in once, then run in Supabase SQL:{" "}
              <code className="text-hm-charcoal">
                update profiles set role = &apos;admin&apos; where email =
                &apos;andy@trusthowmuch.com&apos;;
              </code>
            </p>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-white/50">
          <a href="/portal/login" className="hover:text-white">
            Client portal
          </a>
          {" · "}
          <a href="/" className="hover:text-white">
            Back to site
          </a>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-hm-ink" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
