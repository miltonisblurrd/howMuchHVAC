import type { AppointmentType, JobStatus } from "@/lib/db-types";

/**
 * Plain-English job stages for Andy's admin. Order = the natural path of a job.
 * `cancelled` is handled separately (it is a side exit, not a step).
 */
export const JOB_STAGES: {
  status: Exclude<JobStatus, "cancelled">;
  label: string;
  short: string;
  hint: string;
}[] = [
  {
    status: "quote_request",
    label: "New request",
    short: "Request",
    hint: "Customer asked for help. Send them pricing.",
  },
  {
    status: "estimate_ready",
    label: "Pricing ready",
    short: "Pricing",
    hint: "They can see Good / Better / Best in their portal.",
  },
  {
    status: "scheduled",
    label: "Visit scheduled",
    short: "Scheduled",
    hint: "Date is on the calendar. Customer got an email.",
  },
  {
    status: "in_progress",
    label: "Work started",
    short: "Working",
    hint: "You're on site or the install is underway.",
  },
  {
    status: "completed",
    label: "Done",
    short: "Done",
    hint: "Job finished. Collect any balance.",
  },
];

export function stageIndex(status: JobStatus) {
  return JOB_STAGES.findIndex((s) => s.status === status);
}

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  diagnostic: "Diagnostic / estimate visit",
  install: "Install",
  maintenance: "Maintenance",
  follow_up: "Follow-up",
};

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Customer requested — needs your OK",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** Quick labels for a payment request. Andy asked for more than "Deposit". */
export const INVOICE_LABEL_PRESETS = [
  "Deposit",
  "Progress payment",
  "Balance",
  "Final payment",
  "Service call",
] as const;

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  unpaid: "Waiting on payment",
  paid: "Paid",
  overdue: "Overdue",
  void: "Voided",
};
