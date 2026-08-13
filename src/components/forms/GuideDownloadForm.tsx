"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const GUIDE_HREF = "/guides/fair-hvac-pricing";
const ARROW = "\u2192";
const EM_DASH = "\u2014";

export function GuideDownloadForm({ className }: { className?: string }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") || "").trim();
    const local = email.split("@")[0] || "Homeowner";
    const name = local
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .slice(0, 80);

    const params =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: null,
          city: null,
          service: "Pricing guide download",
          message: "Requested Fair HVAC Pricing Guide download",
          sourcePath: pathname || "/",
          sourceLabel: "Pricing guide download",
          utmSource: params?.get("utm_source"),
          utmMedium: params?.get("utm_medium"),
          utmCampaign: params?.get("utm_campaign"),
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setDone(true);
      window.open(GUIDE_HREF, "_blank", "noopener,noreferrer");
      setLoading(false);
      form.reset();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={cn("w-full max-w-lg", className)}>
      <label htmlFor="guide-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="guide-email"
          name="email"
          type="email"
          required
          placeholder="Enter your email"
          autoComplete="email"
          className="h-12 flex-1 rounded-xl border border-white/25 bg-white px-4 font-medium text-hm-charcoal placeholder:text-hm-muted/70 outline-none ring-hm-ink/10 focus:ring-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-hm-ink px-5 font-display text-sm font-bold text-white transition hover:bg-hm-charcoal disabled:opacity-70"
        >
          <span>{loading ? "Sending..." : "Get The Guide"}</span>
          {!loading ? <span aria-hidden>{ARROW}</span> : null}
        </button>
      </div>
      <p className="mt-3 text-xs text-white/70">
        Instant access. No spam {EM_DASH} just the guide and an optional follow-up if you want help.
      </p>
      {error ? <p className="mt-2 text-sm text-white">{error}</p> : null}
      {done ? (
        <p className="mt-2 text-sm font-medium text-white">
          Guide opened in a new tab.{" "}
          <a href={GUIDE_HREF} className="underline">
            Open Again
          </a>
        </p>
      ) : null}
    </form>
  );
}
