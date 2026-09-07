import { Resend } from "resend";
import { site } from "@/lib/site";
import { getBusinessSettings } from "@/lib/business";

type LeadEmailInput = {
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  service?: string | null;
  message?: string | null;
  sourcePath?: string | null;
  /** Login page for the client portal */
  portalLoginUrl?: string | null;
  /** When set, customer confirmation includes a one-time password setup CTA */
  inviteUrl?: string | null;
};

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendLeadEmails(lead: LeadEmailInput) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL;
  const settings = await getBusinessSettings();
  const notify = settings.notifyEmail || process.env.LEAD_NOTIFY_EMAIL || site.email;

  if (!resend || !from) {
    console.warn("[email] Resend not configured — skipping send");
    return { sent: false as const, reason: "not_configured" };
  }

  const serviceLine = lead.service ? lead.service : "Not specified";
  const phoneLine = lead.phone || "Not provided";
  const cityLine = lead.city || "Not provided";
  const messageLine = lead.message?.trim() || "No message";

  const ownerHtml = `
    <div style="font-family:Helvetica,Arial,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin:0 0 12px">New How Much? lead</h2>
      <p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
      <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
      <p style="margin:0 0 8px"><strong>Phone:</strong> ${escapeHtml(phoneLine)}</p>
      <p style="margin:0 0 8px"><strong>City:</strong> ${escapeHtml(cityLine)}</p>
      <p style="margin:0 0 8px"><strong>Service:</strong> ${escapeHtml(serviceLine)}</p>
      <p style="margin:0 0 8px"><strong>Source:</strong> ${escapeHtml(lead.sourcePath || "/")}</p>
      <p style="margin:16px 0 0"><strong>Message</strong></p>
      <p style="white-space:pre-wrap;margin:4px 0 0">${escapeHtml(messageLine)}</p>
    </div>
  `;

  const portalUrl = lead.portalLoginUrl || `${site.url}/portal/login`;
  const inviteBlock = lead.inviteUrl
    ? `<p style="margin:20px 0"><a href="${escapeHtml(lead.inviteUrl)}" style="display:inline-block;background:#FF1D25;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700">Set your portal password</a></p>
       <p style="font-size:13px;color:#555">Or copy this link: ${escapeHtml(lead.inviteUrl)}</p>`
    : `<p style="margin:20px 0"><a href="${escapeHtml(portalUrl)}" style="display:inline-block;background:#FF1D25;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700">Sign in to your portal</a></p>
       <p>Use the email and password you created on the quote form. Forgot it? Use “Forgot password” on the sign-in page.</p>`;

  const customerHtml = `
    <div style="font-family:Helvetica,Arial,sans-serif;line-height:1.6;color:#111">
      <p>Hi ${escapeHtml(lead.name.split(" ")[0] || "there")},</p>
      <p>Thanks for reaching out to <strong>How Much? Air &amp; Home Improvements</strong>. We got your request and ${escapeHtml(settings.displayName)}’s team will follow up soon.</p>
      <p><strong>Your client portal is ready</strong></p>
      ${inviteBlock}
      <p><strong>What happens next</strong></p>
      <ol>
        <li>We’ll review what you sent and call or email you with clear next steps.</li>
        <li>In your portal you can message us, see pricing options, pick a visit time when slots are open, and pay invoices.</li>
        <li>Prefer the phone? Call ${escapeHtml(settings.displayName)} anytime — that route always stays open.</li>
      </ol>
      <p>Need us sooner? Call ${escapeHtml(settings.displayName)} direct at <a href="${settings.directHref}">${escapeHtml(settings.directDisplay)}</a>.</p>
      <p style="margin-top:24px">— ${escapeHtml(settings.displayName)}<br/>How Much? Air &amp; Home Improvements<br/>${site.license}</p>
    </div>
  `;

  const [owner, customer] = await Promise.all([
    resend.emails.send({
      from,
      to: notify,
      replyTo: lead.email,
      subject: `New lead: ${lead.name}${lead.city ? ` — ${lead.city}` : ""}`,
      html: ownerHtml,
    }),
    resend.emails.send({
      from,
      to: lead.email,
      replyTo: notify,
      subject: "Your How Much? portal + request received",
      html: customerHtml,
    }),
  ]);

  return {
    sent: true as const,
    ownerId: owner.data?.id ?? null,
    customerId: customer.data?.id ?? null,
    ownerError: owner.error?.message ?? null,
    customerError: customer.error?.message ?? null,
  };
}

