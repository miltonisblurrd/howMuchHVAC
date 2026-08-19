import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { InsightBars } from "@/components/admin/InsightBars";
import { CountUp } from "@/components/admin/CountUp";
import { requireAdmin } from "@/lib/auth";
import { getLeadInsights, parseInsightRange, type InsightRange } from "@/lib/lead-insights";
import { cn } from "@/lib/cn";

const ranges: { id: InsightRange; label: string }[] = [
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "all", label: "All time" },
];

export default async function AdminInsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const admin = await requireAdmin();
  const { range: rangeParam } = await searchParams;
  const range = parseInsightRange(rangeParam);
  const insights = await getLeadInsights(range);

  return (
    <AdminShell
      userName={admin.name || admin.email}
      title="Ad insights"
      description="Real leads ? city, service, and which page sent them. Use this to decide who to target next."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {ranges.map((r) => (
          <Link
            key={r.id}
            href={`/admin/insights?range=${r.id}`}
            className={cn(
              "inline-flex h-9 items-center rounded-xl border bg-white px-3 font-display text-[13px] font-semibold transition",
              range === r.id
                ? "border-hm-charcoal/15 text-hm-charcoal shadow-[0_1px_2px_rgba(18,21,26,0.06)]"
                : "border-hm-line text-hm-muted hover:border-hm-charcoal/20 hover:text-hm-charcoal",
            )}
          >
            {r.label}
          </Link>
        ))}
      </div>

      <div className="hm-admin-card mb-6 border-hm-red/20 bg-hm-red/[0.04] px-5 py-5">
        <p className="text-xs font-bold uppercase tracking-wide text-hm-red">
          Next ad to run ? {insights.rangeLabel}
        </p>
        <p className="mt-2 font-display text-2xl font-bold text-hm-charcoal">
          {insights.recommendation.headline}
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-hm-muted">
          {insights.recommendation.detail}
        </p>
        {insights.total > 0 && (
          <p className="mt-4 text-sm font-semibold text-hm-charcoal">
            Audience snapshot: {insights.recommendation.service} ? {insights.recommendation.city} ?{" "}
            via {insights.recommendation.source}
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Leads in range", value: String(insights.total) },
          {
            label: "Named a city",
            value: insights.total ? `${Math.round((insights.withCity / insights.total) * 100)}%` : "?",
          },
          {
            label: "Left a phone",
            value: insights.total ? `${Math.round((insights.withPhone / insights.total) * 100)}%` : "?",
          },
          {
            label: "Opened a portal job",
            value: insights.total
              ? `${Math.round((insights.becameCustomer / insights.total) * 100)}%`
              : "?",
          },
        ].map((stat) => (
          <div key={stat.label} className="hm-admin-card px-5 py-4">
            <p className="text-sm font-semibold text-hm-muted">{stat.label}</p>
            <p className="mt-2 font-display text-3xl font-bold tracking-tight">
              <CountUp value={stat.value} />
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <InsightBars
          title="Where they live"
          caption="Geo targeting. Double down on cities that already ask."
          rows={insights.cities}
          empty="Cities show up once people fill the quote form."
        />
        <InsightBars
          title="What they ask for"
          caption="Service intent. Match ad copy and landing pages to this list."
          rows={insights.services}
          empty="Service breakdown appears as quotes come in."
        />
        <InsightBars
          title="How they found you"
          caption="Page and campaign path. Send paid traffic to what already converts."
          rows={insights.sources}
        />
        <InsightBars
          title="UTM / campaign tags"
          caption="If ads aren't tagged, they'll land in “No UTM tag.” Add UTM so this gets sharper."
          rows={insights.campaigns}
        />
        <InsightBars
          title="Day of week"
          caption="When people actually submit. Useful for ad schedule and bid modifiers."
          rows={insights.weekdays}
        />
        <InsightBars
          title="Volume over time"
          caption="Recent months, highest first in the data ? shown oldest to newest."
          rows={insights.months}
        />
      </div>
    </AdminShell>
  );
}
