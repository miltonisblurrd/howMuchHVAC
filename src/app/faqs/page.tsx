import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { getFaqs } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "FAQ pillars for How Much? HVAC — pricing, second opinions, maintenance, and what to expect.",
};

export default function FaqsPage() {
  const faqs = getFaqs();

  return (
    <SiteShell>
      <FaqJsonLd
        faqs={faqs.map((f) => ({
          question: f.title,
          answer: f.description,
        }))}
      />
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">FAQs</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Questions homeowners actually ask
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Pillar pages built for search and AI answers — clear, quotable, and honest.
          </p>
        </Container>
      </Section>
      <Section tone="white">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {faqs.map((faq) => (
              <Link
                key={faq.slug}
                href={`/faqs/${faq.slug}`}
                className="rounded-2xl border border-hm-line bg-hm-fog p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hm-red">
                  {faq.category}
                </p>
                <h2 className="mt-2 font-display text-xl font-bold">{faq.title}</h2>
                <p className="mt-3 text-sm text-hm-muted">{faq.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
