import Image from "next/image";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Heading, Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Brand Assets",
  description:
    "How Much? brand guidelines, logos, colors, typography, voice, and amplified social creative examples.",
};

const colors = [
  { name: "How Much Red", hex: "#FF1D25", usage: "CTAs, highlights (~10%)" },
  { name: "Coral Soft", hex: "#E56B6F", usage: "Secondary accent" },
  { name: "Charcoal", hex: "#222831", usage: "Primary surfaces & type" },
  { name: "Ink", hex: "#1A1A1A", usage: "Deep backgrounds" },
  { name: "Muted", hex: "#3F3D56", usage: "Wordmark / secondary type" },
  { name: "Light Gray", hex: "#EEEEEE", usage: "UI, callouts (~10%)" },
  { name: "White", hex: "#FFFFFF", usage: "Canvas / contrast" },
];

const socialExamples = [
  {
    title: "Did You Know ? Fun Fact",
    type: "Carousel opener",
    src: "/social/titleSlide.png",
    copy: "Did you know a dirty filter can cut airflow enough to mimic a failing A/C? Swap it before you panic-call.",
  },
  {
    title: "Info slide",
    type: "Educational",
    src: "/social/infoSlide.png",
    copy: "Tip: If one room is always hotter, the issue may be ducts ? not the outdoor unit.",
  },
  {
    title: "Before & After",
    type: "Proof",
    src: "/social/beforeAndAfter1stSlide.jpg",
    copy: "Old unit out. Carrier in. Same home, totally different comfort.",
  },
  {
    title: "Testimonial",
    type: "Trust",
    src: "/social/creativeOption1.jpg",
    copy: "Preschool director. Three years with How Much?. Still Andy's biggest fan.",
  },
  {
    title: "Proud Partner",
    type: "Credibility",
    src: "/social/creativeOption2.png",
    copy: "Proud partner ? Mitsubishi Electric. Ductless done right.",
  },
  {
    title: "Educational Q",
    type: "Authority",
    src: "/social/createOption3.png",
    copy: "What unit if you live in a desert climate? Start with capacity + efficiency, not brand hype.",
  },
  {
    title: "CTA",
    type: "Conversion",
    src: "/social/ctaSlide.png",
    copy: `Reach out at ${site.phones.direct.display} or DM us. ${site.social.hashtag}`,
  },
];

const amplifiedCreatives = [
  {
    title: "So, How Much?",
    body: "Pricing transparency carousel: what affects HVAC cost, what doesn't, and how we quote without games.",
  },
  {
    title: "Second Opinion",
    body: "Got a scary replacement quote? Slide series that invites homeowners to send it over for an honest read.",
  },
  {
    title: "Seasonal Checklist",
    body: "Pre-summer / pre-winter 5-slide checklist ending on book-maintenance CTA.",
  },
  {
    title: "License & Trust",
    body: "Static: CA license, insured/bonded, Google rating ? speech bubble frame, charcoal field, red accent rule.",
  },
];

