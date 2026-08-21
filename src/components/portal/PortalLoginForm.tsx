"use client";

import { Suspense } from "react";
import { Logo } from "@/components/ui/Logo";
import { EmailPasswordForm } from "@/components/auth/EmailPasswordForm";
import { AndyName, DirectPhone } from "@/components/contact/CallAndy";

export function PortalLoginForm() {
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
            Sign in with the email and password you created when you requested a quote.
          </p>
          <EmailPasswordForm next="/portal" />
          <div className="mt-6 rounded-xl bg-hm-fog p-4 text-xs text-hm-muted">
            <p className="font-semibold text-hm-charcoal">Prefer to talk?</p>
            <p className="mt-1">
              Call <AndyName /> direct at{" "}
              <DirectPhone className="font-semibold text-hm-red" />.
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

export function PortalLoginFormBoundary() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-hm-ink" />}>
      <PortalLoginForm />
    </Suspense>
  );
}
