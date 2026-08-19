"use client";

import { Funnel } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AdminChip } from "@/components/admin/AdminUi";
import { DASHBOARD_VIEWS, parseDashboardView, type DashboardView } from "@/lib/admin-dashboard";

export function AdminDashboardToolbar({ updatedLabel = "just now" }: { updatedLabel?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const view = parseDashboardView(params.get("view") || undefined);

  function setView(id: DashboardView) {
    const sp = new URLSearchParams(params.toString());
    if (id === "all") sp.delete("view");
    else sp.set("view", id);
    const q = sp.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <AdminChip active={false} className="pointer-events-none text-hm-muted">
        <Funnel className="h-3.5 w-3.5" />
        Filter
      </AdminChip>
      {DASHBOARD_VIEWS.map((item) => (
        <AdminChip key={item.id} active={view === item.id} onClick={() => setView(item.id)}>
          {item.label}
        </AdminChip>
      ))}
      <span className="ml-auto inline-flex h-9 items-center gap-2 rounded-full border border-hm-line bg-white px-3 text-[12px] font-semibold text-hm-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Last update: {updatedLabel}
      </span>
    </div>
  );
}
