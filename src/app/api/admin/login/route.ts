import { NextResponse } from "next/server";

/** Demo password login removed — use magic link at /admin/login */
export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Use magic-link sign-in at /admin/login" },
    { status: 410 },
  );
}
