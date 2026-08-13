import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container, Heading, Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for the ${site.legalName} website, quote requests, and client portal.`,
};

export default function TermsPage() {
  return (
    <SiteShell>
      <Section tone="white" className="!pt-16 md:!pt-24">
        <Container className="max-w-3xl">
          <Heading as="h1">Terms of Use</Heading>
          <p className="mt-4 text-sm text-hm-muted">Last updated: August 2026</p>

          <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-hm-muted">
            <p>
              Welcome to {site.legalName} (&quot;How Much?&quot;). By using trusthowmuch.com and
              related services (including quote forms and the client portal), you agree to these
              terms.
            </p>

            <div>
              <h2 className="font-display text-xl font-bold text-hm-charcoal">
                Website &amp; information
              </h2>
              <p className="mt-3">
                Content on this site is for general information about our HVAC services. Quotes,
                diagnostics, and final pricing are confirmed after we review your specific
                situation. Website estimates or examples are not a binding contract.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-hm-charcoal">
                Service requests
              </h2>
              <p className="mt-3">
                When you submit a form, you confirm the information is accurate and that we may
                contact you about your request by phone, email, or text. Submitting a request does
                not guarantee a same-day appointment; we will confirm availability when we follow
                up.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-hm-charcoal">Client portal</h2>
              <p className="mt-3">
                Portal access may be offered so you can track jobs, messages, and documents. You are
                responsible for keeping login credentials private. Do not share your account. We may
                suspend access if we detect misuse or security risk.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-hm-charcoal">
                Workmanship &amp; licensing
              </h2>
              <p className="mt-3">
                HVAC work is performed by licensed professionals under California license{" "}
                {site.license.replace("CA Lic ", "")}. Warranties, manufacturer coverage, and job
                specifics are provided with your project paperwork.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-hm-charcoal">
                Limitation of liability
              </h2>
              <p className="mt-3">
                To the fullest extent allowed by law, How Much? is not liable for indirect or
                consequential damages arising from use of the website. Nothing in these terms limits
                rights you have under California consumer law.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-hm-charcoal">Contact</h2>
              <p className="mt-3">
                Questions:{" "}
                <a href={`mailto:${site.email}`} className="font-semibold text-hm-red">
                  {site.email}
                </a>{" "}
                · Direct {site.phones.direct.display}
                <br />
                {site.legalName}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
