import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { site } from "@/lib/site";
import type { Profile } from "@/lib/db-types";
import { sendPortalInviteEmail } from "@/lib/email";

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || site.url;

export type ProvisionLeadInput = {
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  service?: string | null;
  message?: string | null;
  password?: string;
  leadId: string;
};

/**
 * Upsert auth user + profile and create a quote_request job.
 * New customers get the password they chose on the quote form.
 */
export async function provisionPortalFromLead(input: ProvisionLeadInput) {
  const admin = getSupabaseAdmin();
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const loginUrl = `${siteUrl()}/portal/login`;

  let profile = await findProfileByEmail(email);
  let createdUser = false;
  let inviteSent = false;

  if (!profile) {
    const { data: created, error } = await admin.auth.admin.createUser({
      email,
      ...(input.password ? { password: input.password } : {}),
      email_confirm: true,
      user_metadata: { name, role: "customer" },
    });

    if (error || !created.user) {
      const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const existing = listed.data.users.find((u) => u.email?.toLowerCase() === email);
      if (!existing) {
        throw new Error(error?.message || "Could not create portal user");
      }
      await admin.from("profiles").upsert({
        id: existing.id,
        email,
        name,
        phone: input.phone || null,
        role: "customer",
      });
      profile = await findProfileByEmail(email);
    } else {
      createdUser = true;
      await admin.from("profiles").upsert({
        id: created.user.id,
        email,
        name,
        phone: input.phone || null,
        role: "customer",
      });
      profile = (await findProfileByEmail(email))!;
    }
  } else {
    await admin
      .from("profiles")
      .update({
        name: profile.name || name,
        phone: input.phone || profile.phone,
      })
      .eq("id", profile.id);
  }

  if (!profile) throw new Error("Profile missing after provision");

  const serviceLabel = input.service?.trim() || "HVAC service";
  const title = input.city ? `${serviceLabel} — ${input.city}` : `${serviceLabel} request`;

  const summaryParts = [
    "We received your request. Andy's team will follow up with clear next steps.",
    input.message?.trim() ? `Your notes: ${input.message.trim()}` : null,
  ].filter(Boolean);

  const { data: job, error: jobError } = await admin
    .from("jobs")
    .insert({
      customer_id: profile.id,
      title,
      status: "quote_request",
      service: input.service || null,
      city: input.city || null,
      summary: summaryParts.join("\n\n"),
    })
    .select("*")
    .single();

  if (jobError || !job) {
    throw new Error(jobError?.message || "Could not create job");
  }

  await admin.from("job_events").insert({
    job_id: job.id,
    title: "Request received",
    detail:
      "Your quote request is in Andy's queue. Open your portal anytime to message us or add details.",
    event_at: new Date().toISOString(),
  });

  await admin
    .from("leads")
    .update({
      customer_id: profile.id,
      job_id: job.id,
    })
    .eq("id", input.leadId);

  if (createdUser) {
    await admin
      .from("profiles")
      .update({
        invited_at: new Date().toISOString(),
        invite_count: (profile.invite_count || 0) + 1,
      })
      .eq("id", profile.id);
    await admin
      .from("leads")
      .update({ portal_invited_at: new Date().toISOString() })
      .eq("id", input.leadId);
    inviteSent = true;
  }

  return {
    profile,
    job,
    createdUser,
    inviteSent,
    loginUrl,
    inviteLink: loginUrl,
  };
}

/** Andy resend: email a password-reset link so the customer can set or recover access. */
export async function sendPortalInvite(customerId: string, reason = "manual") {
  const admin = getSupabaseAdmin();
  const { data: profile } = await admin.from("profiles").select("*").eq("id", customerId).single();

  if (!profile) throw new Error("Customer not found");

  const link = await createPortalSetupLink(profile.email);
  const loginUrl = `${siteUrl()}/portal/login`;
  const emailResult = await sendPortalInviteEmail({
    name: profile.name || "there",
    email: profile.email,
    inviteUrl: link || loginUrl,
    isNew: !profile.invited_at,
    isPasswordSetup: Boolean(link),
  });

  if (emailResult.sent) {
    await admin
      .from("profiles")
      .update({
        invited_at: new Date().toISOString(),
        invite_count: (profile.invite_count || 0) + 1,
      })
      .eq("id", customerId);
  }

  return { sent: emailResult.sent, reason, inviteUrl: link || loginUrl, email: emailResult };
}

export async function createPortalSetupLink(email: string) {
  const admin = getSupabaseAdmin();
  const redirectTo = `${siteUrl()}/auth/callback?next=/auth/reset-password`;
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });
  if (error) {
    console.error("[portal] generate recovery link failed", error);
    return null;
  }
  return data.properties?.action_link || null;
}

async function findProfileByEmail(email: string): Promise<Profile | null> {
  const admin = getSupabaseAdmin();
  const { data } = await admin.from("profiles").select("*").eq("email", email).maybeSingle();
  return (data as Profile | null) ?? null;
}
