"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { demoUsers } from "@/lib/portal-data";

export default function PortalLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/portal/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Invalid demo credentials. Try demo@trusthowmuch.com / howmuch");
      return;
    }
    router.push("/portal");
    router.refresh();
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
            Demo experience for Andy ? seeded projects, documents, and messages.
          </p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                defaultValue="demo@trusthowmuch.com"
                className="hm-input"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                Password
              </span>
              <input
                name="password"
                type="password"
                required
                defaultValue="howmuch"
                className="hm-input"
              />
            </label>
            {error && <p className="text-sm text-hm-red">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in?" : "Enter portal"}
            </Button>
          </form>
          <div className="mt-6 rounded-xl bg-hm-fog p-4 text-xs text-hm-muted">
            <p className="font-semibold text-hm-charcoal">Demo logins</p>
            {demoUsers.map((u) => (
              <p key={u.id} className="mt-1">
                {u.email} / howmuch
              </p>
            ))}
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-white/50">
          <a href="/" className="hover:text-white">
            ? Back to site
          </a>
        </p>
      </div>
    </div>
  );
}
