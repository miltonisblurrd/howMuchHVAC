-- Optional photo on a Good / Better / Best option, and the customer's install pace.
-- Andy still sets the actual install date.

alter table public.job_options
  add column if not exists image_path text;

alter table public.jobs
  add column if not exists schedule_pace text;

alter table public.jobs
  drop constraint if exists jobs_schedule_pace_check;

alter table public.jobs
  add constraint jobs_schedule_pace_check
  check (
    schedule_pace is null
    or schedule_pace in ('asap', 'this_week', 'this_weekend', 'no_rush')
  );
