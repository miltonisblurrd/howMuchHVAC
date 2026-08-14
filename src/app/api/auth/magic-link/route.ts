import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAuthEmailsEnabled } from "@/lib/auth-email";

const schema = z.object({
  email: z.string().trim().email(),
  next: z.enum(["/portal", "/admin"]).default("/portal"),
});

export async function POST(request: Request) {
  if (!supabaseAuthEmailsEnabled()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Sign-in email is paused until Resend SMTP is connected. Call Andy or wait for portal email to go live.",
      },
      { status: 503 },
    );
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Enter a valid email" }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase is not configured" }, { status: 503 });
  }
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email.toLowerCase(),
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${parsed.data.next}`,
    },
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
