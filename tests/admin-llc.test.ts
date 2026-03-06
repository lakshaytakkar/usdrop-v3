import { TestRunner, adminGet, assertOk, assert } from './helpers';

export async function testLLC() {
  const t = new TestRunner('Admin LLC Tracker');
  console.log('\n📋 Admin LLC Tracker Tests');

  await t.test('GET /api/admin/llc returns applications', async () => {
    const res = await adminGet('/api/admin/llc');
    assertOk(res, 'llc');
    assert(typeof res.data === 'object', 'llc should return data');
  });

  await t.test('GET /api/admin/llc/stats returns stage breakdown', async () => {
    const res = await adminGet('/api/admin/llc/stats');
    assertOk(res, 'llc stats');
  });

  return t.printSummary();
}
