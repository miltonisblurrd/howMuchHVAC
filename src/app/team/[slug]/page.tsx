import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { Breadcrumbs } from "@/components/content/PageExtras";
import { getTeamMember, team } from "@/lib/team";

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) return {};
  return {
    title: `${member.name} ? ${member.role}`,
    description: member.shortBio,
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) notFound();

  const others = team.filter((m) => m.slug !== member.slug).slice(0, 3);

  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Team", href: "/team" },
              { label: member.name },
            ]}
          />
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="40vw"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <Eyebrow className="text-hm-red">{member.role}</Eyebrow>
              <Heading as="h1" className="mt-3 text-white">
                {member.name}
              </Heading>
              <p className="mt-4 text-lg text-white/70">{member.shortBio}</p>
              {member.yearsWithCompany != null && (
                <p className="mt-4 text-sm text-white/50">
                  {member.yearsWithCompany}+ years with How Much?
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/booking" tone="dark">
                  Work with our team
                </Button>
                <Button href="/team" variant="outline" tone="dark">
                  All team members
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Heading as="h2" className="text-hm-charcoal">
              About {member.name.split(" ")[0]}
            </Heading>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-hm-muted">
              {member.bio.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
            {member.funFact && (
              <div className="mt-8 rounded-2xl bg-hm-fog p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-hm-red">
                  Fun fact
                </p>
                <p className="mt-2 font-display text-lg font-semibold text-hm-charcoal">
                  {member.funFact}
                </p>
              </div>
            )}
          </div>
          <aside>
            <div className="rounded-2xl border border-hm-line bg-hm-fog p-6">
              <p className="font-display text-sm font-bold uppercase tracking-[0.16em] text-hm-muted">
                Specialties
              </p>
              <ul className="mt-4 space-y-2">
                {member.specialties.map((s) => (
                  <li key={s} className="font-medium text-hm-charcoal">
                    ? {s}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      </Section>

      <Section tone="fog">
        <Container>
          <Heading as="h2" className="text-hm-charcoal">
            More from the team
          </Heading>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {others.map((m) => (
              <Link
                key={m.slug}
                href={`/team/${m.slug}`}
                className="rounded-2xl border border-hm-line bg-white p-4"
              >
                <div className="relative mb-3 h-40 overflow-hidden rounded-xl">
                  <Image src={m.image} alt={m.name} fill sizes="33vw" className="object-cover" />
                </div>
                <p className="font-display font-bold">{m.name}</p>
                <p className="text-sm text-hm-muted">{m.role}</p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
