"use client";

import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useContact } from "@/components/contact/ContactProvider";
import { cn } from "@/lib/cn";

type CallButtonProps = {
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  tone?: "light" | "dark";
  arrow?: boolean;
  title?: string;
  children?: React.ReactNode;
};

export function CallAndy({ children, ...props }: CallButtonProps) {
  const contact = useContact();
  return (
    <Button href={contact.directHref} {...props}>
      {children ?? `Call ${contact.displayName}`}
    </Button>
  );
}

export function CallAndyPhone(props: CallButtonProps) {
  const contact = useContact();
  return (
    <Button href={contact.directHref} {...props}>
      <Phone className="h-3.5 w-3.5" />
      {contact.directDisplay}
    </Button>
  );
}

export function DirectPhone({ className }: { className?: string }) {
  const contact = useContact();
  return (
    <a href={contact.directHref} className={className}>
      {contact.directDisplay}
    </a>
  );
}

export function AndyName() {
  return <>{useContact().displayName}</>;
}

export function PublicEmail({ className }: { className?: string }) {
  const contact = useContact();
  return (
    <a href={`mailto:${contact.publicEmail}`} className={className}>
      {contact.publicEmail}
    </a>
  );
}

export function AndyAvatar({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const contact = useContact();
  const initial = (contact.displayName.trim()[0] || "A").toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-hm-line bg-hm-fog font-bold text-hm-charcoal",
        size === "sm" && "h-8 w-8 text-xs",
        size === "md" && "h-10 w-10 text-sm",
        size === "lg" && "h-16 w-16 text-lg",
        className,
      )}
    >
      {contact.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={contact.avatarUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </span>
  );
}

export function CallAndyHero() {
  const contact = useContact();
  return (
    <a
      href={contact.directHref}
      className="inline-flex items-center gap-2.5 font-display text-lg font-bold text-white transition hover:text-hm-red"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-hm-red text-white shadow-[0_8px_24px_-8px_rgba(255,29,37,0.8)]">
        <Phone className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
          Call {contact.displayName} direct
        </span>
        {contact.directDisplay}
      </span>
    </a>
  );
}
