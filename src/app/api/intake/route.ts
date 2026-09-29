import { NextResponse } from "next/server";
import { z } from "zod";
import { processPhoneIntake } from "@/lib/phone-intake";
import { findScheduleConflict } from "@/lib/schedule-conflicts";
import { readGuard, screenPublicForm, toScreenHttp } from "@/lib/form-guard";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

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
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Name, a real email, and a phone number are required." }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Name, a real email, and a phone number are required." },
      { status: 400 },
    );
  }

  const guard = readGuard(json);
  const screened = toScreenHttp(
    await screenPublicForm(request, {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      city: parsed.data.city,
      service: parsed.data.service,
      message: parsed.data.notes,
      honeypot: guard.honeypot,
      formToken: guard.formToken,
      turnstileToken: guard.turnstileToken,
    }),
  );
  if (screened) return NextResponse.json(screened.body, { status: screened.status });

  try {
    if (parsed.data.startsAt && parsed.data.endsAt) {
      const conflict = await findScheduleConflict(
        getSupabaseAdmin(),
        parsed.data.startsAt,
        parsed.data.endsAt,
      );
      if (conflict) return NextResponse.json({ ok: false, error: conflict }, { status: 409 });
    }
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
