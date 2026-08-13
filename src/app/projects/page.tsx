import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Recent How Much? HVAC projects across Orange County, Los Angeles, and San Diego — before/after, scope, and outcomes.",
};

export default function ProjectsPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Projects</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Recent Work Worth Showing
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Real jobs, clear outcomes. Stock photography stands in until Andy's project photos
            land.
          </p>
        </Container>
      </Section>
      <Section tone="white">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group overflow-hidden rounded-2xl border border-hm-line"
              >
                <div className="grid grid-cols-2">
                  <div className="relative h-44">
                    <Image src={project.beforeImage} alt="Before" fill className="object-cover" />
                    <span className="absolute bottom-3 left-3 rounded bg-hm-ink/80 px-2 py-1 text-xs font-semibold text-white">
                      Before
                    </span>
                  </div>
                  <div className="relative h-44">
                    <Image
                      src={project.afterImage}
                      alt="After"
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-3 left-3 rounded bg-hm-red px-2 py-1 text-xs font-semibold text-white">
                      After
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-red">
                    {project.city} ? {project.year}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-hm-muted">{project.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
