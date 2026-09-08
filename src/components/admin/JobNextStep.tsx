"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { JobStatus } from "@/lib/db-types";
import { money } from "@/lib/db-types";

type Props = {
  jobId: string;
  status: JobStatus;
  customerFirstName: string;
  hasOptions: boolean;
  selectedOption: { name: string; price_cents: number } | null;
  hasUpcomingVisit: boolean;
  pendingVisitCount: number;
  openInvoiceCents: number;
  paidInvoiceCents: number;
  customerSignedIn: boolean;
};

export function JobNextStep(p: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function setStatus(status: JobStatus) {
    setBusy(true);
    setErr("");
    const res = await fetch("/api/admin/jobs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: p.jobId, status }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErr(data.error || "Couldn't update.");
      return;
    }
    router.refresh();
  }

  const step = pickStep(p, setStatus);
  if (!step) return null;

  return (
    <section className="rounded-2xl border border-hm-red/25 bg-[linear-gradient(135deg,#fff7f7,white_55%)] p-5 shadow-[0_18px_40px_-28px_rgba(255,29,37,0.55)]">
      <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-hm-red">
        Next step
      </p>
      <h2 className="mt-1.5 font-display text-xl font-bold tracking-tight text-hm-charcoal">
        {step.title}
      </h2>
      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-hm-muted">{step.body}</p>

      {p.pendingVisitCount > 0 && (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-950">
          {p.customerFirstName} requested{" "}
          {p.pendingVisitCount === 1 ? "a time" : `${p.pendingVisitCount} times`}. Confirm or
          decline it in Appointments below.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {step.primary.href ? (
          <Button href={step.primary.href} size="sm" arrow={false}>
            <span className="inline-flex items-center gap-2">
              {step.primary.label} <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        ) : (
          <Button type="button" size="sm" arrow={false} disabled={busy} onClick={step.primary.onClick}>
            {step.primary.label}
          </Button>
        )}
        {step.secondary &&
          (step.secondary.href ? (
            <Button href={step.secondary.href} size="sm" variant="outline" arrow={false}>
              {step.secondary.label}
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              arrow={false}
              disabled={busy}
              onClick={step.secondary.onClick}
            >
              {step.secondary.label}
            </Button>
          ))}
      </div>
      {err && <p className="mt-2 text-sm text-hm-red">{err}</p>}
    </section>
  );
}

type Action = { label: string; href?: string; onClick?: () => void };
type Step = { title: string; body: string; primary: Action; secondary?: Action };

function pickStep(p: Props, setStatus: (s: JobStatus) => void): Step | null {
  const name = p.customerFirstName;

  if (p.status === "cancelled") return null;

  if (p.status === "quote_request") {
    return {
      title: `Set a day to go look at ${name}'s place`,
      body: "Andy prices after he's seen the job. Book the first visit, then write Good / Better / Best when you know what they need.",
      primary: { label: "Schedule first visit", href: "#visit" },
    };
  }

  if (p.status === "scheduled") {
    return {
      title: p.hasOptions
        ? `Send ${name} the pricing from the visit`
        : `After the look-over, set ${name}'s pricing`,
      body: p.hasOptions
        ? "Options are drafted. Save them so they show in the portal, then book the install."
        : "Once you've seen the unit, fill in Good / Better / Best. That's when the real quote goes out.",
      primary: { label: p.hasOptions ? "Review pricing" : "Set pricing", href: "#pricing" },
      secondary: { label: "Change first visit", href: "#visit" },
    };
  }

  if (p.status === "estimate_ready") {
    if (p.selectedOption) {
      return {
        title: `${name} picked "${p.selectedOption.name}" (${money(p.selectedOption.price_cents)})`,
        body: "Lock the install / project date and take a deposit so the job is real on both sides.",
        primary: { label: "Set install date", href: "#install" },
        secondary: { label: "Request a deposit", href: "#payments" },
      };
    }
    return {
      title: `Set the install / project date`,
      body: p.customerSignedIn
        ? `${name} can see pricing in the portal. Book the install day, or ask for a deposit now.`
        : `${name} hasn't logged in yet. You can still set the install date, or email them the portal setup.`,
      primary: { label: "Set install date", href: "#install" },
      secondary: { label: "Request a deposit", href: "#payments" },
    };
  }

  if (p.status === "in_progress") {
    return {
      title: "Install / project is on the calendar",
      body:
        p.openInvoiceCents > 0
          ? `${money(p.openInvoiceCents)} is still open. When the work is finished, mark it done.`
          : "When you're on site or the install is finished, mark it done and collect any balance.",
      primary: { label: "Mark job done", onClick: () => setStatus("completed") },
      secondary: { label: "Request balance", href: "#payments" },
    };
  }

  if (p.openInvoiceCents > 0) {
    return {
      title: `Job done - ${money(p.openInvoiceCents)} still owed`,
      body: "Resend the pay link or mark it paid if they paid cash or check.",
      primary: { label: "Go to payments", href: "#payments" },
    };
  }
  return {
    title: "All wrapped up",
    body: `Nothing left to do here. ${name} can message you from the portal if anything comes up.`,
    primary: { label: "Back to jobs", href: "/admin/jobs" },
  };
}
