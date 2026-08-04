export const ADMIN_COOKIE = "hm_admin_demo";

export function encodeAdminSession(userId: string) {
  return Buffer.from(JSON.stringify({ userId, role: "admin", demo: true }), "utf8").toString(
    "base64url",
  );
}

export function decodeAdminSession(value?: string | null): { userId: string } | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as {
      userId?: string;
      role?: string;
    };
    if (!parsed.userId || parsed.role !== "admin") return null;
    return { userId: parsed.userId };
  } catch {
    return null;
  }
}
