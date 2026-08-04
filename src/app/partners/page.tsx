import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { partners } from "@/lib/partners";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "How Much? partners with trusted HVAC brands including Mitsubishi Electric, Carrier, York, Goodman, Honeywell, and Google Nest.",
};

export default function PartnersPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Partners</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Brands we trust with your home
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            We recommend equipment based on your home ? not a commission script. These partners
            help us deliver reliable comfort.
          </p>
        </Container>
      </Section>
      <Section tone="white">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="rounded-2xl border border-hm-line bg-hm-fog p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-red">
                  {partner.category}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold">{partner.name}</h2>
                <p className="mt-3 text-hm-muted">{partner.blurb}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl bg-hm-charcoal p-8 text-white md:flex md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-2xl font-bold">Proud partner energy, on purpose</h3>
              <p className="mt-2 text-white/70">
                Want to see how we shout out partners on social? Visit the brand assets page.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
              <Button href="/brand" variant="secondary" tone="dark">
                Brand & social
              </Button>
              <Button href="/booking" variant="outline" tone="dark">
                Get a quote
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
