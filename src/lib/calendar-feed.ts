import { createHash } from "crypto";
import { site } from "@/lib/site";

export function calendarFeedToken() {
  const secret = process.env.CALENDAR_FEED_TOKEN || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) return null;
  return createHash("sha256").update(`howmuch-calendar-v1:${secret}`).digest("hex").slice(0, 40);
}

export function calendarFeedUrl() {
  const token = calendarFeedToken();
  if (!token) return null;
  return `${site.url}/api/calendar/feed/${token}`;
}

function icsEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function icsStamp(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export type CalendarFeedEvent = {
  uid: string;
  startsAt: string;
  endsAt: string;
  title: string;
  detail?: string;
};

export function buildCalendarIcs(events: CalendarFeedEvent[]) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//How Much Air and Home//Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:How Much Air & Home",
    "REFRESH-INTERVAL;VALUE=DURATION:PT15M",
  ];
  for (const event of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${icsEscape(event.uid)}@trusthowmuch.com`,
      `DTSTAMP:${icsStamp(new Date().toISOString())}`,
      `DTSTART:${icsStamp(event.startsAt)}`,
      `DTEND:${icsStamp(event.endsAt)}`,
      `SUMMARY:${icsEscape(event.title)}`,
      event.detail ? `DESCRIPTION:${icsEscape(event.detail)}` : "",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.filter(Boolean).join("\r\n");
}
