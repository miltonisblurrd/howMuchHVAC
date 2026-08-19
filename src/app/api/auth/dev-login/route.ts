import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { DEV_LOGIN_PASSWORD, isDevLoginEnabled } from "@/lib/dev-auth";

const schema = z.object({
  email: z.string().trim().email(),
  next: z.enum(["/portal", "/admin"]).default("/portal"),
});

/** Local-only password sign-in. Never sends Auth email. */
export async function POST(request: Request) {
  if (!isDevLoginEnabled()) {
    return NextResponse.json({ ok: false, error: "Not available" }, { status: 404 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Enter a valid email" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const admin = getSupabaseAdmin();

  const { data: listed } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  let user = listed.users.find((u) => u.email?.toLowerCase() === email);

  if (!user) {
    const created = await admin.auth.admin.createUser({
      email,
      password: DEV_LOGIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        name: parsed.data.next === "/admin" ? "Andy" : email.split("@")[0],
        role: parsed.data.next === "/admin" ? "admin" : "customer",
      },
    });
    if (created.error || !created.data.user) {
      return NextResponse.json(
        { ok: false, error: created.error?.message || "Could not create user" },
        { status: 500 },
      );
    }
    user = created.data.user;
    await admin.from("profiles").upsert({
      id: user.id,
      email,
      name: parsed.data.next === "/admin" ? "Andy" : email.split("@")[0],
      role: parsed.data.next === "/admin" ? "admin" : "customer",
    });
  } else {
    await admin.auth.admin.updateUserById(user.id, { password: DEV_LOGIN_PASSWORD });
    if (parsed.data.next === "/admin") {
      await admin.from("profiles").update({ role: "admin" }).eq("id", user.id);
    }
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase is not configured" }, { status: 503 });
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: DEV_LOGIN_PASSWORD,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, next: parsed.data.next });
}
