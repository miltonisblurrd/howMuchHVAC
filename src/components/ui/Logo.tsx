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

const SRC = "/brand/NEWREDLOGO.png";
/** Cropped 3D bubble, transparent background */
const INTRINSIC = { w: 717, h: 512 };

export function Logo({
  variant: _variant = "regular",
  height = 56,
  className,
  priority,
  href = "/",
}: LogoProps) {
  const width = Math.round((height * INTRINSIC.w) / INTRINSIC.h);

  const image = (
    <Image
      src={SRC}
      alt="How Much? Air & Home Improvements"
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={cn("object-contain object-center", className)}
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
