import type { Metadata } from "next";
import { PrintButton } from "@/components/content/PrintButton";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fair HVAC Pricing Guide | So, How Much?",
  description:
    "A short homeowner guide to fair HVAC pricing in Southern California ? repair vs replace, quote red flags, and how to use a second opinion.",
  robots: { index: false, follow: true },
};

const sections = [
  {
    title: "Start With The Problem, Not The Product",
    body: "A trustworthy HVAC visit diagnoses first. If a company jumps straight to a full system replacement without explaining what failed, what can be repaired, and what can wait, pause. How Much? is built around options ? repair, improve, or replace ? so you understand how much and why before you spend.",
  },
  {
    title: "Repair Vs Replace: Ask These Questions",
    body: "How old is the equipment? Is the failure isolated (capacitor, contactor, TXV, sensor) or systemic (heat exchanger, compressor, chronic refrigerant leaks)? What is the expected remaining life if you repair? What does a properly sized replacement cost in Good / Better / Best tiers? A clear answer to those beats a fear-based sales script every time.",
  },
  {
    title: "Red Flags In High-Pressure Quotes",
    body: "Same-day ?expire tonight? pricing, vague line items, refusal to show photos or readings, and quotes that never mention ducts, airflow, or sizing are common traps. Ask for the diagnosis in writing. Bring scary proposals to a second opinion ? that is normal, not rude.",
  },
  {
    title: "What A Fair Diagnostic Looks Like",
    body: "Expect plain-English findings, basic performance checks, and a plan that fits your home and budget. Southern California heat, coastal air, and older duct systems change the math ? a one-size pitch usually means someone is selling inventory, not comfort.",
  },
  {
    title: "How To Use This Guide With How Much?",
    body: `Save this page, then call Andy direct at ${site.phones.direct.display} or request a quote online. Share any prior proposals. We will tell you what is fair, what is optional, and what can wait ? with zero pressure to hire us afterward.`,
  },
];

export default function FairHvacPricingGuidePage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24 print:!bg-white print:!pt-8">
        <Container className="max-w-3xl">
          <Eyebrow className="text-hm-red">Free Homeowner Guide</Eyebrow>
          <Heading as="h1" className="mt-3 text-white print:text-hm-charcoal">
            So, How Much? Fair HVAC Pricing For SoCal Homes
          </Heading>
          <p className="mt-4 text-lg text-white/70 print:text-hm-muted">
            A short, honest guide for homeowners who want clear options ? not a scare tactic ?
            before they spend on repair or replacement.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 print:hidden">
            <PrintButton tone="dark" variant="secondary" />
            <Button href="/booking" variant="outline" tone="dark">
              Get A Personalized Quote
            </Button>
          </div>
          <p className="mt-3 text-sm text-white/50 print:hidden">
            Tip: use Print ? Save as PDF to keep a copy on your phone or computer.
          </p>
        </Container>
      </Section>

      <Section tone="white">
        <Container className="max-w-3xl space-y-10">
          {sections.map((section, i) => (
            <article key={section.title}>
              <p className="font-display text-sm font-bold text-hm-red">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-hm-charcoal">
                {section.title}
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-hm-muted">{section.body}</p>
            </article>
          ))}

          <div className="rounded-2xl border border-hm-line bg-hm-fog p-6">
            <h2 className="font-display text-xl font-bold text-hm-charcoal">
              Ready For Straight Answers?
            </h2>
            <p className="mt-3 text-hm-muted">
              How Much? Air &amp; Home Improvements serves Orange County, Los Angeles, and San Diego
              with licensed, family-owned HVAC ? options first, always.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
              <Button href="/booking">Request A Quote</Button>
              <Button href={site.phones.direct.href} variant="outline">
                Call {site.phones.direct.display}
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
