import Link from "next/link";
import { notFound } from "next/navigation";
import { PortalChrome } from "@/components/portal/PortalChrome";
import { Button } from "@/components/ui/Button";
import { ClientJobStepper } from "@/components/portal/ClientJobStepper";
import { ClientNextStep } from "@/components/portal/ClientNextStep";
import { VisitCard } from "@/components/portal/VisitCard";
import { OptionsCard } from "@/components/portal/OptionsCard";
import { InstallCard } from "@/components/portal/InstallCard";
import { JobPhotoGallery } from "@/components/portal/JobPhotoGallery";
import { AdminCard, AdminCardHeader } from "@/components/admin/AdminUi";
import { requirePortalUser } from "@/lib/auth";
import { getClientStage } from "@/lib/client-stages";
import {
  decorateMessagePhotos,
  getCustomerInvoices,
  getCustomerMessages,
  getJobBundle,
  getJobForCustomer,
  getSignedUrl,
  countUnreadForCustomer,
} from "@/lib/portal-queries";
import { formatWhen, type Invoice } from "@/lib/db-types";
import { JobDoneBanner } from "@/components/portal/JobDoneBanner";
import { PortalBurst } from "@/components/portal/PortalBurst";
import { unpackOptionCopy } from "@/lib/option-copy";
import { paceFromEvents } from "@/lib/schedule-pace";

function openCents(invoices: Invoice[]) {
  return invoices
    .filter((i) => i.status === "unpaid" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount_cents, 0);
}

