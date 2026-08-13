"use client";

import { Button } from "@/components/ui/Button";

export function PrintButton({
  label = "Print Or Save As PDF", // Title Case for CTA consistency
  tone = "dark",
  variant = "primary",
}: {
  label?: string;
  tone?: "light" | "dark";
  variant?: "primary" | "secondary" | "outline";
}) {
  return (
    <Button type="button" tone={tone} variant={variant} onClick={() => window.print()}>
      {label}
    </Button>
  );
}
