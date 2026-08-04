import { AdminShell } from "@/components/admin/AdminShell";
import { AdminAssistant } from "@/components/admin/AdminAssistant";
import { requireAdmin } from "@/lib/admin-session";

export default async function AdminAssistantPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell userName={admin.name}>
      <div className="mb-6 max-w-2xl">
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-hm-red">
          AI ? show & tell
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-hm-charcoal">
          Your business assistant
        </h1>
        <p className="mt-2 text-hm-muted">
          Demo bot wired to sample invoices, schedule, and leads. Ask it questions so Andy can
          feel how powerful a connected admin can be ? no live AI API required for this walkthrough.
        </p>
      </div>
      <AdminAssistant />
    </AdminShell>
  );
}
