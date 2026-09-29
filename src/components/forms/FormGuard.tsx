"use client";

import { useEffect, useRef, useState } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      appearance?: "always" | "execute" | "interaction-only";
      theme?: "light" | "dark" | "auto";
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let turnstileLoader: Promise<void> | null = null;

function loadTurnstile() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (turnstileLoader) return turnstileLoader;
  turnstileLoader = new Promise((resolve, reject) => {
    const existing = document.getElementById("cf-turnstile-script") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("turnstile")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = "cf-turnstile-script";
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("turnstile"));
    document.head.appendChild(script);
  });
  return turnstileLoader;
}

export function useFormGuard() {
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [formToken, setFormToken] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [challenge, setChallenge] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    let cancelled = false;

    async function load(attempt: number) {
      try {
        const res = await fetch("/api/form-challenge", { cache: "no-store" });
        const data = (await res.json()) as { token?: string };
        if (cancelled) return;
        if (data.token) {
          setFormToken(data.token);
          setChallenge("ready");
          return;
        }
      } catch {
        /* retry below */
      }
      if (cancelled) return;
      if (attempt < 2) {
        window.setTimeout(() => void load(attempt + 1), 800);
        return;
      }
      setChallenge("failed");
    }

    void load(0);
    return () => {
      cancelled = true;
    };
  }, []);

  function payload() {
    return {
      honeypot: honeypotRef.current?.value || "",
      formToken,
      ...(turnstileToken ? { turnstileToken } : {}),
    };
  }

  function notReadyMessage() {
    if (challenge === "loading") return "Still loading the form. Try again in a second.";
    if (!formToken) return "Refresh the page and try again.";
    if (SITE_KEY && !turnstileToken) return "Still checking this form. Try again in a second.";
    return null;
  }

  return { honeypotRef, setTurnstileToken, payload, notReadyMessage };
}

export function HoneypotField({ inputRef }: { inputRef: React.RefObject<HTMLInputElement | null> }) {
  return (
    <div className="absolute left-0 top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
      <label>
        Fax
        <input
          ref={inputRef}
          type="text"
          name="hm_extra"
          tabIndex={-1}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          defaultValue=""
          data-lpignore="true"
          data-1p-ignore="true"
        />
      </label>
    </div>
  );
}

export function TurnstileField({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return;
    let widgetId = "";
    let cancelled = false;

    loadTurnstile()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        widgetId = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          appearance: "interaction-only",
          theme: "light",
          callback: onToken,
          "expired-callback": () => onToken(""),
          "error-callback": () => onToken(""),
        });
      })
      .catch(() => onToken(""));

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onToken]);

  if (!SITE_KEY) return null;
  return <div ref={ref} className="mt-3 min-h-0" />;
}
