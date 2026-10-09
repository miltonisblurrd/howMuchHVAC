import Link from "next/link";
import { site } from "@/lib/site";
import { PortalBurst } from "@/components/portal/PortalBurst";

export function JobDoneBanner({ jobTitle, jobId }: { jobTitle?: string; jobId?: string }) {
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-5">
      <p className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-800">
        Job done
      </p>
      <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-hm-charcoal">
        {jobTitle ? `${jobTitle} is finished.` : "This job is finished."}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-hm-charcoal/80">
        Book the next maintenance and get $25 off. A review helps the next homeowner know what the visit was like.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/maintenance"
          className="inline-flex h-10 items-center rounded-full bg-hm-red px-4 font-display text-sm font-bold text-white"
        >
          Book maintenance ? $25 off
        </Link>
        <a
          href={site.google.reviewUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center rounded-full border border-hm-charcoal/15 bg-white px-4 font-display text-sm font-bold text-hm-charcoal"
        >
          Leave a review
        </a>
      </div>
      {jobId ? <PortalBurst storageKey={`hm-burst-done-${jobId}`} /> : null}
    </section>
  );
}
