import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Profile } from "@/lib/db-types";

export async function getSessionUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const admin = getSupabaseAdmin();
  const { data } = await admin.from("profiles").select("*").eq("id", userId).maybeSingle();
  return (data as Profile | null) ?? null;
}

export async function requirePortalUser(): Promise<Profile> {
  const user = await getSessionUser();
  if (!user) redirect("/portal/login");
  const profile = await getProfile(user.id);
  if (!profile) redirect("/portal/login");
  return profile;
}

export async function requireAdmin(): Promise<Profile> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  const profile = await getProfile(user.id);
  if (!profile || profile.role !== "admin") redirect("/admin/login");
  return profile;
}

export async function getOptionalProfile(): Promise<Profile | null> {
  const user = await getSessionUser();
  if (!user) return null;
  return getProfile(user.id);
}
