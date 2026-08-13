import { notFound } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/Button";
import { SelectOptionButton } from "@/components/portal/SelectOptionButton";
import { BookSlotForm } from "@/components/portal/BookSlotForm";
import { requirePortalUser } from "@/lib/auth";
import {
  getActiveAvailability,
  getJobBundle,
  getJobForCustomer,
  getSignedUrl,
} from "@/lib/portal-queries";
import { JOB_STATUS_LABELS, formatWhen, money } from "@/lib/db-types";
import { site } from "@/lib/site";

export default async function PortalProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePortalUser();
  const { id } = await params;
  const job = await getJobForCustomer(id, user.id);
  if (!job) notFound();

  const bundle = await getJobBundle(id);
  const slots = await getActiveAvailability();

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
    <PortalShell userName={user.name || user.email}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-hm-muted">
            <a href="/portal" className="hover:text-hm-red">
              ← Dashboard
            </a>
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">{job.title}</h1>
          <p className="mt-2 text-hm-muted">
            {[job.service, JOB_STATUS_LABELS[job.status]].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href="/portal/messages" variant="secondary">
            Message us
          </Button>
          <Button href={site.phones.direct.href} arrow={false}>
            Call Andy
          </Button>
        </div>
      </div>

      {job.summary && <p className="mt-6 max-w-3xl text-hm-muted whitespace-pre-wrap">{job.summary}</p>}

      {bundle.options.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Your options</h2>
          <p className="mt-2 text-sm text-hm-muted">
            Transparency in action — compare packages. Prefer to talk it through? Call Andy.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {bundle.options.map((option) => {
              const selected = job.selected_option_id === option.id;
              return (
                <div
                  key={option.id}
                  className={
                    selected || option.recommended
                      ? "rounded-2xl border-2 border-hm-red bg-white p-5"
                      : "rounded-2xl border border-hm-line bg-white p-5"
                  }
                >
                  {option.recommended && (
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-red">
                      Recommended
                    </p>
                  )}
                  {selected && (
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      Selected
                    </p>
                  )}
                  <h3 className="mt-1 font-display text-lg font-bold">{option.name}</h3>
                  <p className="mt-2 font-display text-2xl font-bold text-hm-charcoal">
                    {money(option.price_cents)}
                  </p>
                  <p className="mt-3 text-sm text-hm-muted">{option.description}</p>
                  {option.selectable && !selected && (
                    <div className="mt-4">
                      <SelectOptionButton jobId={job.id} optionId={option.id} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-bold">Timeline</h2>
          {bundle.events.length === 0 ? (
            <p className="mt-4 text-sm text-hm-muted">Updates will show up here as your job moves.</p>
          ) : (
            <ol className="mt-4 space-y-4">
              {bundle.events.map((item) => (
                <li key={item.id} className="rounded-xl border border-hm-line bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hm-red">
                    {formatWhen(item.event_at)}
                  </p>
                  <p className="mt-1 font-semibold text-hm-charcoal">{item.title}</p>
                  <p className="mt-1 text-sm text-hm-muted">{item.detail}</p>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div>
          <h2 className="font-display text-xl font-bold">Schedule a visit</h2>
          <p className="mt-2 text-sm text-hm-muted">
            Pick an open slot below, or have Andy call you to schedule the old-fashioned way.
          </p>
          {bundle.appointments.length > 0 && (
            <div className="mt-4 space-y-2">
              {bundle.appointments.map((a) => (
                <div key={a.id} className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm">
                  <p className="font-semibold text-emerald-950">{formatWhen(a.starts_at)}</p>
                  <p className="text-emerald-800 capitalize">{a.type.replace("_", " ")} · {a.status}</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <BookSlotForm jobId={job.id} slots={slots} />
          </div>
          <p className="mt-4 text-sm text-hm-muted">
            Or call{" "}
            <a href={site.phones.direct.href} className="font-semibold text-hm-red">
              {site.phones.direct.display}
            </a>
          </p>
        </div>
      </section>

      {(docUrls.length > 0 || photoUrls.length > 0) && (
        <section className="mt-10 grid gap-8 lg:grid-cols-2">
          {docUrls.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold">Documents</h2>
              <ul className="mt-4 space-y-2">
                {docUrls.map((d) => (
                  <li key={d.id}>
                    {d.url ? (
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl border border-hm-line bg-white px-4 py-3 text-sm font-semibold hover:border-hm-red/40"
                      >
                        {d.name}{" "}
                        <span className="font-normal text-hm-muted">· {d.doc_type}</span>
                      </a>
                    ) : (
                      <span className="block rounded-xl border border-hm-line bg-white px-4 py-3 text-sm">
                        {d.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {photoUrls.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold">Job photos</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {photoUrls.map((p) =>
                  p.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={p.id}
                      src={p.url}
                      alt={p.label || "Job photo"}
                      className="h-36 w-full rounded-xl object-cover"
                    />
                  ) : null,
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {job.warranty && (
        <p className="mt-8 rounded-xl border border-hm-line bg-white p-4 text-sm text-hm-muted">
          <span className="font-semibold text-hm-charcoal">Warranty: </span>
          {job.warranty}
        </p>
      )}
    </PortalShell>
  );
}
