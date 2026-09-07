"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { money } from "@/lib/db-types";

export type OptionDraft = {
  id?: string;
  name: string;
  price_cents: number;
  description: string;
  recommended: boolean;
};

const STARTER: OptionDraft[] = [
  { name: "Good", price_cents: 0, description: "Solid, reliable, gets the job done.", recommended: false },
  { name: "Better", price_cents: 0, description: "Higher efficiency, quieter, longer warranty.", recommended: true },
  { name: "Best", price_cents: 0, description: "Top-tier comfort, smart controls, best warranty.", recommended: false },
];

function dollarsToCents(v: string) {
  const digits = v.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) * 100 : 0;
}

function centsToDollars(c: number) {
  return c ? Math.round(c / 100).toLocaleString("en-US") : "";
}

export function JobPricingCard({
  jobId,
  existingOptions,
  selectedOptionId,
}: {
  jobId: string;
  existingOptions: OptionDraft[];
  selectedOptionId: string | null;
}) {
  const router = useRouter();
  const [options, setOptions] = useState<OptionDraft[]>(
    existingOptions.length ? existingOptions : STARTER,
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const isNew = existingOptions.length === 0;

  function update(idx: number, patch: Partial<OptionDraft>) {
    setOptions((prev) => prev.map((o, i) => (i === idx ? { ...o, ...patch } : o)));
  }

  function recommend(idx: number) {
    setOptions((prev) => prev.map((o, i) => ({ ...o, recommended: i === idx })));
  }

  function remove(idx: number) {
    setOptions((prev) => prev.filter((_, i) => i !== idx));
  }

  function add() {
    setOptions((prev) => [
      ...prev,
      { name: `Option ${prev.length + 1}`, price_cents: 0, description: "", recommended: false },
    ]);
  }

  async function save() {
    const missing = options.find((o) => !o.name.trim() || o.price_cents <= 0);
    if (missing) {
      setMsg({ ok: false, text: "Every option needs a name and a price above $0." });
      return;
    }
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/jobs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, options }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg({ ok: false, text: data.error || "Couldn't save pricing." });
      return;
    }
    setMsg({
      ok: true,
      text: isNew
        ? "Pricing sent. Job moved to “Pricing ready” and the customer can pick in their portal."
        : "Pricing updated in the customer's portal.",
    });
    router.refresh();
  }

  return (
    <section id="pricing" className="hm-admin-card scroll-mt-24 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold">Pricing options</h2>
          <p className="mt-1 text-sm text-hm-muted">
            Good / Better / Best. Star the one you recommend. The customer picks one in their portal.
          </p>
        </div>
        {options.length < 4 && (
          <button
            type="button"
            onClick={add}
            className="inline-flex items-center gap-1.5 rounded-full border border-hm-line px-3 py-1.5 text-xs font-semibold text-hm-charcoal hover:bg-hm-fog"
          >
            <Plus className="h-3.5 w-3.5" /> Add option
          </button>
        )}
      </div>

      <div className={cn("mt-4 grid gap-3", options.length >= 3 ? "lg:grid-cols-3" : "sm:grid-cols-2")}>
        {options.map((opt, idx) => {
          const picked = Boolean(opt.id && opt.id === selectedOptionId);
          return (
            <div
              key={opt.id ?? idx}
              className={cn(
                "relative flex flex-col rounded-xl border p-4 transition",
                opt.recommended
                  ? "border-hm-red bg-[color-mix(in_oklab,var(--hm-red)_5%,white)] shadow-[0_0_0_1px_rgba(255,29,37,0.25)]"
                  : "border-hm-line bg-white",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {opt.recommended && (
                    <span className="rounded-full bg-hm-red px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Recommended
                    </span>
                  )}
                  {picked && (
                    <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Customer picked
                    </span>
                  )}
                </div>
                {options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    aria-label="Remove option"
                    className="rounded-md p-1 text-hm-muted hover:bg-hm-fog hover:text-hm-red"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <label className="mt-3 block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">Name</span>
                <input
                  className="hm-input mt-1 h-11 font-display font-bold"
                  value={opt.name}
                  onChange={(e) => update(idx, { name: e.target.value })}
                  placeholder="Good"
                />
              </label>

              <label className="mt-3 block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">Price</span>
                <div className="relative mt-1">
                  <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-display text-lg font-bold text-hm-muted">
                    $
                  </span>
                  <input
                    className="hm-input h-12 font-display text-xl font-bold tabular-nums"
                    style={{ paddingLeft: "2.1rem" }}
                    inputMode="numeric"
                    value={centsToDollars(opt.price_cents)}
                    onChange={(e) => update(idx, { price_cents: dollarsToCents(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </label>

              <label className="mt-3 block flex-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">
                  What they get
                </span>
                <textarea
                  className="hm-input mt-1 min-h-[84px] resize-y py-2.5 text-sm leading-snug"
                  value={opt.description}
                  onChange={(e) => update(idx, { description: e.target.value })}
                  placeholder="Equipment, warranty, what's included…"
                />
              </label>

              <button
                type="button"
                onClick={() => recommend(idx)}
                className={cn(
                  "mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition",
                  opt.recommended
                    ? "border-hm-red bg-hm-red text-white"
                    : "border-hm-line bg-white text-hm-charcoal hover:border-hm-red/50 hover:text-hm-red",
                )}
              >
                <Star className={cn("h-4 w-4", opt.recommended && "fill-current")} />
                {opt.recommended ? "Your recommendation" : "Recommend this one"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button type="button" onClick={save} disabled={saving} arrow={false}>
          {saving ? "Saving…" : isNew ? "Save & send pricing" : "Save pricing"}
        </Button>
        {options.some((o) => o.recommended && o.price_cents > 0) && (
          <span className="text-sm text-hm-muted">
            Recommended: {money(options.find((o) => o.recommended)!.price_cents)}
          </span>
        )}
      </div>
      {msg && (
        <p className={cn("mt-3 text-sm font-medium", msg.ok ? "text-emerald-700" : "text-hm-red")}>
          {msg.text}
        </p>
      )}
    </section>
  );
}
