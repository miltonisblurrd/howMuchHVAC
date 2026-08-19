"use client";

import { DelayedFallback } from "@/components/ui/DelayedFallback";
import { SKIP_PORTAL_SKEL_KEY } from "@/lib/admin-dashboard-skel";

function Bone({ className }: { className: string }) {
  return <div className={`hm-skel ${className}`} />;
}

export function PortalDashboardSkeleton() {
  return (
    <div aria-hidden>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="hm-admin-card p-4">
          <Bone className="h-3 w-24" />
          <Bone className="mt-3 h-5 w-40" />
          <Bone className="mt-2 h-3 w-56" />
        </div>
        <div className="hm-admin-card p-4">
          <Bone className="h-3 w-20" />
          <Bone className="mt-3 h-5 w-36" />
          <Bone className="mt-2 h-3 w-44" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
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
          <Bone className="h-4 w-24" />
          <Bone className="mt-4 h-16 w-full rounded-xl" />
        </div>
        <div className="hm-admin-card p-5">
          <Bone className="h-4 w-28" />
          <Bone className="mt-6 h-12 w-36" />
          <Bone className="mt-3 h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

export function DelayedPortalSkeleton() {
  return (
    <DelayedFallback id="portal-dash" skipKey={SKIP_PORTAL_SKEL_KEY} loginPath="/portal/login">
      <PortalDashboardSkeleton />
    </DelayedFallback>
  );
}
