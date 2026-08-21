import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Use email and password at /admin/login" },
    { status: 410 },
  );
}
