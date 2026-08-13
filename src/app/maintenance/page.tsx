import type { Metadata } from "next";
import { CalendarCheck, ClipboardCheck, Shield, Wind } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { CtaBand, QuoteAndReviewsSection } from "@/components/content/PageExtras";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Maintenance Plans | Stay Ahead Of Breakdown Season",
  description:
    "Seasonal HVAC maintenance with How Much? — protect comfort, catch issues early, and keep systems efficient across Orange County, LA, and San Diego.",
};

const visitItems = [
  "Filter and airflow check",
  "Electrical component inspection",
  "Coil and drainage review",
  "Performance verification",
  "Safety observations",
  "Clear next-step recommendations",
];

const reasons = [
  {
    icon: Wind,
    title: "Catch Issues Early",
    body: "Small problems become expensive emergencies in peak heat. A proper tune-up finds them while they are still easy to fix.",
  },
  {
    icon: Shield,
    title: "Protect Your Investment",
    body: "Regular care helps systems run cleaner and more efficiently — and supports manufacturer warranty expectations when required.",
  },
  {
    icon: ClipboardCheck,
    title: "Documented Clearly",
    body: "You get findings in plain English, not a rushed checklist. Keep records for your home and your client portal path.",
  },
  {
    icon: CalendarCheck,
    title: "Seasonal Timing That Makes Sense",
    body: "We schedule around Southern California weather so you are ready before the worst heat or cold snaps hit.",
  },
];

export default function MaintenancePage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Maintenance</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Stay Ahead Of Breakdown Season
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Tune-ups that actually check the system — documented clearly, available later in your
            client portal experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/booking" tone="dark">
              Schedule Maintenance
            </Button>
            <Button href={site.phones.direct.href} variant="outline" tone="dark">
              Call {site.phones.direct.display}
            </Button>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <Eyebrow>Why It Matters</Eyebrow>
          <Heading className="mt-3 text-hm-charcoal">Maintenance That Protects Comfort</Heading>
          <p className="mt-3 max-w-2xl text-hm-muted">
            How Much? maintenance visits are not a sales trap. We inspect, explain, and only
            recommend what your system actually needs.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {reasons.map((item) => (
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
        <Container>
          <Heading as="h2" className="text-hm-charcoal">
            What&apos;s In A Proper Visit
          </Heading>
          <p className="mt-3 max-w-2xl text-hm-muted">
            Every home is different, but a solid visit covers the basics that keep cooling and
            heating reliable when you need them most.
          </p>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {visitItems.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-hm-line bg-white px-5 py-4 font-medium text-hm-charcoal"
              >
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand
        title="Ready To Book A Tune-Up?"
        body="Tell us your system type and preferred timing — we will schedule a clear, respectful visit."
        primaryHref="/booking"
        primaryLabel="Schedule Maintenance"
      />

      <QuoteAndReviewsSection heading="Request A Maintenance Visit" />
    </SiteShell>
  );
}
