create table if not exists public.blocked_times (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text not null default '',
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists blocked_times_starts_at_idx on public.blocked_times (starts_at);

alter table public.blocked_times enable row level security;

drop policy if exists blocked_times_admin on public.blocked_times;
create policy blocked_times_admin on public.blocked_times
  for all using (public.is_admin()) with check (public.is_admin());
