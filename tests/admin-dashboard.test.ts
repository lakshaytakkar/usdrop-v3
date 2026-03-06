import { TestRunner, adminGet, assertOk, assertHasKeys, assert } from './helpers';

export async function testDashboard() {
  const t = new TestRunner('Admin Dashboard');
  console.log('\n📊 Admin Dashboard Tests');

  await t.test('GET /api/admin/dashboard returns stats', async () => {
    const res = await adminGet('/api/admin/dashboard');
    assertOk(res, 'dashboard');
    assert(typeof res.data === 'object', 'expected object response');
  });

  await t.test('Dashboard stats have expected structure', async () => {
    const res = await adminGet('/api/admin/dashboard');
    assertOk(res, 'dashboard');
    const d = res.data;
    assert(
      'totalExternalUsers' in d,
      `Dashboard data should have totalExternalUsers, got keys: ${Object.keys(d).join(', ')}`
    );
  });

  return t.printSummary();
}
