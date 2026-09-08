import type { Appointment, Invoice, Job, JobStatus } from "@/lib/db-types";
import { money } from "@/lib/db-types";

export type NextAction = {
  title: string;
  body: string;
  href: string;
  cta: string;
  tone: "wait" | "act" | "pay";
};

export function customerNextAction(input: {
  jobs: Job[];
  unpaid: Invoice[];
  unread: number;
  nextAppt: Appointment | null;
}): NextAction {
  const { jobs, unpaid, unread, nextAppt } = input;
  const due = unpaid.reduce((s, i) => s + i.amount_cents, 0);
  const active = jobs.filter((j) => j.status !== "completed" && j.status !== "cancelled");
  const primary = active[0];

  if (due > 0) {
    return {
      title: "Payment due",
      body: `${money(due)} is open. Pay securely online, or call Andy if you have questions.`,
      href: "/portal/pay",
      cta: "Pay now",
      tone: "pay",
    };
  }

  if (unread > 0) {
    return {
      title: "Andy sent a message",
      body: "There's a note waiting in your thread. Reply there or call if it's easier.",
      href: "/portal/messages",
      cta: "Read message",
      tone: "act",
    };
  }

  if (nextAppt?.status === "pending") {
    return {
      title: "Time requested",
      body: "Andy will confirm this visit. You can still call if you need a different day.",
      href: primary ? `/portal/projects/${primary.id}` : "/portal",
      cta: "See visit",
      tone: "wait",
    };
  }

  if (nextAppt?.status === "confirmed") {
    return {
      title: primary?.status === "in_progress" ? "Install day is set" : "Andy is coming out to look",
      body:
        primary?.status === "in_progress"
          ? "Your project date is on the calendar. Add questions or photos in messages anytime."
          : "This first visit is to look at the job. Pricing comes after Andy has seen it.",
      href: primary ? `/portal/projects/${primary.id}` : "/portal/messages",
      cta: "View job",
      tone: "wait",
    };
  }

  if (primary?.status === "scheduled") {
    return {
      title: "Visit is booked",
      body: "Andy will come look first, then send clear pricing options in your portal.",
      href: primary ? `/portal/projects/${primary.id}` : "/portal/messages",
      cta: "View job",
      tone: "wait",
    };
  }

  if (primary?.status === "estimate_ready" || primary?.selected_option_id) {
    return {
      title: "Review your options",
      body: "Andy posted packages. Pick one, request a visit time, or call to talk it through.",
      href: `/portal/projects/${primary.id}`,
      cta: "See options",
      tone: "act",
    };
  }

  if (primary?.status === "quote_request" || jobs.length > 0) {
    return {
      title: "We got your request",
      body: "Andy's team will follow up with clear next steps. Meanwhile you can send photos or questions here.",
      href: "/portal/messages",
      cta: "Message the team",
      tone: "wait",
    };
  }

  return {
    title: "How can we help?",
    body: "Request service from the portal, or call Andy. No pressure — options first.",
    href: "/portal/request",
    cta: "Request service",
    tone: "act",
  };
}

export function jobCardCta(
  status: JobStatus,
  jobId: string,
  hasUnpaid: boolean,
): {
  href: string;
  label: string;
} {
  if (hasUnpaid) return { href: "/portal/pay", label: "Pay invoice" };
  if (status === "estimate_ready") {
    return { href: `/portal/projects/${jobId}`, label: "Review options" };
  }
  if (status === "scheduled") return { href: `/portal/projects/${jobId}`, label: "See visit" };
  if (status === "quote_request") return { href: "/portal/messages", label: "Add details" };
  return { href: `/portal/projects/${jobId}`, label: "Open job" };
}
