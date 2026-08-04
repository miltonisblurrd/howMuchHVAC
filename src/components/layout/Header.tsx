"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { navPrimary, site } from "@/lib/site";
import { cn } from "@/lib/cn";

export function Header({ tone = "light" }: { tone?: "light" | "dark" | "transparent" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (tone !== "transparent") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [tone]);

  const dark =
    tone === "dark" || (tone === "transparent" && !scrolled && !open);
  const solidLight = tone === "light" || (tone === "transparent" && (scrolled || open));

  return (
    <header
      className={cn(
        "z-50 w-full transition-colors duration-300",
        tone === "transparent" ? "fixed inset-x-0 top-0" : "relative",
        solidLight && "border-b border-hm-line bg-white/95 text-hm-charcoal backdrop-blur-md",
        tone === "dark" && "bg-hm-ink text-white",
        tone === "transparent" && !scrolled && !open && "bg-transparent text-white",
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
        <Logo
          variant={dark ? "white" : "regular"}
          priority
          height={dark ? 44 : 48}
        />

        <nav className="hidden items-center gap-6 lg:flex">
          {navPrimary.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "font-display text-[13px] font-semibold tracking-tight transition",
                  dark ? "text-white/75 hover:text-white" : "text-hm-muted hover:text-hm-charcoal",
                  active && (dark ? "text-white" : "text-hm-charcoal"),
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={site.phones.direct.href}
            className={cn(
              "inline-flex items-center gap-2 font-display text-sm font-bold",
              dark ? "text-white" : "text-hm-charcoal",
            )}
          >
            <Phone className="h-4 w-4 text-hm-red" />
            {site.phones.direct.display}
          </a>
          <Button href="/booking" size="sm" tone={dark ? "dark" : "light"}>
            Get a Quote
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

      {open && (
        <div className="border-t border-hm-line bg-white text-hm-charcoal lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-0.5 px-5 py-3">
            {navPrimary.map((item) => (
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
                href={site.phones.direct.href}
                className="font-display text-sm font-bold text-hm-red"
              >
                Direct {site.phones.direct.display}
              </a>
              <Button href="/booking" onClick={() => setOpen(false)}>
                Get a Quote
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
