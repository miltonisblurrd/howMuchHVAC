import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDashboardHome } from "@/components/admin/AdminDashboardHome";
import { DelayedDashboardSkeleton } from "@/components/admin/AdminDashboardSkeleton";
import { requireAdmin } from "@/lib/auth";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; view?: string }>;
}) {
  const admin = await requireAdmin();
  const { q, view } = await searchParams;

  return (
    <AdminShell
      userName={admin.name || admin.email}
      title="Dashboard"
      description="Jobs, money, schedule, and leads — one glance."
    >
      <Suspense fallback={<DelayedDashboardSkeleton />}>
        <AdminDashboardHome q={q} view={view} />
      </Suspense>
    </AdminShell>
  );
}
