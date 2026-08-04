import Image from "next/image";
import type { Metadata } from "next";
import { CheckCircle2, Phone, Star, XCircle } from "lucide-react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { PartnerLogos } from "@/components/brand/PartnerLogos";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { reviews } from "@/lib/reviews";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get Your Personalized HVAC Quote",
  description:
    "Getting the runaround? Overcharged? Need a second opinion? Get a personalized HVAC quote from How Much? — licensed, insured, transparent.",
  robots: { index: false, follow: true },
};

export default function AdsLandingPage() {
  const pains = [
    {
      bad: "Getting the runaround",
      good: "Clear findings the same visit",
    },
    {
      bad: "Being overcharged",
      good: "Options with pricing rationale",
    },
    {
      bad: "Don't trust the tech",
      good: "Licensed crew, no pressure",
    },
    {
      bad: "Need a second opinion",
      good: "We'll review any quote honestly",
    },
  ];

  return (
    <div className="min-h-screen bg-hm-ink pb-20 text-white md:pb-0">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-hm-ink/90 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between">
          <Logo variant="white" height={44} href="/" />
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 text-sm sm:flex">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">
                Google {site.google.rating} ({site.google.reviewCount})
              </span>
            </div>
            <Button href={site.phones.direct.href} size="sm" tone="dark">
              <Phone className="h-3.5 w-3.5" />
              {site.phones.direct.display}
            </Button>
          </div>
        </Container>
      </header>

      {/* Hero + form */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hm-gradient-hero" />
        <Image
          src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=2200&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.28]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-hm-ink via-hm-ink/85 to-hm-ink/45" />
        <Container className="relative grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {site.license} · Licensed · Insured · Bonded
            </div>
            <h1 className="mt-5 font-display text-5xl font-extrabold tracking-[-0.04em] md:text-6xl">
              So, How Much?
            </h1>
            <p className="mt-4 text-xl font-medium text-white/85 md:text-2xl">
              Get your personalized HVAC quote — right now.
            </p>
            <ul className="mt-8 space-y-2.5">
              {[
                "No pressure sales — options you can understand",
                "Repair vs replace guidance before you spend big",
                "Serving Orange County, LA & San Diego",
                "Family-owned · Google 5.0 rated",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/90">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-hm-red" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div id="quote">
            <QuoteForm elevated />
          </div>
        </Container>
      </section>

      {/* Partners with logo treatments */}
      <section className="bg-white py-8 text-hm-charcoal">
        <Container>
          <p className="text-center font-display text-[11px] font-bold uppercase tracking-[0.22em] text-hm-muted">
            Equipment partners we trust
          </p>
          <div className="mt-5">
            <PartnerLogos />
          </div>
        </Container>
      </section>

      {/* Pain → Gain */}
      <section className="bg-hm-fog py-16 text-hm-charcoal">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Tired of the usual HVAC runaround?
          </h2>
          <p className="mt-3 max-w-2xl text-hm-muted">
            Most homeowners who call us are dealing with one of these. Here’s how How Much?
            flips it.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {pains.map((row) => (
              <div
                key={row.bad}
                className="grid gap-0 overflow-hidden rounded-2xl border border-hm-line bg-white sm:grid-cols-2"
              >
                <div className="border-b border-hm-line bg-red-50/80 p-5 sm:border-b-0 sm:border-r">
                  <div className="flex items-center gap-2 text-sm font-bold text-red-700">
                    <XCircle className="h-4 w-4" />
                    The problem
                  </div>
                  <p className="mt-2 font-display text-lg font-bold text-hm-charcoal">
                    {row.bad}
                  </p>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    With How Much?
                  </div>
                  <p className="mt-2 font-display text-lg font-bold text-hm-charcoal">
                    {row.good}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button href="#quote" className="mt-8">
            Get my quote
          </Button>
        </Container>
      </section>

      {/* Benefits bullets */}
      <section className="bg-white py-16 text-hm-charcoal">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Why homeowners submit the form
            </h2>
            <ul className="mt-8 space-y-4">
              {[
                "You’ll know if a repair can save you thousands",
                "You’ll see Good / Better / Best when replacement is real",
                "You’ll talk to people who explain — not pressure",
                "You’ll get a licensed, insured crew ({license})".replace(
                  "{license}",
                  site.license,
                ),
                "You’ll keep documentation for warranties and next steps",
                "Second opinions welcome — even if you don’t hire us",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-hm-red" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-hm-ink p-8 text-white">
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-hm-red">
              3-step process
            </p>
            <ol className="mt-6 space-y-5">
              {[
                {
                  t: "Submit the form",
                  d: "2 minutes. Tell us the issue and your city.",
                },
                {
                  t: "We diagnose & explain",
                  d: "Plain English findings. Photos when helpful.",
                },
                {
                  t: "You choose the option",
                  d: "Repair or replace — priced transparently.",
                },
              ].map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <span className="font-display text-2xl font-extrabold text-hm-red/80">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold">{s.t}</p>
                    <p className="mt-1 text-sm text-white/65">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Button href="#quote" variant="secondary" tone="dark" className="mt-8 w-full">
              Start my quote
            </Button>
          </div>
        </Container>
      </section>

      {/* Social proof */}
      <section className="bg-hm-fog py-16 text-hm-charcoal">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Real Google reviews. Real homeowners.
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {reviews
              .filter((r) => r.featured)
              .map((review, i) => (
                <figure
                  key={review.id}
                  className={
                    i === 1
                      ? "rounded-2xl bg-hm-red p-6 text-white"
                      : "rounded-2xl bg-white p-6 ring-1 ring-black/5"
                  }
                >
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, n) => (
                      <Star key={n} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-sm leading-relaxed">
                    “{review.quote}”
                  </blockquote>
                  <figcaption className="mt-4 font-display text-sm font-bold">
                    {review.name}
                  </figcaption>
                </figure>
              ))}
          </div>
        </Container>
      </section>

      {/* Services + CTA */}
      <section className="bg-white py-16 text-hm-charcoal">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tight">
            HVAC services we handle
          </h2>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <li
                key={service.slug}
                className="flex items-center gap-2 rounded-lg border border-hm-line bg-hm-fog px-4 py-3 text-sm font-semibold"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-hm-red" />
                {service.name}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-hm-red py-16">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-extrabold tracking-tight">
              Curious on How Much?
            </h2>
            <ul className="mt-6 space-y-2 text-white/95">
              <li>· Free quote request — no obligation</li>
              <li>· Direct line: {site.phones.direct.display}</li>
              <li>· {site.license}</li>
              <li>· Same-day callbacks in most cases</li>
            </ul>
            <Button href={site.phones.direct.href} variant="secondary" tone="dark" className="mt-6">
              Call {site.phones.direct.display}
            </Button>
          </div>
          <QuoteForm compact elevated />
        </Container>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/45">
        <Container>
          <Logo variant="white" height={48} href={null} className="mx-auto" />
          <p className="mt-4">
            {site.legalName} · {site.license} · Office {site.phones.office.display}
          </p>
        </Container>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-hm-ink/95 p-3 backdrop-blur md:hidden">
        <div className="flex gap-2">
          <Button href={site.phones.direct.href} className="flex-1" size="sm" tone="dark">
            Call now
          </Button>
          <Button href="#quote" variant="secondary" tone="dark" className="flex-1" size="sm">
            Get quote
          </Button>
        </div>
      </div>
    </div>
  );
}
