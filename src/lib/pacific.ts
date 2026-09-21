const ZONE = "America/Los_Angeles";

/** UTC instant for a wall-clock time in Pacific. */
export function pacificToUtc(date: string, time: string) {
  const asUtc = new Date(`${date}T${time}:00Z`);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(asUtc).map((part) => [part.type, part.value]),
  );
  const asZone = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return new Date(asUtc.getTime() - (asZone - asUtc.getTime()));
}

/** Inclusive Pacific dates, stored as [start midnight, end next midnight). */
export function pacificDateSpan(startDate: string, endDate: string) {
  const end = endDate < startDate ? startDate : endDate;
  const startUtc = pacificToUtc(startDate, "00:00");
  const endDay = pacificToUtc(end, "00:00");
  const endUtc = new Date(endDay.getTime() + 24 * 60 * 60 * 1000);
  return { startsAt: startUtc.toISOString(), endsAt: endUtc.toISOString() };
}
