import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { getBlogPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "HVAC guides from How Much? — pricing transparency, repair vs replace, air quality, and Southern California home comfort.",
};

export default function BlogPage() {
  const posts = getBlogPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    date: p.date,
    readingMinutes: p.readingMinutes,
  }));

  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Blog</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Straight answers for homeowners
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Practical HVAC guidance for Orange County, LA, and San Diego — written to be clear for
            people and useful for search.
          </p>
        </Container>
      </Section>
      <Section tone="white">
        <Container>
          <BlogIndex posts={posts} />
        </Container>
      </Section>
    </SiteShell>
  );
}
