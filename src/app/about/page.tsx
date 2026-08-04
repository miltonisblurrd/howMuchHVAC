import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { site } from "@/lib/site";
import { getLeadership, team } from "@/lib/team";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet How Much? — family-owned HVAC built on integrity, transparency, and fair pricing across Southern California.",
};

export default function AboutPage() {
  const leadership = getLeadership();

  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">About How Much?</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Integrity back into HVAC
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            At How Much?, our mission is to bring integrity and transparency back into the HVAC
            industry. Family-owned. Licensed. Built for homeowners who are done getting the
            runaround.
          </p>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative h-80 overflow-hidden rounded-3xl md:h-[28rem]">
              <Image
                src="https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=1400&q=80"
                alt="Andy with family"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
            <div>
              <Eyebrow>Meet Andy</Eyebrow>
              <Heading as="h2" className="mt-3 text-hm-charcoal">
                A family man who built a company on trust
              </Heading>
              <p className="mt-4 text-lg text-hm-muted">
                Andy is a husband and dad — and he doesn’t mind showing it. That family-first
                mindset is why How Much? treats your home with respect, explains options without
                pressure, and stands behind the work.
              </p>
              <p className="mt-4 text-hm-muted">
                After years seeing the best and worst of this industry, he started How Much? to
                put customers first: fair pricing, lasting relationships, and accountability on
                every job.
              </p>
              <ul className="mt-6 space-y-2 text-hm-charcoal">
                <li>· Family-owned, {site.yearsExperience}+ years experience</li>
                <li>· {site.license}</li>
                <li>· Licensed, insured & bonded</li>
                <li>· Google {site.google.rating} from homeowners who keep coming back</li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/team/andy">Andy’s story</Button>
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
          <Heading as="h2" className="text-hm-charcoal">
            The How Much? promise
          </Heading>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Options, not pressure",
                body: "Good / Better / Best when it matters — and a repair when that’s smarter.",
              },
              {
                title: "Transparent process",
                body: "From diagnostic to install, you know the plan. The client portal makes progress visible.",
              },
              {
                title: "Second opinions welcome",
                body: "Getting the runaround elsewhere? Bring us the quote. We’ll tell you the truth.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-hm-line bg-white p-6">
                <h3 className="font-display text-xl font-bold text-hm-charcoal">{item.title}</h3>
                <p className="mt-3 text-hm-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <Eyebrow>Leadership</Eyebrow>
          <Heading as="h2" className="mt-3 text-hm-charcoal">
            The people running the company
          </Heading>
          <p className="mt-3 max-w-2xl text-hm-muted">
            Not a faceless call center — leadership you can put a name and face to.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {leadership.map((member) => (
              <Link
                key={member.slug}
                href={`/team/${member.slug}`}
                className="group overflow-hidden rounded-2xl border border-hm-line bg-hm-fog transition hover:border-hm-red/35"
              >
                <div className="relative h-56">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-hm-red">
                    {member.role}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-hm-charcoal">
                    {member.name}
                  </h3>
                  <p className="mt-2 text-sm text-hm-muted">{member.shortBio}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-hm-red">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="fog">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Our team</Eyebrow>
              <Heading as="h2" className="mt-3 text-hm-charcoal">
                Everyone behind the work
              </Heading>
              <p className="mt-3 max-w-xl text-hm-muted">
                Technicians, operations, and client experience — each with their own page so you
                know who’s coming to your home.
              </p>
            </div>
            <Button href="/team" variant="outline">
              View full team
            </Button>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Link
                key={member.slug}
                href={`/team/${member.slug}`}
                className="rounded-2xl border border-hm-line bg-white p-4 transition hover:border-hm-red/35"
              >
                <div className="relative mb-3 h-40 overflow-hidden rounded-xl">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="25vw"
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

      <Section tone="dark">
        <Container className="md:flex md:items-center md:justify-between">
          <div className="max-w-xl">
            <Heading as="h2" className="text-white">
              Ready to work with a team that shows up the same way every time?
            </Heading>
            <p className="mt-3 text-white/65">
              Call Andy direct or request a quote — options first, always.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
            <Button href="/booking" tone="dark">
              Get a quote
            </Button>
            <Button href={site.phones.direct.href} variant="outline" tone="dark">
              {site.phones.direct.display}
            </Button>
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
