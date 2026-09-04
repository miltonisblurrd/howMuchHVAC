import { NextResponse, type NextRequest } from "next/server";
import { comingSoonEnabled, isComingSoonExemptPath } from "@/lib/coming-soon";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (comingSoonEnabled() && !isComingSoonExemptPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/coming-soon";
    return NextResponse.rewrite(url);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)",
  ],
};
