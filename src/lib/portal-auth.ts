export const PORTAL_COOKIE = "hm_portal_demo";

export function encodePortalSession(userId: string) {
  return Buffer.from(JSON.stringify({ userId, demo: true }), "utf8").toString("base64url");
}

export function decodePortalSession(value?: string | null): { userId: string } | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as {
      userId?: string;
    };
    if (!parsed.userId) return null;
    return { userId: parsed.userId };
  } catch {
    return null;
  }
}
