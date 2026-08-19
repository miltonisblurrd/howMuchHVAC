import { PortalChrome } from "@/components/portal/PortalChrome";
import { RequestForm } from "@/components/portal/RequestForm";
import { requirePortalUser } from "@/lib/auth";

export default async function PortalRequestPage() {
  const user = await requirePortalUser();

  return (
    <PortalChrome
      userId={user.id}
      userName={user.name || user.email}
      title="Request service"
      description="Tell us what you need. We'll open a new job in your portal and Andy will follow up."
    >
      <RequestForm />
    </PortalChrome>
  );
}
