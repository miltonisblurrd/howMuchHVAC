import type { Metadata } from "next";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { getPublicContact } from "@/lib/business";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Website update in progress",
  description:
    "How Much? Air & Home Improvements is rebuilding trusthowmuch.com for a better customer experience. Call Andy or request a quote.",
  robots: { index: false, follow: true },
};

export default async function ComingSoonPage() {
  const contact = await getPublicContact();

  return (
    <div className="relative min-h-screen overflow-hidden bg-hm-ink px-5 py-12 text-white md:py-16">
      <div className="absolute inset-0 hm-gradient-hero" />
      <div className="absolute inset-0 hm-noise opacity-40" />

      <div className="relative mx-auto flex w-full max-w-xl flex-col items-center">
        <Logo height={168} href={null} priority />

        <p className="mt-6 font-display text-[11px] font-bold uppercase tracking-[0.22em] text-hm-red">
          How Much? Air & Home Improvements
        </p>
        <h1 className="mt-3 text-center font-display text-3xl font-bold tracking-tight md:text-4xl">
          Our website is being rebuilt
        </h1>
        <p className="mt-4 max-w-md text-center text-base leading-relaxed text-white/75 md:text-lg">
          We&apos;re updating trusthowmuch.com for a better customer experience: clearer
          info, an easier way to reach Andy, and a smoother path from quote to visit.
        </p>
        <p className="mt-2 text-center text-sm text-white/55">
          In the meantime, call or send the form. Same-day callbacks. No pressure.
        </p>

        <div className="mt-8 w-full">
          <QuoteForm elevated portalSignup={false} stayOnSuccess sourceLabel="Coming soon" />
        </div>

        <div className="mt-10 w-full rounded-2xl border border-white/15 bg-white/5 p-6 text-center">
          <div className="flex justify-center">
            <Logo height={72} href={null} />
          </div>
          <p className="mt-4 font-display text-sm font-bold text-white">
            Call {contact.displayName}
          </p>
          <a
            href={site.phones.direct.href}
            className="mt-2 block font-display text-2xl font-bold tracking-tight text-white underline decoration-white/25 underline-offset-4 hover:decoration-white"
          >
            {site.phones.direct.display}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="mt-3 block text-sm text-white/70 hover:text-white"
          >
            {site.email}
          </a>
          <div className="mt-5">
            <Button href={site.phones.direct.href} variant="outline" tone="dark" className="w-full">
              Call Andy
            </Button>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-white/45">
            {site.license}
          </p>
          <p className="mt-1 text-xs text-white/40">
            Licensed, insured HVAC serving Orange County, LA &amp; San Diego
          </p>
        </div>
      </div>
    </div>
  );
}
