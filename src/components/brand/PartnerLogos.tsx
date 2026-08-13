import Image from "next/image";
import { cn } from "@/lib/cn";
import { partners } from "@/lib/partners";

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
      {partners.map((partner) => (
        <div
          key={partner.name}
          title={partner.name}
          className={cn(
            "flex h-20 items-center justify-center rounded-xl border px-4 py-3",
            tone === "dark"
              ? "border-white/15 bg-white/95"
              : "border-hm-line bg-white shadow-sm",
          )}
        >
          <Image
            src={partner.logo}
            alt={`${partner.name} logo`}
            width={160}
            height={64}
            className="h-10 w-auto max-w-full object-contain md:h-11"
          />
        </div>
      ))}
    </div>
  );
}
