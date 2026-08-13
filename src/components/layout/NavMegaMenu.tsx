"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { AirVent, ChevronDown, FolderKanban, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { getNavFeaturedAreas } from "@/lib/areas";
import { projects } from "@/lib/projects";
import { serviceIcons } from "@/lib/serviceIcons";
import { services } from "@/lib/services";

type MenuKey = "services" | "projects" | "areas" | null;

type NavMegaMenuProps = {
  dark: boolean;
  shellRef: RefObject<HTMLElement | null>;
  trailingLinks?: ReactNode;
};

export function NavMegaMenu({ dark, shellRef, trailingLinks }: NavMegaMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuKey>(null);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const prevOpen = useRef<MenuKey>(null);
  const baseId = useId();

  useEffect(() => setMounted(true), []);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  };

  const openMenu = (key: Exclude<MenuKey, null>) => {
    clearCloseTimer();
    setOpen(key);
  };

  useEffect(() => {
    setOpen(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    const items = itemsRef.current;
    if (!panel) return;

    const ctx = gsap.context(() => {
      if (open) {
        gsap.killTweensOf([panel, items?.children ?? []]);
        gsap.set(panel, { display: "block", autoAlpha: 0, y: -10 });
        gsap.to(panel, {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        });
        if (items) {
          gsap.fromTo(
            items.children,
            { autoAlpha: 0, y: 12 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.32,
              stagger: 0.025,
              delay: 0.05,
              ease: "power2.out",
            },
          );
        }
      } else if (prevOpen.current) {
        gsap.killTweensOf(panel);
        gsap.to(panel, {
          autoAlpha: 0,
          y: -8,
          duration: 0.22,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(panel, { display: "none" });
          },
        });
      } else {
        gsap.set(panel, { display: "none", autoAlpha: 0 });
      }
    });

    prevOpen.current = open;
    return () => ctx.revert();
  }, [open]);

  const triggerClass = (active: boolean) =>
    cn(
      "inline-flex h-10 items-center gap-1 font-display text-[13px] font-semibold leading-none tracking-tight transition",
      dark ? "text-white/75 hover:text-hm-red" : "text-hm-muted hover:text-hm-red",
      active && (dark ? "text-white" : "text-hm-charcoal"),
    );

  const areas = getNavFeaturedAreas();

  const renderPanel = useCallback(() => {
    if (open === "services") {
      return (
        <>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-hm-red">
                Services
              </p>
              <p className="mt-1 font-display text-lg font-bold text-hm-charcoal">
                Comfort Systems Done Right
              </p>
            </div>
            <Link
              href="/services"
              className="shrink-0 font-display text-sm font-semibold text-hm-red hover:underline"
              onClick={() => setOpen(null)}
            >
              View All Services ?
            </Link>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = serviceIcons[service.slug] ?? AirVent;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  onClick={() => setOpen(null)}
                  className="flex gap-3 rounded-xl px-3 py-3 transition hover:bg-hm-fog"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-hm-red/10 text-hm-red">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span>
                    <p className="font-display text-sm font-bold text-hm-charcoal">
                      {service.name}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-hm-muted">
                      {service.summary}
                    </p>
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      );
    }

    if (open === "projects") {
      return (
        <>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-hm-red">
                Projects
              </p>
              <p className="mt-1 font-display text-lg font-bold text-hm-charcoal">
                Proof In The Work
              </p>
            </div>
            <Link
              href="/projects"
              className="shrink-0 font-display text-sm font-semibold text-hm-red hover:underline"
              onClick={() => setOpen(null)}
            >
              View All Projects ?
            </Link>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                onClick={() => setOpen(null)}
                className="flex gap-3 rounded-xl px-3 py-3 transition hover:bg-hm-fog"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-hm-red/10 text-hm-red">
                  <FolderKanban className="h-[18px] w-[18px]" />
                </span>
                <span>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-hm-red">
                    {project.city}
                  </p>
                  <p className="mt-1 font-display text-sm font-bold text-hm-charcoal">
                    {project.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-hm-muted">
                    {project.summary}
                  </p>
                </span>
              </Link>
            ))}
          </div>
        </>
      );
    }

    if (open === "areas") {
      return (
        <>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-hm-red">
                Service Areas
              </p>
              <p className="mt-1 font-display text-lg font-bold text-hm-charcoal">
                Top Cities We Serve
              </p>
            </div>
            <Link
              href="/service-areas"
              className="shrink-0 font-display text-sm font-semibold text-hm-red hover:underline"
              onClick={() => setOpen(null)}
            >
              See All Service Areas ?
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-5">
            {areas.map((area) => (
              <Link
                key={area.slug}
                href={`/service-areas/${area.slug}`}
                onClick={() => setOpen(null)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-hm-charcoal transition hover:bg-hm-fog hover:text-hm-red"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-hm-red" />
                <span className="truncate">{area.name}</span>
              </Link>
            ))}
          </div>
          <div className="mt-5 border-t border-hm-line pt-4">
            <Link
              href="/service-areas"
              onClick={() => setOpen(null)}
              className="inline-flex items-center rounded-xl bg-hm-ink px-4 py-2.5 font-display text-sm font-bold text-white transition hover:bg-hm-charcoal"
            >
              See All Service Areas
            </Link>
            <p className="mt-2 text-xs text-hm-muted">
              Full OC, LA, and San Diego county directory.
            </p>
          </div>
        </>
      );
    }

    return null;
  }, [areas, open]);

  const triggers: {
    key: Exclude<MenuKey, null>;
    label: string;
    href: string;
  }[] = [
    { key: "services", label: "Services", href: "/services" },
    { key: "projects", label: "Projects", href: "/projects" },
    { key: "areas", label: "Service Areas", href: "/service-areas" },
  ];

  const panel =
    mounted && shellRef.current
      ? createPortal(
          <div
            ref={panelRef}
            id={`${baseId}-panel`}
            className="absolute inset-x-0 top-full z-50 hidden pt-3"
            onMouseEnter={clearCloseTimer}
            onMouseLeave={scheduleClose}
            style={{ display: "none" }}
          >
            <div className="overflow-hidden rounded-2xl border border-hm-line bg-white text-hm-charcoal shadow-[0_28px_80px_-28px_rgba(15,23,42,0.45)]">
              <div ref={itemsRef} className="p-5 md:p-6">
                {renderPanel()}
              </div>
            </div>
          </div>,
          shellRef.current,
        )
      : null;

  return (
    <>
      <div className="relative hidden items-center gap-6 lg:flex" onMouseLeave={scheduleClose}>
        {triggers.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const isOpen = open === item.key;
          return (
            <div
              key={item.key}
              className="flex items-center"
              onMouseEnter={() => openMenu(item.key)}
              onFocus={() => openMenu(item.key)}
            >
              <Link
                href={item.href}
                className={triggerClass(active || isOpen)}
                aria-expanded={isOpen}
                aria-controls={`${baseId}-panel`}
                onClick={() => setOpen(null)}
              >
                {item.label}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                />
              </Link>
            </div>
          );
        })}
        {trailingLinks}
      </div>
      {panel}
    </>
  );
}
