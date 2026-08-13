import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { team } from "@/lib/team";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the How Much? leadership and technicians ? the people behind honest HVAC across Southern California.",
};

export default function TeamPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Team</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            The People Behind How Much?
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Corporate-level transparency: every team member has a page. Know who?s leading,
            who?s installing, and who?s looking out for your experience.
          </p>
        </Container>
      </Section>
      <Section tone="white">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <Link
                key={member.slug}
                href={`/team/${member.slug}`}
                className="group overflow-hidden rounded-2xl border border-hm-line bg-hm-fog transition hover:border-hm-red/35"
              >
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-hm-red">
                    {member.role}
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-hm-charcoal">
                    {member.name}
                  </h2>
                  <p className="mt-2 text-sm text-hm-muted">{member.shortBio}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-hm-red">
                    View profile ?
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
