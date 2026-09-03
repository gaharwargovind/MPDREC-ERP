import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe extraction from environment without hardcoded secrets
const rawEnvUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const rawEnvKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

function validateHttpUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export const isSupabaseConfigured: boolean = Boolean(
  rawEnvUrl &&
  rawEnvKey &&
  validateHttpUrl(rawEnvUrl)
);

// Fallback dummy URL/key for initialization when running purely through backend proxy
const clientUrl = isSupabaseConfigured ? rawEnvUrl.trim() : 'https://cloud-db.internal';
const clientKey = isSupabaseConfigured ? rawEnvKey.trim() : 'anon-client-session';

// Create Supabase client singleton
export const supabase: SupabaseClient = createClient(clientUrl, clientKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
