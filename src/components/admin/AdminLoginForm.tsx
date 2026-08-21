"use client";

import { Suspense } from "react";
import { Logo } from "@/components/ui/Logo";
import { EmailPasswordForm } from "@/components/auth/EmailPasswordForm";

export function AdminLoginForm() {
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
            Sign in with your email and password. First time on password login? Use forgot password
            once to set one.
          </p>
          <EmailPasswordForm next="/admin" defaultEmail="howmuchandy@gmail.com" />
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

export function AdminLoginFormBoundary() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-hm-ink" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
