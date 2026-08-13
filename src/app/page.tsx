import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Phone, Star } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { TrustBar } from "@/components/home/TrustBar";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { PartnerLogos } from "@/components/brand/PartnerLogos";
import { PartnerLogoStrip } from "@/components/brand/PartnerLogoStrip";
import { GuideDownloadBand } from "@/components/home/GuideDownloadBand";
import { projects } from "@/lib/projects";
import { getFeaturedReviews } from "@/lib/reviews";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

const steps = [
  {
    num: "01",
    title: "Tell Us What’s Going On",
    body: "Call or fill out the form. No scripts. No runaround.",
  },
  {
    num: "02",
    title: "We Diagnose & Explain",
    body: "Clear findings in plain English — photos included when it helps.",
  },
  {
    num: "03",
    title: "Options First. Then A Deal.",
    body: "Good / Better / Best when it matters. You decide. We deliver.",
  },
];

const pains = [
  "Getting the runaround?",
  "Being overcharged?",
  "Don’t trust the tech?",
  "Need a second opinion?",
];

export default function HomePage() {
  const featuredServices = services.filter((s) => s.featured).slice(0, 4);
  const featuredReviews = getFeaturedReviews(3);

  return (
    <SiteShell headerTone="transparent">
      {/* ── Hero: conversion split ── */}
      <section className="relative overflow-hidden text-white">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=2400&q=80"
          aria-hidden
        >
          <source src="/videos/hero-hvac.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-hm-ink/93 via-hm-ink/80 to-hm-ink/60" />
        <div className="absolute inset-0 bg-hm-ink/30" />
        <div className="absolute inset-0 hm-noise opacity-40" />

        {/* Oversized bubble watermark */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-16 h-[420px] w-[520px] rounded-[50%] border border-white/[0.07] opacity-60 md:right-0 md:top-10"
        />

        <Container className="relative grid items-center gap-10 pb-12 pt-28 md:gap-12 md:pb-16 md:pt-36 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hm-animate-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85 backdrop-blur">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              Google {site.google.rating} · {site.google.reviewCount} reviews
              <span className="text-white/35">·</span>
              {site.license}
            </div>

            <h1 className="mt-6 font-display text-5xl font-extrabold tracking-[-0.04em] text-balance md:text-6xl lg:text-[4.25rem]">
              So, How Much?
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/75 md:text-xl">
              Honest HVAC for Orange County, LA & San Diego. Transparent pricing.
              Real answers. No pressure.
            </p>

            <ul className="mt-7 grid gap-2 sm:grid-cols-2">
              {pains.map((pain) => (
                <li
                  key={pain}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/90"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-hm-red" />
                  {pain}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={site.phones.direct.href}
                className="inline-flex items-center gap-2.5 font-display text-lg font-bold text-white transition hover:text-hm-red"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-hm-red text-white shadow-[0_8px_24px_-8px_rgba(255,29,37,0.8)]">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                    Call Andy direct
                  </span>
                  {site.phones.direct.display}
                </span>
              </a>
            </div>
          </div>

          <div className="hm-animate-in hm-delay-2" id="quote">
            <QuoteForm elevated />
          </div>
        </Container>

        <TrustBar dark />
      </section>

      <PartnerLogoStrip />

      {/* ── Process ── */}
      <Section tone="white">
        <Container>
          <div className="max-w-xl">
            <Eyebrow>How We Work</Eyebrow>
            <Heading className="mt-3 text-hm-charcoal">We Make It Easy For You</Heading>
            <p className="mt-4 text-lg text-hm-muted">
              Integrity goes a long way — and it&apos;s the standard here.
            </p>
          </div>
          <ol className="mt-12 grid gap-0 md:grid-cols-3 md:divide-x md:divide-hm-line">
            {steps.map((step, i) => (
              <li
                key={step.num}
                className={`py-2 md:px-8 ${i === 0 ? "md:pl-0" : ""} ${i === 2 ? "md:pr-0" : ""}`}
              >
                <span className="font-display text-4xl font-extrabold tracking-tighter text-hm-red/20">
                  {step.num}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-hm-charcoal">
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-hm-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ── Services asymmetric ── */}
      <Section tone="fog">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <Eyebrow>HVAC Services</Eyebrow>
              <Heading className="mt-3 text-hm-charcoal">Comfort Systems Done Right</Heading>
              <p className="mt-4 text-lg text-hm-muted">
                From diagnostics to full installs — A/C, heating, heat pumps, ductless, ductwork,
                and indoor air quality.
              </p>
            </div>
            <Button href="/services" variant="outline" tone="light">
              View All Services
            </Button>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-12">
            {featuredServices.map((service, i) => {
              const wide = i === 0 || i === 3;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className={`group relative overflow-hidden rounded-2xl bg-hm-ink text-white hm-card-lift ${
                    wide ? "md:col-span-7" : "md:col-span-5"
                  }`}
                >
                  <Image
                    src={service.image}
                    alt={service.name}
                    width={900}
                    height={560}
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="h-56 w-full object-cover opacity-50 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-40 md:h-64"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-hm-ink via-hm-ink/50 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-2xl font-bold tracking-tight">
                      {service.name}
                    </h3>
                    <p className="mt-1.5 max-w-md text-sm text-white/70">{service.summary}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ── Why / mission ── */}
      <Section tone="dark" className="overflow-hidden">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-8 rounded-full bg-hm-red/15 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
                  alt="Southern California home exterior"
                  width={900}
                  height={720}
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="h-[380px] w-full object-cover md:h-[440px]"
                />
              </div>
              <div className="absolute -bottom-4 -right-2 rounded-2xl border border-white/10 bg-hm-charcoal/95 px-5 py-4 shadow-xl backdrop-blur md:right-6">
                <p className="font-display text-3xl font-extrabold text-white">
                  {site.yearsExperience}+
                </p>
                <p className="text-xs font-medium uppercase tracking-wider text-white/55">
                  Years in the field
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <Eyebrow>Why How Much?</Eyebrow>
              <Heading className="mt-3 text-white">
                Established. Trustworthy.
                <br />
                100% Legit.
              </Heading>
              <p className="mt-4 text-lg leading-relaxed text-white/65">
                We&apos;ve seen the best and worst of this industry. Our mission: put customers
                first with fair pricing and lasting relationships.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "No pressure — options you can understand",
                  "Licensed crew, professional process",
                  "Second opinions welcome",
                  "Client portal for real transparency",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/90">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-hm-red" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/about" tone="dark">
                  About Andy & The Team
                </Button>
                <Button href="/second-opinion" variant="outline" tone="dark">
                  Request A Second Opinion
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Projects ── */}
      <Section tone="white">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Recent Projects</Eyebrow>
              <Heading className="mt-3 text-hm-charcoal">Proof In The Work</Heading>
            </div>
            <Button href="/projects" variant="outline" tone="light">
              View Projects
            </Button>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group overflow-hidden rounded-2xl border border-hm-line bg-hm-fog hm-card-lift"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.afterImage}
                    alt={project.title}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-hm-red">
                    {project.city}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-hm-charcoal">
                    {project.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-hm-muted">{project.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Partners logos ── */}
      <Section tone="fog" className="!py-14">
        <Container>
          <p className="text-center font-display text-[11px] font-bold uppercase tracking-[0.22em] text-hm-muted">
            Equipment Partners We Trust
          </p>
          <PartnerLogos className="mt-8" />
          <div className="mt-6 text-center">
            <Link
              href="/partners"
              className="font-display text-sm font-semibold text-hm-red hover:underline"
            >
              Meet Our Partners →
            </Link>
          </div>
        </Container>
      </Section>

      {/* ── Reviews sticky scroll ── */}
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Eyebrow>Reviews</Eyebrow>
              <Heading className="mt-3 text-hm-charcoal">
                Rated 5 Stars
                <br />
                For A Reason
              </Heading>
              <p className="mt-4 text-hm-muted">
                Real homeowners. Real Google reviews. No scripts.
              </p>
              <Button href="/reviews" variant="outline" tone="light" className="mt-8">
                See All Reviews
              </Button>
            </div>
            <div className="space-y-4">
              {featuredReviews.map((review, index) => (
                <figure
                  key={review.id}
                  className={
                    index === 0
                      ? "rounded-2xl bg-hm-red p-7 text-white"
                      : "rounded-2xl border border-hm-line bg-hm-fog p-7"
                  }
                >
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <blockquote
                    className={`mt-4 text-[15px] leading-relaxed ${
                      index === 0 ? "text-white/95" : "text-hm-charcoal"
                    }`}
                  >
                    “{review.quote}”
                  </blockquote>
                  <figcaption
                    className={`mt-5 font-display text-sm font-bold ${
                      index === 0 ? "text-white" : "text-hm-charcoal"
                    }`}
                  >
                    {review.name}
                  </figcaption>
                </figure>
              ))}
              <Button
                href="/reviews"
                variant="outline"
                tone="light"
                className="w-full rounded-2xl"
              >
                See All Reviews
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <GuideDownloadBand />
    </SiteShell>
  );
}
