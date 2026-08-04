"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

export function ReviewForm() {
  const [step, setStep] = useState<"form" | "thanks">("form");

  if (step === "thanks") {
    return (
      <div className="rounded-2xl border border-hm-line bg-white p-8">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-hm-red">
          Thank you
        </p>
        <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">
          One more step — post it on Google
        </h3>
        <p className="mt-3 text-hm-muted">
          Google doesn't allow reviews to be posted through third-party sites. Your words matter
          most on Google Business Profile — open the link below to publish there.
        </p>
        <Button href={site.google.reviewUrl} target="_blank" rel="noopener noreferrer" className="mt-6">
          Leave your Google review
        </Button>
        <p className="mt-4 text-xs text-hm-muted">
          Demo note: on-site feedback can also be emailed to Andy for follow-up.
        </p>
      </div>
    );
  }

  return (
    <form
      className="rounded-2xl border border-hm-line bg-white p-8"
      onSubmit={(e) => {
        e.preventDefault();
        setStep("thanks");
      }}
    >
      <h3 className="font-display text-2xl font-bold tracking-tight">Leave a review</h3>
      <p className="mt-2 text-hm-muted">
        Share your experience, then we'll send you to Google to publish it where it helps most.
      </p>
      <div className="mt-6 grid gap-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-hm-muted">Your name</span>
          <input
            required
            className="h-12 w-full rounded-md border border-hm-line bg-hm-fog px-3"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-hm-muted">Rating</span>
          <select
            required
            defaultValue="5"
            className="h-12 w-full rounded-md border border-hm-line bg-hm-fog px-3"
          >
            <option value="5">5 — Excellent</option>
            <option value="4">4 — Great</option>
            <option value="3">3 — Okay</option>
            <option value="2">2 — Needs work</option>
            <option value="1">1 — Poor</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-hm-muted">Your review</span>
          <textarea
            required
            rows={5}
            className="w-full rounded-md border border-hm-line bg-hm-fog px-3 py-3"
            placeholder="What stood out about working with How Much?"
          />
        </label>
      </div>
      <Button type="submit" className="mt-6">
        Continue to Google
      </Button>
    </form>
  );
}
