/*
# Icon Investor Portal v2

- Login by email, phone number or investor code (resolved server-side).
- 8 portal projects, each protected by a per-investor PIN.
- PIN is hashed (bcrypt via pgcrypto), checked on the server, rate-limited.
- Project details, updates and files are returned only after a successful unlock.
- Dividend history, membership level, estimated return, targeted broadcasts.

Investors have NO direct read access to project details tables; everything
goes through SECURITY DEFINER functions that check the caller's email from the JWT.
*/

create extension if not exists pgcrypto;

-- ============ COLUMNS ON EXISTING TABLES ============
alter table investors add column if not exists membership_level text;

alter table investments add column if not exists investor_project_id uuid;
alter table investments add column if not exists expected_return_pct numeric;

alter table investor_notices add column if not exists investor_project_id uuid;

-- ============ PORTAL PROJECTS ============
create table if not exists investor_projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_bn text not null,
  name_en text not null,
  sector_bn text not null default '',
  sector_en text not null default '',
  image_url text,
  sort_order int not null default 0,
  status text check (status in ('planning', 'active', 'on_hold', 'completed')),
  progress_percent int check (progress_percent between 0 and 100),
  summary text not null default '',
  moving_forward text not null default '',
  not_moving_forward text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table investments
  drop constraint if exists investments_investor_project_id_fkey;
alter table investments
  add constraint investments_investor_project_id_fkey
  foreign key (investor_project_id) references investor_projects(id) on delete set null;

alter table investor_notices
  drop constraint if exists investor_notices_investor_project_id_fkey;
alter table investor_notices
  add constraint investor_notices_investor_project_id_fkey
  foreign key (investor_project_id) references investor_projects(id) on delete cascade;

alter table investor_projects enable row level security;
-- No policies: investors reach this only via portal_projects() / portal_project_detail().

insert into investor_projects (slug, name_bn, name_en, sector_bn, sector_en, sort_order) values
  ('makkah-madinah-land', 'মক্কা মদিনা (ল্যান্ড ও প্রপার্টি)', 'Makkah Madinah (Land & Property)', 'ল্যান্ড ও রিয়েল এস্টেট ফান্ডিং', 'Land & Real Estate Funding', 1),
  ('makkah-madinah-hotel', 'মক্কা মদিনা হোটেল প্রজেক্ট', 'Makkah Madinah Hotel Project', 'হসপিটালিটি মেগাপ্রজেক্ট', 'Hospitality Megaproject', 2),
  ('oman-st30', 'ওমান প্রজেক্ট (ST-30 ফোল্ডার)', 'Oman Project (ST-30 Folder)', 'ওমান কৌশলগত ST-30', 'Oman Strategic ST-30', 3),
  ('investor-licence', 'ইনভেস্টর লাইসেন্স প্রজেক্ট', 'Investor Licence Project', 'অফিসিয়াল লাইসেন্সিং', 'Official Licensing', 4),
  ('umrah-b2b', 'ওমরাহ B2B প্রজেক্ট', 'Umrah B2B Project', 'ওমরাহ B2B সার্ভিস', 'Umrah B2B Services', 5),
  ('oman-supermarket', 'সুপারমার্কেট বিজনেস (ওমান)', 'Supermarket Business (Oman)', 'খুচরা সুপারমার্কেট', 'Retail Supermarket', 6),
  ('icon-oud-perfume', 'আইকন উড পারফিউম (ওমান)', 'Icon Oud Perfume (Oman)', 'বিলাসী সুগন্ধি (ওমান)', 'Luxury Fragrance Oman', 7),
  ('lazeez-club-salalah', 'লাজিস ক্লাব রেস্টুরেন্ট (সালালাহ, ওমান)', 'Lazeez Club Restaurant (Salalah, Oman)', 'হসপিটালিটি ও ডাইনিং (সালালাহ)', 'Hospitality & Dining (Salalah)', 8)
on conflict (slug) do nothing;

-- ============ PROJECT UPDATES & FILES (gated) ============
create table if not exists investor_project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references investor_projects(id) on delete cascade,
  title text not null,
  body text not null default '',
  image_url text,
  update_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists investor_project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references investor_projects(id) on delete cascade,
  title text not null,
  file_url text not null,
  file_type text not null default 'document',
  created_at timestamptz not null default now()
);

