import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminJobsList, type AdminJobRow } from "@/components/admin/AdminJobsList";
import { requireAdmin } from "@/lib/auth";
import { getAdminJobs } from "@/lib/admin-queries";
import type { JobStatus } from "@/lib/db-types";

export default async function AdminJobsPage() {
  const admin = await requireAdmin();
  const jobs = await getAdminJobs(100);
  const rows: AdminJobRow[] = jobs.map((row) => {
    const j = row as {
      id: string;
      title: string;
      status: JobStatus;
      city: string | null;
      service: string | null;
      profiles?: { name?: string; email?: string } | null;
    };
    return {
      id: j.id,
      title: j.title,
      status: j.status,
      city: j.city,
      service: j.service,
      customerName: j.profiles?.name || j.profiles?.email || "Customer",
    };
  });

  return (
    <AdminShell
      userName={admin.name || admin.email}
      title="Jobs"
      description="Quotes, options, docs, and scheduling."
    >
      <Suspense fallback={null}>
        <AdminJobsList jobs={rows} />
      </Suspense>
    </AdminShell>
  );
}
