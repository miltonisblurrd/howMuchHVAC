import { NextResponse } from "next/server";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
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
  const name = String(form.get("name") || "").trim();
  const docType = String(form.get("docType") || "Document").trim();
  const file = form.get("file");

  if (!jobId || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: "Choose a file" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: job } = await admin.from("jobs").select("id").eq("id", jobId).maybeSingle();
  if (!job) return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });

  const uploaded = await uploadJobFile({
    bucket: "job-documents",
    jobId,
    file,
    kind: "document",
  });
  if (!uploaded.ok) {
    return NextResponse.json({ ok: false, error: uploaded.error }, { status: 400 });
  }

  const { data: doc, error } = await admin
    .from("documents")
    .insert({
      job_id: jobId,
      name: name || file.name,
      doc_type: docType || "Document",
      storage_path: uploaded.path,
      bucket: "job-documents",
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  await admin.from("job_events").insert({
    job_id: jobId,
    title: "Document uploaded",
    detail: name || file.name,
  });

  return NextResponse.json({ ok: true, document: doc });
}
