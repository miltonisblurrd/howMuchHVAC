import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type InsightLead = {
  id: string;
  created_at: string;
  city: string | null;
  service: string | null;
  source_path: string | null;
  source_label: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: string;
  customer_id: string | null;
  phone: string | null;
};

export type Bucket = { key: string; count: number; pct: number };

export type LeadInsights = {
  total: number;
  rangeLabel: string;
  withPhone: number;
  withCity: number;
  becameCustomer: number;
  won: number;
  cities: Bucket[];
  services: Bucket[];
  sources: Bucket[];
  campaigns: Bucket[];
  weekdays: Bucket[];
  months: Bucket[];
  recommendation: {
    headline: string;
    detail: string;
    city: string;
    service: string;
    source: string;
  };
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type InsightRange = "30d" | "90d" | "all";

export function parseInsightRange(value?: string): InsightRange {
  if (value === "30d" || value === "90d" || value === "all") return value;
  return "90d";
}

function since(range: InsightRange) {
  if (range === "all") return null;
  const days = range === "30d" ? 30 : 90;
  return new Date(Date.now() - days * 86400000).toISOString();
}

function tally(values: (string | null | undefined)[], fallback = "Not given") {
  const map = new Map<string, number>();
  for (const raw of values) {
    const key = (raw || "").trim() || fallback;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return map;
}

function toBuckets(map: Map<string, number>, total: number, limit = 8): Bucket[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({
      key,
      count,
      pct: total ? Math.round((count / total) * 100) : 0,
    }));
}

function prettySource(lead: InsightLead) {
  if (lead.source_label?.trim()) return lead.source_label.trim();
  if (lead.utm_source?.trim()) {
    const medium = lead.utm_medium?.trim();
    return medium ? `${lead.utm_source} / ${medium}` : lead.utm_source.trim();
  }
  if (lead.source_path?.trim()) {
    const path = lead.source_path.trim();
    if (path === "/" || path === "") return "Homepage";
    if (path.startsWith("/service-areas") || path.startsWith("/areas")) return "City / service area page";
    if (path.startsWith("/services")) return "Service page";
    if (path.startsWith("/get-a-quote") || path.startsWith("/ads")) return "Quote / ads landing";
    if (path.startsWith("/blog")) return "Blog";
    return path;
  }
  return "Direct / unknown";
}

function prettyCampaign(lead: InsightLead) {
  return lead.utm_campaign?.trim() || lead.utm_source?.trim() || "No UTM tag";
}

export async function getLeadInsights(range: InsightRange): Promise<LeadInsights> {
  const admin = getSupabaseAdmin();
  const from = since(range);
  let query = admin
    .from("leads")
    .select(
      "id, created_at, city, service, source_path, source_label, utm_source, utm_medium, utm_campaign, status, customer_id, phone",
    )
    .order("created_at", { ascending: false })
    .limit(1000);
  if (from) query = query.gte("created_at", from);

  const { data } = await query;
  const leads = (data || []) as InsightLead[];
  const total = leads.length;

  const cities = toBuckets(tally(leads.map((l) => l.city), "City not given"), total);
  const services = toBuckets(tally(leads.map((l) => l.service), "Service not given"), total);
  const sources = toBuckets(tally(leads.map(prettySource)), total);
  const campaigns = toBuckets(tally(leads.map(prettyCampaign)), total, 6);

  const weekdayMap = new Map<string, number>();
  for (const name of WEEKDAYS) weekdayMap.set(name, 0);
  const monthMap = new Map<string, number>();
  for (const lead of leads) {
    const d = new Date(lead.created_at);
    const day = WEEKDAYS[d.getDay()];
    weekdayMap.set(day, (weekdayMap.get(day) || 0) + 1);
    const month = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    monthMap.set(month, (monthMap.get(month) || 0) + 1);
  }

  const topCity = cities.find((c) => c.key !== "City not given") || cities[0];
  const topService = services.find((s) => s.key !== "Service not given") || services[0];
  const topSource = sources.find((s) => s.key !== "Direct / unknown") || sources[0];

  const rangeLabel = range === "30d" ? "Last 30 days" : range === "90d" ? "Last 90 days" : "All time";
  const city = topCity?.key || "your service area";
  const service = topService?.key || "HVAC";
  const source = topSource?.key || "your site";

  return {
    total,
    rangeLabel,
    withPhone: leads.filter((l) => Boolean(l.phone)).length,
    withCity: leads.filter((l) => Boolean(l.city)).length,
    becameCustomer: leads.filter((l) => Boolean(l.customer_id)).length,
    won: leads.filter((l) => l.status === "won").length,
    cities,
    services,
    sources,
    campaigns,
    weekdays: WEEKDAYS.map((key) => ({
      key,
      count: weekdayMap.get(key) || 0,
      pct: total ? Math.round(((weekdayMap.get(key) || 0) / total) * 100) : 0,
    })),
    months: [...monthMap.entries()].slice(0, 8).reverse().map(([key, count]) => ({
      key,
      count,
      pct: total ? Math.round((count / total) * 100) : 0,
    })),
    recommendation: {
      headline:
        total === 0
          ? "No leads in this window yet"
          : `Run ads for ${service} in ${city}`,
      detail:
        total === 0
          ? "As quote forms come in, this page will show who is actually asking ? city, service, and which page sent them."
          : `${topCity?.pct || 0}% of leads name ${city}. ${topService?.pct || 0}% ask for ${service}. The strongest path in is ${source}. Point the next ad at that combo and send it to a matching landing page ? not a generic homepage.`,
      city,
      service,
      source,
    },
  };
}
