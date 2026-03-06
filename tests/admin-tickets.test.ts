import { TestRunner, adminGet, assertOk, assert } from './helpers';

export async function testTickets() {
  const t = new TestRunner('Admin Tickets');
  console.log('\n🎫 Admin Tickets Tests');

  await t.test('GET /api/admin/tickets returns ticket list', async () => {
    const res = await adminGet('/api/admin/tickets');
    assertOk(res, 'tickets');
    assert(typeof res.data === 'object', 'tickets should return data');
  });

  await t.test('Tickets have expected fields', async () => {
    const res = await adminGet('/api/admin/tickets');
    assertOk(res, 'tickets');
    if (res.data.length > 0) {
      const ticket = res.data[0];
      const expectedKeys = ['id'];
      for (const key of expectedKeys) {
        if (!(key in ticket)) {
          throw new Error(`Ticket missing key: ${key}. Has: ${Object.keys(ticket).join(', ')}`);
        }
      }
    }
  });

  return t.printSummary();
}
