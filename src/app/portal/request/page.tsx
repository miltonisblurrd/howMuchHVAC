import { PortalShell } from "@/components/portal/PortalShell";
import { RequestForm } from "@/components/portal/RequestForm";
import { requirePortalUser } from "@/lib/portal-session";

export default async function PortalRequestPage() {
  const user = await requirePortalUser();
  return (
    <PortalShell userName={user.name}>
      <h1 className="font-display text-3xl font-bold tracking-tight">Request service</h1>
      <p className="mt-2 text-hm-muted">
        Submit a new request — in the demo it appears as a confirmation only.
      </p>
      <RequestForm />
    </PortalShell>
  );
}
