import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Financing",
  description:
    "Explore flexible financing paths for HVAC upgrades with How Much? ? transparent options, clear expectations.",
};

export default function FinancingPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Financing</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Comfort upgrades that fit your timeline
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Ask about financing-friendly options when we present Good / Better / Best packages.
            We'll keep the numbers clear — no fine-print surprises in the conversation.
          </p>
          <Button href="/booking" className="mt-8">
            Talk through options
          </Button>
        </Container>
      </Section>
      <Section tone="white">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Know the full picture",
                body: "Equipment, labor, and any extras explained before you choose a path.",
              },
              {
                title: "Choose the right tier",
                body: "Financing can make the better long-term system realistic — not just the cheapest today.",
              },
              {
                title: "Ask us anything",
                body: "If a payment structure isn't clear, we pause and explain. That's the brand.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-hm-line bg-hm-fog p-6">
                <h2 className="font-display text-xl font-bold">{item.title}</h2>
                <p className="mt-3 text-hm-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