export default async function PortalProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePortalUser();
  const { id } = await params;
  const job = await getJobForCustomer(id, user.id);
  if (!job) notFound();

  const [bundle, invoices, messages, unread] = await Promise.all([
    getJobBundle(id),
    getCustomerInvoices(user.id),
    getCustomerMessages(user.id),
    countUnreadForCustomer(user.id),
  ]);

  const stage = getClientStage({
    job,
    options: bundle.options,
    invoices,
    appointments: bundle.appointments,
    unreadCount: unread,
    otherOpenCents: openCents(invoices.filter((i) => i.job_id !== job.id)),
  });

  const choosing = stage.phase === "pick" || stage.phase === "deposit";

  const thread = (await decorateMessagePhotos(messages.filter((m) => m.job_id === job.id))).slice(-3);

  const photoUrls = await Promise.all(
    bundle.photos.map(async (p) => ({
      ...p,
      url: await getSignedUrl(p.bucket, p.storage_path),
    })),
  );
  const docUrls = await Promise.all(
    bundle.documents.map(async (d) => ({
      ...d,
      url: await getSignedUrl(d.bucket, d.storage_path),
    })),
  );

  return (
    <PortalChrome
      userId={user.id}
      userName={user.name || user.email}
      title={job.title}
      description={[job.service, stage.label].filter(Boolean).join(" · ")}
      actions={
        <Button href="/portal/messages" variant="secondary" size="sm">
          Message Andy
        </Button>
      }
    >
      <p className="mb-6 text-sm text-hm-muted">
        <Link href="/portal" className="font-semibold text-hm-red hover:text-hm-red-deep">
          Back to dashboard
        </Link>
      </p>

      <div className="space-y-6">
        {stage.phase === "done" ? <JobDoneBanner jobTitle={job.title} jobId={job.id} /> : null}
        {stage.depositPaid && stage.phase !== "done" ? (
          <PortalBurst storageKey={`hm-burst-deposit-${job.id}`} />
        ) : null}
        <ClientJobStepper stage={stage} />
        <ClientNextStep stage={stage} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-6">
            <div className={choosing ? "order-2" : "order-1"}>
              <VisitCard appointment={stage.lookVisit} />
            </div>
            <div className={choosing ? "order-1" : "order-2"}>
              <OptionsCard
                stage={stage}
                options={await Promise.all(
                  bundle.options.map(async (option) => ({
                    ...option,
                    imageUrl: await (async () => {
                      const photo = option.image_path || unpackOptionCopy(option.description).photo;
                      return photo ? getSignedUrl("job-photos", photo) : null;
                    })(),
                  })),
                )}
              />
            </div>
            <div className="order-3">
              <InstallCard
                jobId={job.id}
                schedulePace={paceFromEvents(bundle.events, job.schedule_pace)}
                appointment={stage.installVisit}
                hasSelection={Boolean(stage.selected)}
                depositPaid={stage.depositPaid}
                depositCents={stage.depositCents}
                phase={stage.phase}
              />
            </div>
            <div className="order-4">
              <AdminCard>
                <AdminCardHeader
                  title="Photos"
                  caption="Shots Andy took on this job, including before and after."
                />
                <JobPhotoGallery
                  photos={photoUrls.map((photo) => ({
                    id: photo.id,
                    label: photo.label,
                    url: photo.url,
                  }))}
                />
              </AdminCard>
            </div>
          </div>

          <aside className="space-y-6">
            <AdminCard>
              <AdminCardHeader title="Job notes" caption="What Andy has written for you." />
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-hm-muted">
                {job.summary || "No notes yet."}
              </p>
              {job.warranty && (
                <p className="mt-4 text-sm text-hm-muted">
                  <span className="font-semibold text-hm-charcoal">Warranty. </span>
                  {job.warranty}
                </p>
              )}
            </AdminCard>

            <AdminCard>
              <AdminCardHeader
                title="Messages"
                action={
                  <Link href="/portal/messages" className="text-sm font-semibold text-hm-red">
                    Open
                  </Link>
                }
              />
              {thread.length === 0 ? (
                <p className="mt-4 text-sm text-hm-muted">No messages yet.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {thread.map((m) => (
                    <li
                      key={m.id}
                      className={
                        m.from_role === "admin"
                          ? "rounded-xl bg-hm-fog px-3 py-2 text-sm"
                          : "rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-hm-line"
                      }
                    >
                      <p className="text-xs text-hm-muted">
                        {m.from_role === "admin" ? "Andy" : "You"} · {formatWhen(m.created_at)}
                      </p>
                      {m.displayBody && <p className="mt-1 whitespace-pre-wrap">{m.displayBody}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>

            <section id="documents">
              <AdminCard>
                <AdminCardHeader title="Documents" caption="Quotes, scope, and warranty files." />
                {docUrls.length === 0 ? (
                  <p className="mt-4 text-sm text-hm-muted">None yet.</p>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {docUrls.map((d) => (
                      <li key={d.id}>
                        {d.url ? (
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-xl border border-hm-line px-4 py-3 text-sm font-semibold"
                          >
                            {d.name} <span className="font-normal text-hm-muted">· {d.doc_type}</span>
                          </a>
                        ) : (
                          <span className="block rounded-xl border border-hm-line px-4 py-3 text-sm">
                            {d.name}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </AdminCard>
            </section>

            <AdminCard>
              <AdminCardHeader title="History" caption="What has happened on this job." />
              {bundle.events.length === 0 ? (
                <p className="mt-4 text-sm text-hm-muted">Updates will show up here as the job moves.</p>
              ) : (
                <ol className="mt-4 space-y-3 border-l border-hm-line pl-4">
                  {[...bundle.events].reverse().map((item) => (
                    <li key={item.id} className="relative text-sm">
                      <span className="absolute top-1.5 -left-[1.3rem] h-2 w-2 rounded-full bg-hm-red" />
                      <p className="text-xs text-hm-muted">{formatWhen(item.event_at)}</p>
                      <p className="font-semibold text-hm-charcoal">{item.title}</p>
                      {item.detail && <p className="text-hm-muted">{item.detail}</p>}
                    </li>
                  ))}
                </ol>
              )}
            </AdminCard>
          </aside>
        </div>
      </div>

    </PortalChrome>
  );
}
