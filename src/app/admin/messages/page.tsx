import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getAdminMessages } from "@/lib/admin-queries";
import { formatWhen } from "@/lib/db-types";

export default async function AdminMessagesPage() {
  const admin = await requireAdmin();
  const messages = await getAdminMessages();

  return (
    <AdminShell userName={admin.name || admin.email}>
      <h1 className="font-display text-3xl font-bold tracking-tight">Messages</h1>
      <p className="mt-2 text-hm-muted">Portal threads across jobs. Reply from the job page.</p>

      <ul className="mt-8 space-y-3">
        {messages.map((row) => {
          const m = row as {
            id: string;
            body: string;
            from_role: string;
            created_at: string;
            job_id: string;
            jobs?: {
              title?: string;
              profiles?: { name?: string; email?: string } | null;
            } | null;
          };
          return (
            <li key={m.id} className="rounded-2xl border border-hm-line bg-white px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-hm-muted">
                    {m.from_role === "admin" ? "You" : m.jobs?.profiles?.name || "Customer"} ·{" "}
                    {formatWhen(m.created_at)}
                  </p>
                  <p className="mt-1 font-semibold">{m.jobs?.title || "Job"}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-hm-muted">{m.body}</p>
                </div>
                <Link href={`/admin/jobs/${m.job_id}`} className="text-sm font-semibold text-hm-red">
                  Open →
                </Link>
              </div>
            </li>
          );
        })}
        {!messages.length && (
          <p className="rounded-2xl border border-dashed border-hm-line bg-white p-8 text-center text-hm-muted">
            No portal messages yet.
          </p>
        )}
      </ul>
    </AdminShell>
  );
}
