import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { BookingWizard } from "@/components/forms/BookingWizard";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book / Get a Quote",
  description:
    "Schedule HVAC service or request a personalized quote from How Much? ? transparent options, no pressure.",
};

export default function BookingPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24 !pb-12">
        <Container>
          <Eyebrow className="text-hm-red">Book with How Much?</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            Let's make it easy
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Share a few details and we'll follow up with next steps. Prefer to talk now? Call
            direct at {site.phones.direct.display}.
          </p>
        </Container>
      </Section>
      <Section tone="fog" className="!pt-10">
        <Container>
          <BookingWizard />
        </Container>
      </Section>
    </SiteShell>
  );
}
