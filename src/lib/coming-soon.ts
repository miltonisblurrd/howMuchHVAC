/** Public marketing site stays behind the rebuild cover unless explicitly turned off. */
export function comingSoonEnabled() {
  return process.env.NEXT_PUBLIC_COMING_SOON !== "false";
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
  return false;
}
