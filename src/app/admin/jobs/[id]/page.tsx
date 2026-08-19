import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { InviteButton } from "@/components/admin/InviteButton";
import { JobAdminActions } from "@/components/admin/JobAdminActions";
import { AdminMessageComposer } from "@/components/admin/AdminMessageComposer";
import { ConfirmAppointmentActions } from "@/components/admin/ConfirmAppointmentActions";
import { JobDocumentUpload } from "@/components/admin/JobDocumentUpload";
import { InvoiceAdminActions } from "@/components/admin/InvoiceAdminActions";
import { requireAdmin } from "@/lib/auth";
import { getAdminJob } from "@/lib/admin-queries";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { decorateMessagePhotos, getSignedUrl } from "@/lib/portal-queries";
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

  const unreadCustomer = messages.filter((m) => m.from_role === "customer" && !m.read_at);
  if (unreadCustomer.length) {
    await sb
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .in(
        "id",
        unreadCustomer.map((m) => m.id),
      );
  }

  const messagesWithPhotos = await decorateMessagePhotos(messages);
  const docsWithUrls = await Promise.all(
    documents.map(async (d) => ({
      ...d,
      url: await getSignedUrl(d.bucket, d.storage_path),
    })),
  );

  return (
    <AdminShell
      userName={adminUser.name || adminUser.email}
      title={job.title}
      description={[customer?.name || customer?.email, JOB_STATUS_LABELS[job.status]]
        .filter(Boolean)
        .join(" · ")}
      actions={!hasSignedIn ? <InviteButton customerId={job.customer_id} /> : undefined}
    >
      <p className="mb-5 text-sm text-hm-muted">
        <a href="/admin/jobs" className="hover:text-hm-red">
          ← Jobs
        </a>
      </p>

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
          <section className="hm-admin-card p-5">
            <h2 className="font-display text-lg font-bold">Appointments</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {appointments.map((a) => (
                <li
                  key={a.id}
                  className={
                    a.status === "pending"
                      ? "rounded-lg border border-amber-200 bg-amber-50 px-3 py-3"
                      : "rounded-lg bg-hm-fog px-3 py-3"
                  }
                >
                  <p className="font-semibold">
                    {formatWhen(a.starts_at)} · {a.type} · {a.status}
                  </p>
                  <p className="text-xs text-hm-muted">Booked by {a.booked_by}</p>
                  <ConfirmAppointmentActions appointment={a} />
                </li>
              ))}
              {!appointments.length && <p className="text-hm-muted">None yet.</p>}
            </ul>
          </section>

          <section className="hm-admin-card p-5">
            <h2 className="font-display text-lg font-bold">Invoices</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {invoices.map((inv) => (
                <li key={inv.id} className="rounded-lg bg-hm-fog px-3 py-3">
                  <div className="flex justify-between gap-3">
                    <span>
                      {inv.number} · {inv.status}
                    </span>
                    <span className="font-semibold">{money(inv.amount_cents)}</span>
                  </div>
                  <div className="mt-2">
                    <InvoiceAdminActions invoice={inv} />
                  </div>
                </li>
              ))}
              {!invoices.length && <p className="text-hm-muted">None yet.</p>}
            </ul>
          </section>

          <section className="hm-admin-card p-5">
            <h2 className="font-display text-lg font-bold">Documents</h2>
            <ul className="mt-3 space-y-1 text-sm">
              {docsWithUrls.map((d) => (
                <li key={d.id}>
                  {d.url ? (
                    <a href={d.url} target="_blank" rel="noreferrer" className="font-semibold text-hm-red">
                      {d.name}
                    </a>
                  ) : (
                    d.name
                  )}{" "}
                  <span className="text-hm-muted">({d.doc_type})</span>
                </li>
              ))}
              {!docsWithUrls.length && <p className="text-hm-muted">Upload a quote, scope, or warranty.</p>}
            </ul>
            <JobDocumentUpload jobId={job.id} />
          </section>
        </div>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="hm-admin-card p-5">
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
        <div className="hm-admin-card p-5">
          <h2 className="font-display text-lg font-bold">Messages</h2>
          <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
            {messagesWithPhotos.map((m) => (
              <div key={m.id} className="rounded-lg bg-hm-fog px-3 py-2 text-sm">
                <p className="text-xs text-hm-muted">
                  {m.from_role === "admin" ? "You" : customer?.name || "Customer"} ·{" "}
                  {formatWhen(m.created_at)}
                </p>
                {m.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photoUrl} alt="" className="mt-2 max-h-40 rounded-lg object-cover" />
                )}
                {m.displayBody && <p className="whitespace-pre-wrap">{m.displayBody}</p>}
              </div>
            ))}
            {!messagesWithPhotos.length && <p className="text-sm text-hm-muted">No messages yet.</p>}
          </div>
          <AdminMessageComposer jobId={job.id} />
        </div>
      </section>
    </AdminShell>
  );
}
