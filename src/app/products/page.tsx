import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { CallAndy } from "@/components/contact/CallAndy";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { categoryPath, productCategories, productPath, productsInCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Mr. Cool Products",
  description:
    "Shop Mr. Cool heating and cooling equipment through How Much?. Mini-splits, central systems, thermostats, and more, with a quote or an install from Andy.",
};

export default function ProductsPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Products</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Mr. Cool equipment, through How Much?
          </Heading>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/75">
            The same product families Andy is authorized to sell. Pick a system, build the
            install the way you want it, and send it in. How Much? can sell you the equipment or
            install it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/booking" tone="dark">
              Get a quote
            </Button>
            <CallAndy variant="outline" tone="dark" />
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid gap-8">
            {productCategories.map((category) => {
              const items = productsInCategory(category.slug);
              return (
                <section key={category.slug} className="border-b border-hm-line pb-8 last:border-0">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight">{category.name}</h2>
                      <p className="mt-2 max-w-2xl text-hm-muted">{category.summary}</p>
                    </div>
                    <Link
                      href={categoryPath(category.slug)}
                      className="font-display text-sm font-semibold text-hm-red hover:underline"
                    >
                      View {category.name}
                    </Link>
                  </div>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((product) => (
                      <li key={product.slug}>
                        <Link
                          href={productPath(product)}
                          className="flex h-full flex-col items-center rounded-2xl bg-hm-fog px-4 py-5 text-center transition hover:bg-hm-line/60"
                        >
                          <img
                            src={product.image}
                            alt=""
                            className="h-40 w-full object-contain"
                          />
                          <span className="mt-3 font-display text-sm font-semibold leading-snug">
                            {product.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
