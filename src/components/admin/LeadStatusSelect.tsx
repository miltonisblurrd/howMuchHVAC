"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = ["new", "contacted", "quoted", "won", "lost"];

export function LeadStatusSelect({ leadId, status }: { leadId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function onChange(next: string) {
    setValue(next);
    setSaving(true);
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, status: next }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <select
      className="hm-input py-1 text-xs capitalize"
      value={value}
      disabled={saving}
      onChange={(e) => onChange(e.target.value)}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
      {!STATUSES.includes(value) && <option value={value}>{value}</option>}
    </select>
  );
}
