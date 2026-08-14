-- Public URLs and QR codes depend on the original handle remaining valid.
-- Reject handle changes at the database layer, not only in the editor UI.
create or replace function public.preserve_profile_handle()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.handle is distinct from old.handle then
    raise exception 'Profile handles cannot be changed after publishing.'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists preserve_profile_handle_before_update on public.profiles;

create trigger preserve_profile_handle_before_update
before update on public.profiles
for each row
execute function public.preserve_profile_handle();
