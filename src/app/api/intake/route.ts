import { NextResponse } from "next/server";
import { z } from "zod";
import { processPhoneIntake } from "@/lib/phone-intake";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(40),
  address: z.string().trim().max(200).optional().nullable(),
  city: z.string().trim().max(120).optional().nullable(),
  service: z.string().trim().max(120).optional().nullable(),
  notes: z.string().trim().max(4000).optional().nullable(),
  startsAt: z.string().optional().nullable(),
  endsAt: z.string().optional().nullable(),
  visitType: z.enum(["diagnostic", "install", "maintenance", "follow_up"]).optional(),
  techName: z.string().trim().max(80).optional().nullable(),
  website: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Name, a real email, and a phone number are required." },
      { status: 400 },
    );
  }

  if (parsed.data.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  try {
    const result = await processPhoneIntake(parsed.data);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[intake] failed", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Could not save the lead." },
      { status: 500 },
    );
  }
}
