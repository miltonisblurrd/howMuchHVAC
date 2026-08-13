import { Star } from "lucide-react";
import type { Review } from "@/lib/reviews";
import { cn } from "@/lib/cn";

export function ReviewCard({
  review,
  tone = "light",
  className,
  clamp = false,
}: {
  review: Review;
  tone?: "light" | "brand" | "dark";
  className?: string;
  clamp?: boolean;
}) {
  const quote =
    clamp && review.quote.length > 240
      ? `${review.quote.slice(0, 240).trim()}?`
      : review.quote;

  return (
    <figure
      className={cn(
        "rounded-2xl p-6",
        tone === "brand" && "bg-hm-red text-white",
        tone === "dark" && "bg-hm-charcoal text-white",
        tone === "light" && "border border-hm-line bg-hm-fog text-hm-charcoal",
        className,
      )}
    >
      <div
        className={cn(
          "flex gap-0.5",
          tone === "light" ? "text-hm-red" : "text-amber-300",
        )}
      >
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-current" />
        ))}
      </div>
      <blockquote
        className={cn(
          "mt-4 text-sm leading-relaxed",
          tone === "light" ? "text-hm-charcoal" : "text-white/95",
        )}
      >
        ?{quote}?
      </blockquote>
      <figcaption
        className={cn(
          "mt-4 font-display text-sm font-bold",
          tone === "light" ? "text-hm-charcoal" : "text-white",
        )}
      >
        {review.name}
        <span
          className={cn(
            "mt-1 block text-xs font-medium",
            tone === "light" ? "text-hm-muted" : "text-white/60",
          )}
        >
          Google Review{review.when ? ` ? ${review.when}` : ""}
          {review.rating === 4 ? " ? 4 stars" : ""}
        </span>
      </figcaption>
    </figure>
  );
}
