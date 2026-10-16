/*
# Admin accounts (replaces the shared admin password)

Admins are normal Supabase Auth users whose user id is listed here.
The admin-api edge function checks the caller's JWT and this table.
Only the service role can read or write this table (no policies, no grants).

To make a user an admin, run in SQL Editor:
  insert into public.admin_users (user_id)
  select id from auth.users where email = 'you@example.com';
*/

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
