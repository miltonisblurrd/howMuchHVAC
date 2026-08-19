import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type {
  Appointment,
  AvailabilityWindow,
  DocumentRow,
  Invoice,
  Job,
  JobEvent,
  JobOption,
  JobPhoto,
  Message,
  Profile,
} from "@/lib/db-types";
import { parseMessagePhoto } from "@/lib/uploads";

export async function getCustomerJobs(customerId: string) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("jobs")
    .select("*")
    .eq("customer_id", customerId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Job[];
}

export async function getJobForCustomer(jobId: string, customerId: string) {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("customer_id", customerId)
    .maybeSingle();
  return (data as Job | null) ?? null;
}

export async function getJobBundle(jobId: string) {
  const admin = getSupabaseAdmin();
  const [jobRes, optionsRes, eventsRes, docsRes, photosRes, apptsRes] = await Promise.all([
    admin.from("jobs").select("*").eq("id", jobId).maybeSingle(),
    admin.from("job_options").select("*").eq("job_id", jobId).order("sort_order"),
    admin.from("job_events").select("*").eq("job_id", jobId).order("event_at", { ascending: true }),
    admin.from("documents").select("*").eq("job_id", jobId).order("created_at", { ascending: false }),
    admin.from("job_photos").select("*").eq("job_id", jobId).order("created_at", { ascending: false }),
    admin
      .from("appointments")
      .select("*")
      .eq("job_id", jobId)
      .neq("status", "cancelled")
      .order("starts_at", { ascending: true }),
  ]);

  return {
    job: (jobRes.data as Job | null) ?? null,
    options: (optionsRes.data || []) as JobOption[],
    events: (eventsRes.data || []) as JobEvent[],
    documents: (docsRes.data || []) as DocumentRow[],
    photos: (photosRes.data || []) as JobPhoto[],
    appointments: (apptsRes.data || []) as Appointment[],
  };
}

export async function getCustomerInvoices(customerId: string) {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("invoices")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  return (data || []) as Invoice[];
}

export async function getCustomerMessages(customerId: string) {
  const admin = getSupabaseAdmin();
  const { data: jobs } = await admin.from("jobs").select("id").eq("customer_id", customerId);
  const ids = (jobs || []).map((j) => j.id);
  if (!ids.length) return [] as (Message & { job_title?: string })[];

  const { data: messages } = await admin
    .from("messages")
    .select("*")
    .in("job_id", ids)
    .order("created_at", { ascending: true });

  const { data: jobRows } = await admin.from("jobs").select("id, title").in("id", ids);
  const titleMap = new Map((jobRows || []).map((j) => [j.id, j.title]));

  return ((messages || []) as Message[]).map((m) => ({
    ...m,
    job_title: titleMap.get(m.job_id),
  }));
}

export async function getCustomerDocuments(customerId: string) {
  const admin = getSupabaseAdmin();
  const { data: jobs } = await admin.from("jobs").select("id, title").eq("customer_id", customerId);
  const ids = (jobs || []).map((j) => j.id);
  if (!ids.length) return [] as (DocumentRow & { job_title?: string })[];

  const { data: docs } = await admin
    .from("documents")
    .select("*")
    .in("job_id", ids)
    .order("created_at", { ascending: false });

  const titleMap = new Map((jobs || []).map((j) => [j.id, j.title]));
  return ((docs || []) as DocumentRow[]).map((d) => ({
    ...d,
    job_title: titleMap.get(d.job_id),
  }));
}

export async function getActiveAvailability() {
  const admin = getSupabaseAdmin();
  const now = new Date().toISOString();
  const { data } = await admin
    .from("availability_windows")
    .select("*")
    .eq("active", true)
    .gte("starts_at", now)
    .order("starts_at", { ascending: true })
    .limit(40);
  return (data || []) as AvailabilityWindow[];
}

export async function getSignedUrl(bucket: string, path: string, expiresIn = 3600) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error) return null;
  return data.signedUrl;
}

export async function decorateMessagePhotos<T extends Message>(messages: T[]) {
  const out = [];
  for (const m of messages) {
    const parsed = parseMessagePhoto(m.body);
    const photoUrl = parsed.photoPath
      ? await getSignedUrl("job-photos", parsed.photoPath)
      : null;
    out.push({ ...m, photoUrl, displayBody: parsed.text });
  }
  return out;
}

export async function countUnreadForCustomer(customerId: string) {
  const messages = await getCustomerMessages(customerId);
  return messages.filter((m) => m.from_role === "admin" && !m.read_at).length;
}

export async function getNextAppointmentForCustomer(customerId: string) {
  const admin = getSupabaseAdmin();
  const { data: jobs } = await admin.from("jobs").select("id").eq("customer_id", customerId);
  const ids = (jobs || []).map((j) => j.id);
  if (!ids.length) return null;
  const now = new Date().toISOString();
  const { data } = await admin
    .from("appointments")
    .select("*")
    .in("job_id", ids)
    .in("status", ["confirmed", "pending"])
    .gte("starts_at", now)
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return (data as Appointment | null) ?? null;
}

export type { Profile };
