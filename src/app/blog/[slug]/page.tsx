import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { MdxContent } from "@/components/content/MdxContent";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import {
  Breadcrumbs,
  InlineFaqs,
  RelatedPosts,
} from "@/components/content/PageExtras";
import { getBlogPost, getBlogPosts, getRelatedPosts } from "@/lib/mdx";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified ?? post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  const related = getRelatedPosts(slug, 3);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.modified ?? post.date,
    author: {
      "@type": "Organization",
      name: site.legalName,
    },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
    },
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {post.faqs && post.faqs.length > 0 && <FaqJsonLd faqs={post.faqs} />}

      <Section tone="dark" className="!pt-16 md:!pt-24 !pb-12">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
          <Eyebrow className="text-hm-red">{post.category ?? "Blog"}</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            {post.title}
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{post.description}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/55">
            {post.date && (
              <p>
                <span className="text-white/35">Published </span>
                <time dateTime={post.date}>{post.date}</time>
              </p>
            )}
            {(post.modified ?? post.date) && (
              <p>
                <span className="text-white/35">Updated </span>
                <time dateTime={post.modified ?? post.date}>
                  {post.modified ?? post.date}
                </time>
              </p>
            )}
            {post.readingMinutes && <p>{post.readingMinutes} min read</p>}
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <MdxContent source={post.content} />
          <div className="mt-12 rounded-2xl bg-hm-fog p-8">
            <h2 className="font-display text-2xl font-bold text-hm-charcoal">
              Need a straight answer for your home?
            </h2>
            <p className="mt-2 text-hm-muted">
              Get a personalized quote — or ask for a second opinion on a quote you already have.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/booking">Get a quote</Button>
              <Button href="/second-opinion" variant="outline">
                Second opinion
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {post.faqs && post.faqs.length > 0 && <InlineFaqs faqs={post.faqs} />}
      <RelatedPosts posts={related} title="Related articles" />
    </SiteShell>
  );
}
