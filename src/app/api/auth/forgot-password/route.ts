import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAuthEmailsEnabled } from "@/lib/auth-email";

const schema = z.object({
  email: z.string().trim().email(),
});

export async function POST(request: Request) {
  if (!supabaseAuthEmailsEnabled()) {
    return NextResponse.json(
      {
        ok: false,
        error: "Password reset email is paused until Resend SMTP is connected.",
      },
      { status: 503 },
    );
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Enter a valid email" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Reset is not configured" }, { status: 503 });
  }

  const origin = new URL(request.url).origin;
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email.toLowerCase(), {
    redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
  });

  if (error) {
    console.error("[auth] resetPasswordForEmail", error);
  }

  // Always succeed so we don't leak whether the email exists.
  return NextResponse.json({ ok: true });
}
