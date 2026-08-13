"use client";

import { useEffect, useMemo, useState } from "react";
import type { BlogHeading } from "@/lib/blog";
import { cn } from "@/lib/cn";

export function BlogToc({
  headings,
  className,
}: {
  headings: BlogHeading[];
  className?: string;
}) {
  const h2s = useMemo(() => headings.filter((h) => h.level === 2), [headings]);
  const headingKey = h2s.map((h) => h.id).join("|");
  const [activeId, setActiveId] = useState<string>(h2s[0]?.id ?? "");

  useEffect(() => {
    if (!h2s.length) return;

    const elements = h2s
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headingKey, h2s]);

  if (!h2s.length) return null;

  return (
    <nav aria-label="Table of contents" className={cn(className)}>
      <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-hm-red">
        On This Page
      </p>
      <ol className="mt-4 space-y-1 border-l border-hm-line">
        {h2s.map((heading) => {
          const active = activeId === heading.id;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "block border-l-2 py-1.5 pl-3 text-sm leading-snug transition -ml-px",
                  active
                    ? "border-hm-red font-semibold text-hm-charcoal"
                    : "border-transparent text-hm-muted hover:border-hm-red/40 hover:text-hm-charcoal",
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
