import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { getAreasByRegion } from "@/lib/areas";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "HVAC Service Areas | Orange County, Los Angeles & San Diego",
  description:
    "How Much? Air & Home Improvements serves major cities across Orange County, Los Angeles County, and San Diego County with honest HVAC repair, install, and second opinions.",
};

const regions = [
  {
    key: "oc" as const,
    title: "Orange County",
    body: "Our home base. Coastal towns, inland heat, and family neighborhoods — served with the same honest process.",
  },
  {
    key: "la" as const,
    title: "Los Angeles County",
    body: "From Long Beach and the South Bay to the San Gabriel and Santa Clarita valleys — clear options, no pressure.",
  },
  {
    key: "sd" as const,
    title: "San Diego County",
    body: "Coastal mild zones and hotter inland communities. We size and diagnose for the climate you actually live in.",
  },
];

export default function ServiceAreasPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Service areas</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            HVAC Across OC, LA, And San Diego
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Family-owned How Much? serves major Southern California cities with licensed HVAC
            repair, installation, maintenance, and second opinions. Pick your city for local
            details — or call Andy direct at {site.phones.direct.display}.
          </p>
          <Button href="/booking" className="mt-8" tone="dark">
            Book service in your city
          </Button>
        </Container>
      </Section>

      {regions.map((region) => {
        const areas = getAreasByRegion(region.key);
        const hubs = areas.filter((a) => a.isHub);
        const cities = areas.filter((a) => !a.isHub);
        return (
          <Section key={region.key} tone={region.key === "la" ? "fog" : "white"}>
            <Container>
              <Eyebrow>{region.title}</Eyebrow>
              <Heading className="mt-3 text-hm-charcoal">
                {region.title} Cities We Serve
              </Heading>
              <p className="mt-3 max-w-2xl text-hm-muted">{region.body}</p>

              {hubs.length > 0 && (
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {hubs.map((area) => (
                    <Link
                      key={area.slug}
                      href={`/service-areas/${area.slug}`}
                      className="rounded-2xl bg-hm-charcoal p-6 text-white transition hover:bg-hm-ink"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-red">
                        Regional hub
                      </p>
                      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
                        {area.name}
                      </h2>
                      <p className="mt-2 text-sm text-white/65 line-clamp-3">{area.summary}</p>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cities.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/service-areas/${area.slug}`}
                    className="rounded-2xl border border-hm-line bg-white p-5 transition hover:border-hm-red/40"
                  >
                    <h2 className="font-display text-xl font-bold tracking-tight">{area.name}</h2>
                    <p className="mt-2 text-sm text-hm-muted line-clamp-2">{area.summary}</p>
                  </Link>
                ))}
              </div>
            </Container>
          </Section>
        );
      })}

      <Section tone="fog">
        <Container className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-hm-charcoal px-6 py-8 text-white md:flex-row md:items-center md:px-10">
          <div>
            <p className="font-display text-xl font-bold">Do not see your city?</p>
            <p className="mt-2 max-w-xl text-sm text-white/65">
              We cover many surrounding communities across the OC–LA–San Diego corridor. Call and
              we will confirm coverage and timing.
            </p>
          </div>
          <Button href={site.phones.direct.href} tone="dark">
            Call {site.phones.direct.display}
          </Button>
        </Container>
      </Section>
    </SiteShell>
  );
}
