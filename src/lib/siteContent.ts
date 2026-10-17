import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Website-wide editable values (images, text) stored in the site_content table.
// The public site reads them; only admins can change them (database rules).
// If a key is missing, the page keeps its built-in default.

let cache: Record<string, string> = {};
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export async function loadSiteContent(): Promise<void> {
  try {
    const { data, error } = await supabase.from('site_content').select('key, value');
    if (error || !data) return;
    const next: Record<string, string> = {};
    for (const row of data as { key: string; value: string | null }[]) {
      if (row.value) next[row.key] = row.value;
    }
    cache = next;
    notify();
  } catch {
    // Keep defaults if the network is unavailable.
  }
}

export async function saveSiteValue(key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from('site_content')
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
  cache = { ...cache, [key]: value };
  notify();
}

export async function uploadSiteMedia(file: File, keyHint: string): Promise<string> {
  const ext = (file.name.split('.').pop() || 'webp').toLowerCase();
  const path = `${keyHint}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('site-media')
    .upload(path, file, { upsert: true, contentType: file.type || undefined });
  if (error) throw error;
  return supabase.storage.from('site-media').getPublicUrl(path).data.publicUrl;
}

export function useSiteContent(): Record<string, string> {
  const [data, setData] = useState<Record<string, string>>(cache);

  useEffect(() => {
    const update = () => setData(cache);
    listeners.add(update);
    loadSiteContent();
    return () => {
      listeners.delete(update);
    };
  }, []);

  return data;
}
