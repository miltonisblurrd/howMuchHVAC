"use client";

import type { Bucket } from "@/lib/lead-insights";
import { CountUp, useChartReady } from "@/components/admin/CountUp";

export function ColumnChart({ rows }: { rows: Bucket[] }) {
  const ready = useChartReady();
  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <div className="flex h-36 items-end gap-2">
      {rows.map((row, i) => (
        <div key={row.key} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
          <span className="text-[10px] font-semibold text-hm-muted">
            {row.count ? <CountUp value={String(row.count)} duration={800} /> : ""}
          </span>
          <div className="flex h-24 w-full items-end rounded-lg bg-hm-fog/80 px-1">
            <div
              className="w-full origin-bottom rounded-t-md bg-hm-red/80 transition-[height] duration-700 ease-out"
              style={{
                height: ready
                  ? `${Math.max(row.count ? 10 : 3, (row.count / max) * 100)}%`
                  : "0%",
                transitionDelay: `${i * 55}ms`,
              }}
            />
          </div>
          <span className="text-[10px] font-semibold text-hm-muted">{row.key}</span>
        </div>
      ))}
    </div>
  );
}
