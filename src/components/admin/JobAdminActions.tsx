"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { JobStatus } from "@/lib/db-types";
import { money } from "@/lib/db-types";

const statuses: JobStatus[] = [
  "quote_request",
  "estimate_ready",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
];

type OptionDraft = {
  id?: string;
  name: string;
  price_cents: number;
  description: string;
  recommended: boolean;
};

export function JobAdminActions({
  jobId,
  status,
  summary,
  existingOptions,
}: {
  jobId: string;
  status: JobStatus;
  summary: string;
  existingOptions: OptionDraft[];
}) {
  const router = useRouter();
  const [jobStatus, setJobStatus] = useState(status);
  const [jobSummary, setJobSummary] = useState(summary);
  const [options, setOptions] = useState<OptionDraft[]>(
    existingOptions.length
      ? existingOptions
      : [
          { name: "Good", price_cents: 985000, description: "Solid efficiency, reliable cooling.", recommended: false },
          { name: "Better", price_cents: 1240000, description: "Higher efficiency, quieter.", recommended: true },
          { name: "Best", price_cents: 1590000, description: "Top-tier comfort & controls.", recommended: false },
        ],
  );
  const [invoiceAmount, setInvoiceAmount] = useState("500");
  const [invoiceDesc, setInvoiceDesc] = useState("Deposit");
  const [apptStart, setApptStart] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function saveJob() {
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/admin/jobs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, status: jobStatus, summary: jobSummary, options }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "Save failed");
      return;
    }
    setMsg("Job saved");
    router.refresh();
  }

  async function createInvoice() {
    setLoading(true);
    const cents = Math.round(parseFloat(invoiceAmount || "0") * 100);
    const res = await fetch("/api/admin/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, amountCents: cents, description: invoiceDesc }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "Invoice failed");
      return;
    }
    setMsg("Invoice created + emailed");
    router.refresh();
  }

  async function scheduleVisit() {
    if (!apptStart) return;
    setLoading(true);
    const start = new Date(apptStart);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const res = await fetch("/api/admin/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId,
        startsAt: start.toISOString(),
        endsAt: end.toISOString(),
        type: "diagnostic",
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "Schedule failed");
      return;
    }
    setMsg("Visit scheduled (invite prompted if needed)");
    router.refresh();
  }

  return (
    <div className="space-y-4 rounded-2xl border border-hm-line bg-white p-5">
      <h2 className="font-display text-lg font-bold">Edit job</h2>

      <label className="block text-sm">
        <span className="text-xs font-semibold uppercase text-hm-muted">Status</span>
        <select
          className="hm-input mt-1"
          value={jobStatus}
          onChange={(e) => setJobStatus(e.target.value as JobStatus)}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="text-xs font-semibold uppercase text-hm-muted">Summary</span>
        <textarea
          className="hm-input mt-1 min-h-[100px]"
          value={jobSummary}
          onChange={(e) => setJobSummary(e.target.value)}
        />
      </label>

      <div>
        <p className="text-xs font-semibold uppercase text-hm-muted">Good / Better / Best</p>
        <div className="mt-2 space-y-3">
          {options.map((opt, idx) => (
            <div key={idx} className="rounded-xl bg-hm-fog p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  className="hm-input"
                  value={opt.name}
                  onChange={(e) => {
                    const next = [...options];
                    next[idx] = { ...opt, name: e.target.value };
                    setOptions(next);
                  }}
                />
                <input
                  className="hm-input"
                  type="number"
                  step="0.01"
                  value={(opt.price_cents / 100).toFixed(2)}
                  onChange={(e) => {
                    const next = [...options];
                    next[idx] = {
                      ...opt,
                      price_cents: Math.round(parseFloat(e.target.value || "0") * 100),
                    };
                    setOptions(next);
                  }}
                />
              </div>
              <textarea
                className="hm-input mt-2"
                value={opt.description}
                onChange={(e) => {
                  const next = [...options];
                  next[idx] = { ...opt, description: e.target.value };
                  setOptions(next);
                }}
              />
              <label className="mt-2 flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={opt.recommended}
                  onChange={(e) => {
                    const next = options.map((o, i) => ({
                      ...o,
                      recommended: i === idx ? e.target.checked : false,
                    }));
                    setOptions(next);
                  }}
                />
                Recommended ({money(opt.price_cents)})
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button type="button" onClick={saveJob} disabled={loading} arrow={false}>
        Save job & options
      </Button>

      <hr className="border-hm-line" />

      <div>
        <p className="text-xs font-semibold uppercase text-hm-muted">Create invoice</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            className="hm-input w-28"
            value={invoiceAmount}
            onChange={(e) => setInvoiceAmount(e.target.value)}
            placeholder="Amount $"
          />
          <input
            className="hm-input flex-1"
            value={invoiceDesc}
            onChange={(e) => setInvoiceDesc(e.target.value)}
            placeholder="Description"
          />
          <Button type="button" variant="secondary" onClick={createInvoice} disabled={loading} arrow={false}>
            Create
          </Button>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase text-hm-muted">Schedule visit (Andy)</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            type="datetime-local"
            className="hm-input"
            value={apptStart}
            onChange={(e) => setApptStart(e.target.value)}
          />
          <Button type="button" variant="secondary" onClick={scheduleVisit} disabled={loading} arrow={false}>
            Schedule
          </Button>
        </div>
      </div>

      {msg && <p className="text-sm text-hm-muted">{msg}</p>}
    </div>
  );
}
