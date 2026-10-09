"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useContact } from "@/components/contact/ContactProvider";
import { cn } from "@/lib/cn";

export function StickyMobileCTA() {
  const contact = useContact();
  const [shown, setShown] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 48) setShown(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!shown) return;
    setPulse(true);
  }, [shown]);

  return (
    <div
      className={cn(
        "hm-sticky-cta fixed inset-x-0 bottom-0 z-50 border-t border-hm-line bg-white/95 p-3 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur md:hidden",
        shown && "is-in",
        !shown && "pointer-events-none",
      )}
      aria-hidden={!shown}
    >
      <div className="mx-auto flex max-w-lg gap-2">
        <Button
          href={contact.directHref}
          variant="outline"
          tone="light"
          className={cn("flex-1", pulse && "hm-pulse-once")}
          size="md"
          tabIndex={shown ? 0 : -1}
        >
          <Phone className="h-4 w-4 text-hm-red" />
          Call {contact.displayName}
        </Button>
        <Button href="/booking" className="flex-[1.4]" size="md" tabIndex={shown ? 0 : -1}>
          Get A Quote
        </Button>
      </div>
    </div>
  );
}
