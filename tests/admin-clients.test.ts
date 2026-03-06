import { TestRunner, adminGet, assertOk, assertArray, assert } from './helpers';

export async function testClients() {
  const t = new TestRunner('Admin Clients');
  console.log('\n👥 Admin Clients Tests');

  await t.test('GET /api/admin/clients returns response', async () => {
    const res = await adminGet('/api/admin/clients');
    assert(res.status !== 401, 'Should not be unauthorized');
    if (res.status === 500) {
      throw new Error(`Server error 500: ${JSON.stringify(res.data)}`);
    }
    assertOk(res, 'clients');
  });

  await t.test('GET /api/admin/batches returns batches', async () => {
    const res = await adminGet('/api/admin/batches');
    assertOk(res, 'batches');
    assert(typeof res.data === 'object', 'batches should return data');
  });

  await t.test('GET /api/admin/clients/stalled returns response', async () => {
    const res = await adminGet('/api/admin/clients/stalled');
    assert(res.status !== 401, 'Should not be unauthorized');
    if (res.status === 500) {
      throw new Error(`Server error 500: ${JSON.stringify(res.data)}`);
    }
    assertOk(res, 'stalled clients');
  });

  return t.printSummary();
}
