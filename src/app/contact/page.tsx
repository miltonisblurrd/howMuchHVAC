import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact How Much? Air & Home Improvements — call Andy direct or request a quote.",
};

export default function ContactPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow className="text-hm-red">Contact</Eyebrow>
            <Heading as="h1" className="mt-3 text-white">
              Talk to How Much?
            </Heading>
            <div className="mt-8 space-y-4 text-white/80">
              <p>
                <span className="text-white/50">Direct</span>
                <br />
                <a href={site.phones.direct.href} className="font-display text-2xl font-bold text-white">
                  {site.phones.direct.display}
                </a>
              </p>
              <p>
                <span className="text-white/50">Office</span>
                <br />
                <a href={site.phones.office.href} className="font-display text-2xl font-bold text-white">
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
              <p className="text-sm text-white/50">{site.license}</p>
            </div>
          </div>
          <QuoteForm />
        </Container>
      </Section>
    </SiteShell>
  );
}
