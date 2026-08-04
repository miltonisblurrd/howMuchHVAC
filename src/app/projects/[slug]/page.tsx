import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { getProject, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">
            {project.city} ? {project.service}
          </Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            {project.title}
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{project.summary}</p>
        </Container>
      </Section>
      <Section tone="white">
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative h-72 overflow-hidden rounded-2xl md:h-96">
              <Image src={project.beforeImage} alt="Before" fill className="object-cover" />
              <span className="absolute bottom-4 left-4 rounded bg-hm-ink/85 px-3 py-1 text-sm font-semibold text-white">
                Before
              </span>
            </div>
            <div className="relative h-72 overflow-hidden rounded-2xl md:h-96">
              <Image src={project.afterImage} alt="After" fill className="object-cover" />
              <span className="absolute bottom-4 left-4 rounded bg-hm-red px-3 py-1 text-sm font-semibold text-white">
                After
              </span>
            </div>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div>
              <h2 className="font-display text-xl font-bold">Challenge</h2>
              <p className="mt-3 text-hm-muted">{project.challenge}</p>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Solution</h2>
              <p className="mt-3 text-hm-muted">{project.solution}</p>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Outcome</h2>
              <p className="mt-3 text-hm-muted">{project.outcome}</p>
            </div>
          </div>
          <p className="mt-8 text-sm text-hm-muted">
            Brands: {project.brands.join(" ? ")}
          </p>
          <Button href="/booking" className="mt-8">
            Start a project like this
          </Button>
        </Container>
      </Section>
    </SiteShell>
  );
}
