import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CountUp } from "@/components/admin/CountUp";

export function AdminCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <section className={cn("hm-admin-card p-5", className)}>{children}</section>;
}

export function AdminCardHeader({
  title,
  caption,
  action,
}: {
  title: string;
  caption?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-[15px] font-bold tracking-tight text-hm-charcoal">{title}</h2>
        {caption ? <p className="mt-0.5 text-sm text-hm-muted">{caption}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function AdminChip({
  active,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-xl border bg-white px-3 font-display text-[13px] font-semibold transition",
        active
          ? "border-hm-charcoal/15 text-hm-charcoal shadow-[0_1px_2px_rgba(18,21,26,0.06)]"
          : "border-hm-line text-hm-muted hover:border-hm-charcoal/20 hover:text-hm-charcoal",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminLinkChip({
  active,
  href,
  children,
}: {
  active?: boolean;
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-xl border bg-white px-3 font-display text-[13px] font-semibold transition",
        active
          ? "border-hm-charcoal/15 text-hm-charcoal shadow-[0_1px_2px_rgba(18,21,26,0.06)]"
          : "border-hm-line text-hm-muted hover:border-hm-charcoal/20 hover:text-hm-charcoal",
      )}
    >
      {children}
    </a>
  );
}

const iconTones = {
  green: "bg-emerald-500/15 text-emerald-700",
  blue: "bg-sky-500/15 text-sky-700",
  amber: "bg-amber-500/15 text-amber-800",
  red: "bg-hm-red/12 text-hm-red",
  slate: "bg-hm-charcoal/8 text-hm-charcoal",
} as const;

export function AdminKpi({
  href,
  icon: Icon,
  tone = "slate",
  label,
  value,
  hint,
  hintTone,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: keyof typeof iconTones;
  label: string;
  value: string;
  hint?: string;
  hintTone?: "up" | "down" | "muted";
}) {
  return (
    <a
      href={href}
      className="hm-admin-card hm-admin-click group flex flex-col p-4"
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-lg",
            iconTones[tone],
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <p className="font-display text-[13px] font-semibold text-hm-muted">{label}</p>
      </div>
      <p className="mt-4 font-display text-[1.65rem] font-bold leading-none tracking-tight text-hm-charcoal">
        <CountUp value={value} />
      </p>
      {hint ? (
        <p
          className={cn(
            "mt-2 text-xs font-semibold",
            hintTone === "up" && "text-emerald-600",
            hintTone === "down" && "text-hm-red",
            (!hintTone || hintTone === "muted") && "text-hm-muted",
          )}
        >
          {hint}
        </p>
      ) : (
        <p className="mt-2 text-xs text-transparent">.</p>
      )}
    </a>
  );
}

export function AdminEmpty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-hm-line bg-white px-6 py-10 text-center text-sm text-hm-muted">
      {children}
    </p>
  );
}

export function AdminQuietLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="shrink-0 text-[13px] font-semibold text-hm-red hover:text-hm-red-deep">
      {children}
    </a>
  );
}