alter table investor_project_updates enable row level security;
alter table investor_project_files enable row level security;
-- No policies: only via portal_project_detail().

-- ============ PER-INVESTOR PIN PER PROJECT ============
create table if not exists investor_project_access (
  investor_id uuid not null references investors(id) on delete cascade,
  investor_project_id uuid not null references investor_projects(id) on delete cascade,
  pin_hash text not null,
  failed_attempts int not null default 0,
  locked_until timestamptz,
  unlocked_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (investor_id, investor_project_id)
);

alter table investor_project_access enable row level security;
-- No policies: never readable by clients.

-- ============ DIVIDENDS ============
create table if not exists investor_dividends (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references investors(id) on delete cascade,
  investor_project_id uuid references investor_projects(id) on delete set null,
  amount numeric(14,2) not null check (amount >= 0),
  currency text not null default 'USD',
  paid_on date,
  status text not null default 'pending' check (status in ('scheduled', 'pending', 'paid', 'failed')),
  created_at timestamptz not null default now()
);

alter table investor_dividends enable row level security;

drop policy if exists "investor_read_own_dividends" on investor_dividends;
create policy "investor_read_own_dividends" on investor_dividends
  for select to authenticated using (
    exists (select 1 from investors v where v.id = investor_dividends.investor_id and v.email = auth.jwt() ->> 'email')
  );

-- ============ RLS UPDATES ON EXISTING TABLES ============

-- Notices: broadcast to all (null project) or to investors holding that project.
drop policy if exists "investor_read_own_notices" on investor_notices;
create policy "investor_read_own_notices" on investor_notices
  for select to authenticated using (
    (investor_id is null and (
      investor_project_id is null
      or exists (
        select 1 from investments i join investors v on v.id = i.investor_id
        where i.investor_project_id = investor_notices.investor_project_id
          and v.email = auth.jwt() ->> 'email'
      )
    ))
    or exists (
      select 1 from investors v
      where v.id = investor_notices.investor_id and v.email = auth.jwt() ->> 'email'
    )
  );

-- Documents of a portal project require that project to be unlocked.
drop policy if exists "investor_read_own_documents" on investment_documents;
create policy "investor_read_own_documents" on investment_documents
  for select to authenticated using (
    exists (
      select 1 from investments i
      join investors v on v.id = i.investor_id
      where i.id = investment_documents.investment_id
        and v.email = auth.jwt() ->> 'email'
        and (
          i.investor_project_id is null
          or exists (
            select 1 from investor_project_access a
            where a.investor_id = v.id
              and a.investor_project_id = i.investor_project_id
              and a.unlocked_at is not null
          )
        )
    )
  );

-- ============ FUNCTIONS ============

