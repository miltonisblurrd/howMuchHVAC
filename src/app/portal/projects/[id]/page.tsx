import Image from "next/image";
import { notFound } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/Button";
import { getPortalProject } from "@/lib/portal-data";
import { requirePortalUser } from "@/lib/portal-session";
import { site } from "@/lib/site";

export default async function PortalProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePortalUser();
  const { id } = await params;
  const project = getPortalProject(id);
  if (!project || project.userId !== user.id) notFound();

  return (
    <PortalShell userName={user.name}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-hm-muted">
            <a href="/portal" className="hover:text-hm-red">
              ? Dashboard
            </a>
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            {project.title}
          </h1>
          <p className="mt-2 text-hm-muted">
            {project.service} ? {project.status}
          </p>
        </div>
        {project.status === "Completed" && (
          <Button href="/reviews">Leave a Google review</Button>
        )}
      </div>

      <p className="mt-6 max-w-3xl text-hm-muted">{project.summary}</p>

      {project.options && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Your options</h2>
          <p className="mt-2 text-sm text-hm-muted">
            Transparency in action — compare packages without the pressure.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {project.options.map((option) => (
              <div
                key={option.name}
                className={
                  option.recommended
                    ? "rounded-2xl border-2 border-hm-red bg-white p-5"
                    : "rounded-2xl border border-hm-line bg-white p-5"
                }
              >
                {option.recommended && (
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-red">
                    Recommended
                  </p>
                )}
                <h3 className="mt-1 font-display text-lg font-bold">{option.name}</h3>
                <p className="mt-2 font-display text-2xl font-bold text-hm-charcoal">
                  {option.price}
                </p>
                <p className="mt-3 text-sm text-hm-muted">{option.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-bold">Timeline</h2>
          <ol className="mt-4 space-y-4">
            {project.timeline.map((item) => (
              <li key={item.title} className="rounded-xl border border-hm-line bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hm-red">
                  {item.date}
                </p>
                <p className="mt-1 font-display font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-hm-muted">{item.detail}</p>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold">Documents</h2>
          <ul className="mt-4 space-y-3">
            {project.documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between rounded-xl border border-hm-line bg-white px-4 py-3"
              >
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-xs text-hm-muted">
                    {doc.type} ? {doc.date}
                  </p>
                </div>
                <span className="text-xs font-semibold text-hm-red">Demo PDF</span>
              </li>
            ))}
          </ul>
          {project.warranty && (
            <div className="mt-6 rounded-xl bg-hm-charcoal p-5 text-white">
              <p className="font-display font-semibold">Warranty</p>
              <p className="mt-2 text-sm text-white/75">{project.warranty}</p>
            </div>
          )}
        </div>
      </section>

      {project.photos.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Job photos</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {project.photos.map((photo) => (
              <div key={photo.label} className="overflow-hidden rounded-2xl border border-hm-line">
                <div className="relative h-52">
                  <Image src={photo.url} alt={photo.label} fill className="object-cover" />
                </div>
                <p className="bg-white px-4 py-3 text-sm font-medium">{photo.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 rounded-2xl border border-hm-line bg-white p-6">
        <p className="font-display font-semibold">Questions about this project?</p>
        <p className="mt-2 text-sm text-hm-muted">
          Message the crew in-portal or call direct at {site.phones.direct.display}.
        </p>
        <Button href="/portal/messages" className="mt-4">
          Open messages
        </Button>
      </div>
    </PortalShell>
  );
}
