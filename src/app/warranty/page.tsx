import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Warranty",
  description:
    "Manufacturer and workmanship warranty information for How Much? HVAC installs and service.",
};

export default function WarrantyPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Warranty</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            What we stand behind
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Equipment warranties come from manufacturers. Workmanship coverage comes from us.
            You'll see both documented on your project.
          </p>
          <Button href="/booking" className="mt-8">
            Ask about coverage
          </Button>
        </Container>
      </Section>
      <Section tone="white">
        <Container className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-hm-line bg-hm-fog p-6">
            <h2 className="font-display text-xl font-bold">Manufacturer parts</h2>
            <p className="mt-3 text-hm-muted">
              Varies by brand and registration — we'll walk you through what's included on your
              specific equipment.
            </p>
          </div>
          <div className="rounded-2xl border border-hm-line bg-hm-fog p-6">
            <h2 className="font-display text-xl font-bold">How Much? labor</h2>
            <p className="mt-3 text-hm-muted">
              Install workmanship coverage is confirmed per project and stored with your job
              documents in the portal demo.
            </p>
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
