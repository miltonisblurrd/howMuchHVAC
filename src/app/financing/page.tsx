import type { Metadata } from "next";
import { CreditCard, FileText, Handshake, Percent } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { CtaBand, QuoteAndReviewsSection } from "@/components/content/PageExtras";
import { CallAndy } from "@/components/contact/CallAndy";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Financing | Comfort Upgrades On Your Timeline",
  description:
    "Explore flexible financing paths for HVAC upgrades with How Much? — transparent options, clear expectations, and no fine-print surprises in the conversation.",
};

const paths = [
  {
    icon: Percent,
    title: "Know The Full Picture",
    body: "Equipment, labor, permits when needed, and any extras explained before you choose a path — so financing is based on a real number, not a guess.",
  },
  {
    icon: CreditCard,
    title: "Choose The Right Tier",
    body: "Financing can make the better long-term system realistic — not just the cheapest fix today. We walk Good / Better / Best when it matters.",
  },
  {
    icon: FileText,
    title: "Ask Us Anything",
    body: "If a payment structure is not clear, we pause and explain. That is the brand: options first, pressure never.",
  },
  {
    icon: Handshake,
    title: "Decisions On Your Terms",
    body: "Approve what fits your budget and timeline. We are here to get you comfortable — not to rush a signature.",
  },
];

export default function FinancingPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Financing</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Comfort Upgrades That Fit Your Timeline
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Ask about financing-friendly options when we present Good / Better / Best packages.
            We keep the numbers clear — no fine-print surprises in the conversation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={site.synchrony.applyUrl} tone="dark">
              Apply With Synchrony
            </Button>
            <CallAndy variant="outline" tone="dark" />
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <Eyebrow>How It Works</Eyebrow>
          <Heading className="mt-3 text-hm-charcoal">Financing Built Around Clarity</Heading>
          <p className="mt-3 max-w-2xl text-hm-muted">
            We do not bury costs or rush you into a monthly payment. First we diagnose and price
            the work honestly — then we talk through ways to make the right system fit your budget.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {paths.map((item) => (
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
        <Container className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>What To Expect</Eyebrow>
            <Heading className="mt-3 text-hm-charcoal">
              Transparent Numbers Before You Commit
            </Heading>
            <p className="mt-4 leading-relaxed text-hm-muted">
              Availability and terms depend on the lender and your project. We will tell you what
              applies to your job, what is optional, and what can wait — so you never feel pushed
              into financing you do not need.
            </p>
          </div>
          <ul className="space-y-3">
            {[
              "Clear project scope before payment talk",
              "Repair vs replace spelled out in plain English",
              "Second opinions welcome if you already have a quote",
              "Documents available later in your client portal path",
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
        title="Ready To See What Fits Your Budget?"
        body="Get a personalized quote — then ask about financing options that match the work you actually need."
        primaryHref="/booking"
        primaryLabel="Get A Personalized Quote"
      />

      <QuoteAndReviewsSection heading="Request Financing-Friendly Options" />
    </SiteShell>
  );
}
