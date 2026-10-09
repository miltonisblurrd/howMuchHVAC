"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { NavMegaMenu } from "@/components/layout/NavMegaMenu";
import { getNavFeaturedAreas } from "@/lib/areas";
import { categoryPath, productCategories, productPath, productsInCategory } from "@/lib/products";
import { services } from "@/lib/services";
import { useContact } from "@/components/contact/ContactProvider";
import { cn } from "@/lib/cn";

const simpleNav = [{ href: "/about", label: "About" }] as const;

export function Header({ tone = "light" }: { tone?: "light" | "dark" | "transparent" }) {
  const contact = useContact();
  const pathname = usePathname();
  const shellRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [mobileCategory, setMobileCategory] = useState<string | null>(null);
  const featuredAreas = getNavFeaturedAreas();

  useEffect(() => {
    if (tone === "dark") return;
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [tone]);

  useEffect(() => {
    setOpen(false);
    setMobileSection(null);
    setMobileCategory(null);
  }, [pathname]);

  const dark =
    tone === "dark" || (tone === "transparent" && !scrolled && !open);
  const solidLight = tone === "light" || (tone === "transparent" && (scrolled || open));
  const tighten = scrolled && tone !== "dark";

  const linkClass = (active: boolean) =>
    cn(
      "inline-flex h-10 items-center font-display text-[13px] font-semibold leading-none tracking-tight transition",
      dark ? "text-white/75 hover:text-hm-red" : "text-hm-muted hover:text-hm-red",
      active && (dark ? "text-white" : "text-hm-charcoal"),
    );

  return (
    <header
      className={cn(
        "z-50 w-full transition-[background-color,box-shadow,color] duration-300",
        tone === "transparent" ? "fixed inset-x-0 top-0" : "sticky top-0",
        solidLight && "border-b border-hm-line bg-white/95 text-hm-charcoal backdrop-blur-md",
        tighten && "shadow-[0_12px_30px_-18px_rgba(18,21,26,0.45)]",
        tone === "dark" && "bg-hm-ink text-white",
        tone === "transparent" && !scrolled && !open && "bg-transparent text-white",
      )}
    >
      <div
        ref={shellRef}
        data-header-shell
        className="relative mx-auto max-w-6xl px-5 md:px-8"
      >
        <div
          className={cn(
            "flex items-center justify-between gap-4 transition-[height] duration-300",
            tighten ? "h-16" : "h-[4.25rem] md:h-20",
          )}
        >
          <Logo
            variant={dark ? "white" : "regular"}
            priority
            height={tighten ? 42 : dark ? 52 : 56}
          />

          <div className="hidden lg:block lg:translate-x-6 xl:translate-x-8">
            <NavMegaMenu
              dark={dark}
              shellRef={shellRef}
              trailingLinks={simpleNav.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link key={item.href} href={item.href} className={linkClass(active)}>
                    {item.label}
                  </Link>
                );
              })}
            />
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={contact.directHref}
              className={cn(
                "inline-flex h-10 items-center gap-2 font-display text-sm font-bold",
                dark ? "text-white" : "text-hm-charcoal",
              )}
            >
              <Phone className="h-4 w-4 text-hm-red" />
              {contact.directDisplay}
            </a>
            <Button href="/booking" size="sm" tone={dark ? "dark" : "light"}>
              Get A Quote
            </Button>
          </div>

          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-lg lg:hidden",
              dark ? "text-white" : "text-hm-charcoal",
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-4.25rem)] overflow-y-auto border-t border-hm-line bg-white text-hm-charcoal lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-0.5 px-5 py-3">
            {(
              [
                {
                  key: "services",
                  label: "Services",
                  href: "/services",
                  links: services.map((s) => ({
                    href: `/services/${s.slug}`,
                    label: s.name,
                  })),
                },
                {
                  key: "areas",
                  label: "Service Areas",
                  href: "/service-areas",
                  links: featuredAreas.map((a) => ({
                    href: `/service-areas/${a.slug}`,
                    label: a.name,
                  })),
                  cta: { href: "/service-areas", label: "See All Service Areas" },
                },
              ] as const
            ).map((section) => {
              const expanded = mobileSection === section.key;
              return (
                <div key={section.key} className="border-b border-hm-line/70 py-1">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 font-display text-base font-semibold"
                    onClick={() =>
                      setMobileSection((v) => (v === section.key ? null : section.key))
                    }
                    aria-expanded={expanded}
                  >
                    {section.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-hm-muted transition",
                        expanded && "rotate-180",
                      )}
                    />
                  </button>
                  {expanded && (
                    <div className="space-y-0.5 pb-3 pl-2">
                      <Link
                        href={section.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm font-semibold text-hm-red"
                      >
                        View All {section.label}
                      </Link>
                      {section.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm text-hm-charcoal hover:bg-hm-fog"
                        >
                          {link.label}
                        </Link>
                      ))}
                      {"cta" in section && section.cta ? (
                        <Link
                          href={section.cta.href}
                          onClick={() => setOpen(false)}
                          className="mt-1 block rounded-lg bg-hm-fog px-3 py-2.5 text-sm font-semibold text-hm-charcoal"
                        >
                          {section.cta.label} →
                        </Link>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="border-b border-hm-line/70 py-1">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 font-display text-base font-semibold"
                onClick={() =>
                  setMobileSection((current) => (current === "products" ? null : "products"))
                }
                aria-expanded={mobileSection === "products"}
              >
                Shop Equipment
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-hm-muted transition",
                    mobileSection === "products" && "rotate-180",
                  )}
                />
              </button>
              {mobileSection === "products" && (
                <div className="space-y-1 pb-3 pl-2">
                  <Link
                    href="/products"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-hm-red"
                  >
                    View All Products
                  </Link>
                  {productCategories.map((category) => {
                    const categoryOpen = mobileCategory === category.slug;
                    return (
                      <div key={category.slug}>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-hm-charcoal"
                          onClick={() =>
                            setMobileCategory((current) =>
                              current === category.slug ? null : category.slug,
                            )
                          }
                          aria-expanded={categoryOpen}
                        >
                          {category.name}
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-hm-muted transition",
                              categoryOpen && "rotate-180",
                            )}
                          />
                        </button>
                        {categoryOpen && (
                          <div className="grid grid-cols-2 gap-2 pb-2 pl-3">
                            {productsInCategory(category.slug).map((product) => (
                              <Link
                                key={product.slug}
                                href={productPath(product)}
                                onClick={() => setOpen(false)}
                                className="flex flex-col items-center rounded-2xl bg-hm-fog px-2 py-3 text-center"
                              >
                                <img
                                  src={product.image}
                                  alt=""
                                  className="h-24 w-full object-contain"
                                />
                                <span className="mt-2 text-xs font-semibold leading-snug text-hm-charcoal">
                                  {product.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {simpleNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-display text-base font-semibold hover:bg-hm-fog"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/portal/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 font-display text-base font-medium text-hm-muted"
            >
              Client Portal
            </Link>
            <div className="mt-2 flex flex-col gap-2 px-3 pb-3">
              <a
                href={contact.directHref}
                className="font-display text-sm font-bold text-hm-red"
              >
                Direct {contact.directDisplay}
              </a>
              <Button href="/booking" onClick={() => setOpen(false)}>
                Get A Quote
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
