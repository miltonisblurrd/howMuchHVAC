import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

type LogoProps = {
  variant?: "regular" | "white" | "mark";
  /** Height in pixels — single source of truth for sizing */
  height?: number;
  className?: string;
  priority?: boolean;
  /** Pass `null` to render without a link */
  href?: string | null;
};

const intrinsic = {
  regular: { w: 665, h: 400 },
  white: { w: 258, h: 155 },
  mark: { w: 256, h: 256 },
} as const;

export function Logo({
  variant = "regular",
  height = 56,
  className,
  priority,
  href = "/",
}: LogoProps) {
  const src =
    variant === "white"
      ? "/brand/whitelogo.svg"
      : variant === "mark"
        ? "/brand/blackSubLogo.svg"
        : "/brand/regularLogo.svg";

  const { w, h } = intrinsic[variant];
  const width = Math.round((height * w) / h);

  const image = (
    <Image
      src={src}
      alt="How Much? Air & Home Improvements"
      width={width}
      height={height}
      priority={priority}
      className={cn("object-contain object-left", className)}
      style={{ width, height }}
    />
  );

  if (href === null || href === "") return image;
  return (
    <Link
      href={href}
      aria-label="How Much? home"
      className="inline-flex shrink-0 items-center"
      style={{ height }}
    >
      {image}
    </Link>
  );
}
