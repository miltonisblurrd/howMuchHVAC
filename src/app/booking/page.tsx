import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { BookingWizard } from "@/components/forms/BookingWizard";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book HVAC Service / Get a Quote | How Much?",
  description:
    "Schedule HVAC service or request a personalized quote from How Much? Air & Home Improvements. Transparent options, no pressure. Call Andy direct at (714) 333-5953.",
};

export default function BookingPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24 !pb-12">
        <Container>
          <Eyebrow className="text-hm-red">Book with How Much?</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Let&apos;s Make It Easy
          </Heading>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">
            Share a few details about your home and what is going on. We will follow up with clear
            next steps — options first, no pressure. After you submit, you will also get a path into
            your client portal so you can track the visit and keep documents in one place.
          </p>
          <p className="mt-4 text-white/60">
            Prefer to talk now? Call Andy direct at{" "}
            <a href={site.phones.direct.href} className="font-semibold text-white underline">
              {site.phones.direct.display}
            </a>
            .
          </p>
        </Container>
      </Section>
      <Section tone="fog" className="!pt-10">
        <Container>
          <BookingWizard />
          <p className="mt-8 text-center text-sm text-hm-muted">
            {site.license} · Licensed, insured, family-owned HVAC across OC, LA, and San Diego
          </p>
        </Container>
      </Section>
    </SiteShell>
  );
}
