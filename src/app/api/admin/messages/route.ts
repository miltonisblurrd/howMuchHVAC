import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendNewMessageEmail } from "@/lib/email";
import { site } from "@/lib/site";
import { getBusinessSettings } from "@/lib/business";

const schema = z.object({
  jobId: z.string().uuid(),
  body: z.string().trim().min(1).max(4000),
});

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid message" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: job } = await admin
    .from("jobs")
    .select("*, profiles!customer_id(name, email)")
    .eq("id", parsed.data.jobId)
    .maybeSingle();
  if (!job) return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });

  const { data: message, error } = await admin
    .from("messages")
    .insert({
      job_id: job.id,
      sender_id: profile.id,
      from_role: "admin",
      body: parsed.data.body,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const customer = job.profiles as { name?: string; email?: string } | null;
  if (customer?.email) {
    const settings = await getBusinessSettings();
    await sendNewMessageEmail({
      toEmail: customer.email,
      toName: customer.name || "there",
      fromLabel: settings.displayName,
      preview: parsed.data.body.slice(0, 280),
      portalUrl: `${site.url}/portal/messages`,
    });
  }

  return NextResponse.json({ ok: true, message });
}
