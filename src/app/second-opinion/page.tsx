import type { Metadata } from "next";
import { CheckCircle2, Search, Scale, MessageSquareWarning } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { CtaBand } from "@/components/content/PageExtras";
import { CallAndy, DirectPhone } from "@/components/contact/CallAndy";

export const metadata: Metadata = {
  title: "Second Opinion | Honest HVAC Quote Reviews",
  description:
    "Got an HVAC quote you don't trust? How Much? offers honest second opinions across Orange County, LA, and San Diego.",
};

const reasons = [
  {
    icon: MessageSquareWarning,
    title: "The Quote Felt Like A Scare Tactic",
    body: "If someone jumped straight to full replacement without showing options, bring us the paperwork. We will tell you what is fair.",
  },
  {
    icon: Scale,
    title: "The Number Seems High — Or Vague",
    body: "Mystery line items and pressure deadlines are red flags. We break down necessary work versus optional upsells.",
  },
  {
    icon: Search,
    title: "You Want Proof, Not A Pitch",
    body: "We inspect the system, explain findings in plain English, and help you decide with confidence — even if you hire someone else.",
  },
];

export default function SecondOpinionPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <Eyebrow className="text-hm-red">Second Opinion</Eyebrow>
            <Heading as="h1" className="mt-3 text-white">
              Getting The Runaround?
            </Heading>
            <p className="mt-4 text-lg text-white/70">
              Bring us the quote. We will tell you what is fair, what is inflated, and whether you
              actually need a replacement. Call direct at{" "}
              <DirectPhone className="font-semibold text-white underline" />.
            </p>
            <ul className="mt-8 space-y-3 text-white/85">
              {[
                "No pressure to hire us afterward",
                "Plain-English findings",
                "Options when work is truly needed",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-hm-red" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <CallAndy className="mt-8" tone="dark" />
          </div>
          <QuoteForm elevated />
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <Eyebrow>Why Homeowners Ask</Eyebrow>
          <Heading className="mt-3 text-hm-charcoal">
            A Second Opinion Before You Spend Big
          </Heading>
          <p className="mt-3 max-w-2xl text-hm-muted">
            HVAC quotes can feel designed to rush you. How Much? exists for homeowners who want a
            straight answer first — then a deal that makes sense.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reasons.map((item) => (
              <div key={item.title} className="rounded-2xl border border-hm-line bg-hm-fog p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-hm-red shadow-sm">
                  <item.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-hm-charcoal">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-hm-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="fog">
        <Container className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <Heading as="h2" className="text-hm-charcoal">
              What Happens On A Second Opinion Visit
            </Heading>
            <p className="mt-4 leading-relaxed text-hm-muted">
              Share the quote and any photos or prior notes. We inspect the system, compare findings
              to the proposal, and explain repair versus replace in language you can use — with us
              or with anyone else.
            </p>
          </div>
          <ol className="space-y-4">
            {[
              {
                n: "01",
                t: "Share The Quote",
                b: "Email it or bring it — the more detail, the faster we can spot red flags.",
              },
              {
                n: "02",
                t: "On-Site Reality Check",
                b: "We look at the equipment, ducts, and comfort complaints — not just the sales sheet.",
              },
              {
                n: "03",
                t: "Clear Next Steps",
                b: "Fair options, honest pricing, and zero pressure to hire How Much? afterward.",
              },
            ].map((step) => (
              <li key={step.n} className="rounded-2xl border border-hm-line bg-white p-5">
                <p className="font-display text-sm font-bold text-hm-red">{step.n}</p>
                <p className="mt-1 font-display text-lg font-bold text-hm-charcoal">{step.t}</p>
                <p className="mt-2 text-sm text-hm-muted">{step.b}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <CtaBand
        title="Already Have A Scary Quote?"
        body="Request a second opinion online — or call Andy direct for the fastest path."
        primaryHref="/booking"
        primaryLabel="Request A Second Opinion"
      />
    </SiteShell>
  );
}
