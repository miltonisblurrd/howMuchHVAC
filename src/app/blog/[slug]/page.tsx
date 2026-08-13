import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { MdxContent } from "@/components/content/MdxContent";
import { BlogToc } from "@/components/blog/BlogToc";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import {
  Breadcrumbs,
  InlineFaqs,
  RelatedPosts,
} from "@/components/content/PageExtras";
import { extractMarkdownHeadings, formatBlogDate } from "@/lib/blog";
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
  const url = `${site.url}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      publishedTime: post.date,
      modifiedTime: post.modified ?? post.date,
      authors: [post.author ?? "Andy"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
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
  const headings = extractMarkdownHeadings(post.content);
  const author = post.author ?? "Andy";
  const published = formatBlogDate(post.date);
  const updated = formatBlogDate(post.modified ?? post.date);
  const showUpdated = Boolean(post.modified && post.modified !== post.date);
  const pageUrl = `${site.url}/blog/${post.slug}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.modified ?? post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    author: {
      "@type": "Person",
      name: author,
      jobTitle: "Owner",
      worksFor: {
        "@type": "Organization",
        name: site.legalName,
      },
    },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      url: site.url,
    },
    articleSection: post.category,
    keywords: post.tags?.join(", "),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: pageUrl },
    ],
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
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
          <Heading as="h1" className="mt-3 max-w-4xl text-white">
            {post.title}
          </Heading>
          <p className="mt-4 max-w-3xl text-lg text-white/70">{post.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/60">
            <span>By {author}</span>
            {published ? (
              <>
                <span className="text-white/30" aria-hidden>
                  ·
                </span>
                <time dateTime={post.date}>{published}</time>
              </>
            ) : null}
            {showUpdated && updated ? (
              <>
                <span className="text-white/30" aria-hidden>
                  ·
                </span>
                <span>
                  Updated <time dateTime={post.modified}>{updated}</time>
                </span>
              </>
            ) : null}
            {post.readingMinutes ? (
              <>
                <span className="text-white/30" aria-hidden>
                  ·
                </span>
                <span>{post.readingMinutes} min read</span>
              </>
            ) : null}
          </div>
        </Container>
      </Section>

      <Section tone="white" className="!pt-10 md:!pt-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[260px_minmax(0,1fr)]">
            {/* TOC — sticky on desktop, compact on mobile */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-hm-line bg-hm-fog/60 p-5 lg:border-0 lg:bg-transparent lg:p-0">
                <BlogToc headings={headings} />
              </div>
              <div className="mt-6 hidden rounded-2xl border border-hm-line bg-hm-fog p-5 lg:block">
                <p className="font-display text-sm font-bold text-hm-charcoal">
                  Need A Straight Answer?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-hm-muted">
                  Options first — repair, improve, or replace.
                </p>
                <Button href="/booking" size="sm" className="mt-4 w-full">
                  Get A Quote
                </Button>
              </div>
            </aside>

            <div className="min-w-0">
              {post.keyTakeaways && post.keyTakeaways.length > 0 ? (
                <div className="mb-10 rounded-2xl border border-hm-line bg-hm-fog p-6">
                  <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-hm-red">
                    Key Takeaways
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {post.keyTakeaways.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 text-[15px] leading-relaxed text-hm-charcoal"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-hm-red" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <MdxContent source={post.content} />

              <div className="mt-12 rounded-2xl border border-hm-line bg-hm-fog p-6 md:p-8">
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-hm-red">
                  About The Author
                </p>
                <h2 className="mt-2 font-display text-xl font-bold text-hm-charcoal">
                  {author} · How Much?
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-hm-muted">
                  {author} leads How Much? Air &amp; Home Improvements — a family-owned HVAC
                  company serving Orange County, Los Angeles, and San Diego. The goal is simple:
                  honest diagnostics, clear options, and pricing homeowners can actually
                  understand.
                </p>
                <Button href="/about" variant="outline" className="mt-5" size="sm">
                  Meet The Team
                </Button>
              </div>

              <div className="mt-8 rounded-2xl bg-hm-ink p-6 text-white md:p-8">
                <h2 className="font-display text-2xl font-bold">
                  Ready For A Clear Answer On Your Home?
                </h2>
                <p className="mt-2 text-white/70">
                  Get a personalized quote — or ask for a second opinion on a quote you already
                  have.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href="/booking" tone="dark" variant="secondary">
                    Get A Quote
                  </Button>
                  <Button href="/second-opinion" variant="outline" tone="dark">
                    Request A Second Opinion
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {post.faqs && post.faqs.length > 0 && <InlineFaqs faqs={post.faqs} />}
      <RelatedPosts posts={related} title="Related Articles" />
    </SiteShell>
  );
}
