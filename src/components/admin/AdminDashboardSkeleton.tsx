"use client";

import { DelayedFallback } from "@/components/ui/DelayedFallback";
import { SKIP_DASH_SKEL_KEY } from "@/lib/admin-dashboard-skel";

function Bone({ className }: { className: string }) {
  return <div className={`hm-skel ${className}`} />;
}

export function AdminDashboardSkeleton() {
  return (
    <div aria-hidden>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Bone className="h-9 w-24 rounded-xl" />
        <Bone className="h-9 w-14 rounded-xl" />
        <Bone className="h-9 w-24 rounded-xl" />
        <Bone className="h-9 w-20 rounded-xl" />
        <Bone className="h-9 w-24 rounded-xl" />
        <Bone className="ml-auto h-9 w-40 rounded-full" />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="hm-admin-card p-4">
          <Bone className="h-4 w-32" />
          <Bone className="mt-3 h-3 w-48" />
        </div>
        <div className="hm-admin-card p-4">
          <Bone className="h-4 w-28" />
          <Bone className="mt-3 h-3 w-40" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="hm-admin-card p-4">
            <div className="flex items-center gap-2.5">
              <Bone className="h-8 w-8 rounded-lg" />
              <Bone className="h-3 w-20" />
            </div>
            <Bone className="mt-4 h-8 w-16" />
            <Bone className="mt-3 h-3 w-14" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="hm-admin-card p-5">
          <Bone className="h-4 w-36" />
          <Bone className="mt-2 h-3 w-52" />
          <Bone className="mt-6 h-2.5 w-full rounded-full" />
          <div className="mt-5 space-y-2">
            <Bone className="h-9 w-full rounded-xl" />
            <Bone className="h-9 w-full rounded-xl" />
            <Bone className="h-9 w-full rounded-xl" />
          </div>
        </div>
        <div className="hm-admin-card p-5">
          <Bone className="h-4 w-24" />
          <Bone className="mt-2 h-3 w-48" />
          <Bone className="mt-6 h-2.5 w-full rounded-full" />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Bone className="h-16 rounded-xl" />
            <Bone className="h-16 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DelayedDashboardSkeleton() {
  return (
    <DelayedFallback id="admin-dash" skipKey={SKIP_DASH_SKEL_KEY} loginPath="/admin/login">
      <AdminDashboardSkeleton />
    </DelayedFallback>
  );
}