export async function sendPortalInviteEmail(input: {
  name: string;
  email: string;
  inviteUrl: string;
  isNew?: boolean;
  isPasswordSetup?: boolean;
}) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL;
  if (!resend || !from) {
    console.warn("[email] Resend not configured — skipping portal invite");
    return { sent: false as const, reason: "not_configured" as const };
  }

  const settings = await getBusinessSettings();
  const first = input.name.split(" ")[0] || "there";
  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;line-height:1.6;color:#111">
      <p>Hi ${escapeHtml(first)},</p>
      <p>${
        input.isPasswordSetup
          ? `Use this link once to set (or reset) your portal password. After that, sign in at ${escapeHtml(site.url)}/portal/login with your email and password.`
          : input.isNew
            ? `Your How Much? client portal is ready. ${escapeHtml(settings.displayName)} set it up so you can track the job in one place.`
            : `Sign in to your How Much? client portal with the email and password you created.`
      }</p>
      <p>Inside you can track your job, message ${escapeHtml(settings.displayName)}, review options, schedule a visit, and pay invoices.</p>
      <p style="margin:24px 0"><a href="${escapeHtml(input.inviteUrl)}" style="display:inline-block;background:#FF1D25;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700">${input.isPasswordSetup ? "Set your password" : "Sign in to your portal"}</a></p>
      <p style="font-size:13px;color:#555">Link: ${escapeHtml(input.inviteUrl)}</p>
      <p>Prefer to talk? Call ${escapeHtml(settings.displayName)} at <a href="${settings.directHref}">${escapeHtml(settings.directDisplay)}</a>.</p>
      <p style="margin-top:24px">— ${escapeHtml(settings.displayName)}<br/>How Much? Air &amp; Home Improvements</p>
    </div>
  `;

  const result = await resend.emails.send({
    from,
    to: input.email,
    replyTo: settings.notifyEmail || process.env.LEAD_NOTIFY_EMAIL || site.email,
    subject: input.isPasswordSetup ? "Set your How Much? portal password" : "Your How Much? client portal",
    html,
  });

  return {
    sent: !result.error,
    id: result.data?.id ?? null,
    error: result.error?.message ?? null,
  };
}

/** Phone-call intake: thank them for talking with Andy and send portal access. */
export async function sendPhoneIntakeEmail(input: {
  name: string;
  email: string;
  service?: string | null;
  city?: string | null;
  whenLabel?: string | null;
  inviteUrl: string;
}) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL;
  if (!resend || !from) {
    console.warn("[email] Resend not configured — skipping phone intake email");
    return { sent: false as const, reason: "not_configured" as const };
  }

  const settings = await getBusinessSettings();
  const first = input.name.split(" ")[0] || "there";
  const visitBlock = input.whenLabel
    ? `<p>Your visit is on the calendar: <strong>${escapeHtml(input.whenLabel)}</strong>.</p>`
    : `<p>Andy has you in the system. He’ll follow up with a visit time if one isn’t already set.</p>`;
  const serviceLine = [input.service, input.city].filter(Boolean).join(" — ");

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;line-height:1.6;color:#111">
      <p>Hi ${escapeHtml(first)},</p>
      <p>Thank you for talking with <strong>How Much? Air &amp; Home Improvements</strong>. We’re glad you called.</p>
      ${visitBlock}
      ${serviceLine ? `<p>What we noted: <strong>${escapeHtml(serviceLine)}</strong>.</p>` : ""}
      <p>To view your appointment and access your portal — pricing, messages, documents, and pay — click the button below. You’ll set a password on the next screen, then you’re in.</p>
      <p style="margin:24px 0"><a href="${escapeHtml(input.inviteUrl)}" style="display:inline-block;background:#FF1D25;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700">Open your portal</a></p>
      <p style="font-size:13px;color:#555">Or copy this link: ${escapeHtml(input.inviteUrl)}</p>
      <p>Need Andy again? Call <a href="${settings.directHref}">${escapeHtml(settings.directDisplay)}</a>.</p>
      <p style="margin-top:24px">— ${escapeHtml(settings.displayName)}<br/>How Much? Air &amp; Home Improvements<br/>${site.license}</p>
    </div>
  `;

  const result = await resend.emails.send({
    from,
    to: input.email,
    replyTo: settings.notifyEmail || process.env.LEAD_NOTIFY_EMAIL || site.email,
    subject: input.whenLabel
      ? `Thanks for talking with How Much? — your visit + portal`
      : `Thanks for talking with How Much? — your portal is ready`,
    html,
  });

  return {
    sent: !result.error,
    id: result.data?.id ?? null,
    error: result.error?.message ?? null,
  };
}

