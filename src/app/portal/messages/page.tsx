import { PortalShell } from "@/components/portal/PortalShell";
import { MessagesClient } from "@/components/portal/MessagesClient";
import { requirePortalUser } from "@/lib/auth";
import { getCustomerJobs, getCustomerMessages } from "@/lib/portal-queries";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";

export default async function PortalMessagesPage() {
  const user = await requirePortalUser();
  const [jobs, messages] = await Promise.all([
    getCustomerJobs(user.id),
    getCustomerMessages(user.id),
  ]);

  // Mark admin messages as read
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

  return (
    <PortalShell userName={user.name || user.email}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Messages</h1>
          <p className="mt-2 text-hm-muted">
            Chat with Andy&apos;s team about your job. Prefer voice? Call anytime.
          </p>
        </div>
        <Button href={site.phones.direct.href} variant="secondary" arrow={false}>
          Call Andy
        </Button>
      </div>
      <div className="mt-8">
        <MessagesClient
          initial={messages}
          jobs={jobs.map((j) => ({ id: j.id, title: j.title }))}
          customerId={user.id}
        />
      </div>
    </PortalShell>
  );
}
