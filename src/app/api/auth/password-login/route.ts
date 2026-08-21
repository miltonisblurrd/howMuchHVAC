import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { SKIP_DASH_SKEL_KEY, SKIP_PORTAL_SKEL_KEY } from "@/lib/admin-dashboard-skel";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
  next: z.enum(["/portal", "/admin"]).default("/portal"),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Enter your email and password" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Sign-in is not configured" }, { status: 503 });
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.password,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: "Email or password is incorrect." },
      { status: 401 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign-in failed" }, { status: 401 });
  }

  if (parsed.data.next === "/admin") {
    const profile = await getProfile(user.id);
    if (!profile || profile.role !== "admin") {
      await supabase.auth.signOut();
      return NextResponse.json(
        { ok: false, error: "This account is not an admin." },
        { status: 403 },
      );
    }
  }

  const res = NextResponse.json({ ok: true, next: parsed.data.next });
  if (parsed.data.next === "/admin") {
    res.cookies.set(SKIP_DASH_SKEL_KEY, "1", { maxAge: 60, path: "/", sameSite: "lax" });
  } else {
    res.cookies.set(SKIP_PORTAL_SKEL_KEY, "1", { maxAge: 60, path: "/", sameSite: "lax" });
  }
  return res;
}
