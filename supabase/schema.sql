-- ============================================================
-- SOLO FIT — Supabase schema
-- Run this in Supabase SQL Editor (Project -> SQL Editor -> New query)
-- ============================================================

-- Ranks are stored as a fixed ladder in the app code (backend/ranks.py),
-- this schema only stores per-user progress.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default 'Hunter',
  weight_kg numeric not null default 70,
  is_admin boolean not null default false,
  rank text not null default 'F',            -- F,E,D,C,B,A,S,SS,SSS
  streak_days int not null default 0,        -- consecutive days target met at current rank
  best_streak int not null default 0,
  relax_day_available boolean not null default false, -- earned after a rank-up
  last_active_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_progress (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  log_date date not null default current_date,
  pushups int not null default 0,
  squats int not null default 0,
  running_km numeric not null default 0,
  plank_seconds int not null default 0,
  calories_burned numeric not null default 0,
  target_met boolean not null default false,
  was_relax_day boolean not null default false,
  rank_at_time text not null default 'F',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, log_date)
);

create table if not exists public.rank_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  from_rank text not null,
  to_rank text not null,
  achieved_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.daily_progress enable row level security;
alter table public.rank_history enable row level security;

-- Users can read/update only their own profile
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Users can read/write only their own logs
create policy "progress_select_own" on public.daily_progress
  for select using (auth.uid() = user_id);
create policy "progress_insert_own" on public.daily_progress
  for insert with check (auth.uid() = user_id);
create policy "progress_update_own" on public.daily_progress
  for update using (auth.uid() = user_id);

create policy "history_select_own" on public.rank_history
  for select using (auth.uid() = user_id);

-- NOTE: The FastAPI backend uses the service_role key, which bypasses RLS.
-- That's intentional here: the backend enforces "which user can see what"
-- in Python (see backend/auth.py) so these policies are a second safety
-- net in case anyone ever queries Supabase directly with a user's JWT
-- (e.g. from the frontend, if you choose to call Supabase directly later).

-- Simple admin read-everything policy (checked against profiles.is_admin)
create policy "profiles_admin_read_all" on public.profiles
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );
create policy "progress_admin_read_all" on public.daily_progress
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

-- ------------------------------------------------------------
-- Safety net: re-grant schema/table permissions.
-- Normally Supabase sets these up automatically, but if you ever see
-- "permission denied for schema public" (Postgres error 42501), run
-- this block again in the SQL Editor.
-- ------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;