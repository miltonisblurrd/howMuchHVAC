import { NextResponse } from "next/server";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSignedUrl } from "@/lib/portal-queries";
import { uploadJobFile } from "@/lib/uploads";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

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
  const update = {
    avatar_path: uploaded.path,
    avatar_bucket: "job-photos",
    updated_at: new Date().toISOString(),
  };
  const { error } = await admin.from("profiles").update(update).eq("id", profile.id);
  if (error) {
    return NextResponse.json(
      { ok: false, error: "Photo saved, but run the profile migration to keep it." },
      { status: 400 },
    );
  }

  const avatarUrl = await getSignedUrl("job-photos", uploaded.path);
  return NextResponse.json({ ok: true, avatarUrl, path: uploaded.path });
}
