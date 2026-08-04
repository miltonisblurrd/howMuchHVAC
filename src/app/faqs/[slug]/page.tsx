import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { MdxContent } from "@/components/content/MdxContent";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { getFaq, getFaqs } from "@/lib/mdx";

export function generateStaticParams() {
  return getFaqs().map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const faq = getFaq(slug);
  if (!faq) return {};
  return { title: faq.title, description: faq.description };
}

export default async function FaqDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const faq = getFaq(slug);
  if (!faq) notFound();

  return (
    <SiteShell>
      <FaqJsonLd faqs={[{ question: faq.title, answer: faq.description }]} />
      <Section tone="dark" className="!pt-16 md:!pt-24 !pb-12">
        <Container>
          <Eyebrow className="text-hm-red">{faq.category ?? "FAQ"}</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            {faq.title}
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{faq.description}</p>
        </Container>
      </Section>
      <Section tone="white">
        <Container>
          <MdxContent source={faq.content} />
          <Button href="/booking" className="mt-12">
            Still have questions? Get a quote
          </Button>
        </Container>
      </Section>
    </SiteShell>
  );
}
