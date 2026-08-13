import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendLeadEmails } from "@/lib/email";
import { sendLeadSmsAlert } from "@/lib/sms";

const schema = z.object({
  service: z.string().trim().min(1).max(120),
  city: z.string().trim().max(120).optional().nullable(),
  message: z.string().trim().min(1).max(4000),
});

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const title = parsed.data.city
    ? `${parsed.data.service} ? ${parsed.data.city}`
    : `${parsed.data.service} request`;

  const { data: job, error } = await admin
    .from("jobs")
    .insert({
      customer_id: profile.id,
      title,
      status: "quote_request",
      service: parsed.data.service,
      city: parsed.data.city || null,
      summary: parsed.data.message,
    })
    .select("*")
    .single();

  if (error || !job) {
    return NextResponse.json({ ok: false, error: error?.message || "Failed" }, { status: 500 });
  }

  await admin.from("job_events").insert({
    job_id: job.id,
    title: "Service request",
    detail: "Customer submitted a new request from the portal.",
  });

  await admin.from("leads").insert({
    name: profile.name || profile.email,
    email: profile.email,
    phone: profile.phone,
    city: parsed.data.city || null,
    service: parsed.data.service,
    message: parsed.data.message,
    source_path: "/portal/request",
    source_label: "Portal request",
    status: "new",
    customer_id: profile.id,
    job_id: job.id,
  });

  await Promise.allSettled([
    sendLeadEmails({
      name: profile.name || profile.email,
      email: profile.email,
      phone: profile.phone,
      city: parsed.data.city,
      service: parsed.data.service,
      message: parsed.data.message,
      sourcePath: "/portal/request",
    }),
    sendLeadSmsAlert({
      name: profile.name || profile.email,
      phone: profile.phone,
      city: parsed.data.city,
      service: parsed.data.service,
    }),
  ]);

  return NextResponse.json({ ok: true, jobId: job.id });
}
