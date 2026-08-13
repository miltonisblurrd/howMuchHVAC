import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Container, Heading, Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${site.legalName} — how we collect, use, and protect information from quote forms, booking requests, and client portal accounts.`,
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <Section tone="white" className="!pt-16 md:!pt-24">
        <Container className="max-w-3xl prose-hm">
          <Heading as="h1">Privacy Policy</Heading>
          <p className="mt-4 text-sm text-hm-muted">Last updated: August 2026</p>

          <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-hm-muted">
            <p>
              {site.legalName} (&quot;How Much?&quot;, &quot;we&quot;, &quot;us&quot;) respects your
              privacy. This policy explains what information we collect through our website,
              quote/booking forms, emails, texts, and client portal — and how we use it.
            </p>

            <div>
              <h2 className="font-display text-xl font-bold text-hm-charcoal">
                Information we collect
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  Contact details you submit (name, email, phone, city) through quote, booking, or
                  contact forms
                </li>
                <li>Service details and messages you include with a request</li>
                <li>
                  Technical data such as pages visited, referral/UTM parameters, and basic device
                  information needed to run the site securely
                </li>
                <li>
                  Client portal account information when you create or accept an invitation to the
                  portal (email, login credentials, job-related messages/documents)
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-hm-charcoal">
                How we use your information
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Respond to service requests and provide quotes or scheduling</li>
                <li>Send confirmations, follow-ups, and portal access instructions</li>
                <li>Improve our website, operations, and customer experience</li>
                <li>Comply with legal obligations and protect against fraud or abuse</li>
              </ul>
              <p className="mt-3">
                We do <strong className="text-hm-charcoal">not sell</strong> your personal
                information.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-hm-charcoal">
                Where data is stored
              </h2>
              <p className="mt-3">
                Lead and account data may be stored with trusted service providers (for example,
                our database host and email/SMS providers) under agreements that require them to
                protect your information. Access is limited to people who need it to serve your
                request.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-hm-charcoal">Communications</h2>
              <p className="mt-3">
                By submitting a form, you agree we may contact you by phone, email, or text about
                your request. Message/data rates may apply for SMS. You can ask us to stop marketing
                texts or emails anytime; we may still send transactional messages related to an
                active job or account.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-hm-charcoal">Your choices</h2>
              <p className="mt-3">
                California residents may request access to or deletion of personal information we
                hold, subject to legal exceptions. Contact us at{" "}
                <a href={`mailto:${site.email}`} className="font-semibold text-hm-red">
                  {site.email}
                </a>{" "}
                or call {site.phones.direct.display}.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-hm-charcoal">Contact</h2>
              <p className="mt-3">
                Questions about this policy:{" "}
                <a href={`mailto:${site.email}`} className="font-semibold text-hm-red">
                  {site.email}
                </a>
                <br />
                {site.legalName} · {site.license}
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
