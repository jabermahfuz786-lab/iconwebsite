/*
# Other running projects (names only, no amounts)

Investors see their own projects in full. This function lets the dashboard show
a slim list of the other company projects they are not in. Names/status only.
*/
create or replace function public.portal_all_projects()
returns table (
  id uuid, slug text, name_bn text, name_en text, sector_bn text, sector_en text,
  image_url text, sort_order int, status text, progress_percent int
)
language sql stable security definer set search_path = public
as $$
  select p.id, p.slug, p.name_bn, p.name_en, p.sector_bn, p.sector_en, p.image_url, p.sort_order, p.status, p.progress_percent
  from investor_projects p
  where exists (select 1 from investors v where v.email = auth.jwt() ->> 'email' and v.is_active)
  order by p.sort_order;
$$;

revoke all on function public.portal_all_projects() from public, anon;
grant execute on function public.portal_all_projects() to authenticated;
