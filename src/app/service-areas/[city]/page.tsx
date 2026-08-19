import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CheckCircle2,
  Home,
  MapPin,
  ShieldCheck,
  ThermometerSun,
  Wrench,
} from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import {
  BenefitsListSection,
  Breadcrumbs,
  CtaBand,
  InlineFaqs,
  OtherServicesSection,
  PainPointsSection,
  ProcessSection,
  QuoteAndReviewsSection,
  RelatedPosts,
} from "@/components/content/PageExtras";
import { PartnerLogoStrip } from "@/components/brand/PartnerLogoStrip";
import { GuideDownloadBand } from "@/components/home/GuideDownloadBand";
import { getArea, getNearbyAreas, serviceAreas } from "@/lib/areas";
import { getBlogPosts } from "@/lib/mdx";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { AndyName, DirectPhone } from "@/components/contact/CallAndy";

const highlightIcons = [MapPin, Wrench, ShieldCheck];

export function generateStaticParams() {
  return serviceAreas.map((a) => ({ city: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const area = getArea(city);
  if (!area) return {};
  return {
    title: `HVAC In ${area.name} | Repair, Install & Second Opinions`,
    description: `Family-owned HVAC in ${area.name}. How Much? offers honest diagnostics, fair repair and install options, and clear pricing for ${area.region} homeowners. Licensed CA #107-3814.`,
    openGraph: {
      title: `HVAC In ${area.name} | How Much?`,
      description: area.summary,
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const area = getArea(city);
  if (!area) notFound();

  const posts = getBlogPosts().filter((p) => area.relatedBlogSlugs.includes(p.slug));
  const nearby = getNearbyAreas(area.slug, 16);
  const localServices = services.filter((s) =>
    area.popularServiceSlugs.includes(s.slug),
  );

  return (
    <SiteShell>
      <FaqJsonLd faqs={area.faqs} />
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Service Areas", href: "/service-areas" },
              { label: area.name },
            ]}
          />
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Eyebrow className="text-hm-red">{area.region}</Eyebrow>
              <Heading as="h1" className="mt-3 text-white">
                HVAC In {area.name}
              </Heading>
              <p className="mt-4 text-lg leading-relaxed text-white/75">
                {area.description}
              </p>
              <ul className="mt-6 space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-hm-red" />
                  Family-owned · Licensed & insured ({site.license})
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-hm-red" />
                  Options first — repair, improve, or replace
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-hm-red" />
                  Call <AndyName /> direct <DirectPhone className="font-semibold text-white" />
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#quote" tone="dark">
                  Get A Quote In {area.name}
                </Button>
                <Button href="/services" variant="outline" tone="dark">
                  Browse Services
                </Button>
              </div>
            </div>
            <div className="relative h-72 overflow-hidden rounded-3xl md:h-96">
              <Image
                src={area.image}
                alt={`Homes and HVAC service in ${area.name}`}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </Container>
      </Section>

      <PartnerLogoStrip />

      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <Eyebrow>Local To {area.name}</Eyebrow>
              <Heading className="mt-3 text-hm-charcoal">
                Trusted HVAC For {area.name} Homeowners
              </Heading>
              <p className="mt-4 text-lg leading-relaxed text-hm-muted">{area.localStory}</p>
              <p className="mt-4 leading-relaxed text-hm-muted">
                How Much? is not a faceless national dispatch center. You get a Southern California
                family business that explains findings, shows options, and treats your home with
                respect — whether you need a quick repair in {area.name} or a full system
                replacement.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Honest diagnostics before any sales talk",
                  "Fair repair and install options",
                  "Second opinions on big quotes welcome",
                  "Clean, respectful work in your home",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-hm-charcoal">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-hm-red" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-hm-line bg-hm-fog p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-hm-red shadow-sm">
                    <ThermometerSun className="h-5 w-5" />
                  </span>
                  <p className="font-display text-lg font-bold text-hm-charcoal">
                    Climate In {area.name}
                  </p>
                </div>
                <p className="mt-3 leading-relaxed text-hm-muted">{area.climateNote}</p>
              </div>
              <div className="rounded-2xl border border-hm-line bg-hm-fog p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-hm-red shadow-sm">
                    <Home className="h-5 w-5" />
                  </span>
                  <p className="font-display text-lg font-bold text-hm-charcoal">
                    Homes We See Here
                  </p>
                </div>
                <p className="mt-3 leading-relaxed text-hm-muted">{area.housingNote}</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="fog">
        <Container>
          <Eyebrow>Why {area.name}</Eyebrow>
          <Heading className="mt-3 text-hm-charcoal">
            Why Homeowners In {area.name} Call How Much?
          </Heading>
          <p className="mt-3 max-w-2xl text-hm-muted">
            Local service with the same standard on every visit: clear answers, fair options, and
            zero pressure.
          </p>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {area.highlights.map((item, i) => {
              const Icon = highlightIcons[i % highlightIcons.length];
              return (
                <li
                  key={item.title}
                  className="flex h-full flex-col rounded-2xl border border-hm-line bg-white p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-hm-fog text-hm-red">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-display text-lg font-semibold text-hm-charcoal">
                    {item.title}
                  </p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-hm-muted">{item.body}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <PainPointsSection
        items={area.painPoints}
        title={`Common HVAC Issues In ${area.name}`}
        subtitle="If any of these sound like your home, you are in the right place."
      />
      <BenefitsListSection
        benefits={area.benefits}
        title={`What You Get With How Much? In ${area.name}`}
        subtitle="Family-owned HVAC built around integrity — not a hard sell."
      />

      <Section tone="white">
        <Container>
          <Eyebrow>Services In {area.name}</Eyebrow>
          <Heading className="mt-3 text-hm-charcoal">
            What We Can Help With In {area.name}
          </Heading>
          <p className="mt-3 max-w-2xl text-hm-muted">
            From emergency cooling failures to planned replacements and second opinions, How Much?
            covers the HVAC work {area.name} homeowners ask for most.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {localServices.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="rounded-2xl border border-hm-line bg-hm-fog p-5 transition hover:border-hm-red/40"
              >
                <p className="font-display text-lg font-bold text-hm-charcoal">
                  {service.shortName}
                </p>
                <p className="mt-2 text-sm text-hm-muted">{service.summary}</p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <ProcessSection steps={area.process} />

      <CtaBand
        title={`So, How Much In ${area.name}?`}
        body="Local service, transparent options, and zero pressure — whether you need a repair, second opinion, or full install."
        primaryHref="#quote"
      />

      <RelatedPosts posts={posts} title={`Guides For ${area.name} Homeowners`} />
      <InlineFaqs faqs={area.faqs} />

      <div id="quote">
        <QuoteAndReviewsSection heading={`Request Service In ${area.name}`} />
      </div>

      <OtherServicesSection slugs={area.popularServiceSlugs} />

      <Section tone="white">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Nearby In {area.region.replace(", CA", "")}</Eyebrow>
              <Heading className="mt-3 text-hm-charcoal">Other Cities We Serve</Heading>
            </div>
            <Button href="/service-areas" variant="outline" tone="light">
              See All Service Areas
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {nearby.map((a) => (
              <Link
                key={a.slug}
                href={`/service-areas/${a.slug}`}
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full border border-hm-line bg-hm-fog px-4 text-sm font-semibold text-hm-charcoal transition hover:border-hm-red/40 hover:text-hm-red"
              >
                {a.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <GuideDownloadBand />
    </SiteShell>
  );
}
