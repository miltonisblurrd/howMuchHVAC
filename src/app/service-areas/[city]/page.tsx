import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
import { getArea, serviceAreas } from "@/lib/areas";
import { getBlogPosts } from "@/lib/mdx";

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
    title: `HVAC in ${area.name}`,
    description: area.description,
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
  const nearby = serviceAreas.filter((a) => a.slug !== area.slug).slice(0, 6);

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
                HVAC in {area.name}
              </Heading>
              <p className="mt-4 text-lg text-white/70">{area.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#quote" tone="dark">
                  Get a quote in {area.name}
                </Button>
                <Button href="/services" variant="outline" tone="dark">
                  Browse services
                </Button>
              </div>
            </div>
            <div className="relative h-72 overflow-hidden rounded-3xl md:h-96">
              <Image
                src={area.image}
                alt={`Homes in ${area.name}`}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <Eyebrow>Why {area.name}</Eyebrow>
          <Heading className="mt-3 text-hm-charcoal">
            Why homeowners in {area.name} call How Much?
          </Heading>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {area.highlights.map((item) => (
              <li key={item} className="rounded-2xl border border-hm-line bg-hm-fog p-6">
                <p className="font-display text-lg font-semibold text-hm-charcoal">{item}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <PainPointsSection
        items={area.painPoints}
        title={`Common HVAC issues in ${area.name}`}
        subtitle="If any of these sound like your home, you’re in the right place."
      />
      <BenefitsListSection benefits={area.benefits} />
      <ProcessSection steps={area.process} />

      <CtaBand
        title={`So, how much in ${area.name}?`}
        body="Local service, transparent options, and zero pressure — whether you need a repair, second opinion, or full install."
        primaryHref="#quote"
      />

      <RelatedPosts posts={posts} title={`Guides for ${area.name} homeowners`} />
      <InlineFaqs faqs={area.faqs} />

      <div id="quote">
        <QuoteAndReviewsSection heading={`Request service in ${area.name}`} />
      </div>

      <OtherServicesSection slugs={area.popularServiceSlugs} />

      <Section tone="white">
        <Container>
          <Eyebrow>Nearby</Eyebrow>
          <Heading className="mt-3 text-hm-charcoal">Other service areas</Heading>
          <div className="mt-6 flex flex-wrap gap-3">
            {nearby.map((a) => (
              <Link
                key={a.slug}
                href={`/service-areas/${a.slug}`}
                className="rounded-full border border-hm-line bg-hm-fog px-4 py-2 text-sm font-semibold text-hm-charcoal hover:border-hm-red/40"
              >
                {a.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
