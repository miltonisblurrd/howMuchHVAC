import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SKIP_DASH_SKEL_KEY, SKIP_PORTAL_SKEL_KEY } from "@/lib/admin-dashboard-skel";

function safeNext(next: string | null, fallback: string) {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("://")) {
    return fallback;
  }
  return next;
}

function loginPath(next: string) {
  return next.startsWith("/admin") ? "/admin/login" : "/portal/login";
}

function redirectAfterAuth(origin: string, next: string) {
  const res = NextResponse.redirect(`${origin}${next}`);
  if (next.startsWith("/admin")) {
    res.cookies.set(SKIP_DASH_SKEL_KEY, "1", { maxAge: 60, path: "/", sameSite: "lax" });
  }
  if (next.startsWith("/portal") || next.startsWith("/auth/reset-password")) {
    res.cookies.set(SKIP_PORTAL_SKEL_KEY, "1", { maxAge: 60, path: "/", sameSite: "lax" });
  }
  return res;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"), "/portal");

  if (code) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return redirectAfterAuth(origin, next);
      }
    }
  }

  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  if (token_hash && type) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.auth.verifyOtp({
        type: type as "magiclink" | "email" | "recovery",
        token_hash,
      });
      if (!error) {
        return redirectAfterAuth(origin, next);
      }
    }
  }

  return NextResponse.redirect(`${origin}${loginPath(next)}?error=auth`);
}
