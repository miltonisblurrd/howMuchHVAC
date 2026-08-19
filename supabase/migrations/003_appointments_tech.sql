-- Pending visit requests + optional tech name on appointments
alter table public.appointments
  add column if not exists tech_name text;

alter table public.appointments
  add column if not exists customer_note text;
