export type ProfileRole = "customer" | "admin";

export type JobStatus =
  | "quote_request"
  | "estimate_ready"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export type AppointmentType = "diagnostic" | "install" | "maintenance" | "follow_up";
export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type InvoiceStatus = "draft" | "unpaid" | "paid" | "overdue" | "void";

export type Profile = {
  id: string;
  email: string;
  role: ProfileRole;
  name: string;
  phone: string | null;
  address: string | null;
  city?: string | null;
  invited_at: string | null;
  invite_count: number;
  onboarding_completed_at?: string | null;
  avatar_path?: string | null;
  avatar_bucket?: string | null;
  created_at: string;
  updated_at: string;
};

export type Job = {
  id: string;
  customer_id: string;
  title: string;
  status: JobStatus;
  service: string | null;
  city: string | null;
  summary: string;
  selected_option_id: string | null;
  warranty: string | null;
  created_at: string;
  updated_at: string;
};

export type JobOption = {
  id: string;
  job_id: string;
  name: string;
  price_cents: number;
  description: string;
  recommended: boolean;
  selectable: boolean;
  sort_order: number;
  created_at: string;
};

export type JobEvent = {
  id: string;
  job_id: string;
  event_at: string;
  title: string;
  detail: string;
  created_at: string;
};

export type AvailabilityWindow = {
  id: string;
  starts_at: string;
  ends_at: string;
  label: string | null;
  active: boolean;
  created_at: string;
};

export type Appointment = {
  id: string;
  job_id: string;
  availability_window_id: string | null;
  type: AppointmentType;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus;
  booked_by: "customer" | "admin";
  notes: string | null;
  tech_name: string | null;
  customer_note: string | null;
  created_at: string;
};

export type DocumentRow = {
  id: string;
  job_id: string;
  name: string;
  doc_type: string;
  storage_path: string;
  bucket: string;
  created_at: string;
};

export type JobPhoto = {
  id: string;
  job_id: string;
  label: string;
  storage_path: string;
  bucket: string;
  created_at: string;
};

export type Message = {
  id: string;
  job_id: string;
  sender_id: string | null;
  from_role: "customer" | "admin";
  body: string;
  read_at: string | null;
  created_at: string;
};

export type Invoice = {
  id: string;
  job_id: string;
  customer_id: string;
  number: string;
  description: string;
  amount_cents: number;
  status: InvoiceStatus;
  due_at: string | null;
  paid_at: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
};

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  quote_request: "New request",
  scheduled: "Appointment scheduled",
  estimate_ready: "Pricing ready",
  in_progress: "Install / Project Date",
  completed: "Done",
  cancelled: "Cancelled",
};

export function money(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
