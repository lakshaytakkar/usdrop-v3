const TOKEN_KEY = 'usdrop_auth_token';

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function getSessionToken(): Promise<string | null> {
  return getAccessToken();
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getAccessToken();
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

export const supabase = {
  auth: {
    onAuthStateChange(_callback: any) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    async signOut() {
      clearAccessToken();
    },
    async getSession() {
      const token = getAccessToken();
      return { data: { session: token ? { access_token: token } : null } };
    },
  },
};
