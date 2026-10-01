import type { Appointment, Invoice, Job, JobOption, JobStatus } from "@/lib/db-types";
import { formatWhen, money } from "@/lib/db-types";
import { LOCK_IN_COPY, lockInDepositCents } from "@/lib/deposits";

/**
 * Client-facing stages. Same order as the admin stepper.
 * Step 3 has two beats: pick an option, then pay the deposit.
 */
export const CLIENT_STEPS = [
  {
    key: "request",
    label: "Request received",
    hint: "Andy will call to set a day to come look.",
  },
  {
    key: "visit",
    label: "Appointment scheduled",
    hint: "Andy comes out to look. Pricing comes after that visit.",
  },
  {
    key: "choose",
    label: "Choose your option",
    hint: "Compare Andy's options, then pay the deposit to lock the price.",
  },
  {
    key: "install",
    label: "Install day",
    hint: "The install date is confirmed after the deposit is paid.",
  },
  {
    key: "done",
    label: "Complete",
    hint: "The job is finished. Warranty and documents stay here.",
  },
] as const;

export type ClientPhase =
  | "request"
  | "visit"
  | "pick"
  | "deposit"
  | "deposit_paid"
  | "install"
  | "done"
  | "cancelled";

export type ClientSubstep = "pick" | "pay" | "paid" | null;

export type ClientStage = {
  jobId: string;
  title: string;
  service: string | null;
  city: string | null;
  status: JobStatus;
  phase: ClientPhase;
  /** 0-4, matching CLIENT_STEPS. -1 when cancelled. */
  stepIndex: number;
  label: string;
  hint: string;
  substep: ClientSubstep;
  next: {
    title: string;
    body: string;
    cta: string;
    href: string;
    tone: "wait" | "act" | "pay";
  };
  notes: { text: string; href: string }[];
  depositCents: number;
  depositPaid: boolean;
  selected: { id: string; name: string; priceCents: number } | null;
  lookVisit: Appointment | null;
  installVisit: Appointment | null;
  /** Pricing is visible. Drafts before "Pricing ready" stay hidden. */
  showOptions: boolean;
  /** Client may switch until the deposit is paid, and only while choosing. */
  canChangeOption: boolean;
};

const LOOK_TYPES = new Set<Appointment["type"]>(["diagnostic", "maintenance", "follow_up"]);

function isDeposit(invoice: Pick<Invoice, "description">) {
  return /deposit/i.test(invoice.description || "");
}

function isOpen(status: Invoice["status"]) {
  return status === "unpaid" || status === "overdue" || status === "draft";
}

function pickVisit(appointments: Appointment[], kind: "look" | "install") {
  const list = appointments.filter((a) => {
    if (a.status === "cancelled") return false;
    return kind === "install" ? a.type === "install" : LOOK_TYPES.has(a.type);
  });
  const now = Date.now();
  const upcoming = list
    .filter(
      (a) =>
        new Date(a.starts_at).getTime() >= now &&
        (a.status === "confirmed" || a.status === "pending"),
    )
    .sort((a, b) => +new Date(a.starts_at) - +new Date(b.starts_at));
  if (upcoming[0]) return upcoming[0];
  return (
    [...list].sort((a, b) => +new Date(b.starts_at) - +new Date(a.starts_at))[0] ?? null
  );
}

function stepFor(phase: ClientPhase): { stepIndex: number; label: string; hint: string } {
  if (phase === "cancelled") {
    return { stepIndex: -1, label: "Cancelled", hint: "This job was cancelled." };
  }
  if (phase === "request") return { stepIndex: 0, ...CLIENT_STEPS[0] };
  if (phase === "visit") return { stepIndex: 1, ...CLIENT_STEPS[1] };
  if (phase === "install") return { stepIndex: 3, ...CLIENT_STEPS[3] };
  if (phase === "done") return { stepIndex: 4, ...CLIENT_STEPS[4] };
  const choose = CLIENT_STEPS[2];
  if (phase === "pick") {
    return { stepIndex: 2, label: choose.label, hint: "Compare Andy's options and choose one." };
  }
  if (phase === "deposit") {
    return { stepIndex: 2, label: choose.label, hint: "Pay the deposit to lock your price and the install date." };
  }
  return {
    stepIndex: 2,
    label: choose.label,
    hint: "Your deposit is in. Andy will confirm the install day.",
  };
}

