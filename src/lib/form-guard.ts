import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Spam checks for public lead forms.
 * Honeypot and obvious junk are dropped quietly. Humans get a plain error
 * they can recover from. Turnstile runs only when TURNSTILE_SECRET_KEY is set.
 */

const MIN_FILL_MS = 2_000;
const MAX_AGE_MS = 6 * 60 * 60 * 1000;
const EMAIL_BURST_MS = 20_000;
const EMAIL_HOUR_MS = 60 * 60 * 1000;
const MAX_EMAILS_PER_HOUR = 4;

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamailblock.com",
  "sharklasers.com",
  "grr.la",
  "guerrillamail.info",
  "10minutemail.com",
  "10minutemail.net",
  "tempmail.com",
  "temp-mail.org",
  "tempmailo.com",
  "yopmail.com",
  "yopmail.fr",
  "trashmail.com",
  "getnada.com",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
  "throwawaymail.com",
  "mailnesia.com",
  "moakt.com",
  "emailondeck.com",
  "spam4.me",
  "mintemail.com",
  "mytemp.email",
  "tempr.email",
  "discard.email",
  "discardmail.com",
  "mailcatch.com",
  "inboxkitten.com",
  "getairmail.com",
  "example.com",
  "example.org",
  "test.com",
]);

const LINK_RE = /(?:https?:\/\/|www\.|\b(?:bit\.ly|tinyurl\.com|t\.me|wa\.me)\/)/gi;
const SPAM_RE =
  /\b(seo|backlinks?|guest post|crypto(?:currency)?|bitcoin|forex|casino|viagra|cialis|porn|onlyfans|buy followers|web traffic)\b/i;

const hits = new Map<string, number[]>();
const usedTokens = new Map<string, number>();

export type PublicFormInput = {
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  service?: string | null;
  message?: string | null;
  honeypot?: string | null;
  formToken?: string | null;
  turnstileToken?: string | null;
};

export type ScreenResult =
  | { action: "allow" }
  | { action: "drop"; reason: string }
  | { action: "block"; status: number; error: string; reason: string };

const HONEYPOT_KEYS = [
  "honeypot",
  "hm_extra",
  "faxNumber",
  "fax_number",
  "website",
  "companyUrl",
  "company_url",
  "url",
];

export function clientIp(request: Request): string {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return "unknown";
}

export function readGuard(json: unknown): {
  honeypot: string;
  formToken: string;
  turnstileToken: string;
} {
  const body = json && typeof json === "object" ? (json as Record<string, unknown>) : {};
  let honeypot = "";
  for (const key of HONEYPOT_KEYS) {
    const value = body[key];
    if (typeof value === "string" && value.trim()) {
      honeypot = value.trim();
      break;
    }
  }
  return {
    honeypot,
    formToken: typeof body.formToken === "string" ? body.formToken.slice(0, 4000) : "",
    turnstileToken: typeof body.turnstileToken === "string" ? body.turnstileToken.slice(0, 5000) : "",
  };
}

export function issueFormToken(): string | null {
  const secret = signingSecret();
  if (!secret) return null;
  const body = Buffer.from(
    JSON.stringify({ t: Date.now(), n: randomBytes(8).toString("base64url") }),
  ).toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

export function allowChallenge(request: Request): boolean {
  return !overLimit(`challenge:${clientIp(request)}`, 40, 10 * 60 * 1000);
}

export function toScreenHttp(
  verdict: ScreenResult,
): { status: number; body: { ok: boolean; error?: string } } | null {
  if (verdict.action === "allow") return null;
  if (verdict.action === "drop") {
    console.info("[form-guard] dropped", verdict.reason);
    return { status: 200, body: { ok: true } };
  }
  console.info("[form-guard] blocked", verdict.reason);
  return { status: verdict.status, body: { ok: false, error: verdict.error } };
}

export async function screenPublicForm(
  request: Request,
  input: PublicFormInput,
): Promise<ScreenResult> {
  if (!originAllowed(request)) {
    return block(403, "Refresh the page and try again.", "origin");
  }

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") {
    return block(403, "Refresh the page and try again.", "cross-site");
  }

  const ip = clientIp(request);
  if (overLimit(`lead:${ip}:15m`, 8, 15 * 60 * 1000) || overLimit(`lead:${ip}:1d`, 30, 24 * 60 * 60 * 1000)) {
    return block(429, "Too many requests. Call us, or try again in a few minutes.", "ip-rate");
  }

  if (input.honeypot?.trim()) {
    const secret = signingSecret();
    if (secret && tokenIssuedAt(input.formToken || "", secret) != null) {
      consumeToken(input.formToken || "");
    }
    return { action: "drop", reason: "honeypot" };
  }

  const token = peekToken(input.formToken || "");
  if (token.action !== "allow") return token;

  const email = input.email.trim().toLowerCase();
  if (!hasRealName(input.name)) {
    return block(400, "Enter your name.", "name");
  }
  if (input.phone?.trim() && !plausiblePhone(input.phone)) {
    return block(400, "Enter a phone number we can call.", "phone");
  }
  if (isDisposableEmail(email)) {
    return block(400, "Use a regular email address so we can reach you.", "disposable-email");
  }
  if (looksLikeSpam(input)) {
    consumeToken(input.formToken || "");
    return { action: "drop", reason: "content" };
  }

  const burstKey = `email-burst:${email}`;
  if (overLimit(burstKey, 1, EMAIL_BURST_MS)) {
    return block(429, "We already got that. Andy will follow up shortly.", "email-burst");
  }
  consumeToken(input.formToken || "");

  const turnstile = await verifyTurnstile(input.turnstileToken || "", ip);
  if (!turnstile.ok) {
    releaseLimit(burstKey);
    return block(400, "Couldn't confirm this form. Refresh, or call us if it keeps happening.", "turnstile");
  }

  const recent = await recentLeadCount(email);
  if (recent >= MAX_EMAILS_PER_HOUR) {
    return block(429, "We already have your request. Andy will follow up shortly.", "email-hour");
  }

  return { action: "allow" };
}

