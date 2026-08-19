import Image from "next/image";
import type { Metadata } from "next";
import { CheckCircle2, ShieldCheck, Star, XCircle } from "lucide-react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { PartnerLogoStrip } from "@/components/brand/PartnerLogoStrip";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import { getFeaturedReviews } from "@/lib/reviews";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { CallAndy, CallAndyPhone, AndyName, DirectPhone } from "@/components/contact/CallAndy";

export const metadata: Metadata = {
  title: "Get a Free HVAC Quote | How Much? Air & Home",
  description:
    "Request a free, no-obligation HVAC quote in Orange County, LA & San Diego. Transparent pricing, second opinions, and repair-or-replace options — no pressure.",
  alternates: { canonical: "/get-a-quote" },
  openGraph: {
    title: "Get a Free HVAC Quote | How Much?",
    description:
      "Free personalized HVAC quote. Transparent options for repair, improve, or replace across SoCal.",
    url: "/get-a-quote",
  },
};

const faqs = [
  {
    question: "Is requesting a quote free?",
    answer:
      "Yes. Submitting the form is free and no-obligation. We’ll follow up with clear next steps — options first, no pressure.",
  },
  {
    question: "Can you review a quote I already got from another company?",
    answer:
      "Absolutely. Share the proposal (photo or PDF works). We’ll tell you what’s fair, what’s inflated, and whether repair is still a smart path — even if you don’t hire us.",
  },
  {
    question: "How fast will someone get back to me?",
    answer:
      "We aim for same-day callbacks in most cases. If you need help sooner, call Andy direct — we’ll tell you what’s realistic for your city and timing.",
  },
  {
    question: "Do you only push full system replacements?",
    answer:
      "No. How Much? presents repair, improve, or replace. If a repair can get you comfortable for less, we’ll say so.",
  },
  {
    question: "Where do you serve?",
    answer:
      "Orange County, Los Angeles County, and San Diego County. Family-owned HVAC with licensed, insured crews.",
  },
];

