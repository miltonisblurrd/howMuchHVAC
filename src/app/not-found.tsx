import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Container, Heading, Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <SiteShell>
      <Section tone="dark" className="!py-28">
        <Container>
          <Heading as="h1" className="text-white">
            Page not found
          </Heading>
          <p className="mt-4 max-w-lg text-lg text-white/70">
            That link doesn't exist ? but we can still help with your HVAC question.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/">Go home</Button>
            <Button href="/booking" variant="outline" tone="dark">
              Get a quote
            </Button>
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
