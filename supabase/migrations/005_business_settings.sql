-- Andy's public contact + alert destinations (single row)
create table if not exists public.business_settings (
  id int primary key default 1 check (id = 1),
  display_name text not null default 'Andy',
  public_email text,
  direct_phone text,
  notify_email text,
  notify_phone text,
  office_address text,
  avatar_path text,
  avatar_bucket text,
  updated_at timestamptz not null default now()
);

insert into public.business_settings (id, display_name, public_email, direct_phone)
values (1, 'Andy', 'howmuchandy@gmail.com', '(714) 333-5953')
on conflict (id) do nothing;

alter table public.business_settings enable row level security;
