import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { reviews } from "@/lib/reviews";
import { services } from "@/lib/services";
import type { MdxDoc } from "@/lib/mdx";

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/55">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ) : (
              <span className="text-white/80">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PainPointsSection({
  items,
  title = "Sound familiar?",
  subtitle = "These are the reasons homeowners call How Much?",
}: {
  items: { title: string; body: string }[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <Section tone="fog">
      <Container>
        <Eyebrow>Pain points</Eyebrow>
        <Heading className="mt-3 text-hm-charcoal">{title}</Heading>
        <p className="mt-3 max-w-2xl text-hm-muted">{subtitle}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-hm-line bg-white p-6 shadow-sm"
            >
              <h3 className="font-display text-lg font-bold text-hm-charcoal">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-hm-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function ProcessSection({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <Section tone="white">
      <Container>
        <Eyebrow>Process</Eyebrow>
        <Heading className="mt-3 text-hm-charcoal">How it works</Heading>
        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="relative">
              <span className="font-display text-3xl font-extrabold text-hm-red/25">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-hm-charcoal">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-hm-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

export function BenefitsListSection({
  benefits,
  expect,
}: {
  benefits: string[];
  expect?: string[];
}) {
  return (
    <Section tone="white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          {expect && expect.length > 0 && (
            <div>
              <Eyebrow>What you can expect</Eyebrow>
              <Heading as="h2" className="mt-3 text-hm-charcoal">
                Our standard on every job
              </Heading>
              <ul className="mt-6 space-y-3">
                {expect.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-hm-red" />
                    <span className="text-hm-charcoal">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <Eyebrow>Benefits</Eyebrow>
            <Heading as="h2" className="mt-3 text-hm-charcoal">
              Why homeowners choose this service
            </Heading>
            <ul className="mt-6 space-y-3">
              {benefits.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-hm-red" />
                  <span className="text-hm-charcoal">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function InlineFaqs({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  if (!faqs.length) return null;
  return (
    <Section tone="fog">
      <Container>
        <Eyebrow>FAQs</Eyebrow>
        <Heading className="mt-3 text-hm-charcoal">Common questions</Heading>
        <div className="mt-8 divide-y divide-hm-line rounded-2xl border border-hm-line bg-white">
          {faqs.map((faq) => (
            <details key={faq.question} className="group px-6 py-5">
              <summary className="cursor-pointer list-none font-display text-base font-bold text-hm-charcoal marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="text-hm-red transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-hm-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function RelatedPosts({
  posts,
  title = "Related articles",
}: {
  posts: MdxDoc[];
  title?: string;
}) {
  if (!posts.length) return null;
  return (
    <Section tone="white">
      <Container>
        <Eyebrow>Learn more</Eyebrow>
        <Heading className="mt-3 text-hm-charcoal">{title}</Heading>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-2xl border border-hm-line bg-hm-fog p-5 transition hover:border-hm-red/35"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-hm-red">
                {post.category}
              </p>
              <h3 className="mt-2 font-display text-lg font-bold text-hm-charcoal">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-hm-muted">{post.description}</p>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function QuoteAndReviewsSection({
  heading = "Ready for a clear answer?",
}: {
  heading?: string;
}) {
  const featured = reviews.filter((r) => r.featured).slice(0, 3);
  return (
    <>
      <Section tone="dark">
        <Container className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow className="text-hm-red">Get a quote</Eyebrow>
            <Heading className="mt-3 text-white">{heading}</Heading>
            <p className="mt-4 text-white/65">
              Tell us what?s going on. We?ll follow up with next steps ? options first, no
              pressure.
            </p>
          </div>
          <QuoteForm elevated />
        </Container>
      </Section>
      <Section tone="white">
        <Container>
          <Eyebrow>Reviews</Eyebrow>
          <Heading className="mt-3 text-hm-charcoal">What homeowners say</Heading>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {featured.map((review) => (
              <figure
                key={review.id}
                className="rounded-2xl border border-hm-line bg-hm-fog p-6"
              >
                <blockquote className="text-sm leading-relaxed text-hm-charcoal">
                  ?{review.quote}?
                </blockquote>
                <figcaption className="mt-4 font-display text-sm font-bold">
                  {review.name}
                  <span className="mt-1 block text-xs font-medium text-hm-muted">
                    Google Review ? 5.0
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <Button href="/reviews" variant="outline" className="mt-8">
            Read more reviews
          </Button>
        </Container>
      </Section>
    </>
  );
}

export function OtherServicesSection({
  currentSlug,
  slugs,
}: {
  currentSlug?: string;
  slugs?: string[];
}) {
  const list = slugs?.length
    ? services.filter((s) => slugs.includes(s.slug))
    : services.filter((s) => s.slug !== currentSlug).slice(0, 6);

  return (
    <Section tone="fog">
      <Container>
        <Eyebrow>More services</Eyebrow>
        <Heading className="mt-3 text-hm-charcoal">Explore other HVAC solutions</Heading>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group overflow-hidden rounded-2xl border border-hm-line bg-white"
            >
              <div className="relative h-36">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-hm-charcoal">{service.shortName}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-hm-muted">{service.summary}</p>
              </div>
            </Link>
          ))}
        </div>
        <Button href="/services" variant="outline" className="mt-8">
          View all services
        </Button>
      </Container>
    </Section>
  );
}

export function CtaBand({
  title,
  body,
  primaryHref = "/booking",
  primaryLabel = "Get a personalized quote",
}: {
  title: string;
  body: string;
  primaryHref?: string;
  primaryLabel?: string;
}) {
  return (
    <Section tone="dark" className="!py-14">
      <Container className="md:flex md:items-center md:justify-between md:gap-8">
        <div className="max-w-xl">
          <Heading as="h2" className="text-white">
            {title}
          </Heading>
          <p className="mt-3 text-white/65">{body}</p>
        </div>
        <Button href={primaryHref} className="mt-6 md:mt-0" tone="dark">
          {primaryLabel}
        </Button>
      </Container>
    </Section>
  );
}
