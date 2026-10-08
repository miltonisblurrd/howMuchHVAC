import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { ProductQuoteForm } from "@/components/products/ProductQuoteForm";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { getProductDetail, getProductStory } from "@/lib/product-details";
import { getProductShowcase } from "@/lib/product-showcase";
import {
  catalogProducts,
  categoryPath,
  getCategory,
  getProduct,
  productPath,
  productScenes,
  productsInCategory,
} from "@/lib/products";

export function generateStaticParams() {
  return catalogProducts.map((product) => ({
    category: product.categorySlug,
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const product = getProduct(category, slug);
  const detail = product ? getProductDetail(product.slug) : undefined;
  if (!product || !detail) return {};
  return { title: product.name, description: detail.summary };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;
  const product = getProduct(categorySlug, slug);
  const category = getCategory(categorySlug);
  const detail = product ? getProductDetail(product.slug) : undefined;
  if (!product || !category || !detail) notFound();
  const scenes = productScenes(product.slug);
  const story = getProductStory(product.slug);
  const showcase = getProductShowcase(product.slug);
  const related = productsInCategory(category.slug).filter((item) => item.slug !== product.slug);

  return (
    <SiteShell headerTone="transparent">
      <section className="relative min-h-[78vh] overflow-hidden bg-hm-ink text-white">
        <img
          src={scenes.hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-hm-ink via-hm-ink/55 to-hm-ink/20" />
        <Container className="relative flex min-h-[78vh] flex-col justify-end pb-14 pt-32">
          <Eyebrow className="text-white/80">{category.name}</Eyebrow>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-bold tracking-tight md:text-6xl">
            {product.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">{detail.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#quote"
              className="inline-flex h-12 items-center rounded-full bg-hm-red px-6 font-display text-sm font-bold text-white"
            >
              Get a quote
            </a>
            <a
              href="#buy"
              className="inline-flex h-12 items-center rounded-full bg-white px-6 font-display text-sm font-bold text-hm-charcoal"
            >
              Buy now
            </a>
          </div>
        </Container>
      </section>

      <div className="sticky top-16 z-40 border-b border-hm-line bg-white/95 backdrop-blur md:top-20">
        <Container className="flex gap-6 overflow-x-auto py-3 text-sm font-semibold">
          <a href="#overview" className="text-hm-charcoal">
            Overview
          </a>
          <a href="#install" className="text-hm-muted hover:text-hm-charcoal">
            How it goes in
          </a>
          <a href="#facts" className="text-hm-muted hover:text-hm-charcoal">
            Facts
          </a>
          <a href="#why" className="text-hm-muted hover:text-hm-charcoal">
            Why this one
          </a>
          <a href="#questions" className="text-hm-muted hover:text-hm-charcoal">
            Questions
          </a>
          <a href="#quote" className="text-hm-red">
            Get a quote
          </a>
        </Container>
      </div>

      <Section id="overview" tone="white">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="rounded-3xl bg-hm-fog px-8 py-10">
              <img src={product.image} alt="" className="mx-auto h-80 w-full object-contain" />
            </div>
            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-hm-red">
                What you are getting
              </p>
              <ul className="mt-4 space-y-4">
                {detail.points.map((point) => (
                  <li key={point} className="text-lg leading-relaxed text-hm-charcoal">
                    {point}
                  </li>
                ))}
              </ul>
              <dl className="mt-8 grid gap-3 sm:grid-cols-2">
                {detail.specs.map((spec) => (
                  <div key={spec.label} className="rounded-2xl border border-hm-line px-4 py-4">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-hm-muted">
                      {spec.label}
                    </dt>
                    <dd className="mt-1 font-display text-base font-bold">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href={categoryPath(category.slug)}
                className="mt-6 inline-flex text-sm font-semibold text-hm-red"
              >
                All {category.name}
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="install" tone="fog">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-hm-red">
                How it goes in
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">{story.installTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-hm-muted">{story.installBody}</p>
              <ol className="mt-8 space-y-5">
                {story.steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="font-display text-2xl font-bold text-hm-red">0{index + 1}</span>
                    <span>
                      <span className="block font-display text-lg font-bold">{step.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-hm-muted">{step.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <img src={scenes.secondary} alt="" className="h-[28rem] w-full rounded-[2rem] object-cover" />
          </div>
        </Container>
      </Section>

      <Section id="facts" tone="white">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tight">The facts that matter</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {story.facts.map((fact) => (
              <article key={fact.title} className="rounded-2xl bg-hm-fog px-5 py-6">
                <h3 className="font-display text-lg font-bold">{fact.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-hm-muted">{fact.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="why" tone="white" className="!pt-4">
        <Container>
          <Eyebrow>Why this one</Eyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight">{showcase.title}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-hm-muted">{showcase.intro}</p>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {showcase.cards.map((card, index) =>
              index === 1 ? (
                <article
                  key={card.title}
                  className="flex min-h-[34rem] flex-col rounded-[1.75rem] bg-[#f3efe6] p-6 md:p-8"
                >
                  <h3 className="font-display text-2xl font-bold tracking-tight">{card.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-hm-charcoal/80">{card.body}</p>
                  <img src={card.image} alt="" className="mt-6 h-56 w-full object-contain object-bottom" />
                </article>
              ) : (
                <article key={card.title} className="relative min-h-[34rem] overflow-hidden rounded-[1.75rem]">
                  <img src={card.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/15" />
                  <div className="relative flex h-full min-h-[34rem] flex-col justify-end p-6 text-white md:p-8">
                    <h3 className="font-display text-2xl font-bold tracking-tight">{card.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-white/90">{card.body}</p>
                  </div>
                </article>
              ),
            )}
          </div>
          {showcase.parts ? (
            <div className="mt-16">
              <h2 className="font-display text-3xl font-bold tracking-tight">{showcase.partsTitle}</h2>
              <p className="mt-3 max-w-3xl text-lg leading-relaxed text-hm-muted">{showcase.partsIntro}</p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {showcase.parts.map((part) => (
                  <li key={part.title} className="rounded-2xl border border-hm-line px-4 py-5">
                    <h3 className="font-display text-base font-bold">{part.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-hm-muted">{part.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </Section>

      <Section id="questions" tone="white" className="!pt-0">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tight">Questions</h2>
          <div className="mt-6 divide-y divide-hm-line border-y border-hm-line">
            {story.faqs.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="cursor-pointer list-none font-display text-lg font-bold">
                  {faq.question}
                </summary>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-hm-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section tone="fog">
          <Container>
            <h2 className="font-display text-3xl font-bold tracking-tight">Other {category.name}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={productPath(item)}
                    className="flex h-full flex-col items-center rounded-2xl bg-white px-4 py-5 text-center"
                  >
                    <img src={item.image} alt="" className="h-32 w-full object-contain" />
                    <span className="mt-3 font-display text-sm font-semibold">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section tone="dark">
        <Container>
          <div id="buy">
            <ProductQuoteForm productName={product.name} sizes={detail.sizes} />
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
