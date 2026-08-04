import { PortalShell } from "@/components/portal/PortalShell";
import { getUserProjects } from "@/lib/portal-data";
import { requirePortalUser } from "@/lib/portal-session";

export default async function PortalDocumentsPage() {
  const user = await requirePortalUser();
  const docs = getUserProjects(user.id).flatMap((project) =>
    project.documents.map((doc) => ({ ...doc, project: project.title })),
  );

  return (
    <PortalShell userName={user.name}>
      <h1 className="font-display text-3xl font-bold tracking-tight">Documents</h1>
      <p className="mt-2 text-hm-muted">
        Estimates, reports, invoices, and warranties — all in one place.
      </p>
      <ul className="mt-8 space-y-3">
        {docs.map((doc) => (
          <li
            key={doc.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hm-line bg-white px-5 py-4"
          >
            <div>
              <p className="font-display font-semibold">{doc.name}</p>
              <p className="text-sm text-hm-muted">
                {doc.project} ? {doc.type} ? {doc.date}
              </p>
            </div>
            <span className="rounded-full bg-hm-fog px-3 py-1 text-xs font-semibold text-hm-muted">
              Demo file
            </span>
          </li>
        ))}
      </ul>
    </PortalShell>
  );
}
