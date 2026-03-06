import { TestRunner, adminGet, assertOk, assertArray } from './helpers';

export async function testSettings() {
  const t = new TestRunner('Admin Settings');
  console.log('\n⚙️ Admin Settings Tests');

  await t.test('GET /api/admin/access-rules returns rules', async () => {
    const res = await adminGet('/api/admin/access-rules');
    assertOk(res, 'access-rules');
    assertArray(res.data, 'access rules data');
  });

  await t.test('GET /api/admin/plans returns subscription plans', async () => {
    const res = await adminGet('/api/admin/plans');
    assertOk(res, 'plans');
    assertArray(res.data, 'plans data');
  });

  return t.printSummary();
}
