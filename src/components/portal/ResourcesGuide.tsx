"use client";

import { useMemo, useState } from "react";
import { RESOURCE_CATEGORIES, resourceTips } from "@/lib/portal-resources";
import { AdminChip } from "@/components/admin/AdminUi";

export function ResourcesGuide() {
  const [slug, setSlug] = useState("home-basics");
  const tips = useMemo(() => resourceTips.filter((t) => t.serviceSlug === slug), [slug]);
  const category = RESOURCE_CATEGORIES.find((c) => c.slug === slug);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {RESOURCE_CATEGORIES.map((c) => (
          <AdminChip key={c.slug} active={slug === c.slug} onClick={() => setSlug(c.slug)}>
            {c.name}
          </AdminChip>
        ))}
      </div>

      <p className="text-sm text-hm-muted">
        {category?.name} · {tips.length} guide{tips.length === 1 ? "" : "s"}
      </p>

      <div className="mt-4 grid gap-3">
        {tips.map((tip) => (
          <article key={tip.id} className="hm-admin-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="font-display text-[15px] font-bold tracking-tight text-hm-charcoal">
                {tip.title}
              </h2>
              {tip.cadence && (
                <span className="rounded-full bg-hm-red/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-hm-red">
                  {tip.cadence}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-hm-muted">{tip.why}</p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-hm-charcoal">
              {tip.steps.map((step) => (
                <li key={step} className="pl-1 leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
            {tip.callAndyWhen && (
              <p className="mt-4 rounded-xl bg-hm-fog/80 px-3 py-2 text-sm text-hm-muted">
                <span className="font-semibold text-hm-charcoal">Call Andy if: </span>
                {tip.callAndyWhen}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
