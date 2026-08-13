import { PortalShell } from "@/components/portal/PortalShell";
import { RequestForm } from "@/components/portal/RequestForm";
import { requirePortalUser } from "@/lib/auth";

export default async function PortalRequestPage() {
  const user = await requirePortalUser();

  return (
    <PortalShell userName={user.name || user.email}>
      <h1 className="font-display text-3xl font-bold tracking-tight">Request service</h1>
      <p className="mt-2 max-w-xl text-hm-muted">
        Tell us what you need. We&apos;ll open a new job in your portal and Andy will follow up.
      </p>
      <div className="mt-8">
        <RequestForm />
      </div>
    </PortalShell>
  );
}
