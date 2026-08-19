"use client";

import type { Bucket } from "@/lib/lead-insights";
import { CountUp, useChartReady } from "@/components/admin/CountUp";

const tones = ["bg-sky-400", "bg-hm-red", "bg-amber-400", "bg-emerald-400", "bg-hm-charcoal/40"];

export function PipelineBar({ rows }: { rows: Bucket[] }) {
  const ready = useChartReady();
  const total = rows.reduce((s, r) => s + r.count, 0);

  return (
    <div>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-hm-fog">
        {rows.map((row, i) =>
          row.count ? (
            <div
              key={row.key}
              className={`${tones[i % tones.length]} origin-left transition-[width] duration-700 ease-out`}
              style={{
                width: ready ? `${(row.count / Math.max(total, 1)) * 100}%` : "0%",
                transitionDelay: `${i * 70}ms`,
              }}
              title={`${row.key}: ${row.count}`}
            />
          ) : null,
        )}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-hm-muted">
        {rows.map((row, i) => (
          <li key={row.key} className="inline-flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${tones[i % tones.length]}`} />
            {row.key} (<CountUp value={String(row.count)} duration={700} />)
          </li>
        ))}
      </ul>
    </div>
  );
}
