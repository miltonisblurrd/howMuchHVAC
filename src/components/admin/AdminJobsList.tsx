"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Funnel } from "lucide-react";
import { AdminChip, AdminEmpty } from "@/components/admin/AdminUi";
import { JOB_STATUS_LABELS, type JobStatus } from "@/lib/db-types";
import { cn } from "@/lib/cn";

export type AdminJobRow = {
  id: string;
  title: string;
  status: JobStatus;
  city: string | null;
  service: string | null;
  customerName: string;
};

const filters: { id: "all" | JobStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "quote_request", label: JOB_STATUS_LABELS.quote_request },
  { id: "estimate_ready", label: JOB_STATUS_LABELS.estimate_ready },
  { id: "scheduled", label: JOB_STATUS_LABELS.scheduled },
  { id: "in_progress", label: JOB_STATUS_LABELS.in_progress },
  { id: "completed", label: JOB_STATUS_LABELS.completed },
];

export function AdminJobsList({ jobs }: { jobs: AdminJobRow[] }) {
  const params = useSearchParams();
  const q = (params.get("q") || "").trim().toLowerCase();
  const [status, setStatus] = useState<"all" | JobStatus>("all");

  const rows = useMemo(() => {
    return jobs.filter((job) => {
      if (status !== "all" && job.status !== status) return false;
      if (!q) return true;
      return [job.title, job.customerName, job.city, job.service, JOB_STATUS_LABELS[job.status]]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [jobs, q, status]);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <AdminChip className="pointer-events-none text-hm-muted">
          <Funnel className="h-3.5 w-3.5" />
          Filter
        </AdminChip>
        {filters.map((item) => (
          <AdminChip key={item.id} active={status === item.id} onClick={() => setStatus(item.id)}>
            {item.label}
          </AdminChip>
        ))}
      </div>
      {rows.length === 0 ? (
        <AdminEmpty>{q || status !== "all" ? "No jobs match that filter." : "No jobs yet ? they appear when leads come in."}</AdminEmpty>
      ) : (
        <ul className="space-y-2.5">
          {rows.map((j) => (
            <li key={j.id}>
              <a
                href={`/admin/jobs/${j.id}`}
                className="hm-admin-card hm-admin-click flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="font-display text-[17px] font-bold tracking-tight text-hm-charcoal">
                    {j.title}
                  </p>
                  <p className="mt-0.5 text-sm text-hm-muted">
                    {[j.customerName, j.city, j.service].filter(Boolean).join(" ? ")}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-bold",
                    j.status === "completed"
                      ? "bg-emerald-500/12 text-emerald-800"
                      : j.status === "scheduled" || j.status === "in_progress"
                        ? "bg-sky-500/12 text-sky-800"
                        : j.status === "estimate_ready"
                          ? "bg-amber-500/12 text-amber-900"
                          : "bg-hm-fog text-hm-muted",
                  )}
                >
                  {JOB_STATUS_LABELS[j.status]}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
