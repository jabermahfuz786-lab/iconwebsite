import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  detectSessionInUrl: true,
  storageKey: 'my-icon-auth',
  flowType: 'pkce',
  },
});

export const WHATSAPP_NUMBER = '+96872724934';
export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
