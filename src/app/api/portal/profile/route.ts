import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSignedUrl } from "@/lib/portal-queries";

const patchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  phone: z.string().trim().max(40).optional().nullable(),
  address: z.string().trim().max(240).optional().nullable(),
  city: z.string().trim().max(120).optional().nullable(),
  onboardingCompleted: z.boolean().optional(),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const avatarUrl =
    profile.avatar_path && profile.avatar_bucket
      ? await getSignedUrl(profile.avatar_bucket, profile.avatar_path)
      : null;

  return NextResponse.json({ ok: true, profile: { ...profile, avatarUrl } });
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Check the form and try again" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const now = new Date().toISOString();
  const fullUpdate: Record<string, string | null> = {
    updated_at: now,
  };
  if (parsed.data.name !== undefined) fullUpdate.name = parsed.data.name;
  if (parsed.data.phone !== undefined) fullUpdate.phone = parsed.data.phone || null;
  if (parsed.data.address !== undefined) fullUpdate.address = parsed.data.address || null;
  if (parsed.data.city !== undefined) fullUpdate.city = parsed.data.city || null;
  if (parsed.data.onboardingCompleted === true) {
    fullUpdate.onboarding_completed_at = now;
  }
  if (parsed.data.onboardingCompleted === false) {
    fullUpdate.onboarding_completed_at = null;
  }

  let { data, error } = await admin
    .from("profiles")
    .update(fullUpdate)
    .eq("id", profile.id)
    .select("*")
    .single();

  if (error) {
    const fallback: Record<string, string | null> = { updated_at: now };
    if (parsed.data.name !== undefined) fallback.name = parsed.data.name;
    if (parsed.data.phone !== undefined) fallback.phone = parsed.data.phone || null;
    if (parsed.data.address !== undefined) {
      const line = [parsed.data.address, parsed.data.city].filter(Boolean).join(", ");
      fallback.address = line || parsed.data.address || null;
    }
    const retry = await admin.from("profiles").update(fallback).eq("id", profile.id).select("*").single();
    if (retry.error) {
      return NextResponse.json({ ok: false, error: retry.error.message }, { status: 500 });
    }
    data = retry.data;
  }

  return NextResponse.json({ ok: true, profile: data });
}
