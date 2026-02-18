import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getAccessToken(): string | null {
  const session = JSON.parse(
    localStorage.getItem(`sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`) || 'null'
  );
  return session?.access_token || null;
}

export async function getSessionToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = await getSessionToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(path, {
    ...options,
    headers,
  });
}
