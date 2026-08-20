-- Andy receives mail at Gmail, not andy@trusthowmuch.com.
update public.business_settings
set public_email = 'howmuchandy@gmail.com',
    updated_at = now()
where id = 1
  and (public_email is null or public_email = '' or public_email = 'andy@trusthowmuch.com');

update public.business_settings
set notify_email = 'howmuchandy@gmail.com',
    updated_at = now()
where id = 1
  and (notify_email is null or notify_email = '' or notify_email = 'andy@trusthowmuch.com');
