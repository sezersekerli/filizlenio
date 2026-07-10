-- WhatsApp bildirimleri (idempotent)

alter table public.profiles
  add column if not exists whatsapp_phone text,
  add column if not exists whatsapp_notifications_enabled boolean not null default false,
  add column if not exists last_notification_scan_at timestamptz;

create table if not exists public.notification_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  parcel_id uuid references public.parcels (id) on delete set null,
  channel text not null default 'whatsapp',
  label text not null,
  body text not null,
  status text not null default 'draft' check (
    status in ('draft', 'scheduled', 'sent', 'failed')
  ),
  scheduled_at timestamptz,
  sent_at timestamptz,
  provider_ref text,
  error_message text,
  created_at timestamptz not null default now()
);

alter table public.notification_messages
  add column if not exists error_message text;

create index if not exists notification_messages_user_created_idx
  on public.notification_messages (user_id, created_at desc);

create table if not exists public.weather_snapshots (
  id uuid primary key default gen_random_uuid(),
  parcel_id uuid not null references public.parcels (id) on delete cascade,
  fetched_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create index if not exists weather_snapshots_parcel_fetched_idx
  on public.weather_snapshots (parcel_id, fetched_at desc);
