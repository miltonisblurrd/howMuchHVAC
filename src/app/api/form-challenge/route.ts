import { NextResponse } from "next/server";
import { allowChallenge, issueFormToken } from "@/lib/form-guard";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!allowChallenge(request)) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  const token = issueFormToken();
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  return NextResponse.json(
    { token },
    { headers: { "Cache-Control": "no-store" } },
  );
}
