import { TestRunner, adminGet, assertOk, assert } from './helpers';

export async function testAuth() {
  const t = new TestRunner('Admin Auth & Guards');
  console.log('\n🔐 Admin Auth Tests');

  await t.test('GET /api/auth/user returns admin profile', async () => {
    const res = await adminGet('/api/auth/user');
    assertOk(res, 'auth user');
    assert('id' in res.data || 'user' in res.data, `Expected user data, got: ${Object.keys(res.data).join(', ')}`);
  });

  await t.test('Admin endpoints reject unauthenticated requests', async () => {
    const res = await fetch('http://localhost:5000/api/admin/dashboard');
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await t.test('Admin endpoints reject non-admin users', async () => {
    const signinRes = await fetch('http://localhost:5000/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'free@usdrop.ai', password: 'usdrop' }),
    });
    if (signinRes.ok) {
      const { token } = await signinRes.json();
      if (token) {
        const res = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        assert(res.status === 403 || res.status === 401, `Expected 401/403 for non-admin, got ${res.status}`);
      }
    }
  });

  return t.printSummary();
}
