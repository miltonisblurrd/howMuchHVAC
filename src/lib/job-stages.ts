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
    hint: "They're in. Set a day to go look before you price it.",
  },
  {
    status: "scheduled",
    label: "Appointment scheduled",
    short: "Look",
    hint: "First visit is booked. You'll price it after you've seen the job.",
  },
  {
    status: "estimate_ready",
    label: "Pricing ready",
    short: "Pricing",
    hint: "Good / Better / Best is in their portal. Next: set the install date.",
  },
  {
    status: "in_progress",
    label: "Install / Project Date",
    short: "Install",
    hint: "Install day is set, or you're on site.",
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
  diagnostic: "Look / estimate visit",
  install: "Install / project",
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
