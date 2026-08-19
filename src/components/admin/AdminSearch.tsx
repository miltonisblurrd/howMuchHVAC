"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function AdminSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setQ(params.get("q") || "");
  }, [params]);

  function commit(next: string) {
    const sp = new URLSearchParams(params.toString());
    if (next.trim()) sp.set("q", next.trim());
    else sp.delete("q");
    const query = sp.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <label className="relative block w-full max-w-[16.5rem]">
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-hm-muted" />
      <input
        className="hm-search"
        value={q}
        placeholder="Search..."
        onChange={(e) => {
          const next = e.target.value;
          setQ(next);
          if (timer.current) window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => commit(next), 220);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (timer.current) window.clearTimeout(timer.current);
            commit(q);
          }
        }}
      />
    </label>
  );
}
