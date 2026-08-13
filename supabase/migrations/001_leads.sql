-- Phase 1: website lead capture
-- Run in Supabase ? SQL Editor ? New query ? Run

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  city text,
  service text,
  message text,
  source_path text,
  source_label text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text not null default 'new',
  meta jsonb not null default '{}'::jsonb
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_email_idx on public.leads (email);

alter table public.leads enable row level security;

-- No anon policies on purpose.
-- Next.js API routes insert with the service_role key (bypasses RLS).
