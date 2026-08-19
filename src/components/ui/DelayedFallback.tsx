"use client";

import { useEffect, useState, type ReactNode } from "react";

const armedById = new Map<string, boolean>();

function shouldAllowSkeleton(skipKey?: string, loginPath?: string) {
  if (typeof window === "undefined") return false;
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (nav?.type === "reload") return true;

  if (skipKey) {
    try {
      if (sessionStorage.getItem(skipKey) === "1") {
        sessionStorage.removeItem(skipKey);
        return false;
      }
    } catch {
      /* private mode */
    }

    if (document.cookie.split("; ").includes(`${skipKey}=1`)) {
      document.cookie = `${skipKey}=; Max-Age=0; Path=/`;
      return false;
    }
  }

  if (loginPath && document.referrer.includes(loginPath)) return false;
  return true;
}

/** Holds off on the skeleton so a fast login never flashes it. */
export function DelayedFallback({
  children,
  ms = 400,
  id = "default",
  skipKey,
  loginPath,
}: {
  children: ReactNode;
  ms?: number;
  id?: string;
  skipKey?: string;
  loginPath?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const armed = armedById.get(id) !== false;
    if (!armed || !shouldAllowSkeleton(skipKey, loginPath)) {
      armedById.set(id, false);
      return;
    }

    const t = window.setTimeout(() => setShow(true), ms);
    return () => {
      window.clearTimeout(t);
      armedById.set(id, false);
    };
  }, [id, loginPath, ms, skipKey]);

  if (!show) return null;
  return <>{children}</>;
}
