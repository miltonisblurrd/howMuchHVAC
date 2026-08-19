"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X } from "lucide-react";
import { AdminAssistant } from "@/components/admin/AdminAssistant";

export function AdminAssistantBubble() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (pathname.startsWith("/admin/login")) return null;

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {open && (
        <div className="pointer-events-auto mb-3 flex h-[min(70vh,560px)] w-[min(calc(100vw-2rem),400px)] flex-col overflow-hidden rounded-2xl border border-hm-line bg-white shadow-[0_24px_60px_-20px_rgba(18,21,26,0.45)]">
          <div className="flex items-center justify-between gap-3 border-b border-hm-line px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-hm-red text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-hm-charcoal">Ask How Much?</p>
                <p className="text-[11px] text-hm-muted">Demo assistant ? stays on this page</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="rounded-lg p-1.5 text-hm-muted hover:bg-hm-fog hover:text-hm-charcoal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <AdminAssistant />
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        aria-expanded={open}
        className="pointer-events-auto ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-hm-red text-white shadow-[0_12px_28px_-8px_rgba(255,29,37,0.7)] transition hover:bg-hm-red-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hm-red/45 focus-visible:ring-offset-2"
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </button>
    </div>
  );
}
