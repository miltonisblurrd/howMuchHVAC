import { PortalChrome } from "@/components/portal/PortalChrome";
import { MessagesClient } from "@/components/portal/MessagesClient";
import { requirePortalUser } from "@/lib/auth";
import { decorateMessagePhotos, getCustomerJobs, getCustomerMessages } from "@/lib/portal-queries";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export default async function PortalMessagesPage() {
  const user = await requirePortalUser();
  const [jobs, messages] = await Promise.all([
    getCustomerJobs(user.id),
    getCustomerMessages(user.id),
  ]);

  const unreadIds = messages
    .filter((m) => m.from_role === "admin" && !m.read_at)
    .map((m) => m.id);
  if (unreadIds.length) {
    const admin = getSupabaseAdmin();
    await admin
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .in("id", unreadIds);
  }

  const withPhotos = await decorateMessagePhotos(messages);

  return (
    <PortalChrome
      userId={user.id}
      userName={user.name || user.email}
      unreadCount={0}
      title="Messages"
      description="Chat with Andy's team about your job. Prefer voice? Call anytime."
    >
      <MessagesClient
        initial={withPhotos}
        jobs={jobs.map((j) => ({ id: j.id, title: j.title }))}
        customerId={user.id}
      />
    </PortalChrome>
  );
}
