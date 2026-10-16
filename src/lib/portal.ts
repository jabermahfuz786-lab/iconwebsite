import { supabase } from './supabase';

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed';

export type Overview = {
  full_name: string;
  investor_code: string;
  membership_level: string | null;
  total_by_currency: Record<string, number>;
  invested_projects: number;
  active_projects: number;
  completed_projects: number;
  received_by_currency: Record<string, number>;
  estimated_by_currency: Record<string, number>;
};

export type PortalProject = {
  id: string;
  slug: string;
  name_bn: string;
  name_en: string;
  sector_bn: string;
  sector_en: string;
  image_url: string | null;
  sort_order: number;
  my_amount: number;
  my_currency: string | null;
  has_pin: boolean;
  is_unlocked: boolean;
};

export type ProjectUpdate = {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  update_date: string;
  created_at: string;
};

export type ProjectFile = {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  created_at: string;
};

export type ProjectDetail = {
  project: {
    id: string;
    name_bn: string;
    name_en: string;
    sector_bn: string;
    sector_en: string;
    image_url: string | null;
    status: ProjectStatus | null;
    progress_percent: number | null;
    summary: string;
    moving_forward: string;
    not_moving_forward: string;
    updated_at: string;
  };
  my_amount: number;
  my_currency: string | null;
  updates: ProjectUpdate[];
  files: ProjectFile[];
};

export type Dividend = {
  id: string;
  project_name_bn: string | null;
  project_name_en: string | null;
  amount: number;
  currency: string;
  paid_on: string | null;
  status: 'scheduled' | 'pending' | 'paid' | 'failed';
};

export async function resolveLoginEmail(identifier: string): Promise<string> {
  const { data, error } = await supabase.rpc('resolve_investor_login', { p_identifier: identifier });
  if (error || !data) return identifier.trim();
  return data as string;
}

export async function fetchOverview(): Promise<Overview | null> {
  const { data, error } = await supabase.rpc('portal_overview');
  if (error || !data) return null;
  return data as Overview;
}

export async function fetchProjects(): Promise<PortalProject[]> {
  const { data, error } = await supabase.rpc('portal_projects');
  if (error || !data) return [];
  return data as PortalProject[];
}

export async function fetchDividends(): Promise<Dividend[]> {
  const { data, error } = await supabase.rpc('portal_dividends');
  if (error || !data) return [];
  return data as Dividend[];
}

export async function fetchProjectDetail(projectId: string): Promise<ProjectDetail | 'locked' | 'error'> {
  const { data, error } = await supabase.rpc('portal_project_detail', { p_project_id: projectId });
  if (error) return error.message?.includes('locked') ? 'locked' : 'error';
  return data as ProjectDetail;
}

export type UnlockResult = 'ok' | 'wrong' | 'locked' | 'no_investment' | 'no_pin' | 'error';

export async function unlockProject(projectId: string, pin: string): Promise<UnlockResult> {
  const { data, error } = await supabase.rpc('unlock_portal_project', { p_project_id: projectId, p_pin: pin });
  if (error) {
    const m = error.message || '';
    if (m.includes('too_many_attempts')) return 'locked';
    if (m.includes('no_investment')) return 'no_investment';
    if (m.includes('pin_not_set')) return 'no_pin';
    return 'error';
  }
  return data ? 'ok' : 'wrong';
}
