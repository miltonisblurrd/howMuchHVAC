import { NextResponse } from "next/server";
import { buildCalendarIcs, calendarFeedToken, type CalendarFeedEvent } from "@/lib/calendar-feed";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const expected = calendarFeedToken();
  if (!expected || token !== expected) {
    return new NextResponse("Not found", { status: 404 });
  }

  const admin = getSupabaseAdmin();
  const from = new Date();
  from.setDate(from.getDate() - 14);
  const to = new Date();
  to.setDate(to.getDate() + 180);

  const { data: appointments } = await admin
    .from("appointments")
    .select("id, starts_at, ends_at, type, status, jobs(title, city, profiles!customer_id(name))")
    .gte("starts_at", from.toISOString())
    .lte("starts_at", to.toISOString())
    .neq("status", "cancelled");

  const events: CalendarFeedEvent[] = (appointments || []).map((row) => {
    const jobRaw = row.jobs as
      | {
          title?: string;
          city?: string;
          profiles?: { name?: string } | { name?: string }[] | null;
        }
      | {
          title?: string;
          city?: string;
          profiles?: { name?: string } | { name?: string }[] | null;
        }[]
      | null;
    const job = Array.isArray(jobRaw) ? jobRaw[0] : jobRaw;
    const profile = Array.isArray(job?.profiles) ? job?.profiles[0] : job?.profiles;
    const who = profile?.name || "Customer";
    return {
      uid: `appt-${row.id}`,
      startsAt: row.starts_at,
      endsAt: row.ends_at,
      title: `${row.type === "install" ? "Install" : "Visit"} - ${who}`,
      detail: [job?.title, job?.city].filter(Boolean).join(" - "),
    };
  });

  const { data: blocks } = await admin
    .from("availability_windows")
    .select("id, starts_at, ends_at, label")
    .like("label", "block:%")
    .gte("ends_at", from.toISOString())
    .lte("starts_at", to.toISOString());

  for (const block of blocks || []) {
    const reason = (block.label || "").replace(/^block:/, "").trim();
    events.push({
      uid: `block-${block.id}`,
      startsAt: block.starts_at,
      endsAt: block.ends_at,
      title: reason ? `Blocked: ${reason}` : "Blocked",
      detail: "Not available for new bookings.",
    });
  }

  return new NextResponse(buildCalendarIcs(events), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
