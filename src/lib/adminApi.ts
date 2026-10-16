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

export type AdminSignInResult =
  | { status: 'ok' }
  | { status: 'not_admin' }
  | { status: 'error'; message: string };

/** Turns a Supabase auth error into a message the admin can act on. */
function authErrorMessage(error: { message?: string; code?: string }): string {
  const code = error.code ?? '';
  const msg = (error.message ?? '').toLowerCase();
  if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
    return 'ইমেইল বা পাসওয়ার্ড ভুল। পাসওয়ার্ড কপি-পেস্ট করলে আগে-পিছের স্পেস মুছে দিন।';
  }
  if (code === 'email_not_confirmed' || msg.includes('email not confirmed')) {
    return 'ইমেইল এখনো যাচাই হয়নি। Supabase-এ email_confirmed_at সেট করুন।';
  }
  if (code === 'over_request_rate_limit' || msg.includes('rate limit')) {
    return 'অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।';
  }
  return error.message || 'লগইন ব্যর্থ হয়েছে।';
}

export async function signInAdmin(email: string, password: string): Promise<AdminSignInResult> {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) return { status: 'error', message: authErrorMessage(error) };

  if (await checkAdminSession()) return { status: 'ok' };

  // Signed in, but the user is not in admin_users: sign out so no half-session stays.
  await supabase.auth.signOut();
  return { status: 'not_admin' };
}
