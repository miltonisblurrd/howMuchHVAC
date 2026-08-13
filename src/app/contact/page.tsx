import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact How Much? | Call Andy or Request a Quote",
  description:
    "Contact How Much? Air & Home Improvements. Call Andy direct at (714) 333-5953, office (562) 612-8961, or request a quote online for HVAC service in OC, LA, and San Diego.",
};

export default function ContactPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <Eyebrow className="text-hm-red">Contact</Eyebrow>
            <Heading as="h1" className="mt-3 text-white">
              Talk To How Much?
            </Heading>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70">
              Real people. Clear answers. Whether your AC failed today or you want a second opinion
              on a big quote, reach Andy&apos;s team the way that works for you.
            </p>
            <div className="mt-8 space-y-5 text-white/80">
              <p>
                <span className="text-white/50">Direct (Andy)</span>
                <br />
                <a
                  href={site.phones.direct.href}
                  className="font-display text-2xl font-bold text-white"
                >
                  {site.phones.direct.display}
                </a>
              </p>
              <p>
                <span className="text-white/50">Office</span>
                <br />
                <a
                  href={site.phones.office.href}
                  className="font-display text-2xl font-bold text-white"
                >
                  {site.phones.office.display}
                </a>
              </p>
              <p>
                <span className="text-white/50">Email</span>
                <br />
                <a href={`mailto:${site.email}`} className="text-lg text-white">
                  {site.email}
                </a>
              </p>
              <p className="text-sm text-white/50">{site.license} · Family-owned HVAC</p>
            </div>
            <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5 text-sm leading-relaxed text-white/65">
              After you submit a request online, we save it securely and follow up with next steps.
              You will also get a path to create your client portal so job status, messages, and
              documents stay organized.
            </div>
          </div>
          <QuoteForm sourceLabel="Contact page" />
        </Container>
      </Section>
    </SiteShell>
  );
}
