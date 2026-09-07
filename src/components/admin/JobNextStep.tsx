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

/**
 * One card that answers "what do I do next on this job?"
 */
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
          {p.customerFirstName} requested {p.pendingVisitCount === 1 ? "a time" : `${p.pendingVisitCount} times`}.
          Confirm or decline it in the Visit section below.
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
      title: p.hasOptions ? `Pricing is ready — send it to ${name}` : `Send ${name} pricing`,
      body: p.hasOptions
        ? "You already have options on this job. Saving them moves the job to “Pricing ready” and shows them in the portal."
        : "Fill in Good / Better / Best below and hit Save. The customer picks one in their portal — no PDF, no back-and-forth.",
      primary: { label: p.hasOptions ? "Review pricing" : "Set pricing", href: "#pricing" },
      secondary: { label: "Schedule a visit first", href: "#visit" },
    };
  }

  if (p.status === "estimate_ready") {
    if (p.selectedOption) {
      return {
        title: `${name} picked “${p.selectedOption.name}” (${money(p.selectedOption.price_cents)})`,
        body: "Lock in the date and take a deposit so the job is real on both sides.",
        primary: { label: "Schedule the visit", href: "#visit" },
        secondary: { label: "Request a deposit", href: "#payments" },
      };
    }
    return {
      title: `Waiting on ${name} to pick an option`,
      body: p.customerSignedIn
        ? "They've logged in and can see your pricing. You can still schedule the visit or ask for a deposit now."
        : "They haven't logged into the portal yet. Email them the password setup (right side) so they can see the pricing.",
      primary: { label: "Schedule the visit", href: "#visit" },
      secondary: { label: "Request a deposit", href: "#payments" },
    };
  }

  if (p.status === "scheduled") {
    if (p.openInvoiceCents === 0 && p.paidInvoiceCents === 0) {
      return {
        title: "Visit is booked — request a deposit",
        body: "Pick a label like “Deposit”, tap a quick amount, and send. They pay by card, Cash App, or financing in the portal.",
        primary: { label: "Request a deposit", href: "#payments" },
        secondary: { label: "Start the job", onClick: () => setStatus("in_progress") },
      };
    }
    return {
      title: p.openInvoiceCents > 0 ? `${money(p.openInvoiceCents)} still unpaid` : "Deposit is in — you're set",
      body: "When you get on site, mark the job started so the customer sees progress.",
      primary: { label: "Start the job", onClick: () => setStatus("in_progress") },
      secondary: { label: "See payments", href: "#payments" },
    };
  }

  if (p.status === "in_progress") {
    return {
      title: "Work is underway",
      body:
        p.openInvoiceCents > 0
          ? `${money(p.openInvoiceCents)} is still open. When you're done, mark it complete and collect the balance.`
          : "When you're done, mark it complete and request the balance.",
      primary: { label: "Mark job done", onClick: () => setStatus("completed") },
      secondary: { label: "Request balance", href: "#payments" },
    };
  }

  // completed
  if (p.openInvoiceCents > 0) {
    return {
      title: `Job done — ${money(p.openInvoiceCents)} still owed`,
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
