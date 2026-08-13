import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getProfile } from "@/lib/auth";
import { supabaseAuthEmailsEnabled } from "@/lib/auth-email";
import { sendPortalInvite } from "@/lib/portal-provision";

const schema = z.object({
  customerId: z.string().uuid(),
});

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  if (!supabaseAuthEmailsEnabled()) {
    return NextResponse.json(
      {
        ok: false,
        error: "Portal invites are paused until Resend SMTP is connected.",
      },
      { status: 503 },
    );
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid customer" }, { status: 400 });
  }

  try {
    const result = await sendPortalInvite(parsed.data.customerId, "admin_resend");
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Invite failed" },
      { status: 500 },
    );
  }
}
