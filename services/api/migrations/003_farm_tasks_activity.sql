-- Farm tasks activity tracking (idempotent)

create table if not exists public.farm_tasks (
  id uuid primary key default gen_random_uuid(),
  parcel_id uuid not null references public.parcels (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  task_type text not null,
  due_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  body text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.farm_tasks add column if not exists completed_at timestamptz;

create index if not exists farm_tasks_user_status_due_idx
  on public.farm_tasks (user_id, status, due_at);

create index if not exists farm_tasks_user_completed_idx
  on public.farm_tasks (user_id, completed_at desc nulls last);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  parcel_id uuid not null references public.parcels (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  category text not null,
  amount numeric not null,
  currency text not null default 'TRY',
  occurred_at timestamptz not null default now(),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists expenses_user_occurred_idx
  on public.expenses (user_id, occurred_at desc);
