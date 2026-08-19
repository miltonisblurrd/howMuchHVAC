import { PortalChrome } from "@/components/portal/PortalChrome";
import { AdminEmpty } from "@/components/admin/AdminUi";
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
    <PortalChrome
      userId={user.id}
      userName={user.name || user.email}
      title="Documents"
      description="Quotes, scopes, warranties, and paperwork for your jobs."
    >
      {withUrls.length === 0 ? (
        <AdminEmpty>No documents yet. They'll appear here when Andy uploads them.</AdminEmpty>
      ) : (
        <ul className="space-y-2.5">
          {withUrls.map((d) => (
            <li key={d.id}>
              {d.url ? (
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hm-admin-card hm-admin-click flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                >
                  <div>
                    <p className="font-display text-[15px] font-bold text-hm-charcoal">{d.name}</p>
                    <p className="mt-0.5 text-sm text-hm-muted">
                      {d.doc_type}
                      {d.job_title ? ` · ${d.job_title}` : ""}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-hm-red">Download →</span>
                </a>
              ) : (
                <div className="hm-admin-card flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <p className="font-display text-[15px] font-bold text-hm-charcoal">{d.name}</p>
                    <p className="mt-0.5 text-sm text-hm-muted">{d.doc_type}</p>
                  </div>
                  <span className="text-sm text-hm-muted">Unavailable</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </PortalChrome>
  );
}
