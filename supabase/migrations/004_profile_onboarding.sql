-- Profile extras for portal onboarding + account settings
alter table public.profiles
  add column if not exists city text;

alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz;

alter table public.profiles
  add column if not exists avatar_path text;

alter table public.profiles
  add column if not exists avatar_bucket text;
