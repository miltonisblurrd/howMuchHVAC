import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createPortalSetupLink, provisionPortalFromLead } from "@/lib/portal-provision";
import { sendPhoneIntakeEmail } from "@/lib/email";
import { sendAppointmentSms } from "@/lib/sms";
import { formatWhen } from "@/lib/db-types";

export type PhoneIntakeInput = {
  name: string;
  email: string;
  phone: string;
  address?: string | null;
  city?: string | null;
  service?: string | null;
  notes?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  visitType?: "diagnostic" | "install" | "maintenance" | "follow_up";
  techName?: string | null;
};

export async function processPhoneIntake(input: PhoneIntakeInput) {
  const admin = getSupabaseAdmin();
  const city = input.city?.trim() || null;
  const address = input.address?.trim() || null;
  const noteParts = [
    address ? `Address: ${address}` : null,
    input.notes?.trim() || null,
    "Added by Andy from a phone call.",
  ].filter(Boolean);
  const message = noteParts.join("\n\n");

  const { data: lead, error: leadError } = await admin
    .from("leads")
    .insert({
      name: input.name,
      email: input.email.trim().toLowerCase(),
      phone: input.phone,
      city,
      service: input.service || null,
      message,
      source_path: "/call",
      source_label: "Phone call",
      status: "new",
    })
    .select("id")
    .single();

  if (leadError || !lead) {
    throw new Error(leadError?.message || "Could not save the lead.");
  }

  const provisioned = await provisionPortalFromLead({
    name: input.name,
    email: input.email,
    phone: input.phone,
    city,
    service: input.service,
    message,
    leadId: lead.id,
  });

  let whenLabel: string | null = null;
  if (input.startsAt && input.endsAt) {
    const insert = {
      job_id: provisioned.job.id,
      type: input.visitType || "diagnostic",
      starts_at: input.startsAt,
      ends_at: input.endsAt,
      status: "confirmed",
      booked_by: "admin",
      tech_name: input.techName || null,
    };
    let { error: apptError } = await admin.from("appointments").insert(insert);
    if (apptError) {
      const retry = await admin.from("appointments").insert({
        job_id: insert.job_id,
        type: insert.type,
        starts_at: insert.starts_at,
        ends_at: insert.ends_at,
        status: insert.status,
        booked_by: insert.booked_by,
      });
      apptError = retry.error;
    }
    if (!apptError) {
      whenLabel = formatWhen(input.startsAt);
      await admin
        .from("jobs")
        .update({ status: "scheduled", updated_at: new Date().toISOString() })
        .eq("id", provisioned.job.id);
      await admin.from("job_events").insert({
        job_id: provisioned.job.id,
        title: "First visit scheduled by Andy",
        detail: `${whenLabel}${input.techName ? ` ? ${input.techName}` : ""}`,
      });
      await sendAppointmentSms({
        toPhone: input.phone,
        whenLabel,
        jobTitle: provisioned.job.title,
      });
    }
  }

  const setupLink =
    (await createPortalSetupLink(provisioned.profile.email)) || provisioned.loginUrl;

  const emailResult = await sendPhoneIntakeEmail({
    name: input.name,
    email: provisioned.profile.email,
    service: input.service,
    city,
    whenLabel,
    inviteUrl: setupLink,
  });

  if (emailResult.sent) {
    await admin
      .from("profiles")
      .update({
        invited_at: new Date().toISOString(),
        invite_count: (provisioned.profile.invite_count || 0) + 1,
      })
      .eq("id", provisioned.profile.id);
    await admin
      .from("leads")
      .update({ portal_invited_at: new Date().toISOString() })
      .eq("id", lead.id);
  }

  return {
    leadId: lead.id,
    jobId: provisioned.job.id,
    emailSent: emailResult.sent,
    scheduled: Boolean(whenLabel),
    whenLabel,
  };
}
