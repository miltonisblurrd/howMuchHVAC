import type { SupabaseClient } from "@supabase/supabase-js";

export async function findScheduleConflict(
  admin: SupabaseClient,
  startsAt: string,
  endsAt: string,
) {
  const { data: visits } = await admin
    .from("appointments")
    .select("id")
    .neq("status", "cancelled")
    .lt("starts_at", endsAt)
    .gt("ends_at", startsAt)
    .limit(1);

  if (visits?.length) {
    return "That time overlaps a visit already on the schedule.";
  }

  const { data: blocks } = await admin
    .from("availability_windows")
    .select("id, label")
    .like("label", "block:%")
    .lt("starts_at", endsAt)
    .gt("ends_at", startsAt)
    .limit(1);

  if (!blocks?.length) return null;
  const reason = (blocks[0].label || "").replace(/^block:/, "").trim();
  return reason ? `That time is blocked off (${reason}).` : "That time is blocked off.";
}
