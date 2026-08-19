import { Suspense } from "react";
import { PortalChrome } from "@/components/portal/PortalChrome";
import { PortalDashboardHome } from "@/components/portal/PortalDashboardHome";
import { DelayedPortalSkeleton } from "@/components/portal/PortalDashboardSkeleton";
import { requirePortalUser } from "@/lib/auth";

export default async function PortalDashboardPage() {
  const user = await requirePortalUser();
  const first = (user.name || "there").split(" ")[0];
  const firstVisit = !user.onboarding_completed_at;

  return (
    <PortalChrome
      userId={user.id}
      userName={user.name || user.email}
      title={firstVisit ? `Welcome, ${first}` : `Welcome back, ${first}`}
      description={
        firstVisit
          ? "This is your job home. Options, visit times, messages, and invoices all land here — and you can always call Andy."
          : user.address || "Your jobs, messages, and invoices in one place."
      }
    >
      <Suspense fallback={<DelayedPortalSkeleton />}>
        <PortalDashboardHome userId={user.id} />
      </Suspense>
    </PortalChrome>
  );
}
