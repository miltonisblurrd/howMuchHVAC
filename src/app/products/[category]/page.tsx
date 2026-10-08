import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import {
  categoryPath,
  getCategory,
  productCategories,
  productPath,
  productsInCategory,
} from "@/lib/products";

export function generateStaticParams() {
  return productCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.summary,
  };
}

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const items = productsInCategory(category.slug);

  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Products</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            {category.name}
          </Heading>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/75">{category.summary}</p>
          <Link
            href="/products"
            className="mt-6 inline-flex font-display text-sm font-semibold text-white/80 hover:text-white"
          >
            All products
          </Link>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product) => (
              <li key={product.slug} id={product.slug}>
                <Link
                  href={productPath(product)}
                  className="flex h-full flex-col items-center rounded-2xl bg-hm-fog px-4 py-5 text-center transition hover:bg-hm-line/60"
                >
                  <img
                    src={product.image}
                    alt=""
                    className="h-44 w-full object-contain"
                  />
                  <h2 className="mt-3 font-display text-sm font-semibold leading-snug">{product.name}</h2>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-2">
            {productCategories
              .filter((item) => item.slug !== category.slug)
              .map((item) => (
                <Link
                  key={item.slug}
                  href={categoryPath(item.slug)}
                  className="rounded-full border border-hm-line px-3 py-1.5 text-sm font-medium text-hm-charcoal hover:border-hm-red hover:text-hm-red"
                >
                  {item.name}
                </Link>
              ))}
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
