"use client";

import { useEffect, useState } from "react";

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** One short red-and-white burst. Plays once per storage key. */
export function PortalBurst({ storageKey }: { storageKey: string }) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (reducedMotion()) return;
    try {
      if (localStorage.getItem(storageKey)) return;
      localStorage.setItem(storageKey, "1");
    } catch {
      return;
    }
    setPlay(true);
    const timer = window.setTimeout(() => setPlay(false), 1100);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  if (!play) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {BITS.map((bit) => (
        <span
          key={bit.i}
          className="hm-burst-bit"
          style={{
            background: bit.i % 2 === 0 ? "var(--hm-red)" : "#fff",
            boxShadow: bit.i % 2 === 0 ? "none" : "0 0 0 1.5px var(--hm-red)",
            animationDelay: `${bit.delay}ms`,
            ["--hm-x" as string]: bit.x,
            ["--hm-y" as string]: bit.y,
          }}
        />
      ))}
    </div>
  );
}

const BITS = [
  { i: 0, x: "-120px", y: "-80px", delay: 0 },
  { i: 1, x: "110px", y: "-90px", delay: 20 },
  { i: 2, x: "-40px", y: "-130px", delay: 40 },
  { i: 3, x: "50px", y: "-120px", delay: 10 },
  { i: 4, x: "-160px", y: "10px", delay: 30 },
  { i: 5, x: "150px", y: "20px", delay: 50 },
  { i: 6, x: "-90px", y: "70px", delay: 15 },
  { i: 7, x: "80px", y: "90px", delay: 35 },
  { i: 8, x: "0px", y: "-150px", delay: 25 },
  { i: 9, x: "-20px", y: "110px", delay: 45 },
  { i: 10, x: "130px", y: "-30px", delay: 5 },
  { i: 11, x: "-140px", y: "-40px", delay: 55 },
] as const;
