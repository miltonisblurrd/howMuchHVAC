import { CheckCircle2, FileText } from "lucide-react";

/** Visual stand-in for the downloadable pricing guide cover */
export function GuideCover() {
  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <div
        aria-hidden
        className="absolute -right-3 top-4 h-full w-full rotate-3 rounded-2xl bg-hm-ink/25"
      />
      <div className="relative overflow-hidden rounded-2xl border border-white/30 bg-white text-hm-charcoal shadow-[0_28px_70px_-24px_rgba(0,0,0,0.55)]">
        <div className="bg-hm-ink px-5 py-4 text-white">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.22em] text-hm-red">
            Free Homeowner Guide
          </p>
          <p className="mt-2 font-display text-xl font-extrabold leading-tight tracking-tight">
            So, How Much?
          </p>
          <p className="mt-1 text-sm text-white/70">Fair HVAC Pricing For SoCal Homes</p>
        </div>
        <div className="space-y-3 px-5 py-5">
          {[
            "Repair vs replace questions that matter",
            "Red flags in high-pressure quotes",
            "What a fair diagnostic looks like",
            "How to use a second opinion well",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-hm-red" />
              <span className="leading-snug text-hm-charcoal/85">{item}</span>
            </div>
          ))}
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-hm-fog px-3 py-2.5 text-xs font-semibold text-hm-muted">
            <FileText className="h-4 w-4 text-hm-red" />
            PDF-style guide ? ~5 min read
          </div>
        </div>
      </div>
    </div>
  );
}
