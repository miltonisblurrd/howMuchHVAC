import { NextResponse } from "next/server";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isPhotoLabel } from "@/lib/job-photos";
import { uploadJobFile } from "@/lib/uploads";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const form = await request.formData();
  const jobId = String(form.get("jobId") || "");
  const files = form.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);
  const labels = form.getAll("labels").map((item) => String(item));

  if (!jobId || !files.length) {
    return NextResponse.json({ ok: false, error: "Choose a photo" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: job } = await admin.from("jobs").select("id").eq("id", jobId).maybeSingle();
  if (!job) return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });

  if (String(form.get("purpose") || "") === "option") {
    const uploaded = await uploadJobFile({
      bucket: "job-photos",
      jobId,
      file: files[0],
      kind: "photo",
    });
    if (!uploaded.ok) return NextResponse.json({ ok: false, error: uploaded.error }, { status: 400 });
    return NextResponse.json({ ok: true, path: uploaded.path, bucket: "job-photos" });
  }

  const saved: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const raw = labels[i] || "On site";
    const label = isPhotoLabel(raw) ? raw : "On site";
    const uploaded = await uploadJobFile({
      bucket: "job-photos",
      jobId,
      file,
      kind: "photo",
    });
    if (!uploaded.ok) {
      return NextResponse.json(
        { ok: false, error: uploaded.error, saved: saved.length },
        { status: 400 },
      );
    }
    const { error } = await admin.from("job_photos").insert({
      job_id: jobId,
      label,
      storage_path: uploaded.path,
      bucket: "job-photos",
    });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    saved.push(label);
  }

  const count = saved.length;
  await admin.from("job_events").insert({
    job_id: jobId,
    title: "Photos added",
    detail: count === 1 ? "1 photo" : `${count} photos`,
  });

  return NextResponse.json({ ok: true, count });
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const photoId = String(body.photoId || "");
  if (!photoId) return NextResponse.json({ ok: false, error: "Missing photo" }, { status: 400 });

  const admin = getSupabaseAdmin();
  const { data: photo } = await admin.from("job_photos").select("*").eq("id", photoId).maybeSingle();
  if (!photo) return NextResponse.json({ ok: false, error: "Photo not found" }, { status: 404 });

  await admin.storage.from(photo.bucket || "job-photos").remove([photo.storage_path]);
  const { error } = await admin.from("job_photos").delete().eq("id", photoId);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
