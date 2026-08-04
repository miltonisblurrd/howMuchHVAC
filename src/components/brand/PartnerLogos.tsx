import { cn } from "@/lib/cn";

/** Stylized wordmark treatments ? looks intentional without needing brand SVG files */
const partners = [
  { name: "Mitsubishi Electric", mark: "MITSUBISHI" },
  { name: "Carrier", mark: "CARRIER" },
  { name: "York", mark: "YORK" },
  { name: "Goodman", mark: "GOODMAN" },
  { name: "Honeywell Home", mark: "Honeywell" },
  { name: "Google Nest", mark: "Nest" },
  { name: "The Home Depot", mark: "HOME DEPOT" },
];

export function PartnerLogos({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 items-center gap-3 sm:grid-cols-3 lg:grid-cols-7",
        className,
      )}
    >
      {partners.map((p) => (
        <div
          key={p.name}
          title={p.name}
          className={cn(
            "flex h-16 items-center justify-center rounded-xl border px-3",
            tone === "dark"
              ? "border-white/15 bg-white/5"
              : "border-hm-line bg-white shadow-sm",
          )}
        >
          <span
            className={cn(
              "text-center font-display text-[11px] font-extrabold tracking-[0.12em] sm:text-xs",
              tone === "dark" ? "text-white/85" : "text-hm-charcoal/70",
            )}
          >
            {p.mark}
          </span>
        </div>
      ))}
    </div>
  );
}
