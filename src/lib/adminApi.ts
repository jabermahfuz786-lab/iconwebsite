import { supabase } from './supabase';

// Admin requests use the signed-in user's access token. The edge function accepts
// only users listed in the admin_users table.
const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api`;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

async function accessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function handle<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as { error?: string }).error || `HTTP ${res.status}`);
  return json as T;
}

export async function adminRequest<T>(resource: string, method: string, payload?: unknown): Promise<T> {
  const token = await accessToken();
  if (!token) throw new Error('Unauthorized');
  const res = await fetch(`${EDGE_URL}/${resource}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(payload !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: payload !== undefined ? JSON.stringify(payload) : undefined,
  });
  return handle<T>(res);
}

export function adminGet<T>(resource: string): Promise<T> {
  return adminRequest<T>(resource, 'GET');
}

export function adminPost<T>(resource: string, payload: Record<string, unknown>): Promise<T> {
  return adminRequest<T>(resource, 'POST', payload);
}

/** True when the current session belongs to an admin. */
export async function checkAdminSession(): Promise<boolean> {
  try {
    await adminGet('whoami');
    return true;
  } catch {
    return false;
  }
}

export async function signInAdmin(email: string, password: string): Promise<'ok' | 'bad_credentials' | 'not_admin'> {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) return 'bad_credentials';
  if (await checkAdminSession()) return 'ok';
  await supabase.auth.signOut();
  return 'not_admin';
}