export async function sendAppointmentEmail(input: {
  name: string;
  email: string;
  whenLabel: string;
  jobTitle: string;
}) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL;
  if (!resend || !from) return { sent: false as const, reason: "not_configured" as const };
  const settings = await getBusinessSettings();

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;line-height:1.6;color:#111">
      <p>Hi ${escapeHtml(input.name.split(" ")[0] || "there")},</p>
      <p>Your visit for <strong>${escapeHtml(input.jobTitle)}</strong> is confirmed.</p>
      <p style="font-size:18px;font-weight:700">${escapeHtml(input.whenLabel)}</p>
      <p>You can review details anytime in your <a href="${site.url}/portal">client portal</a>.</p>
      <p>Questions? Call ${escapeHtml(settings.displayName)} at <a href="${settings.directHref}">${escapeHtml(settings.directDisplay)}</a>.</p>
      <p style="margin-top:24px">— ${escapeHtml(settings.displayName)}</p>
    </div>
  `;

  const result = await resend.emails.send({
    from,
    to: input.email,
    replyTo: settings.notifyEmail || process.env.LEAD_NOTIFY_EMAIL || site.email,
    subject: `Visit confirmed — ${input.whenLabel}`,
    html,
  });
  return { sent: !result.error, id: result.data?.id ?? null };
}

export async function sendInvoiceEmail(input: {
  name: string;
  email: string;
  invoiceNumber: string;
  amountLabel: string;
  payUrl: string;
  description: string;
}) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL;
  if (!resend || !from) return { sent: false as const, reason: "not_configured" as const };

  const settings = await getBusinessSettings();
  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;line-height:1.6;color:#111">
      <p>Hi ${escapeHtml(input.name.split(" ")[0] || "there")},</p>
      <p>Invoice <strong>${escapeHtml(input.invoiceNumber)}</strong> is ready.</p>
      <p>${escapeHtml(input.description)}</p>
      <p style="font-size:22px;font-weight:700">${escapeHtml(input.amountLabel)}</p>
      <p style="margin:24px 0"><a href="${escapeHtml(input.payUrl)}" style="display:inline-block;background:#FF1D25;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700">Pay securely</a></p>
      <p>Or open your <a href="${site.url}/portal/pay">portal payments</a> page.</p>
      <p>Questions? Call ${escapeHtml(settings.displayName)} at <a href="${settings.directHref}">${escapeHtml(settings.directDisplay)}</a>.</p>
      <p style="margin-top:24px">— ${escapeHtml(settings.displayName)}</p>
    </div>
  `;

  const result = await resend.emails.send({
    from,
    to: input.email,
    replyTo: settings.notifyEmail || process.env.LEAD_NOTIFY_EMAIL || site.email,
    subject: `Invoice ${input.invoiceNumber} — ${input.amountLabel}`,
    html,
  });
  return { sent: !result.error, id: result.data?.id ?? null };
}

export async function sendNewMessageEmail(input: {
  toEmail: string;
  toName: string;
  fromLabel: string;
  preview: string;
  portalUrl: string;
}) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL;
  if (!resend || !from) return { sent: false as const, reason: "not_configured" as const };

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;line-height:1.6;color:#111">
      <p>Hi ${escapeHtml(input.toName.split(" ")[0] || "there")},</p>
      <p><strong>${escapeHtml(input.fromLabel)}</strong> sent a portal message:</p>
      <blockquote style="border-left:3px solid #FF1D25;padding-left:12px;color:#333">${escapeHtml(input.preview)}</blockquote>
      <p style="margin:24px 0"><a href="${escapeHtml(input.portalUrl)}" style="display:inline-block;background:#FF1D25;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700">Reply in portal</a></p>
    </div>
  `;

  const result = await resend.emails.send({
    from,
    to: input.toEmail,
    subject: `New message from ${input.fromLabel}`,
    html,
  });
  return { sent: !result.error, id: result.data?.id ?? null };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
