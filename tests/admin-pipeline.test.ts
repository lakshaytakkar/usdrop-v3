import { TestRunner, adminGet, assertOk, assertArray } from './helpers';

export async function testPipeline() {
  const t = new TestRunner('Admin Pipeline');
  console.log('\n🔀 Admin Pipeline Tests');

  await t.test('GET /api/admin/pipeline returns leads data', async () => {
    const res = await adminGet('/api/admin/pipeline');
    assertOk(res, 'pipeline');
    assertArray(res.data, 'pipeline data');
  });

  await t.test('GET /api/admin/leads returns leads', async () => {
    const res = await adminGet('/api/admin/leads');
    assertOk(res, 'leads');
  });

  return t.printSummary();
}
