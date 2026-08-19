import { NextResponse } from "next/server";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendNewMessageEmail } from "@/lib/email";
import { sendLeadSmsAlert } from "@/lib/sms";
import { site } from "@/lib/site";
import { getBusinessSettings } from "@/lib/business";
import { uploadJobFile, withPhotoMarker } from "@/lib/uploads";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const contentType = request.headers.get("content-type") || "";
  let jobId = "";
  let body = "";
  let photo: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    jobId = String(form.get("jobId") || "");
    body = String(form.get("body") || "").trim();
    const file = form.get("photo");
    photo = file instanceof File && file.size > 0 ? file : null;
  } else {
    const json = (await request.json().catch(() => null)) as { jobId?: string; body?: string } | null;
    jobId = json?.jobId || "";
    body = (json?.body || "").trim();
  }

  if (!jobId || (!body && !photo)) {
    return NextResponse.json({ ok: false, error: "Write a message or attach a photo" }, { status: 400 });
  }
  if (body.length > 4000) {
    return NextResponse.json({ ok: false, error: "Message is too long" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: job } = await admin
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("customer_id", profile.id)
    .maybeSingle();

  if (!job) return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });

  let storedBody = body || "Photo attached";
  if (photo) {
    const uploaded = await uploadJobFile({
      bucket: "job-photos",
      jobId: job.id,
      file: photo,
      kind: "photo",
    });
    if (!uploaded.ok) {
      return NextResponse.json({ ok: false, error: uploaded.error }, { status: 400 });
    }
    await admin.from("job_photos").insert({
      job_id: job.id,
      label: photo.name || "Customer photo",
      storage_path: uploaded.path,
      bucket: "job-photos",
    });
    storedBody = withPhotoMarker(uploaded.path, body);
  }

  const { data: message, error } = await admin
    .from("messages")
    .insert({
      job_id: job.id,
      sender_id: profile.id,
      from_role: "customer",
      body: storedBody,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const settings = await getBusinessSettings();
  const notify = settings.notifyEmail || process.env.LEAD_NOTIFY_EMAIL || site.email;
  const preview = (body || "Sent a photo").slice(0, 280);
  await Promise.allSettled([
    sendNewMessageEmail({
      toEmail: notify,
      toName: settings.displayName,
      fromLabel: profile.name || profile.email,
      preview,
      portalUrl: `${site.url}/admin/messages?job=${job.id}`,
    }),
    sendLeadSmsAlert({
      name: `Portal msg: ${profile.name || profile.email}`,
      phone: profile.phone,
      city: job.city,
      service: job.service,
    }),
  ]);

  return NextResponse.json({ ok: true, message });
}
