import { ShieldCheck, BadgeCheck, Star, Clock } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

const items = [
  { icon: ShieldCheck, label: "Licensed, Insured & Bonded" },
  { icon: BadgeCheck, label: site.license },
  { icon: Clock, label: `${site.yearsExperience}+ Years Experience` },
  {
    icon: Star,
    label: `Google ${site.google.rating} · ${site.google.reviewCount} Reviews`,
  },
];

export function TrustBar({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={cn(
        "grid gap-1 sm:grid-cols-2 lg:grid-cols-4",
        dark
          ? "border-y border-white/10 bg-black/25"
          : "border-y border-hm-line bg-white",
      )}
    >
      {items.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className={cn(
            "flex items-center justify-center gap-2.5 px-4 py-4 text-center text-[13px] font-medium",
            dark ? "text-white/90" : "text-hm-charcoal",
          )}
        >
          <Icon className="h-4 w-4 shrink-0 text-hm-red" aria-hidden />
          <span className="font-display tracking-tight">{label}</span>
        </div>
      ))}
    </div>
  );
}
