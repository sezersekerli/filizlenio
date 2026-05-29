-- Filizlen platform schema (PostGIS + RLS)
create extension if not exists postgis with schema extensions;

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'sense', 'cloud', 'control')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Parcels
create table public.parcels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text,
  il_id integer not null,
  ilce_id integer not null,
  mahalle_id integer not null,
  ada text not null,
  parsel_no text not null,
  geometry extensions.geography (polygon, 4326),
  area_m2 numeric,
  nitelik text,
  properties jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index parcels_user_id_idx on public.parcels (user_id);

-- Parcel events (manual tracking)
create table public.parcel_events (
  id uuid primary key default gen_random_uuid(),
  parcel_id uuid not null references public.parcels (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (
    type in ('note', 'irrigation_manual', 'planting', 'harvest')
  ),
  occurred_at timestamptz not null default now(),
  body text,
  created_at timestamptz not null default now()
);

create index parcel_events_parcel_id_idx on public.parcel_events (parcel_id);

-- Entitlements (paid features — MVP placeholder)
create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  feature text not null check (
    feature in ('sense_live', 'cloud_recommendations', 'control_commands')
  ),
  active boolean not null default false,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, feature)
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger parcels_updated_at
  before update on public.parcels
  for each row execute function public.set_updated_at();

-- Free tier parcel limit (5)
create or replace function public.check_parcel_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  parcel_count integer;
  user_plan text;
begin
  select plan into user_plan from public.profiles where id = new.user_id;
  if user_plan is null or user_plan = 'free' then
    select count(*) into parcel_count
    from public.parcels
    where user_id = new.user_id;
    if parcel_count >= 5 then
      raise exception 'parcel_limit_reached: Free plan allows max 5 parcels';
    end if;
  end if;
  return new;
end;
$$;

create trigger enforce_parcel_limit
  before insert on public.parcels
  for each row execute function public.check_parcel_limit();

-- RLS
alter table public.profiles enable row level security;
alter table public.parcels enable row level security;
alter table public.parcel_events enable row level security;
alter table public.entitlements enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users manage own parcels"
  on public.parcels for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own parcel events"
  on public.parcel_events for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users read own entitlements"
  on public.entitlements for select
  using (auth.uid() = user_id);

-- Grants
grant usage on schema public to anon, authenticated;
grant all on public.profiles to authenticated;
grant all on public.parcels to authenticated;
grant all on public.parcel_events to authenticated;
grant select on public.entitlements to authenticated;
