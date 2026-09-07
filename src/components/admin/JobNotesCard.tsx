"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function JobNotesCard({ jobId, summary }: { jobId: string; summary: string }) {
  const router = useRouter();
  const [value, setValue] = useState(summary);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const dirty = value !== summary;

  async function save() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/jobs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, summary: value }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "Couldn't save.");
      return;
    }
    setMsg("Saved.");
    router.refresh();
  }

  return (
    <section className="hm-admin-card p-5">
      <h2 className="font-display text-lg font-bold">Job notes</h2>
      <p className="mt-1 text-sm text-hm-muted">
        The customer sees this in their portal. Keep it short and clear.
      </p>
      <textarea
        className="hm-input mt-3 min-h-[110px] resize-y py-2.5 text-sm leading-relaxed"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="mt-3 flex items-center gap-3">
        <Button type="button" size="sm" variant="secondary" onClick={save} disabled={saving || !dirty} arrow={false}>
          {saving ? "Saving…" : "Save notes"}
        </Button>
        {msg && <span className="text-sm text-hm-muted">{msg}</span>}
      </div>
    </section>
  );
}
