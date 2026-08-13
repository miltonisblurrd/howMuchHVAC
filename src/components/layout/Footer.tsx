import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { serviceAreas } from "@/lib/areas";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Our Team" },
  { href: "/partners", label: "Partners" },
  { href: "/projects", label: "Projects" },
  { href: "/brand", label: "Brand Assets" },
  { href: "/contact", label: "Contact" },
];

const resourceLinks = [
  { href: "/faqs", label: "FAQs" },
  { href: "/blog", label: "Blog" },
  { href: "/reviews", label: "Reviews" },
  { href: "/warranty", label: "Warranty" },
  { href: "/financing", label: "Financing" },
  { href: "/maintenance", label: "Maintenance Plans" },
  { href: "/second-opinion", label: "Second Opinion" },
  { href: "/booking", label: "Book / Get Quote" },
  { href: "/portal/login", label: "Client Portal" },
];

const locationGroups = [
  {
    title: "Orange County",
    areas: serviceAreas.filter((a) => a.regionKey === "oc"),
  },
  {
    title: "Los Angeles County",
    areas: serviceAreas.filter((a) => a.regionKey === "la"),
  },
  {
    title: "San Diego County",
    areas: serviceAreas.filter((a) => a.regionKey === "sd"),
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-hm-ink text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.1fr_2fr]">
          <div>
            <Logo variant="white" height={56} />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/65">
              {site.tagline} Licensed, insured, and built around integrity — not pressure.
            </p>
            <div className="mt-6 space-y-2 text-sm text-white/80">
              <p>
                <span className="text-white/45">Direct</span>{" "}
                <a
                  href={site.phones.direct.href}
                  className="font-semibold text-white transition hover:text-hm-red"
                >
                  {site.phones.direct.display}
                </a>
              </p>
              <p>
                <span className="text-white/45">Office</span>{" "}
                <a
                  href={site.phones.office.href}
                  className="font-semibold text-white transition hover:text-hm-red"
                >
                  {site.phones.office.display}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="transition hover:text-hm-red">
                  {site.email}
                </a>
              </p>
              <p className="pt-2 text-white/40">{site.license}</p>
            </div>
            <div className="mt-8">
              <Button href="/booking" tone="dark">
                Get Your Quote
              </Button>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
                Company
              </p>
              <ul className="mt-4 space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
                Services
              </p>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/services"
                    className="text-sm font-semibold text-white transition hover:text-hm-red"
                  >
                    All Services
                  </Link>
                </li>
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-sm text-white/70 transition hover:text-white"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
                Resources
              </p>
              <ul className="mt-4 space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Locations — full-width row for interlinking */}
        <div className="mt-14">
          <div>
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
              Locations
            </p>
            <p className="mt-2 text-sm text-white/55">
              HVAC service across Orange County, Los Angeles, and San Diego.
            </p>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {locationGroups.map((group) => (
              <div key={group.title}>
                <p className="font-display text-sm font-bold text-white">{group.title}</p>
                <ul className="mt-3 columns-2 gap-x-4 space-y-2">
                  {group.areas.map((area) => (
                    <li key={area.slug} className="break-inside-avoid">
                      <Link
                        href={`/service-areas/${area.slug}`}
                        className="text-sm text-white/65 transition hover:text-white"
                      >
                        {area.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/portal/login" className="hover:text-white">
              Client Portal
            </Link>
            <Link href="/admin/login" className="hover:text-white">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
