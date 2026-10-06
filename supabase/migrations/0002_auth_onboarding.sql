-- Auth/profile onboarding hardening

alter table public.service_categories enable row level security;

create policy "public reads active categories"
on public.service_categories for select
using (is_active = true or public.is_admin());

-- Prevent ordinary authenticated users from editing authorization-sensitive profile columns.
revoke update on table public.profiles from authenticated;
grant update (full_name, phone, avatar_url, updated_at)
on table public.profiles to authenticated;

-- Professionals can edit their business profile, but cannot set approval/reputation fields.
revoke update on table public.professional_profiles from authenticated;
grant update (
  business_name,
  headline,
  bio,
  years_experience,
  base_location_name,
  service_radius_km,
  service_area_center,
  is_available,
  updated_at
)
on table public.professional_profiles to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text;
  safe_role public.app_role;
begin
  requested_role := coalesce(new.raw_user_meta_data ->> 'role', 'customer');

  -- Never trust signup metadata for privileged roles.
  safe_role := case
    when requested_role = 'professional' then 'professional'::public.app_role
    else 'customer'::public.app_role
  end;

  insert into public.profiles (id, role, full_name, phone)
  values (
    new.id,
    safe_role,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.phone
  )
  on conflict (id) do nothing;

  if safe_role = 'professional'::public.app_role then
    insert into public.professional_profiles (user_id, application_status)
    values (new.id, 'draft')
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.submit_professional_application()
returns public.application_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_status public.application_status;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if not exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'professional'::public.app_role
  ) then
    raise exception 'Professional account required';
  end if;

  select application_status
  into current_status
  from public.professional_profiles
  where user_id = auth.uid()
  for update;

  if current_status is null then
    raise exception 'Professional profile not found';
  end if;

  if current_status not in ('draft','info_required','rejected') then
    return current_status;
  end if;

  update public.professional_profiles
  set application_status = 'submitted',
      updated_at = now()
  where user_id = auth.uid();

  return 'submitted'::public.application_status;
end;
$$;

revoke all on function public.submit_professional_application() from public;
grant execute on function public.submit_professional_application() to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists professional_profiles_set_updated_at on public.professional_profiles;
create trigger professional_profiles_set_updated_at
before update on public.professional_profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at
before update on public.jobs
for each row execute procedure public.set_updated_at();
