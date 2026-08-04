import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { serviceAreas } from "@/lib/areas";

export const metadata: Metadata = {
  title: "Service Areas",
  description:
    "How Much? HVAC serves Orange County, Los Angeles, San Diego, and surrounding Southern California cities.",
};

export default function ServiceAreasPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Service areas</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Southern California comfort, locally delivered
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Based in Orange County and serving the biggest cities across the LA?OC?San Diego
            corridor.
          </p>
        </Container>
      </Section>
      <Section tone="white">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/service-areas/${area.slug}`}
                className="rounded-2xl border border-hm-line bg-hm-fog p-6 transition hover:border-hm-red/40"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-red">
                  {area.region}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
                  {area.name}
                </h2>
                <p className="mt-2 text-sm text-hm-muted line-clamp-3">{area.summary}</p>
              </Link>
            ))}
          </div>
          <div className="mt-12">
            <Button href="/booking">Book service in your city</Button>
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
