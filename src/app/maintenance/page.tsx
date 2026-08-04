import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Maintenance Plans",
  description:
    "Seasonal HVAC maintenance with How Much? ? protect comfort, catch issues early, and keep systems efficient.",
};

export default function MaintenancePage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Maintenance</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Stay ahead of breakdown season
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Tune-ups that actually check the system — documented clearly, available later in your
            client portal experience.
          </p>
          <Button href="/booking" className="mt-8">
            Schedule maintenance
          </Button>
        </Container>
      </Section>
      <Section tone="white">
        <Container>
          <Heading as="h2">What's in a proper visit</Heading>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              "Filter and airflow check",
              "Electrical component inspection",
              "Coil and drainage review",
              "Performance verification",
              "Safety observations",
              "Clear next-step recommendations",
            ].map((item) => (
              <li key={item} className="rounded-xl border border-hm-line bg-hm-fog px-5 py-4">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </SiteShell>
  );
}
