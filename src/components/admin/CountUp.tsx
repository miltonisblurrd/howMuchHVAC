"use client";

import { useEffect, useState } from "react";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function formatLike(template: string, n: number) {
  if (!/\d/.test(template)) return template;
  const rounded = Math.round(n);
  if (template.includes("$")) {
    const money = `$${rounded.toLocaleString("en-US")}`;
    return /\$[\d,]+/.test(template) ? template.replace(/\$[\d,]+/, money) : money;
  }
  const formatted = rounded.toLocaleString("en-US");
  return template.replace(/-?\d[\d,]*/, formatted);
}

export function CountUp({
  value,
  className,
  duration = 900,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const target = Number(value.replace(/[^\d.-]/g, "")) || 0;
  const [display, setDisplay] = useState(target === 0 ? value : formatLike(value, 0));

  useEffect(() => {
    if (prefersReducedMotion() || target === 0) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(formatLike(value, target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, target, duration]);

  return <span className={className}>{display}</span>;
}

export function useChartReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReady(true);
      return;
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setReady(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return ready;
}
