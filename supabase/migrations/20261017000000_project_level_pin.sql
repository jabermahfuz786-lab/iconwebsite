/*
# Investor Portal v3 — one PIN per project

- Every logged-in investor sees all portal projects (portal_projects).
- Each project has ONE PIN (stored hashed on investor_projects.pin_hash), shared by its investors.
- Only investors with an investment in a project can unlock it with that PIN.
- Changing a project's PIN re-locks it for everyone.
- Wrong PIN 5 times -> 15 minute lock (per investor, per project).
*/

-- Project PIN (hashed). Null = no PIN yet.
alter table investor_projects add column if not exists pin_hash text;

-- Per-investor unlock state no longer needs its own PIN.
alter table investor_project_access alter column pin_hash drop not null;

-- Admin (service role only): set or change the project PIN. Re-locks the project for all investors.
create or replace function public.admin_set_project_pin(p_investor_project_id uuid, p_pin text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if p_pin is null or length(p_pin) < 4 or length(p_pin) > 12 then
    raise exception 'pin_length_invalid';
  end if;

  update investor_projects
    set pin_hash = crypt(p_pin, gen_salt('bf')), updated_at = now()
    where id = p_investor_project_id;
  if not found then
    raise exception 'project_not_found';
  end if;

  update investor_project_access
    set unlocked_at = null, failed_attempts = 0, locked_until = null, updated_at = now()
    where investor_project_id = p_investor_project_id;
end;
$$;

revoke all on function public.admin_set_project_pin(uuid, text) from public, anon, authenticated;
grant execute on function public.admin_set_project_pin(uuid, text) to service_role;

-- Investor: check the project PIN. Only for investors who hold the project.
create or replace function public.unlock_portal_project(p_project_id uuid, p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_email text := auth.jwt() ->> 'email';
  v_investor_id uuid;
  v_pin_hash text;
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

  select pin_hash into v_pin_hash from investor_projects where id = p_project_id;
  if v_pin_hash is null then raise exception 'pin_not_set'; end if;

  insert into investor_project_access (investor_id, investor_project_id, pin_hash)
  values (v_investor_id, p_project_id, null)
  on conflict (investor_id, investor_project_id) do nothing;

  select * into v_row from investor_project_access
  where investor_id = v_investor_id and investor_project_id = p_project_id;

  if v_row.locked_until is not null and v_row.locked_until > now() then
    raise exception 'too_many_attempts';
  end if;

  if v_pin_hash = crypt(coalesce(p_pin, ''), v_pin_hash) then
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

-- Investor: all portal projects (every investor sees the list). No project details here.
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
    (p.pin_hash is not null) as has_pin,
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
