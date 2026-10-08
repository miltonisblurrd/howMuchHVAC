"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { AndyAvatar, AndyName, DirectPhone } from "@/components/contact/CallAndy";
import { useContact } from "@/components/contact/ContactProvider";
import { onboardingStorageKey } from "@/lib/profile-display";

function IntroVideo() {
  const contact = useContact();
  const [failed, setFailed] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const src = site.portalIntroVideo;
  const youtube = /youtube\.com|youtu\.be/.test(src);
  const vimeo = /vimeo\.com/.test(src);

  useEffect(() => {
    if (!src || youtube || vimeo) return;
    let cancelled = false;
    fetch(src, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setAvailable(res.ok);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, [src, youtube, vimeo]);

  const header = (
    <div className="mb-3 flex items-center gap-3">
      <AndyAvatar size="md" className="border-white/20 bg-white/10 text-white" />
      <div>
        <p className="font-display text-sm font-bold text-white">Welcome from {contact.displayName}</p>
        <p className="text-xs text-white/60">A quick hello before you look around.</p>
      </div>
    </div>
  );

  if (failed || !src || available === false) return null;
  if (!youtube && !vimeo && available !== true) return null;

  if (youtube || vimeo) {
    const embed = youtube
      ? src.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/")
      : src.replace("vimeo.com/", "player.vimeo.com/video/");
    return (
      <div>
        {header}
        <iframe
          title={`Welcome from ${contact.displayName}`}
          src={embed}
          className="aspect-video w-full rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div>
      {header}
      <video
        className="aspect-video w-full rounded-xl bg-hm-ink object-cover"
        controls
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
      >
        <source src={src} />
      </video>
    </div>
  );
}

export function PortalOnboarding({
  userId,
  firstName,
  open,
  onClose,
}: {
  userId: string;
  firstName: string;
  open: boolean;
  onClose: () => void;
}) {
  const contact = useContact();
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: `Hey ${firstName}`,
      body: `This portal is your job home. Options, visit times, messages, and invoices all land here. No pressure, and you can always call ${contact.displayName}.`,
    },
    {
      title: "Find your way in 10 seconds",
      body: "Everything you need is in the left menu. Here's what each one is for.",
    },
    {
      title: "You're set",
      body: "Add your home address anytime from the circle by your name. If something's unclear, message us or call.",
    },
  ] as const;
  const last = step === steps.length - 1;

  const navGuide = [
    { label: "Dashboard", detail: "Your next step, jobs, and upcoming visit." },
    { label: "Message Andy", detail: `Ask ${contact.displayName} a question or send photos of the unit.` },
    { label: "Your Past Services", detail: "Finished jobs. Open the project or download receipts." },
    { label: "Home Tips and Resources", detail: "Filter changes, how-tos, and when to call." },
    { label: "Pay", detail: "Invoices when they are ready. Pay online." },
    { label: "Request service", detail: "The red button starts a new job." },
  ];

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function finish() {
    try {
      localStorage.setItem(onboardingStorageKey(userId), "1");
    } catch {
      /* ignore */
    }
    await fetch("/api/portal/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onboardingCompleted: true }),
    }).catch(() => undefined);
    onClose();
  }

  if (!open) return null;

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-hm-ink/60 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.45)] sm:p-7"
      >
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-hm-red">
          Step {step + 1} of {steps.length}
        </p>
        <h2 id="onboarding-title" className="mt-2 font-display text-2xl font-bold tracking-tight">
          {current.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-hm-muted">{current.body}</p>

        {step === 0 && (
          <div className="mt-5">
            <IntroVideo />
          </div>
        )}

        {step === 1 && (
          <ul className="mt-5 space-y-2">
            {navGuide.map((item) => (
              <li
                key={item.label}
                className="flex items-start gap-3 rounded-xl border border-hm-line bg-hm-fog px-3 py-2.5"
              >
                <span className="mt-0.5 font-display text-sm font-bold text-hm-charcoal">
                  {item.label}
                </span>
                <span className="text-sm text-hm-muted">{item.detail}</span>
              </li>
            ))}
          </ul>
        )}

        {step === 2 && (
          <div className="mt-5 rounded-xl border border-hm-line bg-hm-fog px-4 py-3 text-sm text-hm-muted">
            Tap the circle next to your name anytime to add your home address or update your info.
          </div>
        )}

        <div className="mt-6 flex items-center gap-2">
          {steps.map((_, i) => (
            <span
              key={i}
              className={
                i === step ? "h-1.5 flex-1 rounded-full bg-hm-red" : "h-1.5 flex-1 rounded-full bg-hm-gray"
              }
            />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            className="text-sm font-semibold text-hm-muted hover:text-hm-charcoal"
            onClick={finish}
          >
            Skip
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                tone="light"
                size="sm"
                arrow={false}
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </Button>
            )}
            {last ? (
              <Button type="button" size="sm" onClick={finish}>
                Let's go
              </Button>
            ) : (
              <Button type="button" size="sm" arrow={false} onClick={() => setStep((s) => s + 1)}>
                Next
              </Button>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-hm-muted">
          Prefer voice? Call <AndyName /> at{" "}
          <DirectPhone className="font-semibold text-hm-red" />
        </p>
      </div>
    </div>
  );
}
