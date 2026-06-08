-- Filizlen farm management schema

alter table parcel_events drop constraint if exists parcel_events_type_check;
alter table parcel_events add constraint parcel_events_type_check check (
  type in (
    'note',
    'irrigation_manual',
    'planting',
    'harvest',
    'fertilization',
    'spray',
    'expense_note',
    'inspection'
  )
);

create table if not exists parcel_seasons (
  id uuid primary key default gen_random_uuid(),
  parcel_id uuid not null references public.parcels (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  crop text not null,
  planted_at date,
  stage text not null default 'Başlangıç',
  progress_pct integer not null default 0 check (progress_pct >= 0 and progress_pct <= 100),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (parcel_id)
);

create table if not exists farm_tasks (
  id uuid primary key default gen_random_uuid(),
  parcel_id uuid not null references public.parcels (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  task_type text not null check (
    task_type in ('irrigation', 'fertilization', 'spray', 'inspection', 'expense', 'other')
  ),
  due_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists farm_tasks_user_due_idx on public.farm_tasks (user_id, due_at);
create index if not exists farm_tasks_parcel_idx on public.farm_tasks (parcel_id);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  parcel_id uuid not null references public.parcels (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  category text not null check (
    category in ('fuel', 'fertilizer', 'pesticide', 'labor', 'seed', 'irrigation', 'transport', 'other')
  ),
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'TRY',
  occurred_at timestamptz not null default now(),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists expenses_user_idx on public.expenses (user_id, occurred_at desc);
create index if not exists expenses_parcel_idx on public.expenses (parcel_id);

create table if not exists notification_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  parcel_id uuid references public.parcels (id) on delete set null,
  channel text not null default 'whatsapp' check (channel in ('whatsapp', 'sms', 'push')),
  label text not null,
  body text not null,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'sent', 'failed')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  provider_ref text,
  created_at timestamptz not null default now()
);

create index if not exists notification_messages_user_idx on public.notification_messages (user_id, created_at desc);

create table if not exists weather_snapshots (
  id uuid primary key default gen_random_uuid(),
  parcel_id uuid not null references public.parcels (id) on delete cascade,
  fetched_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create index if not exists weather_snapshots_parcel_idx on public.weather_snapshots (parcel_id, fetched_at desc);

create trigger parcel_seasons_updated_at
  before update on public.parcel_seasons
  for each row execute function public.set_updated_at();

create trigger farm_tasks_updated_at
  before update on public.farm_tasks
  for each row execute function public.set_updated_at();
