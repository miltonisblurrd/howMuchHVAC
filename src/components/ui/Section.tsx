import { cn } from "@/lib/cn";

export function Section({
  children,
  className,
  id,
  tone = "fog",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: "default" | "dark" | "white" | "fog" | "red";
}) {
  const tones = {
    default: "hm-gradient-mesh text-hm-charcoal",
    dark: "bg-hm-ink text-white",
    white: "bg-white text-hm-charcoal",
    fog: "bg-hm-fog text-hm-charcoal",
    red: "bg-hm-red text-white",
  };

  return (
    <section id={id} className={cn("relative py-16 md:py-24", tones[tone], className)}>
      {children}
    </section>
  );
}

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 md:px-8", className)}>{children}</div>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-display text-[11px] font-bold uppercase tracking-[0.24em] text-hm-red",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Heading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "font-display font-bold tracking-[-0.03em] text-balance",
        Tag === "h1" && "text-4xl leading-[1.05] md:text-6xl",
        Tag === "h2" && "text-3xl leading-[1.1] md:text-[2.75rem]",
        Tag === "h3" && "text-2xl leading-tight md:text-3xl",
        // Inherit from Section tone unless overridden
        !className?.includes("text-") && "text-current",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
