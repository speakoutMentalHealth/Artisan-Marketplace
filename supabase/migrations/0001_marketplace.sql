-- Artisan Marketplace MVP schema (Supabase/Postgres)
-- Enable PostGIS in a dedicated "extensions" schema before applying.

create extension if not exists pgcrypto with schema extensions;
create extension if not exists postgis with schema extensions;

create type public.app_role as enum ('customer','professional','admin','super_admin');
create type public.application_status as enum ('draft','submitted','under_review','info_required','approved','rejected','suspended');
create type public.job_status as enum ('draft','open','quoting','quote_accepted','payment_pending','confirmed','en_route','arrived','in_progress','awaiting_customer_confirmation','completed','cancelled','disputed','refund_pending','refunded');
create type public.quote_status as enum ('sent','accepted','rejected','withdrawn','expired');
create type public.payment_status as enum ('pending','processing','paid','failed','refunded','partially_refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'customer',
  full_name text not null default '',
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.service_categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.professional_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  business_name text,
  headline text,
  bio text,
  years_experience integer check (years_experience is null or years_experience >= 0),
  base_location_name text,
  service_radius_km integer not null default 15 check (service_radius_km between 1 and 200),
  service_area_center extensions.geography(POINT),
  is_available boolean not null default false,
  application_status public.application_status not null default 'draft',
  reputation_score numeric(5,2) not null default 0 check (reputation_score between 0 and 100),
  average_rating numeric(3,2) not null default 0 check (average_rating between 0 and 5),
  completed_jobs integer not null default 0,
  response_rate numeric(5,2) not null default 0 check (response_rate between 0 and 100),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index professional_profiles_geo_idx on public.professional_profiles using gist (service_area_center);
create index professional_profiles_search_idx on public.professional_profiles (application_status, is_available, average_rating desc);

create table public.professional_services (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professional_profiles(user_id) on delete cascade,
  category_id uuid not null references public.service_categories(id),
  title text not null,
  pricing_model text not null check (pricing_model in ('fixed','starting_from','hourly','inspection','quote')),
  price_minor bigint check (price_minor is null or price_minor >= 0),
  currency char(3) not null default 'NGN',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.professional_verifications (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professional_profiles(user_id) on delete cascade,
  verification_type text not null check (verification_type in ('phone','identity','certificate','bank','reference')),
  status text not null default 'pending' check (status in ('pending','verified','rejected','expired')),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  unique(professional_id, verification_type)
);

create table public.professional_documents (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professional_profiles(user_id) on delete cascade,
  document_type text not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professional_profiles(user_id) on delete cascade,
  title text not null,
  description text,
  media_url text not null,
  created_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  category_id uuid references public.service_categories(id),
  title text not null,
  description text not null,
  status public.job_status not null default 'draft',
  location_name text not null,
  job_location extensions.geography(POINT),
  exact_address text,
  preferred_at timestamptz,
  urgency text check (urgency is null or urgency in ('now','today','scheduled','flexible')),
  budget_min_minor bigint check (budget_min_minor is null or budget_min_minor >= 0),
  budget_max_minor bigint check (budget_max_minor is null or budget_max_minor >= 0),
  currency char(3) not null default 'NGN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (budget_min_minor is null or budget_max_minor is null or budget_max_minor >= budget_min_minor)
);

create index jobs_geo_idx on public.jobs using gist (job_location);
create index jobs_status_idx on public.jobs (status, category_id, created_at desc);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  professional_id uuid not null references public.professional_profiles(user_id),
  status public.quote_status not null default 'sent',
  amount_minor bigint not null check (amount_minor >= 0),
  currency char(3) not null default 'NGN',
  message text,
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes > 0),
  available_at timestamptz,
  created_at timestamptz not null default now(),
  unique(job_id, professional_id)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references public.jobs(id),
  quote_id uuid not null unique references public.quotes(id),
  customer_id uuid not null references public.profiles(id),
  professional_id uuid not null references public.professional_profiles(user_id),
  status public.job_status not null default 'confirmed',
  scheduled_at timestamptz,
  agreed_amount_minor bigint not null check (agreed_amount_minor >= 0),
  platform_fee_minor bigint not null default 0 check (platform_fee_minor >= 0),
  currency char(3) not null default 'NGN',
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  provider text not null,
  provider_reference text unique,
  status public.payment_status not null default 'pending',
  amount_minor bigint not null check (amount_minor >= 0),
  platform_fee_minor bigint not null default 0 check (platform_fee_minor >= 0),
  professional_amount_minor bigint not null default 0 check (professional_amount_minor >= 0),
  currency char(3) not null default 'NGN',
  created_at timestamptz not null default now(),
  verified_at timestamptz
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id),
  customer_id uuid not null references public.profiles(id),
  professional_id uuid not null references public.professional_profiles(user_id),
  overall_rating smallint not null check (overall_rating between 1 and 5),
  quality_rating smallint check (quality_rating between 1 and 5),
  punctuality_rating smallint check (punctuality_rating between 1 and 5),
  communication_rating smallint check (communication_rating between 1 and 5),
  professionalism_rating smallint check (professionalism_rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table public.disputes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  opened_by uuid not null references public.profiles(id),
  reason text not null,
  description text not null,
  status text not null default 'open' check (status in ('open','under_review','resolved','closed')),
  assigned_admin uuid references public.profiles(id),
  resolution text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.professional_profiles enable row level security;
alter table public.professional_services enable row level security;
alter table public.professional_verifications enable row level security;
alter table public.professional_documents enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.jobs enable row level security;
alter table public.quotes enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.disputes enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin'::public.app_role,'super_admin'::public.app_role)
  );
