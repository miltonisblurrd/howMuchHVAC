import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSignedUrl } from "@/lib/portal-queries";
import { uploadJobFile } from "@/lib/uploads";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: "Choose a photo" }, { status: 400 });
  }

  const uploaded = await uploadJobFile({
    bucket: "job-photos",
    jobId: `avatars/${profile.id}`,
    file,
    kind: "photo",
  });
  if (!uploaded.ok) {
    return NextResponse.json({ ok: false, error: uploaded.error }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const now = new Date().toISOString();
  await admin
    .from("profiles")
    .update({
      avatar_path: uploaded.path,
      avatar_bucket: "job-photos",
      updated_at: now,
    })
    .eq("id", profile.id);

  const { data: existing } = await admin.from("business_settings").select("id").eq("id", 1).maybeSingle();
  const { error } = existing
    ? await admin
        .from("business_settings")
        .update({
          avatar_path: uploaded.path,
          avatar_bucket: "job-photos",
          updated_at: now,
        })
        .eq("id", 1)
    : await admin.from("business_settings").insert({
        id: 1,
        display_name: profile.name || "Andy",
        avatar_path: uploaded.path,
        avatar_bucket: "job-photos",
        updated_at: now,
      });

  if (error) {
    return NextResponse.json(
      { ok: false, error: "Photo uploaded. Run 005_business_settings.sql to keep it on the business profile." },
      { status: 400 },
    );
  }

  revalidatePath("/", "layout");
  const avatarUrl = await getSignedUrl("job-photos", uploaded.path);
  return NextResponse.json({ ok: true, avatarUrl });
}