export default function GetAQuotePage() {
  const pains = [
    {
      bad: "Getting The Runaround",
      good: "Clear Findings The Same Visit",
    },
    {
      bad: "Being Overcharged",
      good: "Options With Pricing Rationale",
    },
    {
      bad: "Don't Trust The Tech",
      good: "Licensed Crew, No Pressure",
    },
    {
      bad: "Need A Second Opinion",
      good: "We'll Review Any Quote Honestly",
    },
  ];

  return (
    <div className="min-h-screen bg-hm-ink pb-20 text-white md:pb-0">
      <FaqJsonLd faqs={faqs} />

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
            <CallAndyPhone size="sm" tone="dark" arrow={false} />
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
              Get Your Personalized HVAC Quote — Right Now.
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
            <QuoteForm elevated sourceLabel="Get a quote page" />
          </div>
        </Container>
      </section>

      <PartnerLogoStrip />

      {/* Pain → Gain */}
      <section className="bg-hm-fog py-16 text-hm-charcoal">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Tired Of The Usual HVAC Runaround?
          </h2>
          <p className="mt-3 max-w-2xl text-hm-muted">
            Most homeowners who call us are dealing with one of these. Here’s how How Much? flips
            it.
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
                    The Problem
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
            Get My Quote
          </Button>
        </Container>
      </section>

      {/* Why people choose How Much? */}
      <section className="bg-white py-16 text-hm-charcoal">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-hm-red">
              Why Homeowners Choose How Much?
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              You Deserve Straight Answers.
              <br />
              Not A Hard Sell.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-hm-muted">
              Most people who work with us are tired of feeling talked past. We listen first,
              explain what&apos;s actually going on, and give you options you can trust —
              including when a repair is the smarter move.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "We hear you out before pitching anything",
                "We explain findings in plain English — no scare tactics",
                "We show repair vs replace when both are real options",
                "We price it clearly so you know how much and why",
                `We're a licensed, insured family crew (${site.license})`,
                "Second opinions welcome — even if you don't hire us after",
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
              How Working With Us Feels
            </p>
            <ol className="mt-6 space-y-5">
              {[
                {
                  t: "Tell Us What's Going On",
                  d: "The issue, your city, and any prior quotes — no scripts.",
                },
                {
                  t: "We Diagnose & Explain",
                  d: "Plain-English findings. Photos when they help.",
                },
                {
                  t: "You Decide With Clarity",
                  d: "Repair or replace — priced transparently, zero pressure.",
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
              Get My Quote
            </Button>
          </div>
        </Container>
      </section>

      {/* Social proof */}
      <section className="bg-hm-fog py-16 text-hm-charcoal">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Real Google Reviews. Real Homeowners.
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {getFeaturedReviews(3).map((review, i) => (
              <figure
                key={review.id}
                className={
                  i === 1
                    ? "rounded-2xl bg-hm-red p-6 text-white"
                    : "rounded-2xl bg-white p-6 ring-1 ring-black/5"
                }
              >
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: review.rating }).map((_, n) => (
                    <Star key={n} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed">
                  “
                  {review.quote.length > 220
                    ? `${review.quote.slice(0, 220)}…`
                    : review.quote}
                  ”
                </blockquote>
                <figcaption className="mt-4 font-display text-sm font-bold">
                  {review.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* Convincing section: second opinion / don't overpay */}
      <section className="bg-white py-16 text-hm-charcoal">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-hm-red">
                Second Opinions Welcome
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Already Got A Scary Quote?
                <br />
                Don&apos;t Guess.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-hm-muted">
                Big national brands often jump straight to full replacement. How Much? will tell
                you what&apos;s necessary, what&apos;s optional, and whether a repair still makes
                sense — in plain English.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "We review the proposal and the equipment, not just the sales sheet",
                  "No pressure to hire us afterward — clarity is the deliverable",
                  "Repair vs replace spelled out before you spend thousands",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-hm-red" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Button href="#quote" className="mt-8">
                Request A Second Opinion
              </Button>
            </div>
            <div className="rounded-3xl border border-hm-line bg-hm-fog p-8">
              <p className="font-display text-sm font-bold uppercase tracking-[0.16em] text-hm-red">
                What To Provide
              </p>
              <ol className="mt-5 space-y-4">
                {[
                  "The written quote or proposal (photo or PDF is fine)",
                  "Photos of indoor / outdoor units if you have them",
                  "What symptoms started this — heat, noise, bills, uneven rooms",
                ].map((item, i) => (
                  <li key={item} className="flex gap-3">
                    <span className="font-display text-xl font-extrabold text-hm-red/40">
                      0{i + 1}
                    </span>
                    <span className="pt-1 font-medium text-hm-charcoal">{item}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm text-hm-muted">
                Prefer to talk now? Call <AndyName /> direct at{" "}
                <DirectPhone className="font-semibold text-hm-red" />
                .
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="bg-hm-fog py-16 text-hm-charcoal">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tight">
            HVAC Services We Handle
          </h2>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <li
                key={service.slug}
                className="flex items-center gap-2 rounded-lg border border-hm-line bg-white px-4 py-3 text-sm font-semibold"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-hm-red" />
                {service.name}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* FAQs */}
      <section className="bg-white py-16 text-hm-charcoal">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Common Questions Before You Submit
          </h2>
          <p className="mt-3 max-w-2xl text-hm-muted">
            Straight answers — so you know what happens after you hit send.
          </p>
          <div className="mt-8 divide-y divide-hm-line rounded-2xl border border-hm-line bg-hm-fog">
            {faqs.map((faq) => (
              <details key={faq.question} className="group px-5 py-4 md:px-6">
                <summary className="cursor-pointer list-none font-display text-base font-bold text-hm-charcoal marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-hm-red transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-hm-muted md:text-[15px]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Slim banner CTA → form */}
      <section className="bg-hm-red">
        <Container className="flex flex-col items-start justify-between gap-4 py-5 md:flex-row md:items-center md:py-6">
          <div>
            <p className="font-display text-xl font-bold tracking-tight md:text-2xl">
              Ready For A Clear Answer?
            </p>
            <p className="mt-1 text-sm text-white/85 md:text-base">
              Jump back up and submit the form — options first, no pressure.
            </p>
          </div>
          <Button href="#quote" variant="secondary" tone="dark" className="shrink-0">
            Back To Quote Form
          </Button>
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
          <CallAndy className="flex-1" size="sm" tone="dark" arrow={false}>
            Call Now
          </CallAndy>
          <Button href="#quote" variant="secondary" tone="dark" className="flex-1" size="sm">
            Get Quote
          </Button>
        </div>
      </div>
    </div>
  );
}
