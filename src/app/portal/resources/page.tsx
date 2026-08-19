import { PortalChrome } from "@/components/portal/PortalChrome";
import { ResourcesGuide } from "@/components/portal/ResourcesGuide";
import { requirePortalUser } from "@/lib/auth";

export default async function PortalResourcesPage() {
  const user = await requirePortalUser();

  return (
    <PortalChrome
      userId={user.id}
      userName={user.name || user.email}
      title="Resources & tips"
      description="How-tos from Andy's crew — filters, heat, ducts, indoor air, and the rest of what we actually service. Start with Home basics. Call if anything feels off."
    >
      <ResourcesGuide />
    </PortalChrome>
  );
}
