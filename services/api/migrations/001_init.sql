-- Filizlen — kendi Postgres (Supabase auth.users yok)
create extension if not exists postgis;
create extension if not exists pgcrypto;

create table public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references public.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'sense', 'cloud', 'control')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.refresh_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index refresh_tokens_user_id_idx on public.refresh_tokens (user_id);

create table public.parcels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  label text,
  il_id integer not null,
  ilce_id integer not null,
  mahalle_id integer not null,
  ada text not null,
  parsel_no text not null,
  geometry geography (polygon, 4326),
  area_m2 numeric,
  nitelik text,
  properties jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index parcels_user_id_idx on public.parcels (user_id);

create table public.parcel_events (
  id uuid primary key default gen_random_uuid(),
  parcel_id uuid not null references public.parcels (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  type text not null check (
    type in ('note', 'irrigation_manual', 'planting', 'harvest')
  ),
  occurred_at timestamptz not null default now(),
  body text,
  created_at timestamptz not null default now()
);

create index parcel_events_parcel_id_idx on public.parcel_events (parcel_id);

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  feature text not null check (
    feature in ('sense_live', 'cloud_recommendations', 'control_commands')
  ),
  active boolean not null default false,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, feature)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger parcels_updated_at
  before update on public.parcels
  for each row execute function public.set_updated_at();

create or replace function public.check_parcel_limit()
returns trigger
language plpgsql
as $$
declare
  parcel_count integer;
  user_plan text;
begin
  select plan into user_plan from public.profiles where id = new.user_id;
  if user_plan is null or user_plan = 'free' then
    select count(*) into parcel_count from public.parcels where user_id = new.user_id;
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
