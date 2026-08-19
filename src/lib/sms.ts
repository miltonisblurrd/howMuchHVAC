import twilio from "twilio";
import { getBusinessSettings, toE164 } from "@/lib/business";

function getTwilio() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from) return null;
  return { client: twilio(sid, token), from };
}

/** Optional SMS alert to Andy when a lead comes in. Soft-fails if not configured. */
export async function sendLeadSmsAlert(input: {
  name: string;
  phone?: string | null;
  city?: string | null;
  service?: string | null;
}) {
  const tw = getTwilio();
  const settings = await getBusinessSettings();
  const to =
    toE164(settings.notifyPhone) ||
    process.env.LEAD_NOTIFY_PHONE ||
    process.env.TWILIO_TO_NUMBER;
  if (!tw || !to) {
    console.warn("[sms] Twilio not fully configured — skipping");
    return { sent: false as const, reason: "not_configured" as const };
  }

  const body = [
    `New How Much? lead: ${input.name}`,
    input.phone ? `Phone: ${input.phone}` : null,
    input.city ? `City: ${input.city}` : null,
    input.service ? `Service: ${input.service}` : null,
    `Call: ${settings.directDisplay}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const message = await tw.client.messages.create({ from: tw.from, to, body });
  return { sent: true as const, sid: message.sid };
}

/** Optional appointment confirmation SMS to the customer. */
export async function sendAppointmentSms(input: {
  toPhone?: string | null;
  whenLabel: string;
  jobTitle: string;
}) {
  const tw = getTwilio();
  if (!tw || !input.toPhone) {
    return { sent: false as const, reason: "not_configured" as const };
  }

  const body = [
    `How Much? visit confirmed`,
    input.jobTitle,
    input.whenLabel,
    `Questions: ${(await getBusinessSettings()).directDisplay}`,
  ].join(" · ");

  try {
    const message = await tw.client.messages.create({
      from: tw.from,
      to: input.toPhone,
      body,
    });
    return { sent: true as const, sid: message.sid };
  } catch (err) {
    console.error("[sms] appointment sms failed", err);
    return { sent: false as const, reason: "failed" as const };
  }
}
