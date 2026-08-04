import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { navFooter, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-hm-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.15fr_2fr] md:px-8 md:py-20">
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
          {navFooter.map((group) => (
            <div key={group.title}>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
                {group.title}
              </p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
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
          ))}
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
