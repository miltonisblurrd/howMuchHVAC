import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getSessionUser, getProfile } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getBusinessSettings } from "@/lib/business";

const schema = z.object({
  displayName: z.string().trim().min(1).max(80),
  publicEmail: z.string().trim().email().max(200),
  directPhone: z.string().trim().min(7).max(40),
  notifyEmail: z.string().trim().email().max(200),
  notifyPhone: z.string().trim().max(40).optional().nullable(),
  officeAddress: z.string().trim().max(240).optional().nullable(),
});

async function requireAdminUser() {
  const user = await getSessionUser();
  if (!user) return { error: NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 }) };
  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") {
    return { error: NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 }) };
  }
  return { profile };
}

export async function GET() {
  const auth = await requireAdminUser();
  if ("error" in auth) return auth.error;
  const settings = await getBusinessSettings();
  return NextResponse.json({
    ok: true,
    settings,
    loginEmail: auth.profile.email,
  });
}

export async function PATCH(request: Request) {
  const auth = await requireAdminUser();
  if ("error" in auth) return auth.error;

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Check the fields and try again" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const now = new Date().toISOString();
  const row = {
    id: 1,
    display_name: parsed.data.displayName,
    public_email: parsed.data.publicEmail,
    direct_phone: parsed.data.directPhone,
    notify_email: parsed.data.notifyEmail,
    notify_phone: parsed.data.notifyPhone || null,
    office_address: parsed.data.officeAddress || null,
    updated_at: now,
  };

  const { data: existing } = await admin.from("business_settings").select("id").eq("id", 1).maybeSingle();
  const { id: _id, ...fields } = row;
  const { error } = existing
    ? await admin.from("business_settings").update(fields).eq("id", 1)
    : await admin.from("business_settings").insert(row);
  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Could not save. Run supabase/migrations/005_business_settings.sql in the SQL Editor.",
      },
      { status: 500 },
    );
  }

  await admin
    .from("profiles")
    .update({
      name: parsed.data.displayName,
      phone: parsed.data.directPhone,
      address: parsed.data.officeAddress || null,
      updated_at: now,
    })
    .eq("id", auth.profile.id);

  revalidatePath("/", "layout");
  const settings = await getBusinessSettings();
  return NextResponse.json({ ok: true, settings });
}
