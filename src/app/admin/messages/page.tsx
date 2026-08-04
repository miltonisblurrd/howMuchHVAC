import { AdminShell } from "@/components/admin/AdminShell";
import { adminMessages } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-session";

export default async function AdminMessagesPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell userName={admin.name}>
      <h1 className="font-display text-3xl font-bold tracking-tight text-hm-charcoal">
        Messages
      </h1>
      <p className="mt-2 text-hm-muted">
        Portal, SMS, and email threads in one inbox ? demo only.
      </p>

      <div className="mt-8 space-y-3">
        {adminMessages.map((m) => (
          <article
            key={m.id}
            className={`rounded-2xl border bg-white p-5 shadow-sm ${
              m.unread ? "border-hm-red/30" : "border-hm-line"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {m.unread && <span className="h-2 w-2 rounded-full bg-hm-red" />}
                <h2 className="font-display text-base font-bold text-hm-charcoal">{m.from}</h2>
                <span className="rounded-full bg-hm-fog px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-hm-muted">
                  {m.channel}
                </span>
              </div>
              <p className="text-xs text-hm-muted">{m.at}</p>
            </div>
            <p className="mt-2 text-sm text-hm-muted">{m.preview}</p>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
