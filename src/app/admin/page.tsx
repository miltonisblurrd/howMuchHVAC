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
      actions={
        <a
          href="/admin/intake"
          className="inline-flex h-10 items-center rounded-lg bg-hm-red px-4 font-display text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(255,29,37,0.75)] hover:bg-hm-red-deep"
        >
          Add from a call
        </a>
      }
    >
      <Suspense fallback={<DelayedDashboardSkeleton />}>
        <AdminDashboardHome q={q} view={view} />
      </Suspense>
    </AdminShell>
  );
}
