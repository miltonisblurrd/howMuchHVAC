import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "HVAC Services",
  description:
    "A/C, heating, heat pumps, ductless mini-splits, ductwork, insulation, and indoor air quality — honest HVAC across Southern California.",
};

export default function ServicesPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Services</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            HVAC done with clarity
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Every service starts the same way: diagnose honestly, present options, and let you
            decide — no pressure, no mystery pricing.
          </p>
          <div className="mt-8">
            <Button href="/booking">Get a quote</Button>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group overflow-hidden rounded-2xl border border-hm-line bg-hm-fog"
              >
                <div className="relative h-52">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-display text-2xl font-bold tracking-tight">
                    {service.name}
                  </h2>
                  <p className="mt-2 text-hm-muted">{service.summary}</p>
                  <span className="mt-4 inline-flex font-display text-sm font-semibold text-hm-red">
                    Learn more ?
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
