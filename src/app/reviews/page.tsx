import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { ReviewCard } from "@/components/content/ReviewCard";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { getFeaturedReviews, reviews, reviewStats } from "@/lib/reviews";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reviews | How Much? Google Reviews",
  description:
    "Read real Google reviews for How Much? Air & Home Improvements — honest HVAC, fair options, and family-owned service across Orange County, Los Angeles, and San Diego.",
};

export default function ReviewsPage() {
  const featured = getFeaturedReviews(6);
  const rest = reviews.filter((r) => !featured.some((f) => f.id === r.id));

  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Google reviews</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Rated {reviewStats.average} Stars For A Reason
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Real homeowners. Real jobs. No scripts. How Much? is the family-owned HVAC team people
            call when they want honest options — not pressure.
          </p>
          <p className="mt-3 text-sm text-white/50">
            {site.google.reviewCount}+ reviews on Google · Showing {reviewStats.onSiteCount} on
            this page
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/booking" tone="dark">
              Get a clear quote
            </Button>
            <Button
              href={site.google.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              tone="dark"
            >
              View on Google
            </Button>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <Eyebrow>Featured</Eyebrow>
          <Heading as="h2" className="mt-3">
            Stories That Show How We Work
          </Heading>
          <p className="mt-3 max-w-2xl text-hm-muted">
            Heatwave rescues. Full-system installs in one day. Second opinions that saved thousands.
            This is what integrity looks like in the field.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((review, i) => (
              <ReviewCard
                key={review.id}
                review={review}
                tone={i === 0 ? "brand" : "light"}
                clamp
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="fog">
        <Container>
          <Eyebrow>More from Google</Eyebrow>
          <Heading as="h2" className="mt-3">
            More Homeowners. Same Standard.
          </Heading>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {rest.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <Eyebrow>Share your experience</Eyebrow>
              <Heading as="h2" className="mt-3">
                Leave A Review That Lands On Google
              </Heading>
              <p className="mt-4 text-hm-muted">
                Draft your review here, then publish it on our Google Business Profile. That&apos;s
                the legitimate path Google supports — and it helps the next homeowner trust How
                Much?.
              </p>
              <Button href="/booking" className="mt-6">
                Need service first? Get a quote
              </Button>
            </div>
            <ReviewForm />
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
