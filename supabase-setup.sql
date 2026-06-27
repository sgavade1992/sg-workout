-- ═══════════════════════════════════════════════════════
-- SG Workout — Supabase Database Setup
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- All statements are idempotent (safe to re-run)
-- ═══════════════════════════════════════════════════════

-- 1. Create the user_data table
create table if not exists user_data (
  id         uuid references auth.users on delete cascade primary key,
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Enable Row Level Security
alter table user_data enable row level security;

-- 3. RLS Policy: users can only read/write their own row
drop policy if exists "Users can manage their own data" on user_data;
create policy "Users can manage their own data"
  on user_data
  for all
  using     (auth.uid() = id)
  with check (auth.uid() = id);

-- 4. Auto-update updated_at on every save
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists user_data_updated_at on user_data;
create trigger user_data_updated_at
  before update on user_data
  for each row execute function update_updated_at();

-- 5. Enable Realtime (cross-device live sync)
alter publication supabase_realtime add table user_data;

-- ── VERIFY ──────────────────────────────────────────────
-- Run this to confirm everything is set up correctly:
select tablename, rowsecurity
from pg_tables
where tablename = 'user_data';
-- Expected result: user_data | t
