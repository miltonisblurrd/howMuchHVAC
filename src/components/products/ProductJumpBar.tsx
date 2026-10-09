"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

const links = [
  { id: "overview", label: "Overview" },
  { id: "install", label: "How it goes in" },
  { id: "facts", label: "Facts" },
  { id: "why", label: "Why this one" },
  { id: "questions", label: "Questions" },
  { id: "quote", label: "Get a quote" },
] as const;

export function ProductJumpBar() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<(typeof links)[number]["id"]>("overview");
  const [bar, setBar] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const id = visible[0]?.target.id;
        if (id && links.some((link) => link.id === id)) {
          setActive(id as (typeof links)[number]["id"]);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.2] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    const link = row?.querySelector<HTMLElement>(`[data-jump="${active}"]`);
    if (!row || !link) return;
    setBar({ left: link.offsetLeft, width: link.offsetWidth });
  }, [active]);

  return (
    <div className="sticky top-16 z-40 border-b border-hm-line bg-white/95 backdrop-blur md:top-20">
      <Container className="relative">
        <div ref={rowRef} className="relative flex gap-6 overflow-x-auto py-3 text-sm font-semibold">
          {links.map((link) => (
            <a
              key={link.id}
              data-jump={link.id}
              href={`#${link.id}`}
              className={cn(
                "shrink-0 pb-1",
                active === link.id
                  ? "text-hm-charcoal"
                  : link.id === "quote"
                    ? "text-hm-red"
                    : "text-hm-muted hover:text-hm-charcoal",
              )}
            >
              {link.label}
            </a>
          ))}
          <span
            aria-hidden
            className="hm-jump-bar pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-hm-red"
            style={{ left: bar.left, width: bar.width }}
          />
        </div>
      </Container>
    </div>
  );
}
