import { PortalChrome } from "@/components/portal/PortalChrome";
import { Button } from "@/components/ui/Button";
import { AdminEmpty } from "@/components/admin/AdminUi";
import { requirePortalUser } from "@/lib/auth";
import { getCustomerDocuments, getCustomerInvoices, getCustomerJobs, getSignedUrl } from "@/lib/portal-queries";

export default async function PastServicesPage() {
  const user = await requirePortalUser();
  const [jobs, invoices, documents] = await Promise.all([
    getCustomerJobs(user.id),
    getCustomerInvoices(user.id),
    getCustomerDocuments(user.id),
  ]);

  const finished = jobs.filter((job) => job.status === "completed");
  const invoiceFiles = await Promise.all(
    documents
      .filter((doc) => doc.doc_type.toLowerCase() === "invoice copy")
      .map(async (doc) => ({
        id: doc.id,
        jobId: doc.job_id,
        label: doc.name,
        href: (await getSignedUrl(doc.bucket, doc.storage_path, 3600, doc.name)) || "",
      })),
  );

  return (
    <PortalChrome
      userId={user.id}
      userName={user.name || user.email}
      title="Your Past Services"
      description="Finished jobs. Open one to see the project, photos, and paperwork."
    >
      {finished.length === 0 ? (
        <AdminEmpty>No finished jobs yet. Active jobs stay on your dashboard.</AdminEmpty>
      ) : (
        <ul className="space-y-4">
          {finished.map((job) => {
            const receipts = [
              ...invoices
                .filter((invoice) => invoice.job_id === job.id && invoice.status === "paid")
                .map((invoice) => ({
                  id: invoice.id,
                  label: invoice.number,
                  href: `/api/portal/receipts/${invoice.id}`,
                })),
              ...invoiceFiles
                .filter((file) => file.jobId === job.id && file.href)
                .map((file) => ({ id: file.id, label: file.label, href: file.href })),
            ];

            return (
              <li key={job.id} className="hm-admin-card p-5">
                <h2 className="font-display text-xl font-bold tracking-tight text-hm-charcoal">
                  {job.title}
                </h2>
                <p className="mt-1 text-sm text-hm-muted">
                  {[job.service, job.city].filter(Boolean).join(" - ") || "Finished job"}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button href={`/portal/projects/${job.id}`} size="sm">
                    Open project
                  </Button>
                  {receipts.length === 1 && (
                    <a
                      href={receipts[0].href}
                      className="inline-flex h-10 items-center rounded-lg border border-hm-charcoal/20 px-4 font-display text-sm font-semibold text-hm-charcoal hover:bg-hm-fog"
                    >
                      Download receipts
                    </a>
                  )}
                </div>
                {receipts.length > 1 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-hm-charcoal">Download receipts</p>
                    <ul className="mt-2 space-y-1">
                      {receipts.map((receipt) => (
                        <li key={receipt.id}>
                          <a
                            href={receipt.href}
                            className="text-sm font-semibold text-hm-red hover:text-hm-red-deep"
                          >
                            {receipt.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {receipts.length === 0 && (
                  <p className="mt-3 text-sm text-hm-muted">No receipt yet.</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </PortalChrome>
  );
}
