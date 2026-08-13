import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { GuideDownloadBand } from "@/components/home/GuideDownloadBand";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "HVAC Services | A/C, Heating, Heat Pumps & More",
  description:
    "Family-owned HVAC services across Southern California: A/C repair and installation, heating, heat pumps, ductless mini-splits, ductwork, insulation, and indoor air quality. Honest options from How Much?.",
};

export default function ServicesPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Services</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            HVAC Done With Clarity
          </Heading>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/75">
            Every How Much? service starts the same way: diagnose honestly, present options in plain
            English, and let you decide. No pressure. No mystery pricing. Just family-owned HVAC
            for Orange County, Los Angeles, and San Diego homeowners who want to know{" "}
            <em>how much</em> — and why.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/booking" tone="dark">
              Get a quote
            </Button>
            <Button href={site.phones.direct.href} variant="outline" tone="dark">
              Call {site.phones.direct.display}
            </Button>
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
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
      <GuideDownloadBand />
    </SiteShell>
  );
}
