"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function RequestForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="mt-8 rounded-2xl border border-hm-line bg-white p-8">
        <h2 className="font-display text-2xl font-bold">Request received (demo)</h2>
        <p className="mt-3 text-hm-muted">
          Andy would see this in the real portal queue. Nice for walking through the client
          experience.
        </p>
        <Button href="/portal" className="mt-6">
          Back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <form
      className="mt-8 max-w-xl space-y-4 rounded-2xl border border-hm-line bg-white p-6"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-hm-muted">Service type</span>
        <select className="h-12 w-full rounded-md border border-hm-line bg-hm-fog px-3">
          <option>Maintenance</option>
          <option>Repair</option>
          <option>Second opinion</option>
          <option>New install quote</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-hm-muted">Preferred timing</span>
        <input className="h-12 w-full rounded-md border border-hm-line bg-hm-fog px-3" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-hm-muted">Details</span>
        <textarea
          rows={4}
          className="w-full rounded-md border border-hm-line bg-hm-fog px-3 py-3"
          placeholder="What's going on with the system?"
        />
      </label>
      <Button type="submit">Submit request</Button>
    </form>
  );
}
