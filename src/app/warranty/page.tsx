import type { Metadata } from "next";
import { BadgeCheck, FileCheck2, Shield, Wrench } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { CtaBand, QuoteAndReviewsSection } from "@/components/content/PageExtras";
import { CallAndy } from "@/components/contact/CallAndy";

export const metadata: Metadata = {
  title: "Warranty | What We Stand Behind",
  description:
    "Manufacturer and workmanship warranty information for How Much? HVAC installs and service across Southern California.",
};

const pillars = [
  {
    icon: BadgeCheck,
    title: "Manufacturer Parts",
    body: "Coverage varies by brand and registration. We walk you through what is included on your specific equipment so you are not guessing later.",
  },
  {
    icon: Wrench,
    title: "How Much? Labor",
    body: "Install workmanship coverage is confirmed per project and stored with your job documents so you know who stands behind the work.",
  },
  {
    icon: FileCheck2,
    title: "Clear Paperwork",
    body: "You should never hunt for warranty details after install day. We document what applies and keep it with your project path.",
  },
  {
    icon: Shield,
    title: "Honest Expectations",
    body: "We tell you what warranties cover — and what they do not — before you buy. No vague promises that disappear after the truck leaves.",
  },
];

export default function WarrantyPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Warranty</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            What We Stand Behind
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Equipment warranties come from manufacturers. Workmanship coverage comes from us. You
            will see both documented on your project.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/booking" tone="dark">
              Ask About Coverage
            </Button>
            <CallAndy variant="outline" tone="dark" />
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <Eyebrow>Coverage Basics</Eyebrow>
          <Heading className="mt-3 text-hm-charcoal">Warranty Clarity From Day One</Heading>
          <p className="mt-3 max-w-2xl text-hm-muted">
            Big national brands love selling “coverage” without explaining the details. How Much?
            makes the warranty conversation part of the options process — not an afterthought.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {pillars.map((item) => (
              <div key={item.title} className="rounded-2xl border border-hm-line bg-hm-fog p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-hm-red shadow-sm">
                  <item.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-display text-xl font-bold text-hm-charcoal">
                  {item.title}
                </h2>
                <p className="mt-3 text-hm-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="fog">
        <Container className="grid gap-8 lg:grid-cols-2">
          <div>
            <Heading as="h2" className="text-hm-charcoal">
              Before You Replace Anything
            </Heading>
            <p className="mt-4 leading-relaxed text-hm-muted">
              Sometimes a repair under existing coverage is the smarter move. We check what still
              applies to your equipment and tell you straight whether a replacement is necessary —
              or whether you are being sold fear.
            </p>
          </div>
          <ul className="space-y-3">
            {[
              "We explain manufacturer vs labor coverage in plain English",
              "Registration and claim steps spelled out when relevant",
              "Second opinions welcome on big replacement quotes",
              "Project documents stay with your client portal path",
            ].map((item) => (
              <li
                key={item}
                className="rounded-xl border border-hm-line bg-white px-5 py-4 text-hm-charcoal"
              >
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand
        title="Questions About Your Coverage?"
        body="Bring your equipment details or an existing quote — we will help you understand what is actually protected."
        primaryHref="/booking"
        primaryLabel="Ask About Warranty"
      />

      <QuoteAndReviewsSection heading="Ask About Warranty Options" />
    </SiteShell>
  );
}
