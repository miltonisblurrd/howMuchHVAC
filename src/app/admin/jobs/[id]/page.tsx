import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Phone, Wrench } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { InviteButton } from "@/components/admin/InviteButton";
import { AdminMessageComposer } from "@/components/admin/AdminMessageComposer";
import { JobDocumentUpload } from "@/components/admin/JobDocumentUpload";
import { JobStatusStepper } from "@/components/admin/JobStatusStepper";
import { JobNextStep } from "@/components/admin/JobNextStep";
import { JobPricingCard } from "@/components/admin/JobPricingCard";
import { JobPaymentCard } from "@/components/admin/JobPaymentCard";
import { JobVisitCard } from "@/components/admin/JobVisitCard";
import { JobNotesCard } from "@/components/admin/JobNotesCard";
import { requireAdmin } from "@/lib/auth";
import { getAdminJob } from "@/lib/admin-queries";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { decorateMessagePhotos, getSignedUrl } from "@/lib/portal-queries";
import { formatWhen } from "@/lib/db-types";
import { JOB_STAGES } from "@/lib/job-stages";

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
  const firstName = (customer?.name || "the customer").split(" ")[0];

  const sb = getSupabaseAdmin();
  const { data: authUser } = await sb.auth.admin.getUserById(job.customer_id);
  const hasSignedIn = Boolean(authUser.user?.last_sign_in_at);

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

  const selected = options.find((o) => o.id === job.selected_option_id) ?? null;
  const hasUpcomingVisit = appointments.some((a) => a.status === "confirmed");
  const pendingVisitCount = appointments.filter((a) => a.status === "pending").length;
  const openInvoiceCents = invoices
    .filter((i) => i.status === "unpaid" || i.status === "overdue")
    .reduce((s, i) => s + i.amount_cents, 0);
  const paidInvoiceCents = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.amount_cents, 0);

  const stageLabel =
    JOB_STAGES.find((s) => s.status === job.status)?.label ?? (job.status === "cancelled" ? "Cancelled" : job.status);

  return (
    <AdminShell
      userName={adminUser.name || adminUser.email}
      title={job.title}
      description={[customer?.name, stageLabel].filter(Boolean).join(" · ")}
    >
      <Link
        href="/admin/jobs"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-hm-muted hover:text-hm-red"
      >
        <ArrowLeft className="h-4 w-4" /> All jobs
      </Link>

      <JobStatusStepper jobId={job.id} status={job.status} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <JobNextStep
            jobId={job.id}
            status={job.status}
            customerFirstName={firstName}
            hasOptions={options.length > 0}
            selectedOption={selected ? { name: selected.name, price_cents: selected.price_cents } : null}
            hasUpcomingVisit={hasUpcomingVisit}
            pendingVisitCount={pendingVisitCount}
            openInvoiceCents={openInvoiceCents}
            paidInvoiceCents={paidInvoiceCents}
            customerSignedIn={hasSignedIn}
          />

          <JobPricingCard
            jobId={job.id}
            selectedOptionId={job.selected_option_id}
            existingOptions={options.map((o) => ({
              id: o.id,
              name: o.name,
              price_cents: o.price_cents,
              description: o.description,
              recommended: o.recommended,
            }))}
          />

          <JobVisitCard jobId={job.id} customerFirstName={firstName} appointments={appointments} />

          <JobPaymentCard
            jobId={job.id}
            customerFirstName={firstName}
            invoices={invoices}
            selectedOptionId={job.selected_option_id}
            options={options.map((o) => ({
              id: o.id,
              name: o.name,
              price_cents: o.price_cents,
              recommended: o.recommended,
            }))}
          />

          <JobNotesCard jobId={job.id} summary={job.summary} />
        </div>

        <aside className="space-y-6">
          <section className="hm-admin-card p-5">
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-hm-muted">
              Customer
            </p>
            <h2 className="mt-1 font-display text-xl font-bold tracking-tight">
              {customer?.name || "Customer"}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {customer?.phone && (
                <li>
                  <a
                    href={`tel:${customer.phone.replace(/[^0-9+]/g, "")}`}
                    className="inline-flex items-center gap-2 font-semibold text-hm-charcoal hover:text-hm-red"
                  >
                    <Phone className="h-4 w-4 text-hm-red" /> {customer.phone}
                  </a>
                </li>
              )}
              {customer?.email && (
                <li>
                  <a
                    href={`mailto:${customer.email}`}
                    className="inline-flex items-center gap-2 text-hm-charcoal hover:text-hm-red"
                  >
                    <Mail className="h-4 w-4 text-hm-red" /> <span className="truncate">{customer.email}</span>
                  </a>
                </li>
              )}
              {(job.service || job.city) && (
                <li className="inline-flex items-center gap-2 text-hm-muted">
                  {job.service ? <Wrench className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                  {[job.service, job.city].filter(Boolean).join(" · ")}
                </li>
              )}
            </ul>

            <div className="mt-4 rounded-xl bg-hm-fog px-3.5 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-hm-muted">Portal</p>
              {hasSignedIn ? (
                <p className="mt-1 text-sm font-semibold text-emerald-700">
                  Logged in — sees pricing, schedule, and pay.
                </p>
              ) : (
                <>
                  <p className="mt-1 text-sm font-semibold text-amber-800">Hasn&apos;t logged in yet.</p>
                  <p className="mt-0.5 text-xs text-hm-muted">
                    Send the password setup so they can see what you post here.
                  </p>
                  <div className="mt-2">
                    <InviteButton customerId={job.customer_id} />
                  </div>
                </>
              )}
            </div>
          </section>

          <section id="messages" className="hm-admin-card scroll-mt-24 p-5">
            <h2 className="font-display text-lg font-bold">Messages</h2>
            <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
              {messagesWithPhotos.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.from_role === "admin"
                      ? "ml-6 rounded-xl bg-hm-charcoal px-3 py-2 text-sm text-white"
                      : "mr-6 rounded-xl bg-hm-fog px-3 py-2 text-sm"
                  }
                >
                  <p className={m.from_role === "admin" ? "text-xs text-white/60" : "text-xs text-hm-muted"}>
                    {m.from_role === "admin" ? "You" : firstName} · {formatWhen(m.created_at)}
                  </p>
                  {m.photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photoUrl} alt="" className="mt-2 max-h-40 rounded-lg object-cover" />
                  )}
                  {m.displayBody && <p className="whitespace-pre-wrap">{m.displayBody}</p>}
                </div>
              ))}
              {!messagesWithPhotos.length && (
                <p className="text-sm text-hm-muted">No messages yet.</p>
              )}
            </div>
            <AdminMessageComposer jobId={job.id} />
          </section>

          <section className="hm-admin-card p-5">
            <h2 className="font-display text-lg font-bold">Documents</h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {docsWithUrls.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-2">
                  {d.url ? (
                    <a href={d.url} target="_blank" rel="noreferrer" className="truncate font-semibold text-hm-red">
                      {d.name}
                    </a>
                  ) : (
                    <span className="truncate">{d.name}</span>
                  )}
                  <span className="shrink-0 text-xs text-hm-muted">{d.doc_type}</span>
                </li>
              ))}
              {!docsWithUrls.length && (
                <p className="text-hm-muted">Upload a signed quote, scope, or warranty.</p>
              )}
            </ul>
            <JobDocumentUpload jobId={job.id} />
          </section>

          <section className="hm-admin-card p-5">
            <h2 className="font-display text-lg font-bold">History</h2>
            <ol className="mt-3 space-y-3 border-l border-hm-line pl-4">
              {[...events].reverse().map((e) => (
                <li key={e.id} className="relative text-sm">
                  <span className="absolute top-1.5 -left-[1.3rem] h-2 w-2 rounded-full bg-hm-red" />
                  <p className="text-xs text-hm-muted">{formatWhen(e.event_at)}</p>
                  <p className="font-semibold">{e.title}</p>
                  {e.detail && <p className="text-hm-muted">{e.detail}</p>}
                </li>
              ))}
              {!events.length && <p className="text-hm-muted">Nothing yet.</p>}
            </ol>
          </section>
        </aside>
      </div>
    </AdminShell>
  );
}
