import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { site } from "@/lib/site";
import { getPublicContact } from "@/lib/business";

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getPublicContact();
  return {
    title: `Contact How Much? | Call ${contact.displayName} or Request a Quote`,
    description: `Contact How Much? Air & Home Improvements. Call ${contact.displayName} direct at ${contact.directDisplay}, office ${contact.officeDisplay}, or request a quote online for HVAC service in OC, LA, and San Diego.`,
  };
}

export default async function ContactPage() {
  const contact = await getPublicContact();
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <Eyebrow className="text-hm-red">Contact</Eyebrow>
            <Heading as="h1" className="mt-3 text-white">
              Talk To How Much?
            </Heading>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70">
              Real people. Clear answers. Whether your AC failed today or you want a second opinion
              on a big quote, reach {contact.displayName}&apos;s team the way that works for you.
            </p>
            <div className="mt-8 space-y-5 text-white/80">
              <p>
                <span className="text-white/50">Direct ({contact.displayName})</span>
                <br />
                <a
                  href={contact.directHref}
                  className="font-display text-2xl font-bold text-white"
                >
                  {contact.directDisplay}
                </a>
              </p>
              <p>
                <span className="text-white/50">Office</span>
                <br />
                <a
                  href={contact.officeHref}
                  className="font-display text-2xl font-bold text-white"
                >
                  {contact.officeDisplay}
                </a>
              </p>
              <p>
                <span className="text-white/50">Email</span>
                <br />
                <a href={`mailto:${contact.publicEmail}`} className="text-lg text-white">
                  {contact.publicEmail}
                </a>
              </p>
              {contact.officeAddress ? (
                <p>
                  <span className="text-white/50">Shop</span>
                  <br />
                  <span className="text-white">{contact.officeAddress}</span>
                </p>
              ) : null}
              <p className="text-sm text-white/50">{site.license} · Family-owned HVAC</p>
            </div>
            <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5 text-sm leading-relaxed text-white/65">
              After you submit a request online, we save it securely and follow up with next steps.
              You will also get a path to create your client portal so job status, messages, and
              documents stay organized.
            </div>
          </div>
          <QuoteForm sourceLabel="Contact page" />
        </Container>
      </Section>
    </SiteShell>
  );
}