$$;

create policy "users read own profile"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

create policy "users update own profile"
on public.profiles for update
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "public approved professional read"
on public.professional_profiles for select
using (application_status = 'approved' or user_id = auth.uid() or public.is_admin());

create policy "professionals update own profile"
on public.professional_profiles for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "professional service public read"
on public.professional_services for select
using (
  (is_active and exists (
    select 1 from public.professional_profiles p
    where p.user_id = professional_id and p.application_status = 'approved'
  ))
  or professional_id = auth.uid()
  or public.is_admin()
);

create policy "professionals manage own services"
on public.professional_services for all
using (professional_id = auth.uid() or public.is_admin())
with check (professional_id = auth.uid() or public.is_admin());

create policy "public approved portfolio read"
on public.portfolio_items for select
using (
  exists (
    select 1 from public.professional_profiles p
    where p.user_id = professional_id and p.application_status = 'approved'
  )
  or professional_id = auth.uid()
  or public.is_admin()
);

create policy "professionals manage own portfolio"
on public.portfolio_items for all
using (professional_id = auth.uid() or public.is_admin())
with check (professional_id = auth.uid() or public.is_admin());

create policy "customers create jobs"
on public.jobs for insert
with check (customer_id = auth.uid());

create policy "customers read own jobs"
on public.jobs for select
using (customer_id = auth.uid() or public.is_admin());

create policy "approved professionals read open jobs"
on public.jobs for select
using (
  (
    status in ('open','quoting')
    and exists (
      select 1 from public.professional_profiles p
      where p.user_id = auth.uid() and p.application_status = 'approved'
    )
  )
  or customer_id = auth.uid()
  or public.is_admin()
);

create policy "professionals create own quotes"
on public.quotes for insert
with check (professional_id = auth.uid());

create policy "quote participants read"
on public.quotes for select
using (
  professional_id = auth.uid()
  or exists (select 1 from public.jobs j where j.id = job_id and j.customer_id = auth.uid())
  or public.is_admin()
);

create policy "booking participants read"
on public.bookings for select
using (customer_id = auth.uid() or professional_id = auth.uid() or public.is_admin());

create policy "payment participants read"
on public.payments for select
using (
  exists (
    select 1 from public.bookings b
    where b.id = booking_id and (b.customer_id = auth.uid() or b.professional_id = auth.uid())
  )
  or public.is_admin()
);

create policy "completed booking reviews public"
on public.reviews for select using (true);

create policy "customer creates completed booking review"
on public.reviews for insert
with check (
  customer_id = auth.uid()
  and exists (
    select 1 from public.bookings b
    where b.id = booking_id
      and b.customer_id = auth.uid()
      and b.professional_id = professional_id
      and b.status = 'completed'
  )
);

create policy "verification owner admin read"
on public.professional_verifications for select
using (professional_id = auth.uid() or public.is_admin());

create policy "admins manage verifications"
on public.professional_verifications for all
using (public.is_admin())
with check (public.is_admin());

create policy "document owner admin read"
on public.professional_documents for select
using (professional_id = auth.uid() or public.is_admin());

create policy "professionals add own documents"
on public.professional_documents for insert
with check (professional_id = auth.uid());

create policy "dispute participants read"
on public.disputes for select
using (
  opened_by = auth.uid()
  or exists (
    select 1 from public.bookings b
    where b.id = booking_id and (b.customer_id = auth.uid() or b.professional_id = auth.uid())
  )
  or public.is_admin()
);

create policy "booking participants open dispute"
on public.disputes for insert
with check (
  opened_by = auth.uid()
  and exists (
    select 1 from public.bookings b
    where b.id = booking_id and (b.customer_id = auth.uid() or b.professional_id = auth.uid())
  )
);

create policy "admins read audit logs"
on public.audit_logs for select using (public.is_admin());

create or replace function public.nearby_professionals(lat float, long float, max_km float default 25)
returns table (
  user_id uuid,
  business_name text,
  headline text,
  distance_km float,
  average_rating numeric,
  completed_jobs integer,
  is_available boolean
)
set search_path = ''
language sql
stable
as $$
  select
    p.user_id,
    p.business_name,
    p.headline,
    extensions.st_distance(
      p.service_area_center,
      extensions.st_point(long, lat)::extensions.geography
    ) / 1000.0 as distance_km,
    p.average_rating,
    p.completed_jobs,
    p.is_available
  from public.professional_profiles p
  where p.application_status = 'approved'
    and p.service_area_center is not null
    and extensions.st_distance(
      p.service_area_center,
      extensions.st_point(long, lat)::extensions.geography
    ) <= max_km * 1000
  order by p.service_area_center operator(extensions.<->) extensions.st_point(long, lat)::extensions.geography;
$$;

insert into public.service_categories (name,slug,description,icon,sort_order) values
('Plumbing','plumbing','Leaks, pipes, fittings and water systems','🔧',10),
('Electrical','electrical','Wiring, faults, installations and power','⚡',20),
('Cleaning','cleaning','Home, office and post-construction cleaning','🧹',30),
('Carpentry','carpentry','Furniture, doors, repairs and fittings','🪚',40),
('AC & Cooling','ac-cooling','AC, refrigeration and cooling repairs','❄️',50),
('Auto Repair','auto-repair','Mechanics, diagnostics and auto electrical','🚗',60),
('Tailoring','tailoring','Alterations, custom sewing and fashion','🧵',70),
('Beauty','beauty','Barbing, hair styling, makeup and grooming','✂️',80)
on conflict (slug) do nothing;
