"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { InvoiceAdminActions } from "@/components/admin/InvoiceAdminActions";
import { cn } from "@/lib/cn";
import { formatWhen, money } from "@/lib/db-types";
import type { Invoice } from "@/lib/db-types";
import { INVOICE_LABEL_PRESETS, INVOICE_STATUS_LABELS } from "@/lib/job-stages";

type Opt = { id: string; name: string; price_cents: number; recommended: boolean };

function dollarsToCents(v: string) {
  const digits = v.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) * 100 : 0;
}
function centsToDollars(c: number) {
  return c ? Math.round(c / 100).toLocaleString("en-US") : "";
}

export function JobPaymentCard({
  jobId,
  customerFirstName,
  invoices,
  options,
  selectedOptionId,
}: {
  jobId: string;
  customerFirstName: string;
  invoices: Invoice[];
  options: Opt[];
  selectedOptionId: string | null;
}) {
  const router = useRouter();
  const [label, setLabel] = useState<string>("Deposit");
  const [customLabel, setCustomLabel] = useState("");
  const [cents, setCents] = useState(0);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const base = useMemo(() => {
    const picked = options.find((o) => o.id === selectedOptionId);
    const rec = options.find((o) => o.recommended);
    const src = picked ?? rec ?? options[0];
    return src && src.price_cents > 0 ? { ...src, from: picked ? "picked" : rec ? "recommended" : "first" } : null;
  }, [options, selectedOptionId]);

  const paidCents = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount_cents, 0);
  const openCents = invoices
    .filter((i) => i.status === "unpaid" || i.status === "overdue")
    .reduce((s, i) => s + i.amount_cents, 0);
  const remaining = base ? Math.max(base.price_cents - paidCents - openCents, 0) : 0;

  const quick: { label: string; cents: number }[] = base
    ? [
        { label: "10% deposit", cents: Math.round(base.price_cents * 0.1) },
        { label: "25% deposit", cents: Math.round(base.price_cents * 0.25) },
        { label: "Half", cents: Math.round(base.price_cents * 0.5) },
        { label: remaining > 0 && remaining !== base.price_cents ? "Remaining balance" : "Full amount", cents: remaining > 0 ? remaining : base.price_cents },
      ]
    : [];

  const finalLabel = label === "Custom" ? customLabel.trim() : label;
  const canSend = cents > 0 && finalLabel.length > 0 && !sending;

  async function send() {
    if (!canSend) return;
    setSending(true);
    setMsg(null);
    const res = await fetch("/api/admin/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, amountCents: cents, description: finalLabel }),
    });
    setSending(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg({ ok: false, text: data.error || "Couldn't send the payment request." });
      return;
    }
    setMsg({
      ok: true,
      text: `Sent. ${customerFirstName} got an email with a pay link for ${money(cents)} (?${finalLabel}?).`,
    });
    setCents(0);
    router.refresh();
  }

  return (
    <section id="payments" className="hm-admin-card scroll-mt-24 p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">Payments</h2>
          <p className="mt-1 text-sm text-hm-muted">
            Ask for money in two taps. They pay by card, Cash App, Affirm, or financing in their portal.
          </p>
        </div>
        {(paidCents > 0 || openCents > 0) && (
          <div className="flex gap-4 text-right">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">Paid</p>
              <p className="font-display text-lg font-bold text-emerald-700">{money(paidCents)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">Open</p>
              <p className="font-display text-lg font-bold text-hm-charcoal">{money(openCents)}</p>
            </div>
          </div>
        )}
      </div>

      {invoices.length > 0 && (
        <ul className="mt-4 divide-y divide-hm-line/80 overflow-hidden rounded-xl border border-hm-line">
          {invoices.map((inv) => (
            <li key={inv.id} className="flex flex-wrap items-center gap-3 bg-white px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold text-hm-charcoal">{inv.description}</p>
                <p className="text-xs text-hm-muted">
                  {inv.number}
                  {inv.status === "paid" && inv.paid_at
                    ? ` ? paid ${formatWhen(inv.paid_at)}`
                    : inv.due_at
                      ? ` ? due ${formatWhen(inv.due_at)}`
                      : ""}
                </p>
              </div>
              <span className="font-display text-lg font-bold tabular-nums">{money(inv.amount_cents)}</span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-bold",
                  inv.status === "paid"
                    ? "bg-emerald-500/12 text-emerald-800"
                    : inv.status === "overdue"
                      ? "bg-hm-red/12 text-hm-red"
                      : "bg-amber-500/12 text-amber-900",
                )}
              >
                {INVOICE_STATUS_LABELS[inv.status] ?? inv.status}
              </span>
              {(inv.status === "unpaid" || inv.status === "overdue") && (
                <div className="basis-full sm:basis-auto">
                  <InvoiceAdminActions invoice={inv} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 rounded-xl bg-hm-fog p-4">
        <p className="font-display text-sm font-bold text-hm-charcoal">Request a payment</p>

        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-hm-muted">
          1. What is it for?
        </p>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {[...INVOICE_LABEL_PRESETS, "Custom"].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setLabel(preset)}
              className={cn(
                "h-9 rounded-full border px-3.5 text-sm font-semibold transition",
                label === preset
                  ? "border-hm-charcoal bg-hm-charcoal text-white"
                  : "border-hm-line bg-white text-hm-charcoal hover:border-hm-charcoal/40",
              )}
            >
              {preset}
            </button>
          ))}
        </div>
        {label === "Custom" && (
          <input
            className="hm-input mt-2 h-11 bg-white"
            placeholder="e.g. Duct cleaning add-on"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            autoFocus
          />
        )}

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-hm-muted">2. How much?</p>
        {quick.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-2">
            {quick.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => setCents(q.cents)}
                className={cn(
                  "h-9 rounded-full border px-3.5 text-sm font-semibold transition",
                  cents === q.cents
                    ? "border-hm-red bg-hm-red text-white"
                    : "border-hm-line bg-white text-hm-charcoal hover:border-hm-red/50",
                )}
              >
                {q.label} ? {money(q.cents)}
              </button>
            ))}
          </div>
        )}
        {base && (
          <p className="mt-1.5 text-xs text-hm-muted">
            Based on the {base.from === "picked" ? "option the customer picked" : base.from === "recommended" ? "option you recommended" : "first option"}: {base.name}, {money(base.price_cents)}.
          </p>
        )}
        <div className="relative mt-2 max-w-xs">
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-display text-lg font-bold text-hm-muted">
            $
          </span>
          <input
            className="hm-input h-12 bg-white font-display text-xl font-bold tabular-nums"
            style={{ paddingLeft: "2.1rem" }}
            inputMode="numeric"
            placeholder="Or type an amount"
            value={centsToDollars(cents)}
            onChange={(e) => setCents(dollarsToCents(e.target.value))}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button type="button" onClick={send} disabled={!canSend} arrow={false}>
            {sending ? "Sending?" : cents > 0 ? `Send ${money(cents)} request` : "Send payment request"}
          </Button>
          <span className="text-xs text-hm-muted">Emails a pay link. Due in 7 days.</span>
        </div>
        {msg && (
          <p className={cn("mt-3 text-sm font-medium", msg.ok ? "text-emerald-700" : "text-hm-red")}>
            {msg.text}
          </p>
        )}
      </div>
    </section>
  );
}
