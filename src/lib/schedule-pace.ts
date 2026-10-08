import type { SchedulePace } from "@/lib/db-types";

export const SCHEDULE_PACES: { id: SchedulePace; label: string; detail: string }[] = [
  { id: "asap", label: "ASAP", detail: "As soon as Andy can get there." },
  { id: "this_week", label: "This week", detail: "Any day left in this week." },
  { id: "this_weekend", label: "This weekend", detail: "Saturday or Sunday." },
  { id: "no_rush", label: "No rush", detail: "Whenever it fits the schedule." },
];

export function paceFromEvents(
  events: { title: string; detail: string }[],
  stored?: SchedulePace | null,
): SchedulePace | null {
  if (stored) return stored;
  const latest = [...events].reverse().find((event) => event.title === "Install pace");
  if (!latest) return null;
  return SCHEDULE_PACES.find((pace) => latest.detail.includes(pace.label))?.id ?? null;
}

export const SCHEDULE_PACE_LABELS: Record<SchedulePace, string> = {
  asap: "ASAP",
  this_week: "This week",
  this_weekend: "This weekend",
  no_rush: "No rush",
};
