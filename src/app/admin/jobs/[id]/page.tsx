import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { InviteButton } from "@/components/admin/InviteButton";
import { JobAdminActions } from "@/components/admin/JobAdminActions";
import { AdminMessageComposer } from "@/components/admin/AdminMessageComposer";
import { requireAdmin } from "@/lib/auth";
import { getAdminJob } from "@/lib/admin-queries";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { JOB_STATUS_LABELS, formatWhen, money } from "@/lib/db-types";

export default async function AdminJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const adminUser = await requireAdmin();
  const { id } = await params;
  const bundle = await getAdminJob(id);
  if (!bundle) notFound();

  const { job, options, events, documents, appointments, invoices, messages } = bundle;
  const customer = job.profiles;

  const sb = getSupabaseAdmin();
  const { data: authUser } = await sb.auth.admin.getUserById(job.customer_id);
  const hasSignedIn = Boolean(authUser.user?.last_sign_in_at);
  const showInvitePrompt =
    !hasSignedIn && (job.status === "scheduled" || job.status === "estimate_ready");

  return (
    <AdminShell userName={adminUser.name || adminUser.email}>
      <p className="text-sm text-hm-muted">
        <a href="/admin/jobs" className="hover:text-hm-red">
          ? Jobs
        </a>
      </p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{job.title}</h1>
          <p className="mt-2 text-hm-muted">
            {customer?.name || customer?.email} ? {JOB_STATUS_LABELS[job.status]}
          </p>
        </div>
        {!hasSignedIn && <InviteButton customerId={job.customer_id} />}
      </div>

      {showInvitePrompt && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Customer hasn&apos;t signed into the portal yet. Send (or resend) their invite so they can
          see options, schedule, and pay.
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <JobAdminActions
          jobId={job.id}
          status={job.status}
          summary={job.summary}
          existingOptions={options.map((o) => ({
            id: o.id,
            name: o.name,
            price_cents: o.price_cents,
            description: o.description,
            recommended: o.recommended,
          }))}
        />

        <div className="space-y-6">
          <section className="rounded-2xl border border-hm-line bg-white p-5">
            <h2 className="font-display text-lg font-bold">Appointments</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {appointments.map((a) => (
                <li key={a.id} className="rounded-lg bg-hm-fog px-3 py-2">
                  {formatWhen(a.starts_at)} ? {a.type} ? {a.status} ({a.booked_by})
                </li>
              ))}
              {!appointments.length && <p className="text-hm-muted">None yet.</p>}
            </ul>
          </section>

          <section className="rounded-2xl border border-hm-line bg-white p-5">
            <h2 className="font-display text-lg font-bold">Invoices</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {invoices.map((inv) => (
                <li key={inv.id} className="flex justify-between rounded-lg bg-hm-fog px-3 py-2">
                  <span>
                    {inv.number} ? {inv.status}
                  </span>
                  <span className="font-semibold">{money(inv.amount_cents)}</span>
                </li>
              ))}
              {!invoices.length && <p className="text-hm-muted">None yet.</p>}
            </ul>
          </section>

          <section className="rounded-2xl border border-hm-line bg-white p-5">
            <h2 className="font-display text-lg font-bold">Documents</h2>
            <ul className="mt-3 space-y-1 text-sm">
              {documents.map((d) => (
                <li key={d.id}>
                  {d.name} <span className="text-hm-muted">({d.doc_type})</span>
                </li>
              ))}
              {!documents.length && <p className="text-hm-muted">Upload via job actions.</p>}
            </ul>
          </section>
        </div>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-hm-line bg-white p-5">
          <h2 className="font-display text-lg font-bold">Timeline</h2>
          <ol className="mt-3 space-y-3">
            {events.map((e) => (
              <li key={e.id} className="text-sm">
                <p className="text-xs font-semibold text-hm-red">{formatWhen(e.event_at)}</p>
                <p className="font-semibold">{e.title}</p>
                <p className="text-hm-muted">{e.detail}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl border border-hm-line bg-white p-5">
          <h2 className="font-display text-lg font-bold">Messages</h2>
          <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
            {messages.map((m) => (
              <div key={m.id} className="rounded-lg bg-hm-fog px-3 py-2 text-sm">
                <p className="text-xs text-hm-muted">
                  {m.from_role === "admin" ? "You" : customer?.name || "Customer"} ?{" "}
                  {formatWhen(m.created_at)}
                </p>
                <p className="whitespace-pre-wrap">{m.body}</p>
              </div>
            ))}
            {!messages.length && <p className="text-sm text-hm-muted">No messages yet.</p>}
          </div>
          <AdminMessageComposer jobId={job.id} />
        </div>
      </section>
    </AdminShell>
  );
}
