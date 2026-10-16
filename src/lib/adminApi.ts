// Same admin password mechanism as AdminPage. See the security note in the setup doc:
// this is client-visible and should be replaced with a JWT-based admin check.
export const ADMIN_PASSWORD = 'myicon-admin-2024';

const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api`;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

async function handle<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as { error?: string }).error || `HTTP ${res.status}`);
  return json as T;
}

export async function adminGet<T>(resource: string): Promise<T> {
  const res = await fetch(`${EDGE_URL}/${resource}`, {
    headers: { Authorization: `Bearer ${anonKey}`, 'X-Admin-Password': ADMIN_PASSWORD },
  });
  return handle<T>(res);
}

export async function adminPost<T>(resource: string, payload: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${EDGE_URL}/${resource}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${anonKey}` },
    body: JSON.stringify({ ...payload, _admin_password: ADMIN_PASSWORD }),
  });
  return handle<T>(res);
}
