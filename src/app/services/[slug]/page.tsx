import Image from "next/image";
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
import { getBlogPosts } from "@/lib/mdx";
import { getService, services } from "@/lib/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const posts = getBlogPosts().filter((p) => service.relatedBlogSlugs.includes(p.slug));

  return (
    <SiteShell>
      <FaqJsonLd faqs={service.faqs} />
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: service.name },
            ]}
          />
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Eyebrow className="text-hm-red">HVAC service</Eyebrow>
              <Heading as="h1" className="mt-3 text-white">
                {service.name}
              </Heading>
              <p className="mt-4 text-lg text-white/70">{service.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#quote" tone="dark">
                  Get a quote
                </Button>
                <Button href="/second-opinion" variant="outline" tone="dark">
                  Need a second opinion?
                </Button>
              </div>
            </div>
            <div className="relative h-72 overflow-hidden rounded-3xl md:h-96">
              <Image
                src={service.image}
                alt={service.name}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </Container>
      </Section>

      <PainPointsSection items={service.painPoints} />
      <BenefitsListSection benefits={service.benefits} expect={service.expect} />
      <ProcessSection steps={service.process} />

      <CtaBand
        title={`So, how much for ${service.shortName}?`}
        body="Every home is different. We’ll diagnose, explain, and give you clear options — so you know exactly what you’re paying for."
      />

      <RelatedPosts posts={posts} title="Helpful guides for this service" />
      <InlineFaqs faqs={service.faqs} />

      <div id="quote">
        <QuoteAndReviewsSection heading={`Get pricing for ${service.shortName}`} />
      </div>

      <OtherServicesSection currentSlug={service.slug} />
    </SiteShell>
  );
}
