import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendNewMessageEmail } from "@/lib/email";
import { sendLeadSmsAlert } from "@/lib/sms";
import { site } from "@/lib/site";

const schema = z.object({
  jobId: z.string().uuid(),
  body: z.string().trim().min(1).max(4000),
});

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid message" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: job } = await admin
    .from("jobs")
    .select("*")
    .eq("id", parsed.data.jobId)
    .eq("customer_id", profile.id)
    .maybeSingle();

  if (!job) return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });

  const { data: message, error } = await admin
    .from("messages")
    .insert({
      job_id: job.id,
      sender_id: profile.id,
      from_role: "customer",
      body: parsed.data.body,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const notify = process.env.LEAD_NOTIFY_EMAIL || site.email;
  await Promise.allSettled([
    sendNewMessageEmail({
      toEmail: notify,
      toName: "Andy",
      fromLabel: profile.name || profile.email,
      preview: parsed.data.body.slice(0, 280),
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
