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
  leadId: string;
};

/**
 * Upsert auth user + profile, create a quote_request job, send magic-link invite.
 * If the customer already has an account, attach a new job and skip invite when they've signed in.
 */
export async function provisionPortalFromLead(input: ProvisionLeadInput) {
  const admin = getSupabaseAdmin();
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();

  let profile = await findProfileByEmail(email);
  let createdUser = false;
  let inviteSent = false;
  let inviteLink: string | null = null;

  if (!profile) {
    const { data: created, error } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { name, role: "customer" },
    });

    if (error || !created.user) {
      // Race: user may already exist in auth but profile missing
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
  const title = input.city
    ? `${serviceLabel} ? ${input.city}`
    : `${serviceLabel} request`;

  const summaryParts = [
    "We received your request. Andy?s team will follow up with clear next steps.",
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
    detail: "Your quote request is in Andy?s queue. Open your portal anytime to message us or add details.",
    event_at: new Date().toISOString(),
  });

  await admin
    .from("leads")
    .update({
      customer_id: profile.id,
      job_id: job.id,
    })
    .eq("id", input.leadId);

  // Invite if never signed in. generateLink does not send mail — Resend sends the URL.
  const { data: authUser } = await admin.auth.admin.getUserById(profile.id);
  const hasSignedIn = Boolean(authUser.user?.last_sign_in_at);

  if (!hasSignedIn) {
    const link = await generateMagicLink(email);
    inviteLink = link;
    if (link) {
      // Link is included in the lead confirmation email (caller sends it).
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
  }

  return {
    profile,
    job,
    createdUser,
    inviteSent,
    inviteLink,
    hasSignedIn,
  };
}

export async function sendPortalInvite(customerId: string, reason = "manual") {
  const admin = getSupabaseAdmin();
  const { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("id", customerId)
    .single();

  if (!profile) throw new Error("Customer not found");

  const link = await generateMagicLink(profile.email);
  if (!link) throw new Error("Could not generate invite link");

  const emailResult = await sendPortalInviteEmail({
    name: profile.name || "there",
    email: profile.email,
    inviteUrl: link,
    isNew: !profile.invited_at,
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

  return { sent: emailResult.sent, reason, inviteUrl: link, email: emailResult };
}

async function generateMagicLink(email: string) {
  const admin = getSupabaseAdmin();
  const redirectTo = `${siteUrl()}/auth/callback?next=/portal`;
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });
  if (error) {
    console.error("[portal] generateLink failed", error);
    return null;
  }
  // Prefer action_link from Supabase; falls back to constructing from hashed_token
  const actionLink = data.properties?.action_link;
  if (actionLink) return actionLink;
  return null;
}

async function findProfileByEmail(email: string): Promise<Profile | null> {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("profiles")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  return (data as Profile | null) ?? null;
}