export function getClientStage(input: {
  job: Job;
  options: JobOption[];
  invoices: Invoice[];
  appointments: Appointment[];
  unreadCount?: number;
  otherOpenCents?: number;
}): ClientStage {
  const { job, options } = input;
  const project = `/portal/projects/${job.id}`;
  const messages = "/portal/messages";
  const jobInvoices = input.invoices.filter((i) => i.job_id === job.id);
  const deposits = jobInvoices.filter((i) => isDeposit(i) && i.status !== "void");
  const openDeposit = deposits.find((i) => isOpen(i.status));
  const paidDeposit = deposits.find((i) => i.status === "paid");

  const selectedOption = options.find((o) => o.id === job.selected_option_id) ?? null;
  const selected = selectedOption
    ? { id: selectedOption.id, name: selectedOption.name, priceCents: selectedOption.price_cents }
    : null;

  const expected = selected ? lockInDepositCents(selected.priceCents) : 0;
  const depositCents = openDeposit?.amount_cents ?? paidDeposit?.amount_cents ?? expected;
  const depositPaid = Boolean(selected) && !openDeposit && (Boolean(paidDeposit) || expected === 0);

  const lookVisit = pickVisit(input.appointments, "look");
  const installVisit = pickVisit(input.appointments, "install");

  let phase: ClientPhase = "request";
  if (job.status === "cancelled") phase = "cancelled";
  else if (job.status === "completed") phase = "done";
  else if (job.status === "in_progress") phase = "install";
  else if (job.status === "scheduled") phase = "visit";
  else if (job.status === "estimate_ready") {
    if (!selected) phase = "pick";
    else if (!depositPaid) phase = "deposit";
    else phase = "deposit_paid";
  } else phase = "request";

  const { stepIndex, label, hint } = stepFor(phase);
  const substep: ClientSubstep =
    phase === "pick" ? "pick" : phase === "deposit" ? "pay" : phase === "deposit_paid" ? "paid" : null;

  const when = (a: Appointment | null) => (a ? formatWhen(a.starts_at) : "");
  const lookUpcoming =
    lookVisit &&
    new Date(lookVisit.starts_at).getTime() >= Date.now() &&
    (lookVisit.status === "confirmed" || lookVisit.status === "pending");

  let next: ClientStage["next"];
  if (phase === "cancelled") {
    next = {
      title: "This job was cancelled",
      body: "Message Andy if you'd like to start again.",
      cta: "Message Andy",
      href: messages,
      tone: "wait",
    };
  } else if (phase === "request") {
    next = {
      title: "We got your request",
      body: "Andy will call to set a day to come look. You can add photos or a note anytime.",
      cta: "Add a note",
      href: messages,
      tone: "wait",
    };
  } else if (phase === "visit") {
    next = lookUpcoming
      ? {
          title: `Andy's coming out ${when(lookVisit)}`,
          body: "This visit is to look at the job. Pricing comes after Andy has seen it.",
          cta: "Message Andy",
          href: messages,
          tone: "wait",
        }
      : lookVisit
        ? {
            title: "Your appointment is done",
            body: "Pricing comes next, after he's written your options.",
            cta: "Message Andy",
            href: messages,
            tone: "wait",
          }
        : {
            title: "A visit isn't on the calendar yet",
            body: "Andy sets the day to come look. Message him if you have a time that works.",
            cta: "Message Andy",
            href: messages,
            tone: "wait",
          };
  } else if (phase === "pick") {
    next = {
      title: "Andy's quote is ready",
      body: "Compare the options. Andy marked the one he recommends.",
      cta: "Compare options",
      href: `${project}#options`,
      tone: "act",
    };
  } else if (phase === "deposit" && selected) {
    next = {
      title: `Pay your deposit to lock ${selected.name}, ${money(selected.priceCents)}`,
      body: LOCK_IN_COPY,
      cta: "Pay deposit",
      href: "/portal/pay",
      tone: "pay",
    };
  } else if (phase === "deposit_paid") {
    next = installVisit
      ? {
          title: `Install day is set for ${when(installVisit)}`,
          body: "Your deposit is in. This day is confirmed.",
          cta: "See install day",
          href: `${project}#install`,
          tone: "wait",
        }
      : {
          title: "Deposit received",
          body: "Andy will set your install day. You'll see it here once it's on the calendar.",
          cta: "Message Andy",
          href: messages,
          tone: "wait",
        };
  } else if (phase === "install") {
    next = installVisit
      ? {
          title: `Install is ${when(installVisit)}`,
          body: depositPaid
            ? "You're confirmed. Message Andy if anything comes up before the day."
            : "This day is held until the deposit is paid.",
          cta: "View details",
          href: `${project}#install`,
          tone: depositPaid ? "wait" : "pay",
        }
      : {
          title: "Install day is coming",
          body: "Andy will put the date on your calendar.",
          cta: "Message Andy",
          href: messages,
          tone: "wait",
        };
  } else {
    next = {
      title: "All done",
      body: job.warranty
        ? `Warranty: ${job.warranty} Documents stay in your portal.`
        : "Warranty and documents stay in your portal. Message Andy if anything comes up.",
      cta: "Warranty and documents",
      href: `${project}#documents`,
      tone: "wait",
    };
  }

  const notes: ClientStage["notes"] = [];
  if ((input.unreadCount || 0) > 0) {
    notes.push({
      text: "Andy sent a message.",
      href: messages,
    });
  }
  if ((input.otherOpenCents || 0) > 0) {
    notes.push({
      text: `${money(input.otherOpenCents || 0)} is open on another job.`,
      href: "/portal/pay",
    });
  }
  const otherOpenOnJob = jobInvoices
    .filter((i) => isOpen(i.status) && !isDeposit(i))
    .reduce((sum, i) => sum + i.amount_cents, 0);
  if (otherOpenOnJob > 0 && phase !== "deposit") {
    notes.push({
      text: `${money(otherOpenOnJob)} is still open on this job.`,
      href: "/portal/pay",
    });
  }
  if (phase === "install" && !depositPaid && depositCents > 0) {
    notes.push({
      text: `Pay the ${money(depositCents)} deposit to confirm the install date.`,
      href: "/portal/pay",
    });
  }

  const showOptions =
    (job.status === "estimate_ready" || job.status === "in_progress" || job.status === "completed") &&
    options.length > 0;

  return {
    jobId: job.id,
    title: job.title,
    service: job.service,
    city: job.city,
    status: job.status,
    phase,
    stepIndex,
    label,
    hint,
    substep,
    next,
    notes,
    depositCents,
    depositPaid,
    selected,
    lookVisit,
    installVisit,
    showOptions,
    canChangeOption: job.status === "estimate_ready" && !depositPaid,
  };
}