function block(status: number, error: string, reason: string): ScreenResult {
  return { action: "block", status, error, reason };
}

function signingSecret(): string | null {
  const secret = process.env.FORM_GUARD_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "dev-form-guard";
  return null;
}

function sign(body: string, secret: string) {
  return createHmac("sha256", secret).update(body).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function peekToken(token: string): ScreenResult {
  const secret = signingSecret();
  if (!secret) return block(503, "This form is offline. Please call us.", "no-secret");

  const issuedAt = tokenIssuedAt(token, secret);
  if (issuedAt == null) return block(400, "Refresh the page and try again.", "token");

  const age = Date.now() - issuedAt;
  if (age < MIN_FILL_MS) return block(400, "Please wait a moment and submit again.", "too-fast");
  if (age > MAX_AGE_MS) return block(400, "This form expired. Refresh the page and try again.", "expired");
  if (usedTokens.has(token)) return block(400, "Refresh the page and try again.", "replay");
  return { action: "allow" };
}

function consumeToken(token: string) {
  usedTokens.set(token, Date.now());
  if (usedTokens.size <= 2000) return;
  const now = Date.now();
  for (const [key, issued] of usedTokens) {
    if (now - issued > MAX_AGE_MS) usedTokens.delete(key);
  }
}

function tokenIssuedAt(token: string, secret: string): number | null {
  const [body, sig] = token.split(".");
  if (!body || !sig || !safeEqual(sig, sign(body, secret))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString()) as { t?: unknown };
    return typeof parsed.t === "number" ? parsed.t : null;
  } catch {
    return null;
  }
}

function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return false;
  let originHost = "";
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  const hosts = new Set<string>();
  for (const header of ["x-forwarded-host", "host"]) {
    const value = request.headers.get(header);
    if (value) hosts.add(value.split(",")[0].trim());
  }
  try {
    hosts.add(new URL(request.url).host);
  } catch {
    /* ignore malformed request url */
  }
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    try {
      hosts.add(new URL(configured).host);
    } catch {
      /* ignore malformed site url */
    }
  }
  return hosts.has(originHost);
}

function releaseLimit(key: string) {
  const recent = hits.get(key);
  if (!recent?.length) return;
  recent.pop();
  if (recent.length === 0) hits.delete(key);
}

function overLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    const oldest = hits.keys().next().value;
    if (oldest) hits.delete(oldest);
  }
  return false;
}

function hasRealName(name: string) {
  const trimmed = name.trim();
  if (trimmed.length < 2) return false;
  if (linkCount(trimmed) > 0) return false;
  return !/^[\d\s.+()-]+$/.test(trimmed);
}

function plausiblePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function isDisposableEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (!domain) return true;
  if (DISPOSABLE_DOMAINS.has(domain)) return true;
  for (const known of DISPOSABLE_DOMAINS) {
    if (domain.endsWith(`.${known}`)) return true;
  }
  return false;
}

function linkCount(value: string) {
  const re = new RegExp(LINK_RE.source, "gi");
  return value.match(re)?.length ?? 0;
}

function looksLikeSpam(input: PublicFormInput) {
  const name = input.name || "";
  const message = input.message || "";
  const city = input.city || "";
  const service = input.service || "";
  if (linkCount(name) > 0 || linkCount(city) > 0) return true;
  if (linkCount(message) + linkCount(service) >= 3) return true;
  const blob = `${name}\n${city}\n${service}\n${message}`;
  return SPAM_RE.test(blob);
}

async function recentLeadCount(email: string): Promise<number> {
  try {
    const supabase = getSupabaseAdmin();
    const since = new Date(Date.now() - EMAIL_HOUR_MS).toISOString();
    const pattern = email.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
    const { count, error } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .ilike("email", pattern)
      .gte("created_at", since);
    if (error) return 0;
    return count ?? 0;
  } catch (error) {
    console.error("[form-guard] email count failed", error);
    return 0;
  }
}

async function verifyTurnstile(token: string, ip: string): Promise<{ ok: boolean }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true };
  if (!token) return { ok: false };

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return { ok: Boolean(data.success) };
  } catch (error) {
    console.error("[form-guard] turnstile verify failed", error);
    return { ok: false };
  }
}
