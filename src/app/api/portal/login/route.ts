import { NextResponse } from "next/server";

/** Demo password login removed — use magic link at /portal/login */
export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Use magic-link sign-in at /portal/login" },
    { status: 410 },
  );
}
