import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type {
  Appointment,
  AvailabilityWindow,
  Invoice,
  Job,
  Message,
  Profile,
} from "@/lib/db-types";

export type LeadRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  service: string | null;
  message: string | null;
  source_path: string | null;
  source_label: string | null;
  status: string;
  customer_id: string | null;
  job_id: string | null;
  portal_invited_at: string | null;
};

export async function getAdminKpis() {
  const admin = getSupabaseAdmin();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const iso = startOfMonth.toISOString();

  const [
    { data: paidInv },
    { data: unpaidInv },
    { count: jobsWeek },
    { count: newLeads },
    { count: activeJobs },
  ] = await Promise.all([
    admin.from("invoices").select("amount_cents, paid_at").eq("status", "paid").gte("paid_at", iso),
    admin.from("invoices").select("amount_cents, status").in("status", ["unpaid", "overdue"]),
    admin
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .gte("starts_at", new Date(Date.now() - 7 * 86400000).toISOString())
      .neq("status", "cancelled"),
    admin.from("leads").select("*", { count: "exact", head: true }).gte("created_at", iso),
    admin
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .in("status", ["quote_request", "estimate_ready", "scheduled", "in_progress"]),
  ]);

  const monthRevenue = (paidInv || []).reduce((s, i) => s + (i.amount_cents || 0), 0);
  const outstanding = (unpaidInv || []).reduce((s, i) => s + (i.amount_cents || 0), 0);
  const overdue = (unpaidInv || [])
    .filter((i) => i.status === "overdue")
    .reduce((s, i) => s + (i.amount_cents || 0), 0);

  return {
    monthRevenue,
    outstanding,
    overdue,
    jobsThisWeek: jobsWeek || 0,
    newLeads: newLeads || 0,
    activeJobs: activeJobs || 0,
  };
}

export async function getAdminLeads(limit = 100) {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data || []) as LeadRow[];
}

export async function getAdminJobs(limit = 100) {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("jobs")
    .select("*, profiles!customer_id(name, email, phone, invited_at, invite_count)")
    .order("updated_at", { ascending: false })
    .limit(limit);
  return data || [];
}

export async function getAdminJob(jobId: string) {
  const admin = getSupabaseAdmin();
  const { data: job } = await admin
    .from("jobs")
    .select("*, profiles!customer_id(*)")
    .eq("id", jobId)
    .maybeSingle();
  if (!job) return null;

  const [options, events, docs, appts, invoices, messages] = await Promise.all([
    admin.from("job_options").select("*").eq("job_id", jobId).order("sort_order"),
    admin.from("job_events").select("*").eq("job_id", jobId).order("event_at"),
    admin.from("documents").select("*").eq("job_id", jobId).order("created_at", { ascending: false }),
    admin.from("appointments").select("*").eq("job_id", jobId).order("starts_at"),
    admin.from("invoices").select("*").eq("job_id", jobId).order("created_at", { ascending: false }),
    admin.from("messages").select("*").eq("job_id", jobId).order("created_at"),
  ]);

  return {
    job: job as Job & { profiles: Profile },
    options: options.data || [],
    events: events.data || [],
    documents: docs.data || [],
    appointments: (appts.data || []) as Appointment[],
    invoices: (invoices.data || []) as Invoice[],
    messages: (messages.data || []) as Message[],
  };
}

export async function getAdminInvoices() {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("invoices")
    .select("*, profiles!customer_id(name, email), jobs(title)")
    .order("created_at", { ascending: false })
    .limit(100);
  return data || [];
}

export async function getAdminSchedule() {
  const admin = getSupabaseAdmin();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const { data: appointments } = await admin
    .from("appointments")
    .select("*, jobs(title, city, customer_id, profiles!customer_id(name, phone))")
    .gte("starts_at", now.toISOString())
    .neq("status", "cancelled")
    .order("starts_at")
    .limit(50);

  const { data: windows } = await admin
    .from("availability_windows")
    .select("*")
    .eq("active", true)
    .gte("starts_at", now.toISOString())
    .order("starts_at")
    .limit(40);

  return {
    appointments: appointments || [],
    windows: (windows || []) as AvailabilityWindow[],
  };
}

export async function getAdminMessages() {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("messages")
    .select("*, jobs(title, customer_id, profiles!customer_id(name, email))")
    .order("created_at", { ascending: false })
    .limit(80);
  return data || [];
}

export async function getCustomers() {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false })
    .limit(200);
  return (data || []) as Profile[];
}
