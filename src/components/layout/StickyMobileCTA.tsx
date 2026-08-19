"use client";

import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useContact } from "@/components/contact/ContactProvider";

export function StickyMobileCTA() {
  const contact = useContact();
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-hm-line bg-white/95 p-3 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <Button href={contact.directHref} variant="outline" tone="light" className="flex-1" size="md">
          <Phone className="h-4 w-4 text-hm-red" />
          Call {contact.displayName}
        </Button>
        <Button href="/booking" className="flex-[1.4]" size="md">
          Get A Quote
        </Button>
      </div>
    </div>
  );
}
