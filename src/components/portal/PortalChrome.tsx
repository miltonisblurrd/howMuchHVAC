import { PortalShell } from "@/components/portal/PortalShell";
import { getProfile } from "@/lib/auth";
import { countUnreadForCustomer, getCustomerInvoices, getSignedUrl } from "@/lib/portal-queries";

export async function PortalChrome({
  userId,
  userName,
  children,
  unreadCount: unreadOverride,
  title,
  description,
  actions,
}: {
  userId: string;
  userName: string;
  children: React.ReactNode;
  unreadCount?: number;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  const [invoices, profile] = await Promise.all([
    getCustomerInvoices(userId),
    getProfile(userId),
  ]);
  const unreadCount = unreadOverride ?? (await countUnreadForCustomer(userId));
  const unpaidCount = invoices.filter((i) => i.status === "unpaid" || i.status === "overdue").length;

  const avatarUrl =
    profile?.avatar_path && (profile.avatar_bucket || "job-photos")
      ? await getSignedUrl(profile.avatar_bucket || "job-photos", profile.avatar_path)
      : null;

  return (
    <PortalShell
      unreadCount={unreadCount}
      unpaidCount={unpaidCount}
      showOnboarding={!profile?.onboarding_completed_at}
      title={title}
      description={description}
      actions={actions}
      profile={{
        id: userId,
        name: profile?.name || userName,
        email: profile?.email || "",
        phone: profile?.phone || "",
        address: profile?.address || "",
        city: profile?.city || "",
        avatarUrl,
      }}
    >
      {children}
    </PortalShell>
  );
}
