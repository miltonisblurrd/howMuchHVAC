import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminEmpty } from "@/components/admin/AdminUi";
import { requireAdmin } from "@/lib/auth";
import { getAdminInbox } from "@/lib/admin-queries";
import { formatWhen } from "@/lib/db-types";
import { parseMessagePhoto } from "@/lib/uploads";
import { cn } from "@/lib/cn";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string; q?: string }>;
}) {
  const admin = await requireAdmin();
  const { job: highlightJob, q: qParam } = await searchParams;
  const q = (qParam || "").trim().toLowerCase();
  const threads = (await getAdminInbox()).filter((thread) => {
    if (!q) return true;
    const last = thread.last as { body?: string };
    const preview = parseMessagePhoto(last.body || "").text || "";
    return [thread.customerName, thread.title, preview].join(" ").toLowerCase().includes(q);
  });

  return (
    <AdminShell
      userName={admin.name || admin.email}
      title="Messages"
      description="One conversation per job. Unread notes are highlighted."
    >
      {threads.length === 0 ? (
        <AdminEmpty>{q ? "No threads match that search." : "No portal messages yet."}</AdminEmpty>
      ) : (
        <ul className="space-y-2.5">
          {threads.map((thread) => {
            const last = thread.last as {
              body?: string;
              from_role?: string;
              created_at?: string;
            };
            const preview = parseMessagePhoto(last.body || "").text || "Photo attached";
            const active = highlightJob === thread.jobId;
            return (
              <li key={thread.jobId}>
                <Link
                  href={`/admin/jobs/${thread.jobId}`}
                  className={cn(
                    "hm-admin-card hm-admin-click block px-5 py-4",
                    active && "border-hm-red/50 ring-2 ring-hm-red/15",
                    !active && thread.unreadFromCustomer > 0 && "border-amber-200/80 bg-amber-50/60",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">
                        {thread.customerName}
                        {last.created_at ? ` · ${formatWhen(last.created_at)}` : ""}
                      </p>
                      <p className="mt-1 font-display text-[15px] font-bold text-hm-charcoal">
                        {thread.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-hm-muted">
                        {last.from_role === "admin" ? "You: " : ""}
                        {preview}
                      </p>
                      {thread.unreadFromCustomer > 0 && (
                        <p className="mt-2 text-xs font-bold text-amber-800">
                          {thread.unreadFromCustomer} unread
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-hm-red">Open thread</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </AdminShell>
  );
}
