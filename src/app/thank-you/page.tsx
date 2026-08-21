import type { Metadata } from "next";
import {
  CheckCircle2,
  FileText,
  MessageSquare,
  CalendarDays,
  CreditCard,
  Mail,
} from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { getFeaturedReviews } from "@/lib/reviews";
import { CallAndy, AndyName, DirectPhone } from "@/components/contact/CallAndy";

export const metadata: Metadata = {
  title: "Request received",
  robots: { index: false, follow: false },
};

const portalPerks = [
  {
    icon: CalendarDays,
    title: "Track your visit",
    body: "See when the tech is scheduled and what’s next — without chasing texts.",
  },
  {
    icon: MessageSquare,
    title: "Message the team",
    body: "Ask questions, send photos of the unit, and keep everything in one thread.",
  },
  {
    icon: FileText,
    title: "Documents in one place",
    body: "Quotes, invoices, warranties, and paperwork stay with your job — not lost in email.",
  },
  {
    icon: CreditCard,
    title: "Pay when you’re ready",
    body: "Review options and pay invoices securely from the same portal.",
  },
];

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const { name } = await searchParams;
  const first = name?.trim() || "there";
  const featured = getFeaturedReviews(3);

  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container className="max-w-3xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <Eyebrow className="mt-6 text-hm-red">Request received</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Thanks, {first} — We&apos;ve Got You
          </Heading>
          <p className="mt-5 text-lg leading-relaxed text-white/75">
            Your request is in Andy&apos;s queue. A real person from How Much? will follow up with
            clear next steps — options first, no pressure.
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-white/85">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-hm-red" />
            <div>
              <p className="font-semibold text-white">Your portal is ready</p>
              <p className="mt-1 text-sm text-white/70">
                Sign in with the email and password you just created. You&apos;re already signed in
                on this device if the quote went through.
              </p>
            </div>
          </div>
          <p className="mt-4 text-white/60">
            Need us sooner? Call <AndyName /> direct at{" "}
            <DirectPhone className="font-semibold text-white underline" />
            .
          </p>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <Eyebrow>Your client portal</Eyebrow>
              <Heading as="h2" className="mt-3">
                Everything In One Place
              </Heading>
              <p className="mt-4 text-hm-muted">
                Open your portal anytime with your email and password. Prefer the phone? Andy&apos;s
                number stays on every screen — you&apos;re never locked into the app.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {portalPerks.map((perk) => (
                  <div
                    key={perk.title}
                    className="rounded-2xl border border-hm-line bg-hm-fog/40 p-5"
                  >
                    <perk.icon className="h-5 w-5 text-hm-red" />
                    <h3 className="mt-3 font-display text-base font-bold">{perk.title}</h3>
                    <p className="mt-2 text-sm text-hm-muted">{perk.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/portal">Open your portal →</Button>
                <CallAndy variant="secondary" arrow={false} />
              </div>
            </div>
            <div className="rounded-2xl border border-hm-line bg-white p-6 shadow-sm">
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-hm-red">
                Neighbors trust How Much?
              </p>
              <ul className="mt-4 space-y-4">
                {featured.map((r) => (
                  <li key={r.id} className="border-t border-hm-line pt-4 first:border-0 first:pt-0">
                    <p className="text-sm leading-relaxed text-hm-charcoal">&ldquo;{r.quote}&rdquo;</p>
                    <p className="mt-2 text-xs font-semibold text-hm-muted">— {r.name}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
