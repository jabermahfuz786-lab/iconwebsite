/*
# Investor Portal v4 — no PIN; each investor sees only their own projects

- Login with email/phone/code + password is the only gate.
- portal_projects(): only projects where the signed-in investor has an investment.
- portal_project_detail(): allowed when the investor has an investment in that project.
- Investment documents: visible to the investment's owner (no unlock step).
- Project PIN code is no longer used by the portal.
*/

-- ============ PROJECTS I HOLD ============
drop function if exists public.portal_projects();

create function public.portal_projects()
returns table (
  id uuid,
  slug text,
  name_bn text,
  name_en text,
  sector_bn text,
  sector_en text,
  image_url text,
  sort_order int,
  status text,
  progress_percent int,
  my_amount numeric,
  my_currency text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id, p.slug, p.name_bn, p.name_en, p.sector_bn, p.sector_en, p.image_url, p.sort_order,
    p.status, p.progress_percent,
    sum(i.investment_amount) as my_amount,
    min(i.currency) as my_currency
  from investments i
  join investors v on v.id = i.investor_id
  join investor_projects p on p.id = i.investor_project_id
  where v.email = auth.jwt() ->> 'email'
    and v.is_active
  group by p.id, p.slug, p.name_bn, p.name_en, p.sector_bn, p.sector_en, p.image_url, p.sort_order, p.status, p.progress_percent
  order by p.sort_order;
$$;

revoke all on function public.portal_projects() from public, anon;
grant execute on function public.portal_projects() to authenticated;

-- ============ PROJECT DETAIL (only for holders) ============
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
    select 1 from investments i where i.investor_id = v_investor_id and i.investor_project_id = p_project_id
  ) then
    raise exception 'not_invested';
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

-- ============ DOCUMENTS: owner only, no unlock step ============
drop policy if exists "investor_read_own_documents" on investment_documents;
create policy "investor_read_own_documents" on investment_documents
  for select to authenticated using (
    exists (
      select 1 from investments i
      join investors v on v.id = i.investor_id
      where i.id = investment_documents.investment_id
        and v.email = auth.jwt() ->> 'email'
    )
  );
