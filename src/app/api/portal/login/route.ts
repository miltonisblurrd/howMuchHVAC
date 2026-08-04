import { NextResponse } from "next/server";
import { demoUsers } from "@/lib/portal-data";
import { encodePortalSession, PORTAL_COOKIE } from "@/lib/portal-auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const user = demoUsers.find(
    (u) =>
      u.email.toLowerCase() === String(body.email ?? "").toLowerCase() &&
      u.password === body.password,
  );

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, userId: user.id });
  response.cookies.set(PORTAL_COOKIE, encodePortalSession(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
