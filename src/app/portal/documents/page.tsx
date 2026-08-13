import { PortalShell } from "@/components/portal/PortalShell";
import { requirePortalUser } from "@/lib/auth";
import { getCustomerDocuments, getSignedUrl } from "@/lib/portal-queries";

export default async function PortalDocumentsPage() {
  const user = await requirePortalUser();
  const docs = await getCustomerDocuments(user.id);
  const withUrls = await Promise.all(
    docs.map(async (d) => ({
      ...d,
      url: await getSignedUrl(d.bucket, d.storage_path),
    })),
  );

  return (
    <PortalShell userName={user.name || user.email}>
      <h1 className="font-display text-3xl font-bold tracking-tight">Documents</h1>
      <p className="mt-2 text-hm-muted">Quotes, scopes, warranties, and paperwork for your jobs.</p>

      {withUrls.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-hm-line bg-white p-8 text-center text-hm-muted">
          No documents yet. They&apos;ll appear here when Andy uploads them.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {withUrls.map((d) => (
            <li
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hm-line bg-white px-5 py-4"
            >
              <div>
                <p className="font-semibold text-hm-charcoal">{d.name}</p>
                <p className="text-sm text-hm-muted">
                  {d.doc_type}
                  {d.job_title ? ` · ${d.job_title}` : ""}
                </p>
              </div>
              {d.url ? (
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-hm-red hover:underline"
                >
                  Download →
                </a>
              ) : (
                <span className="text-sm text-hm-muted">Unavailable</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
