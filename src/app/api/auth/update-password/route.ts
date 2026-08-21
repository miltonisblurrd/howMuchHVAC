import { NextResponse } from "next/server";
import { z } from "zod";
import { getProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MIN_PASSWORD_LENGTH, validateNewPassword } from "@/lib/passwords";

const schema = z.object({
  password: z.string().min(MIN_PASSWORD_LENGTH).max(72),
  confirm: z.string().min(1),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` },
      { status: 400 },
    );
  }

  const mismatch = validateNewPassword(parsed.data.password, parsed.data.confirm);
  if (mismatch) {
    return NextResponse.json({ ok: false, error: mismatch }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Not configured" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Reset link expired. Request a new one." },
      { status: 401 },
    );
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  const profile = await getProfile(user.id);
  const next = profile?.role === "admin" ? "/admin" : "/portal";
  return NextResponse.json({ ok: true, next });
}