-- Login: email, phone number or investor code -> email (for signInWithPassword).
create or replace function public.resolve_investor_login(p_identifier text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select v.email
  from investors v
  where v.is_active
    and (
      lower(v.email) = lower(trim(p_identifier))
      or upper(v.investor_code) = upper(trim(p_identifier))
      or (
        length(regexp_replace(coalesce(v.phone, ''), '\D', '', 'g')) >= 7
        and regexp_replace(coalesce(v.phone, ''), '\D', '', 'g') = regexp_replace(coalesce(p_identifier, ''), '\D', '', 'g')
      )
    )
  limit 1;
$$;

revoke all on function public.resolve_investor_login(text) from public;
grant execute on function public.resolve_investor_login(text) to anon, authenticated;

-- Admin (service role only): set or reset an investor's PIN for one project. Re-locks the project.
create or replace function public.admin_set_investor_pin(p_investor_id uuid, p_investor_project_id uuid, p_pin text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if p_pin is null or length(p_pin) < 4 or length(p_pin) > 12 then
    raise exception 'pin_length_invalid';
  end if;
  insert into investor_project_access (investor_id, investor_project_id, pin_hash, failed_attempts, locked_until, unlocked_at, updated_at)
  values (p_investor_id, p_investor_project_id, crypt(p_pin, gen_salt('bf')), 0, null, null, now())
  on conflict (investor_id, investor_project_id) do update
    set pin_hash = excluded.pin_hash,
        failed_attempts = 0,
        locked_until = null,
        unlocked_at = null,
        updated_at = now();
end;
$$;

revoke all on function public.admin_set_investor_pin(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.admin_set_investor_pin(uuid, uuid, text) to service_role;

-- Investor: check PIN for a project. Rate-limited: 5 wrong tries -> 15 min lock.
create or replace function public.unlock_portal_project(p_project_id uuid, p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_email text := auth.jwt() ->> 'email';
  v_investor_id uuid;
  v_row investor_project_access%rowtype;
begin
  if v_email is null then raise exception 'not_authorized'; end if;

  select v.id into v_investor_id from investors v where v.email = v_email and v.is_active;
  if v_investor_id is null then raise exception 'not_authorized'; end if;

  if not exists (
    select 1 from investments i where i.investor_id = v_investor_id and i.investor_project_id = p_project_id
  ) then
    raise exception 'no_investment';
  end if;

  select * into v_row from investor_project_access
  where investor_id = v_investor_id and investor_project_id = p_project_id;
  if not found then raise exception 'pin_not_set'; end if;

  if v_row.locked_until is not null and v_row.locked_until > now() then
    raise exception 'too_many_attempts';
  end if;

  if v_row.pin_hash = crypt(coalesce(p_pin, ''), v_row.pin_hash) then
    update investor_project_access
      set failed_attempts = 0, locked_until = null, unlocked_at = now(), updated_at = now()
      where investor_id = v_investor_id and investor_project_id = p_project_id;
    return true;
  end if;

  update investor_project_access
    set failed_attempts = failed_attempts + 1,
        locked_until = case when failed_attempts + 1 >= 5 then now() + interval '15 minutes' else null end,
        updated_at = now()
    where investor_id = v_investor_id and investor_project_id = p_project_id;
  return false;
end;
$$;

revoke all on function public.unlock_portal_project(uuid, text) from public, anon;
grant execute on function public.unlock_portal_project(uuid, text) to authenticated;

-- Investor: the 8 portal projects with their own amount and lock state. No project details.
create or replace function public.portal_projects()
returns table (
  id uuid,
  slug text,
  name_bn text,
  name_en text,
  sector_bn text,
  sector_en text,
  image_url text,
  sort_order int,
  my_amount numeric,
  my_currency text,
  has_pin boolean,
  is_unlocked boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id, p.slug, p.name_bn, p.name_en, p.sector_bn, p.sector_en, p.image_url, p.sort_order,
    coalesce((
      select sum(i.investment_amount) from investments i
      join investors v on v.id = i.investor_id
      where v.email = auth.jwt() ->> 'email' and i.investor_project_id = p.id
    ), 0) as my_amount,
    (
      select min(i.currency) from investments i
      join investors v on v.id = i.investor_id
      where v.email = auth.jwt() ->> 'email' and i.investor_project_id = p.id
    ) as my_currency,
    exists (
      select 1 from investor_project_access a join investors v on v.id = a.investor_id
      where v.email = auth.jwt() ->> 'email' and a.investor_project_id = p.id
    ) as has_pin,
    exists (
      select 1 from investor_project_access a join investors v on v.id = a.investor_id
      where v.email = auth.jwt() ->> 'email' and a.investor_project_id = p.id and a.unlocked_at is not null
    ) as is_unlocked
  from investor_projects p
  where auth.uid() is not null
  order by p.sort_order;
$$;

revoke all on function public.portal_projects() from public, anon;
grant execute on function public.portal_projects() to authenticated;

-- Investor: full details of one project. Only after a successful unlock.
create or replace function public.portal_project_detail(p_project_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_email text := auth.jwt() ->> 'email';
  v_investor_id uuid;
  v_result jsonb;
begin
  select v.id into v_investor_id from investors v where v.email = v_email and v.is_active;
  if v_investor_id is null then raise exception 'not_authorized'; end if;

  if not exists (
    select 1 from investor_project_access a
    where a.investor_id = v_investor_id and a.investor_project_id = p_project_id and a.unlocked_at is not null
  ) then
    raise exception 'locked';
  end if;

  select jsonb_build_object(
    'project', (
      select jsonb_build_object(
        'id', p.id, 'name_bn', p.name_bn, 'name_en', p.name_en,
        'sector_bn', p.sector_bn, 'sector_en', p.sector_en, 'image_url', p.image_url,
        'status', p.status, 'progress_percent', p.progress_percent, 'summary', p.summary,
        'moving_forward', p.moving_forward, 'not_moving_forward', p.not_moving_forward,
        'updated_at', p.updated_at
      ) from investor_projects p where p.id = p_project_id
    ),
    'my_amount', coalesce((
      select sum(i.investment_amount) from investments i
      where i.investor_id = v_investor_id and i.investor_project_id = p_project_id
    ), 0),
    'my_currency', (
      select min(i.currency) from investments i
      where i.investor_id = v_investor_id and i.investor_project_id = p_project_id
    ),
    'updates', coalesce((
      select jsonb_agg(to_jsonb(u) order by u.update_date desc, u.created_at desc)
      from (select id, title, body, image_url, update_date, created_at from investor_project_updates where project_id = p_project_id) u
    ), '[]'::jsonb),
    'files', coalesce((
      select jsonb_agg(to_jsonb(f) order by f.created_at desc)
      from (select id, title, file_url, file_type, created_at from investor_project_files where project_id = p_project_id) f
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.portal_project_detail(uuid) from public, anon;
grant execute on function public.portal_project_detail(uuid) to authenticated;

-- Investor: overview numbers for the 6 cards.
create or replace function public.portal_overview()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'full_name', v.full_name,
    'investor_code', v.investor_code,
    'membership_level', v.membership_level,
    'total_by_currency', (
      select coalesce(jsonb_object_agg(q.currency, q.total), '{}'::jsonb)
      from (select currency, sum(investment_amount) as total from investments where investor_id = v.id group by currency) q
    ),
    'invested_projects', (
      select count(distinct investor_project_id) from investments
      where investor_id = v.id and investor_project_id is not null
    ),
    'active_projects', (
      select count(distinct i.investor_project_id) from investments i
      join investor_projects p on p.id = i.investor_project_id
      where i.investor_id = v.id and p.status = 'active'
    ),
    'completed_projects', (
      select count(distinct i.investor_project_id) from investments i
      join investor_projects p on p.id = i.investor_project_id
      where i.investor_id = v.id and p.status = 'completed'
    ),
    'received_by_currency', (
      select coalesce(jsonb_object_agg(q.currency, q.total), '{}'::jsonb)
      from (select currency, sum(amount) as total from investor_dividends where investor_id = v.id and status = 'paid' group by currency) q
    ),
    'estimated_by_currency', (
      select coalesce(jsonb_object_agg(q.currency, q.total), '{}'::jsonb)
      from (
        select currency, sum(investment_amount * expected_return_pct / 100) as total
        from investments where investor_id = v.id and expected_return_pct is not null
        group by currency
      ) q
    )
  )
  from investors v
  where v.email = auth.jwt() ->> 'email' and v.is_active;
$$;

revoke all on function public.portal_overview() from public, anon;
grant execute on function public.portal_overview() to authenticated;

-- Investor: dividend history with project names.
create or replace function public.portal_dividends()
returns table (
  id uuid,
  project_name_bn text,
  project_name_en text,
  amount numeric,
  currency text,
  paid_on date,
  status text
)
language sql
stable
security definer
set search_path = public
as $$
  select d.id, p.name_bn, p.name_en, d.amount, d.currency, d.paid_on, d.status
  from investor_dividends d
  join investors v on v.id = d.investor_id
  left join investor_projects p on p.id = d.investor_project_id
  where v.email = auth.jwt() ->> 'email'
  order by d.paid_on desc nulls last, d.created_at desc;
$$;

revoke all on function public.portal_dividends() from public, anon;
grant execute on function public.portal_dividends() to authenticated;

-- Make sure the anon key cannot touch any gated table directly.
revoke all on investor_project_updates, investor_project_files, investor_project_access, investor_projects from anon, authenticated;
