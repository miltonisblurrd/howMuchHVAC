import { cache } from "react";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSignedUrl } from "@/lib/portal-queries";
import { site } from "@/lib/site";

export type BusinessSettings = {
  displayName: string;
  publicEmail: string;
  directPhone: string;
  directDisplay: string;
  directHref: string;
  notifyEmail: string;
  notifyPhone: string;
  officeAddress: string;
  avatarPath: string | null;
  avatarBucket: string | null;
  avatarUrl: string | null;
};

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function formatPhoneDisplay(raw: string) {
  const digits = digitsOnly(raw);
  const d = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return raw.trim();
}

export function toTelHref(raw: string) {
  const digits = digitsOnly(raw);
  if (!digits) return site.phones.direct.href;
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `tel:+${digits}`;
  return raw.startsWith("tel:") ? raw : `tel:${raw}`;
}

export function toE164(raw: string) {
  const digits = digitsOnly(raw);
  if (!digits) return "";
  if (digits.length === 10) return `+1${digits}`;
  if (digits.startsWith("1") && digits.length === 11) return `+${digits}`;
  return raw.startsWith("+") ? raw : `+${digits}`;
}

function defaults(): Omit<BusinessSettings, "avatarUrl"> {
  return {
    displayName: "Andy",
    publicEmail: site.email,
    directPhone: site.phones.direct.display,
    directDisplay: site.phones.direct.display,
    directHref: site.phones.direct.href,
    notifyEmail: process.env.LEAD_NOTIFY_EMAIL || site.email,
    notifyPhone: process.env.LEAD_NOTIFY_PHONE || "",
    officeAddress: "",
    avatarPath: null,
    avatarBucket: null,
  };
}

export const getBusinessSettings = cache(async (): Promise<BusinessSettings> => {
  const fallback = defaults();
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.from("business_settings").select("*").eq("id", 1).maybeSingle();
    if (error || !data) {
      return { ...fallback, avatarUrl: null };
    }

    const directPhone = (data.direct_phone as string) || fallback.directPhone;
    const avatarPath = (data.avatar_path as string | null) || null;
    const avatarBucket = (data.avatar_bucket as string | null) || null;
    const avatarUrl = avatarPath
      ? await getSignedUrl(avatarBucket || "job-photos", avatarPath, 60 * 60 * 24 * 7)
      : null;

    return {
      displayName: (data.display_name as string) || fallback.displayName,
      publicEmail: (data.public_email as string) || fallback.publicEmail,
      directPhone,
      directDisplay: formatPhoneDisplay(directPhone) || fallback.directDisplay,
      directHref: toTelHref(directPhone),
      notifyEmail: (data.notify_email as string) || fallback.notifyEmail,
      notifyPhone: (data.notify_phone as string) || fallback.notifyPhone,
      officeAddress: (data.office_address as string) || "",
      avatarPath,
      avatarBucket,
      avatarUrl,
    };
  } catch {
    return { ...fallback, avatarUrl: null };
  }
});

export const getPublicContact = cache(async () => {
  const s = await getBusinessSettings();
  return {
    displayName: s.displayName,
    publicEmail: s.publicEmail,
    directDisplay: s.directDisplay,
    directHref: s.directHref,
    officeAddress: s.officeAddress,
    officeDisplay: site.phones.office.display,
    officeHref: site.phones.office.href,
    avatarUrl: s.avatarUrl,
  };
});

export type PublicContact = Awaited<ReturnType<typeof getPublicContact>>;
