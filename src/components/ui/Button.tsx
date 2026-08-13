import Link from "next/link";
import { cn } from "@/lib/cn";
import { titleCaseWords } from "@/lib/titleCase";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";
/** Surface the button sits on — fixes invisible white-on-white ghost/outline */
type Tone = "light" | "dark";

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-[3.25rem] px-8 text-base",
};

function variantClasses(variant: Variant, tone: Tone) {
  if (variant === "primary") {
    return "bg-hm-red text-white hover:bg-hm-red-deep shadow-[0_12px_28px_-12px_rgba(255,29,37,0.75)]";
  }
  if (variant === "secondary") {
    return tone === "dark"
      ? "bg-white text-hm-charcoal hover:bg-hm-gray"
      : "bg-hm-charcoal text-white hover:bg-hm-ink";
  }
  if (variant === "outline") {
    return tone === "dark"
      ? "border border-white/35 bg-transparent text-white hover:bg-white/10"
      : "border border-hm-charcoal/20 bg-transparent text-hm-charcoal hover:border-hm-charcoal/40 hover:bg-hm-charcoal/[0.03]";
  }
  // ghost
  return tone === "dark"
    ? "bg-transparent text-white hover:bg-white/10"
    : "bg-transparent text-hm-charcoal hover:bg-hm-charcoal/[0.05]";
}

function shouldShowArrow(href: string | undefined, arrow: boolean | undefined) {
  if (arrow === false) return false;
  if (arrow === true) return true;
  if (!href) return true; // form / action CTAs
  if (href.startsWith("tel:") || href.startsWith("mailto:")) return false;
  return true;
}

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  tone?: Tone;
  /** Trailing → on CTA buttons. Defaults on except tel/mailto. */
  arrow?: boolean;
};

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

function formatLabel(children: React.ReactNode) {
  if (typeof children === "string") return titleCaseWords(children.trim());
  return children;
}

function withArrow(children: React.ReactNode, show: boolean) {
  const label = formatLabel(children);
  if (!show) return label;
  return (
    <span className="inline-flex items-center gap-2">
      <span className="leading-none">{label}</span>
      <span
        aria-hidden
        className="inline-flex h-[1em] w-[1em] shrink-0 items-center justify-center text-[1.1em] leading-none"
      >
        {"\u2192"}
      </span>
    </span>
  );
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  tone = "light",
  arrow,
  href,
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const showArrow = shouldShowArrow(href, arrow);
  const content = withArrow(children, showArrow);

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-display font-semibold tracking-tight transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hm-red/45 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses(variant, tone),
    sizes[size],
    className,
  );

  if (href) {
    const external =
      href.startsWith("http") ||
      href.startsWith("tel:") ||
      href.startsWith("mailto:") ||
      href.startsWith("#");

    if (external) {
      return (
        <a
          href={href}
          className={classes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    const { onClick, ...rest } = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={href} className={classes} onClick={onClick} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
