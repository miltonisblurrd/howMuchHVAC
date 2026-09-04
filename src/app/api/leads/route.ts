import { NextResponse } from "next/server";
import { z } from "zod";
import { sendLeadEmails } from "@/lib/email";
import { sendLeadSmsAlert } from "@/lib/sms";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { provisionPortalFromLead } from "@/lib/portal-provision";
import { MIN_PASSWORD_LENGTH } from "@/lib/passwords";

const leadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().nullable(),
  city: z.string().trim().max(120).optional().nullable(),
  service: z.string().trim().max(120).optional().nullable(),
  message: z.string().trim().max(4000).optional().nullable(),
  password: z.string().min(MIN_PASSWORD_LENGTH).max(72).optional(),
  sourcePath: z.string().trim().max(300).optional().nullable(),
  sourceLabel: z.string().trim().max(120).optional().nullable(),
  utmSource: z.string().trim().max(120).optional().nullable(),
  utmMedium: z.string().trim().max(120).optional().nullable(),
  utmCampaign: z.string().trim().max(120).optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = leadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid lead payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const lead = parsed.data;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("leads")
      .insert({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || null,
        city: lead.city || null,
        service: lead.service || null,
        message: lead.message || null,
        source_path: lead.sourcePath || null,
        source_label: lead.sourceLabel || null,
        utm_source: lead.utmSource || null,
        utm_medium: lead.utmMedium || null,
        utm_campaign: lead.utmCampaign || null,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[leads] supabase insert failed", error);
      const msg = (error.message || "").toLowerCase();
      const missingTable =
        msg.includes("could not find the table") ||
        error.code === "42P01" ||
        (msg.includes("relation") && msg.includes("does not exist")) ||
        msg.includes("schema cache");

      return NextResponse.json(
        {
          ok: false,
          error: missingTable
            ? "Leads table missing. Run supabase/migrations/001_leads.sql in the Supabase SQL Editor."
            : "Could not save lead",
          details: error.message,
        },
        { status: 500 },
      );
    }

    let inviteUrl: string | null = null;
    let portal: { inviteSent: boolean; jobId?: string } = { inviteSent: false };
    const skipPortal =
      lead.sourceLabel === "Pricing guide download" || lead.sourceLabel === "Coming soon";

    if (!skipPortal) {
      try {
        const provisioned = await provisionPortalFromLead({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          city: lead.city,
          service: lead.service,
          message: lead.message,
          password: lead.password,
          leadId: data.id,
        });
        inviteUrl = provisioned.loginUrl;
        portal = {
          inviteSent: provisioned.inviteSent,
          jobId: provisioned.job.id,
        };
      } catch (provisionError) {
        console.error("[leads] portal provision failed", provisionError);
      }
    }

    const [emailResult, smsResult] = await Promise.allSettled([
      sendLeadEmails({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        city: lead.city,
        service: lead.service,
        message: lead.message,
        sourcePath: lead.sourcePath,
        portalLoginUrl: inviteUrl,
      }),
      sendLeadSmsAlert({
        name: lead.name,
        phone: lead.phone,
        city: lead.city,
        service: lead.service,
      }),
    ]);

    return NextResponse.json({
      ok: true,
      id: data.id,
      portal,
      email:
        emailResult.status === "fulfilled" ? emailResult.value : { sent: false, reason: "failed" },
      sms: smsResult.status === "fulfilled" ? smsResult.value : { sent: false, reason: "failed" },
    });
  } catch (error) {
    console.error("[leads] unexpected error", error);
    return NextResponse.json({ ok: false, error: "Unexpected server error" }, { status: 500 });
  }
}