export default function BrandPage() {
  return (
    <SiteShell>
      <Section tone="dark" className="!pt-16 md:!pt-24">
        <Container>
          <Eyebrow className="text-hm-red">Brand system ? v2.0</Eyebrow>
          <Heading as="h1" className="mt-3 text-white">
            How Much? brand assets
          </Heading>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Guidelines, logos, voice, and amplified social creatives ? so the brand stays
            established, trustworthy, and unmistakably How Much?.
          </p>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <Eyebrow>Mission</Eyebrow>
          <Heading as="h2" className="mt-3">
            Integrity and transparency
          </Heading>
          <p className="mt-4 max-w-3xl text-lg text-hm-muted">
            Bring integrity back into HVAC. Put customers first. Offer fair pricing. Build lasting
            relationships based on respect and accountability. Corporate-professional energy ?
            never ?one-man shop.?
          </p>
        </Container>
      </Section>

      <Section tone="fog">
        <Container>
          <Eyebrow>Logo</Eyebrow>
          <Heading as="h2" className="mt-3">
            Speech bubble is the hero
          </Heading>
          <p className="mt-3 max-w-2xl text-hm-muted">
            Clearspace, minimum size, and no distortion rules from the brand kit apply. Use the
            white logo on dark fields; regular on light; mark for small/thumbnail uses.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="flex items-center justify-center rounded-2xl border border-hm-line bg-white p-8">
              <Logo href={null} variant="regular" className="h-24 w-auto" />
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-hm-ink p-8">
              <Logo href={null} variant="white" className="h-24 w-auto" />
            </div>
            <div className="flex items-center justify-center rounded-2xl border border-hm-line bg-hm-gray p-8">
              <Logo href={null} variant="mark" className="h-20 w-auto" />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/brand/NEWREDLOGO.png" variant="outline">
              Download 3D bubble PNG
            </Button>
            <Button href="/brand/regularLogo.svg" variant="outline">
              Download regular SVG
            </Button>
            <Button href="/brand/whitelogo.svg" variant="outline">
              Download white SVG
            </Button>
            <Button href="/brand/blackSubLogo.svg" variant="outline">
              Download mark SVG
            </Button>
          </div>
          <ul className="mt-8 grid gap-3 text-sm text-hm-muted md:grid-cols-2">
            <li>· Don't skew, rotate, recolor, or stroke the logo</li>
            <li>· Don't rearrange bubble + wordmark</li>
            <li>· Don't place in a random colored box</li>
            <li>· Drop under-bubble text at very small sizes</li>
          </ul>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <Eyebrow>Color</Eyebrow>
          <Heading as="h2" className="mt-3">
            Small palette, strong hierarchy
          </Heading>
          <p className="mt-3 text-hm-muted">
            Red is scarce on purpose ? reserved for CTAs and emphasis.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {colors.map((color) => (
              <div key={color.hex} className="overflow-hidden rounded-2xl border border-hm-line">
                <div className="h-24" style={{ background: color.hex }} />
                <div className="bg-white p-4">
                  <p className="font-display font-semibold">{color.name}</p>
                  <p className="mt-1 font-mono text-xs text-hm-muted">{color.hex}</p>
                  <p className="mt-2 text-sm text-hm-muted">{color.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="fog">
        <Container>
          <Eyebrow>Typography</Eyebrow>
          <Heading as="h2" className="mt-3">
            Inter + Lato
          </Heading>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-hm-line bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-red">
                Headlines ? Inter
              </p>
              <p className="mt-4 font-display text-4xl font-bold tracking-tight">
                So, how much?
              </p>
              <p className="mt-3 font-display text-lg font-semibold text-hm-muted">
                Honest HVAC. Transparent pricing.
              </p>
            </div>
            <div className="rounded-2xl border border-hm-line bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-red">
                Body ? Lato
              </p>
              <p className="mt-4 text-lg leading-relaxed text-hm-muted">
                We explain options in plain English. No scripts. No mystery fees. Just the kind of
                service that makes homeowners say your name to their neighbors.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <Eyebrow>Voice</Eyebrow>
          <Heading as="h2" className="mt-3">
            Direct. Human. Zero games.
          </Heading>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { title: "Do", body: "Say the price drivers. Offer options. Invite second opinions." },
              { title: "Don't", body: "Fear-sell. Hide fees. Sound like a call-center script." },
              { title: "Signature", body: "Lead with the question the industry avoids: How much?" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-hm-line bg-hm-fog p-6">
                <h3 className="font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-hm-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="fog">
        <Container>
          <Eyebrow>Social creative</Eyebrow>
          <Heading as="h2" className="mt-3">
            Templates amplified
          </Heading>
          <p className="mt-3 max-w-2xl text-hm-muted">
            Your content types ? fun facts, before/after, testimonials, partners, CTAs ? with
            real brand-aligned example copy.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {socialExamples.map((item) => (
              <figure
                key={item.title}
                className="overflow-hidden rounded-2xl border border-hm-line bg-white"
              >
                <div className="relative aspect-square bg-hm-ink">
                  <Image src={item.src} alt={item.title} fill className="object-cover" />
                </div>
                <figcaption className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hm-red">
                    {item.type}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-hm-muted">{item.copy}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-12">
            <Heading as="h3">New creative directions</Heading>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {amplifiedCreatives.map((item) => (
                <div key={item.title} className="rounded-2xl bg-hm-charcoal p-6 text-white">
                  <h4 className="font-display text-xl font-bold">{item.title}</h4>
                  <p className="mt-2 text-white/70">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="dark">
        <Container className="md:flex md:items-center md:justify-between">
          <div>
            <Heading as="h2" className="text-white">
              Need the full PDF kit?
            </Heading>
            <p className="mt-3 text-white/70">
              Original guideline PDFs live in the project&apos;s brand-kit folder for your team.
            </p>
          </div>
          <Button href="/get-a-quote" variant="secondary" tone="dark" className="mt-6 md:mt-0">
            View ad landing
          </Button>
        </Container>
      </Section>
    </SiteShell>
  );
}
