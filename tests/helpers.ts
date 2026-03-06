const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:5000';
const ADMIN_EMAIL = 'admin@usdrop.ai';
const ADMIN_PASSWORD = 'usdrop';

export interface TestResult {
  name: string;
  passed: boolean;
  status?: number;
  error?: string;
  details?: string;
}

let cachedToken: string | null = null;

export async function getAdminToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  const res = await fetch(`${BASE_URL}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Admin login failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  cachedToken = data.token;
  if (!cachedToken) throw new Error('No token returned from signin');
  return cachedToken;
}

export async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAdminToken();
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers as Record<string, string> || {}),
    },
  });
}

export async function adminGet(path: string): Promise<{ status: number; data: any; ok: boolean }> {
  const res = await adminFetch(path);
  const contentType = res.headers.get('content-type') || '';
  let data: any = null;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  return { status: res.status, data, ok: res.ok };
}

export async function adminPost(path: string, body: any): Promise<{ status: number; data: any; ok: boolean }> {
  const res = await adminFetch(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data, ok: res.ok };
}

export async function adminPatch(path: string, body: any): Promise<{ status: number; data: any; ok: boolean }> {
  const res = await adminFetch(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data, ok: res.ok };
}

export async function adminDelete(path: string): Promise<{ status: number; data: any; ok: boolean }> {
  const res = await adminFetch(path, { method: 'DELETE' });
  const data = await res.json().catch(() => null);
  return { status: res.status, data, ok: res.ok };
}

export function summarize(data: any): string {
  if (!data) return 'null';
  if (typeof data === 'string') return data.substring(0, 100);
  if (Array.isArray(data)) return `Array[${data.length}]`;
  const keys = Object.keys(data);
  return `{${keys.slice(0, 5).join(', ')}}${keys.length > 5 ? ` +${keys.length - 5} more` : ''}`;
}

export class TestRunner {
  private results: TestResult[] = [];
  private suiteName: string;

  constructor(suiteName: string) {
    this.suiteName = suiteName;
  }

  async test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      this.results.push({ name, passed: true });
      console.log(`  ✅ ${name}`);
    } catch (err: any) {
      this.results.push({ name, passed: false, error: err.message });
      console.log(`  ❌ ${name}`);
      console.log(`     ${err.message}`);
    }
  }

  printSummary() {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    console.log(`\n  ${this.suiteName}: ${passed} passed, ${failed} failed out of ${this.results.length}`);
    return { passed, failed, total: this.results.length, results: this.results };
  }
}

export function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

export function assertStatus(actual: number, expected: number, label: string) {
  if (actual !== expected) {
    throw new Error(`${label}: expected status ${expected}, got ${actual}`);
  }
}

export function assertOk(result: { ok: boolean; status: number; data: any }, label: string) {
  if (!result.ok) {
    throw new Error(`${label}: expected OK, got ${result.status} — ${JSON.stringify(result.data).substring(0, 200)}`);
  }
}

export function assertArray(data: any, label: string) {
  if (!Array.isArray(data)) {
    throw new Error(`${label}: expected array, got ${typeof data}`);
  }
}

export function assertHasKeys(obj: any, keys: string[], label: string) {
  if (!obj || typeof obj !== 'object') {
    throw new Error(`${label}: expected object, got ${typeof obj}`);
  }
  const missing = keys.filter(k => !(k in obj));
  if (missing.length > 0) {
    throw new Error(`${label}: missing keys: ${missing.join(', ')}`);
  }
}
