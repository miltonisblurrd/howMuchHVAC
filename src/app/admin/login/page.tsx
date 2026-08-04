"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { adminUser } from "@/lib/admin-data";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      setError(`Invalid credentials. Try ${adminUser.email} / howmuch`);
      return;
    }
    router.push("/admin");
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
          <div className="mb-1 inline-flex rounded-full bg-hm-red/10 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-hm-red">
            Admin portal
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight">
            Welcome back, Andy
          </h1>
          <p className="mt-2 text-sm text-hm-muted">
            Demo ops dashboard ? invoices, schedule, leads, messages, and AI assistant.
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
                defaultValue={adminUser.email}
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
              {loading ? "Signing in?" : "Enter admin"}
            </Button>
          </form>
          <div className="mt-6 rounded-xl bg-hm-fog p-4 text-xs text-hm-muted">
            <p className="font-semibold text-hm-charcoal">Demo login</p>
            <p className="mt-1">
              {adminUser.email} / howmuch
            </p>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-white/50">
          <a href="/portal/login" className="hover:text-white">
            Client portal
          </a>
          {" ? "}
          <a href="/" className="hover:text-white">
            Back to site
          </a>
        </p>
      </div>
    </div>
  );
}
