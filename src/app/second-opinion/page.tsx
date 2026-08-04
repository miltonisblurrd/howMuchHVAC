import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Second Opinion",
  description:
    "Got an HVAC quote you don't trust? How Much? offers honest second opinions across Orange County, LA, and San Diego.",
};

export default function SecondOpinionPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <Eyebrow className="text-hm-red">Second opinion</Eyebrow>
            <Heading as="h1" className="mt-3 text-white">
              Getting the runaround?
            </Heading>
            <p className="mt-4 text-lg text-white/70">
              Bring us the quote. We'll tell you what's fair, what's inflated, and whether you
              actually need a replacement. Call direct at {site.phones.direct.display}.
            </p>
            <ul className="mt-8 space-y-3 text-white/85">
              <li>· No pressure to hire us afterward</li>
              <li>· Plain-English findings</li>
              <li>· Options when work is truly needed</li>
            </ul>
          </div>
          <QuoteForm />
        </Container>
      </Section>
    </SiteShell>
  );
}
