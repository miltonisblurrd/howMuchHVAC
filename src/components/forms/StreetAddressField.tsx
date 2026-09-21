"use client";

import { useEffect, useId, useRef, useState } from "react";

type Suggestion = { label: string; street: string; city: string };

export function StreetAddressField({
  address,
  onAddress,
  onCity,
}: {
  address: string;
  onAddress: (value: string) => void;
  onCity: (city: string) => void;
}) {
  const listId = useId();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const skipFetch = useRef(false);

  useEffect(() => {
    if (skipFetch.current) {
      skipFetch.current = false;
      return;
    }
    const query = address.trim();
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    const handle = window.setTimeout(async () => {
      const res = await fetch(`/api/address-suggest?q=${encodeURIComponent(query)}`);
      const data = await res.json().catch(() => ({ suggestions: [] }));
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
      setOpen(true);
    }, 300);
    return () => window.clearTimeout(handle);
  }, [address]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function pick(item: Suggestion) {
    skipFetch.current = true;
    onAddress(item.street || item.label);
    if (item.city) onCity(item.city);
    setOpen(false);
    setSuggestions([]);
  }

  return (
    <div ref={box} className="relative">
      <input
        className="hm-input mt-1 h-12 bg-white"
        autoComplete="off"
        aria-autocomplete="list"
        aria-controls={listId}
        value={address}
        onChange={(e) => onAddress(e.target.value)}
        onFocus={() => suggestions.length && setOpen(true)}
        placeholder="Start typing and pick the matching address"
      />
      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-hm-line bg-white py-1 shadow-lg"
        >
          {suggestions.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm hover:bg-hm-fog"
                onClick={() => pick(item)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
