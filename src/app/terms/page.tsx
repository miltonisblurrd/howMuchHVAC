import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container, Heading, Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <SiteShell>
      <Section tone="white" className="!pt-16 md:!pt-24">
        <Container className="max-w-3xl">
          <Heading as="h1">Terms of Service</Heading>
          <div className="mt-6 space-y-4 text-hm-muted">
            <p>
              Website content is provided for general information about {site.legalName} services.
              Quotes and work scopes are confirmed directly with our team.
            </p>
            <p>
              The client portal on this site is a demonstration experience and does not constitute
              a live account system until connected to production systems.
            </p>
            <p>{site.license}</p>
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
