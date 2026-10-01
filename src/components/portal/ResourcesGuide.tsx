"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { RESOURCE_CATEGORIES, resourceTips, type ResourceTip } from "@/lib/portal-resources";
import { AdminChip } from "@/components/admin/AdminUi";

export function ResourcesGuide() {
  const [slug, setSlug] = useState("home-basics");
  const [openId, setOpenId] = useState<string | null>(null);
  const tips = useMemo(() => resourceTips.filter((t) => t.serviceSlug === slug), [slug]);
  const open = tips.find((tip) => tip.id === openId) ?? null;

  useEffect(() => {
    setOpenId(null);
  }, [slug]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {RESOURCE_CATEGORIES.map((c) => (
          <AdminChip key={c.slug} active={slug === c.slug} onClick={() => setSlug(c.slug)}>
            {c.name}
          </AdminChip>
        ))}
      </div>

      {open ? (
        <TipDetail tip={open} onBack={() => setOpenId(null)} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tips.map((tip) => (
            <li key={tip.id}>
              <button
                type="button"
                onClick={() => setOpenId(tip.id)}
                className="hm-admin-card hm-admin-click flex h-full w-full flex-col overflow-hidden text-left"
              >
                <img
                  src={tip.image}
                  alt=""
                  className="h-40 w-full object-cover"
                />
                <span className="flex flex-1 flex-col gap-2 p-4">
                  {tip.cadence && (
                    <span className="text-[11px] font-bold uppercase tracking-wide text-hm-red">
                      {tip.cadence}
                    </span>
                  )}
                  <span className="font-display text-lg font-bold tracking-tight text-hm-charcoal">
                    {tip.title}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TipDetail({ tip, onBack }: { tip: ResourceTip; onBack: () => void }) {
  return (
    <article className="hm-admin-card overflow-hidden">
      <img src={tip.image} alt="" className="h-56 w-full object-cover sm:h-72" />
      <div className="p-5 sm:p-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-hm-red hover:text-hm-red-deep"
        >
          <ArrowLeft className="h-4 w-4" />
          All guides
        </button>
        {tip.cadence && (
          <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-hm-red">{tip.cadence}</p>
        )}
        <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-hm-charcoal">{tip.title}</h2>

        <h3 className="mt-6 font-display text-sm font-bold uppercase tracking-[0.14em] text-hm-muted">
          Simple steps
        </h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-hm-charcoal">
          {tip.steps.map((step) => (
            <li key={step} className="pl-1 leading-relaxed">
              {step}
            </li>
          ))}
        </ol>

        <h3 className="mt-6 font-display text-sm font-bold uppercase tracking-[0.14em] text-hm-muted">
          In depth
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-hm-charcoal">{tip.inDepth}</p>

        {tip.callAndyWhen && (
          <p className="mt-6 rounded-xl bg-hm-fog/80 px-3 py-2 text-sm text-hm-muted">
            <span className="font-semibold text-hm-charcoal">Call Andy if: </span>
            {tip.callAndyWhen}
          </p>
        )}
      </div>
    </article>
  );
}
