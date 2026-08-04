import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container, Heading, Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <Section tone="white" className="!pt-16 md:!pt-24">
        <Container className="max-w-3xl">
          <Heading as="h1">Privacy Policy</Heading>
          <div className="mt-6 space-y-4 text-hm-muted">
            <p>
              {site.legalName} collects contact information you submit through quote and booking
              forms to respond to service requests. We do not sell your personal information.
            </p>
            <p>
              Demo portal data is fictional seed content for product walkthroughs and is not tied
              to real customer accounts.
            </p>
            <p>
              Questions:{" "}
              <a href={`mailto:${site.email}`} className="text-hm-red">
                {site.email}
              </a>
            </p>
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
