import { notFound } from "next/navigation";
import { PortalChrome } from "@/components/portal/PortalChrome";
import { Button } from "@/components/ui/Button";
import { SelectOptionButton } from "@/components/portal/SelectOptionButton";
import { BookSlotForm } from "@/components/portal/BookSlotForm";
import { AdminCard, AdminCardHeader } from "@/components/admin/AdminUi";
import { CountUp } from "@/components/admin/CountUp";
import { requirePortalUser } from "@/lib/auth";
import {
  getActiveAvailability,
  getJobBundle,
  getJobForCustomer,
  getSignedUrl,
} from "@/lib/portal-queries";
import { JOB_STATUS_LABELS, formatWhen, money } from "@/lib/db-types";
import { APPOINTMENT_TYPE_LABELS } from "@/lib/job-stages";
import { DirectPhone } from "@/components/contact/CallAndy";
import { cn } from "@/lib/cn";

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
    <PortalChrome
      userId={user.id}
      userName={user.name || user.email}
      title={job.title}
      description={[job.service, JOB_STATUS_LABELS[job.status]].filter(Boolean).join(" · ")}
      actions={
        <Button href="/portal/messages" variant="secondary" size="sm">
          Message us
        </Button>
      }
    >
      <p className="mb-6 text-sm text-hm-muted">
        <a href="/portal" className="font-semibold text-hm-red hover:text-hm-red-deep">
          ← Dashboard
        </a>
      </p>

      {job.summary && (
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-hm-muted whitespace-pre-wrap">
          {job.summary}
        </p>
      )}

      {bundle.options.length > 0 && (
        <section className="mb-6">
          <AdminCard>
            <AdminCardHeader
              title="Your options"
              caption="Compare packages. Prefer to talk it through? Call Andy."
            />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {bundle.options.map((option) => {
                const selected = job.selected_option_id === option.id;
                return (
                  <div
                    key={option.id}
                    className={cn(
                      "rounded-xl border bg-white p-4",
                      selected || option.recommended
                        ? "border-hm-red/50"
                        : "border-hm-line",
                    )}
                  >
                    {option.recommended && (
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-hm-red">
                        Recommended
                      </p>
                    )}
                    {selected && (
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                        Selected
                      </p>
                    )}
                    <h3 className="mt-1 font-display text-[15px] font-bold text-hm-charcoal">
                      {option.name}
                    </h3>
                    <p className="mt-2 font-display text-2xl font-bold tracking-tight text-hm-charcoal">
                      <CountUp value={money(option.price_cents)} />
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
          </AdminCard>
        </section>
      )}

      <section className="grid gap-5 lg:grid-cols-2">
        <AdminCard>
          <AdminCardHeader title="Timeline" caption="Updates as your job moves." />
          {bundle.events.length === 0 ? (
            <p className="mt-4 text-sm text-hm-muted">Updates will show up here as your job moves.</p>
          ) : (
            <ol className="mt-4 space-y-2">
              {bundle.events.map((item) => (
                <li key={item.id} className="rounded-xl bg-hm-fog/80 px-3.5 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-hm-red">
                    {formatWhen(item.event_at)}
                  </p>
                  <p className="mt-1 font-semibold text-hm-charcoal">{item.title}</p>
                  <p className="mt-0.5 text-sm text-hm-muted">{item.detail}</p>
                </li>
              ))}
            </ol>
          )}
        </AdminCard>

        <AdminCard>
          <AdminCardHeader
            title={
              job.status === "in_progress" || job.status === "estimate_ready"
                ? "Install / project date"
                : "First visit"
            }
            caption={
              job.status === "in_progress" || job.status === "estimate_ready"
                ? "This is the day Andy comes back to do the work."
                : "Andy looks at the job first. Pricing comes after that visit."
            }
          />
          {bundle.appointments.length > 0 && (
            <div className="mt-4 space-y-2">
              {bundle.appointments.map((a) => (
                <div
                  key={a.id}
                  className={
                    a.status === "pending"
                      ? "rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-2.5 text-sm"
                      : "rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-3 py-2.5 text-sm"
                  }
                >
                  <p className="font-semibold text-hm-charcoal">{formatWhen(a.starts_at)}</p>
                  <p className="text-hm-muted">
                    {APPOINTMENT_TYPE_LABELS[a.type] ?? a.type} · {a.status}
                    {a.tech_name ? ` · ${a.tech_name}` : ""}
                  </p>
                  {a.status === "pending" && (
                    <p className="mt-1 text-xs text-amber-900">Waiting on Andy to confirm.</p>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <BookSlotForm jobId={job.id} slots={slots} />
          </div>
          <p className="mt-4 text-sm text-hm-muted">
            Or call <DirectPhone className="font-semibold text-hm-red" />
          </p>
        </AdminCard>
      </section>

      {(docUrls.length > 0 || photoUrls.length > 0) && (
        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          {docUrls.length > 0 && (
            <AdminCard>
              <AdminCardHeader title="Documents" />
              <ul className="mt-4 space-y-2">
                {docUrls.map((d) => (
                  <li key={d.id}>
                    {d.url ? (
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hm-admin-click block rounded-xl border border-hm-line px-4 py-3 text-sm font-semibold"
                      >
                        {d.name}{" "}
                        <span className="font-normal text-hm-muted">· {d.doc_type}</span>
                      </a>
                    ) : (
                      <span className="block rounded-xl border border-hm-line px-4 py-3 text-sm">
                        {d.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </AdminCard>
          )}
          {photoUrls.length > 0 && (
            <AdminCard>
              <AdminCardHeader title="Job photos" />
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
            </AdminCard>
          )}
        </section>
      )}

      {job.warranty && (
        <p className="hm-admin-card mt-5 px-5 py-4 text-sm text-hm-muted">
          <span className="font-semibold text-hm-charcoal">Warranty: </span>
          {job.warranty}
        </p>
      )}
    </PortalChrome>
  );
}
