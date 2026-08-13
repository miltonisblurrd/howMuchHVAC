import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { getFeaturedReviews } from "@/lib/reviews";
import { ReviewCard } from "@/components/content/ReviewCard";
import { site } from "@/lib/site";
import { team } from "@/lib/team";

export const metadata: Metadata = {
  title: "About How Much? | Family-Owned HVAC with Integrity",
  description:
    "How Much? Air & Home Improvements is a family-owned HVAC company serving Orange County, Los Angeles, and San Diego. Meet Andy and the team behind honest options and fair pricing.",
};

export default function AboutPage() {
  const featured = getFeaturedReviews(3);

  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">About How Much?</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Bringing Integrity Back Into HVAC
          </Heading>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/75">
            How Much? Air &amp; Home Improvements is a family-owned HVAC company built for
            homeowners who are done with scare tactics, mystery fees, and the runaround. We serve
            Orange County, Los Angeles, and San Diego with licensed work, clear options, and real
            accountability — because your home deserves the same care we give our own families.
          </p>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative h-80 overflow-hidden rounded-3xl md:h-[28rem]">
              <Image
                src="https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=1400&q=80"
                alt="Andy and the How Much? family"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
            <div>
              <Eyebrow>Meet Andy</Eyebrow>
              <Heading as="h2" className="mt-3 text-hm-charcoal">
                A Family Man Who Built A Company On Trust
              </Heading>
              <p className="mt-4 text-lg leading-relaxed text-hm-muted">
                Andy is a husband and dad — and he does not hide that. That family-first mindset is
                why How Much? treats your home with respect, explains options without pressure, and
                stands behind the work long after the truck leaves.
              </p>
              <p className="mt-4 leading-relaxed text-hm-muted">
                After years seeing the best and worst of this industry, he started How Much? to put
                customers first: fair pricing, lasting relationships, and accountability on every
                job. When another company jumps straight to a full system sell, Andy would rather
                show you what is actually broken — and what you can wait on.
              </p>
              <ul className="mt-6 space-y-2 text-hm-charcoal">
                <li>· Family-owned, {site.yearsExperience}+ years experience</li>
                <li>· {site.license}</li>
                <li>· Licensed, insured &amp; bonded</li>
                <li>· Google {site.google.rating} from homeowners who keep coming back</li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/team/andy">Andy&apos;s story</Button>
                <Button href="/booking" variant="outline">
                  Work with us
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="fog">
        <Container>
          <Eyebrow>How we work</Eyebrow>
          <Heading as="h2" className="mt-3 text-hm-charcoal">
            The How Much? Promise
          </Heading>
          <p className="mt-3 max-w-2xl text-hm-muted">
            We are not here to confuse you into a bigger ticket. We are here to get your home
            comfortable and help you understand every dollar before you spend it.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Options, Not Pressure",
                body: "Good / Better / Best when it matters — and a repair when that is smarter. You decide. We deliver.",
              },
              {
                title: "Transparent Process",
                body: "From diagnostic to install, you know the plan. Your client portal keeps status, messages, and documents in one place.",
              },
              {
                title: "Second Opinions Welcome",
                body: "Getting the runaround elsewhere? Bring us the quote. We will tell you what is fair, what is fear, and what can wait.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-hm-line bg-white p-6">
                <h3 className="font-display text-xl font-bold text-hm-charcoal">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-hm-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <Eyebrow>Who we serve</Eyebrow>
          <Heading as="h2" className="mt-3 text-hm-charcoal">
            Built For Southern California Homeowners
          </Heading>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <p className="text-lg leading-relaxed text-hm-muted">
              Whether you are inland baking through a heatwave, coastal dealing with marine air, or
              stuck between two scary quotes, How Much? is the family HVAC company that slows down
              enough to explain. We serve major cities across Orange County, Los Angeles County, and
              San Diego County — with the same standard everywhere we go.
            </p>
            <div className="rounded-2xl bg-hm-fog p-6">
              <p className="font-display font-bold text-hm-charcoal">What you can expect</p>
              <ul className="mt-4 space-y-3 text-hm-muted">
                <li>· A real diagnosis before any hard sell</li>
                <li>· Pricing you can understand before work begins</li>
                <li>· Clean, respectful crews in your home</li>
                <li>· Follow-up through a modern client portal experience</li>
                <li>· Direct access to Andy when you need a straight answer</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/service-areas">See service areas</Button>
            <Button href="/reviews" variant="outline">
              Read Google reviews
            </Button>
          </div>
        </Container>
      </Section>

      <Section tone="fog">
        <Container>
          <Eyebrow>Reviews</Eyebrow>
          <Heading as="h2" className="mt-3 text-hm-charcoal">
            Homeowners Say It Better Than We Can
          </Heading>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {featured.map((review) => (
              <ReviewCard key={review.id} review={review} clamp />
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Team</Eyebrow>
              <Heading as="h2" className="mt-3 text-hm-charcoal">
                The People Behind The Work
              </Heading>
            </div>
            <Button href="/team" variant="outline">
              Meet the full team
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.slice(0, 4).map((member) => (
              <Link
                key={member.slug}
                href={`/team/${member.slug}`}
                className="rounded-2xl border border-hm-line bg-hm-fog p-4 transition hover:border-hm-red/40"
              >
                <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-xl">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </div>
                <p className="font-display font-bold text-hm-charcoal">{member.name}</p>
                <p className="text-sm text-hm-muted">{member.role}</p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="fog">
        <Container className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-hm-charcoal px-6 py-8 text-white md:flex-row md:items-center md:px-10">
          <div>
            <p className="font-display text-xl font-bold">Ready for a clear answer?</p>
            <p className="mt-2 max-w-xl text-sm text-white/65">
              Tell us what is going on. We will follow up with options first — no pressure.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/booking" tone="dark">
              Get a quote
            </Button>
            <Button href={site.phones.direct.href} variant="outline" tone="dark">
              Call {site.phones.direct.display}
            </Button>
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
