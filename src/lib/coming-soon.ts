/** Marketing pages are on for review. Set NEXT_PUBLIC_COMING_SOON=true to put the cover back. */
export function comingSoonEnabled() {
  return process.env.NEXT_PUBLIC_COMING_SOON === "true";
}

export function isComingSoonExemptPath(pathname: string) {
  if (
    pathname.startsWith("/portal") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth")
  ) {
    return true;
  }
  if (pathname === "/coming-soon" || pathname === "/thank-you") return true;
  if (pathname === "/call" || pathname.startsWith("/call/")) return true;
  if (pathname === "/manifest.webmanifest" || pathname === "/manifest") return true;
  return false;
}
