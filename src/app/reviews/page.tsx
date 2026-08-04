import type { Metadata } from "next";
import { Star } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { reviews } from "@/lib/reviews";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Read Google reviews for How Much? Air & Home Improvements, and leave a review on Google Business Profile.",
};

export default function ReviewsPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Reviews</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Trustworthy & reliable ? rated 5 stars for a reason
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Google {site.google.rating} average from homeowners across Southern California.
          </p>
          <Button
            href={site.google.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8"
            variant="secondary"
            tone="dark"
          >
            View on Google Maps
          </Button>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((review) => (
              <figure
                key={review.id}
                className="rounded-2xl border border-hm-line bg-hm-fog p-6"
              >
                <div className="flex gap-1 text-hm-red">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-hm-charcoal">?{review.quote}?</blockquote>
                <figcaption className="mt-4 font-display text-sm font-semibold">
                  {review.name}
                  <span className="mt-1 block text-xs font-medium text-hm-muted">
                    {review.source} Review
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="fog">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <Eyebrow>Share your experience</Eyebrow>
              <Heading as="h2" className="mt-3">
                Leave a review that lands on Google
              </Heading>
              <p className="mt-4 text-hm-muted">
                Draft your review here, then publish it on our Google Business Profile. That's the
                legitimate path Google supports ? and it helps the next homeowner trust How Much?.
              </p>
            </div>
            <ReviewForm />
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
