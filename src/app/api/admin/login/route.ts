import { NextResponse } from "next/server";
import { adminUser } from "@/lib/admin-data";
import { ADMIN_COOKIE, encodeAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const ok =
    String(body.email ?? "").toLowerCase() === adminUser.email.toLowerCase() &&
    body.password === adminUser.password;

  if (!ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, encodeAdminSession(adminUser.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
