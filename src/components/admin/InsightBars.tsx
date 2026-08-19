"use client";

import type { Bucket } from "@/lib/lead-insights";
import { AdminCard, AdminCardHeader } from "@/components/admin/AdminUi";
import { CountUp, useChartReady } from "@/components/admin/CountUp";

export function InsightBars({
  title,
  caption,
  rows,
  empty,
}: {
  title: string;
  caption?: string;
  rows: Bucket[];
  empty?: string;
}) {
  const ready = useChartReady();
  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <AdminCard>
      <AdminCardHeader title={title} caption={caption} />
      {rows.length === 0 || rows.every((r) => r.count === 0) ? (
        <p className="mt-4 text-sm text-hm-muted">{empty || "Nothing to chart yet."}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((row, i) => (
            <li key={row.key}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate font-semibold text-hm-charcoal">{row.key}</span>
                <span className="shrink-0 text-xs font-semibold text-hm-muted">
                  <CountUp value={String(row.count)} duration={800} /> ·{" "}
                  <CountUp value={`${row.pct}%`} duration={800} />
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-hm-fog">
                <div
                  className="h-full origin-left rounded-full bg-hm-red transition-[width] duration-700 ease-out"
                  style={{
                    width: ready ? `${Math.max(6, (row.count / max) * 100)}%` : "0%",
                    transitionDelay: `${i * 70}ms`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminCard>
  );
}
