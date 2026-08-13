-- Phase 3: real client portal + admin ops
-- Run in Supabase ? SQL Editor after 001_leads.sql

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  name text not null default '',
  phone text,
  address text,
  invited_at timestamptz,
  invite_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists profiles_role_idx on public.profiles (role);

-- ---------------------------------------------------------------------------
-- Jobs
-- ---------------------------------------------------------------------------
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  status text not null default 'quote_request'
    check (status in (
      'quote_request',
      'estimate_ready',
      'scheduled',
      'in_progress',
      'completed',
      'cancelled'
    )),
  service text,
  city text,
  summary text not null default '',
  selected_option_id uuid,
  warranty text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists jobs_customer_id_idx on public.jobs (customer_id);
create index if not exists jobs_status_idx on public.jobs (status);
create index if not exists jobs_updated_at_idx on public.jobs (updated_at desc);

-- ---------------------------------------------------------------------------
-- Job options (Good / Better / Best)
-- ---------------------------------------------------------------------------
create table if not exists public.job_options (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  name text not null,
  price_cents int not null check (price_cents >= 0),
  description text not null default '',
  recommended boolean not null default false,
  selectable boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists job_options_job_id_idx on public.job_options (job_id);

alter table public.jobs
  drop constraint if exists jobs_selected_option_id_fkey;

alter table public.jobs
  add constraint jobs_selected_option_id_fkey
  foreign key (selected_option_id) references public.job_options (id) on delete set null;

-- ---------------------------------------------------------------------------
-- Timeline events
-- ---------------------------------------------------------------------------
create table if not exists public.job_events (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  event_at timestamptz not null default now(),
  title text not null,
  detail text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists job_events_job_id_idx on public.job_events (job_id, event_at);

-- ---------------------------------------------------------------------------
-- Availability (Andy publishes slots customers can book)
-- ---------------------------------------------------------------------------
create table if not exists public.availability_windows (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  label text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists availability_windows_starts_at_idx
  on public.availability_windows (starts_at)
  where active = true;

-- ---------------------------------------------------------------------------
-- Appointments
-- ---------------------------------------------------------------------------
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  availability_window_id uuid references public.availability_windows (id) on delete set null,
  type text not null default 'diagnostic'
    check (type in ('diagnostic', 'install', 'maintenance', 'follow_up')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  booked_by text not null default 'admin' check (booked_by in ('customer', 'admin')),
  notes text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists appointments_job_id_idx on public.appointments (job_id);
create index if not exists appointments_starts_at_idx on public.appointments (starts_at);

-- ---------------------------------------------------------------------------
-- Documents & photos (Storage paths)
-- ---------------------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  name text not null,
  doc_type text not null default 'Document',
  storage_path text not null,
  bucket text not null default 'job-documents',
  created_at timestamptz not null default now()
);

create index if not exists documents_job_id_idx on public.documents (job_id);

create table if not exists public.job_photos (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  label text not null default '',
  storage_path text not null,
  bucket text not null default 'job-photos',
  created_at timestamptz not null default now()
);

create index if not exists job_photos_job_id_idx on public.job_photos (job_id);

-- ---------------------------------------------------------------------------
-- Messages (job-scoped thread)
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  sender_id uuid references public.profiles (id) on delete set null,
  from_role text not null check (from_role in ('customer', 'admin')),
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists messages_job_id_idx on public.messages (job_id, created_at);
create index if not exists messages_unread_idx on public.messages (job_id) where read_at is null;

-- ---------------------------------------------------------------------------
-- Invoices
-- ---------------------------------------------------------------------------
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  customer_id uuid not null references public.profiles (id) on delete cascade,
  number text not null unique,
  description text not null default '',
  amount_cents int not null check (amount_cents >= 0),
  status text not null default 'unpaid'
    check (status in ('draft', 'unpaid', 'paid', 'overdue', 'void')),
  due_at timestamptz,
  paid_at timestamptz,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists invoices_customer_id_idx on public.invoices (customer_id);
create index if not exists invoices_job_id_idx on public.invoices (job_id);
create index if not exists invoices_status_idx on public.invoices (status);

-- ---------------------------------------------------------------------------
-- Leads: link to portal customer + job
-- ---------------------------------------------------------------------------
alter table public.leads
  add column if not exists customer_id uuid references public.profiles (id) on delete set null;

alter table public.leads
  add column if not exists job_id uuid references public.jobs (id) on delete set null;

alter table public.leads
  add column if not exists portal_invited_at timestamptz;

create index if not exists leads_customer_id_idx on public.leads (customer_id);

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

drop trigger if exists invoices_set_updated_at on public.invoices;
create trigger invoices_set_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

-- Auto-create profile when auth user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email, ''), '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('job-documents', 'job-documents', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('job-photos', 'job-photos', false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- RLS helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.owns_job(jid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.jobs j
    where j.id = jid and j.customer_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.job_options enable row level security;
alter table public.job_events enable row level security;
alter table public.availability_windows enable row level security;
alter table public.appointments enable row level security;
alter table public.documents enable row level security;
alter table public.job_photos enable row level security;
alter table public.messages enable row level security;
alter table public.invoices enable row level security;

-- Profiles
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid() or public.is_admin());

-- Jobs
drop policy if exists jobs_select on public.jobs;
create policy jobs_select on public.jobs
  for select using (customer_id = auth.uid() or public.is_admin());

drop policy if exists jobs_insert_admin on public.jobs;
create policy jobs_insert_admin on public.jobs
  for insert with check (public.is_admin() or customer_id = auth.uid());

drop policy if exists jobs_update on public.jobs;
create policy jobs_update on public.jobs
  for update using (customer_id = auth.uid() or public.is_admin());

-- Job options
drop policy if exists job_options_select on public.job_options;
create policy job_options_select on public.job_options
  for select using (public.owns_job(job_id) or public.is_admin());

drop policy if exists job_options_admin_write on public.job_options;
create policy job_options_admin_write on public.job_options
  for all using (public.is_admin()) with check (public.is_admin());

-- Job events
drop policy if exists job_events_select on public.job_events;
create policy job_events_select on public.job_events
  for select using (public.owns_job(job_id) or public.is_admin());

drop policy if exists job_events_admin_write on public.job_events;
create policy job_events_admin_write on public.job_events
  for all using (public.is_admin()) with check (public.is_admin());

-- Availability: customers can read active windows
drop policy if exists availability_select on public.availability_windows;
create policy availability_select on public.availability_windows
  for select using (active = true or public.is_admin());

drop policy if exists availability_admin_write on public.availability_windows;
create policy availability_admin_write on public.availability_windows
  for all using (public.is_admin()) with check (public.is_admin());

-- Appointments
drop policy if exists appointments_select on public.appointments;
create policy appointments_select on public.appointments
  for select using (public.owns_job(job_id) or public.is_admin());

drop policy if exists appointments_insert on public.appointments;
create policy appointments_insert on public.appointments
  for insert with check (public.owns_job(job_id) or public.is_admin());

drop policy if exists appointments_update on public.appointments;
create policy appointments_update on public.appointments
  for update using (public.owns_job(job_id) or public.is_admin());

-- Documents / photos
drop policy if exists documents_select on public.documents;
create policy documents_select on public.documents
  for select using (public.owns_job(job_id) or public.is_admin());

drop policy if exists documents_admin_write on public.documents;
create policy documents_admin_write on public.documents
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists job_photos_select on public.job_photos;
create policy job_photos_select on public.job_photos
  for select using (public.owns_job(job_id) or public.is_admin());

drop policy if exists job_photos_write on public.job_photos;
create policy job_photos_write on public.job_photos
  for all using (public.owns_job(job_id) or public.is_admin())
  with check (public.owns_job(job_id) or public.is_admin());

-- Messages
drop policy if exists messages_select on public.messages;
create policy messages_select on public.messages
  for select using (public.owns_job(job_id) or public.is_admin());

drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages
  for insert with check (
    (public.owns_job(job_id) and from_role = 'customer' and sender_id = auth.uid())
    or public.is_admin()
  );

drop policy if exists messages_update on public.messages;
create policy messages_update on public.messages
  for update using (public.owns_job(job_id) or public.is_admin());

-- Invoices: customers can read; only admin (or service role via API) writes paid
drop policy if exists invoices_select on public.invoices;
create policy invoices_select on public.invoices
  for select using (customer_id = auth.uid() or public.is_admin());

drop policy if exists invoices_admin_write on public.invoices;
create policy invoices_admin_write on public.invoices
  for all using (public.is_admin()) with check (public.is_admin());

-- Storage policies
drop policy if exists job_documents_select on storage.objects;
create policy job_documents_select on storage.objects
  for select using (
    bucket_id = 'job-documents'
    and (
      public.is_admin()
      or public.owns_job(((storage.foldername(name))[1])::uuid)
    )
  );

drop policy if exists job_documents_admin on storage.objects;
create policy job_documents_admin on storage.objects
  for all using (bucket_id = 'job-documents' and public.is_admin())
  with check (bucket_id = 'job-documents' and public.is_admin());

drop policy if exists job_photos_select_storage on storage.objects;
create policy job_photos_select_storage on storage.objects
  for select using (
    bucket_id = 'job-photos'
    and (
      public.is_admin()
      or public.owns_job(((storage.foldername(name))[1])::uuid)
    )
  );

drop policy if exists job_photos_write_storage on storage.objects;
create policy job_photos_write_storage on storage.objects
  for all using (
    bucket_id = 'job-photos'
    and (public.is_admin() or public.owns_job(((storage.foldername(name))[1])::uuid))
  )
  with check (
    bucket_id = 'job-photos'
    and (public.is_admin() or public.owns_job(((storage.foldername(name))[1])::uuid))
  );

-- Seed note: promote Andy to admin after he signs in once, e.g.:
-- update public.profiles set role = 'admin' where email = 'andy@trusthowmuch.com';
