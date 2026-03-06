import { TestRunner, adminGet, adminPost, adminPatch, adminDelete, assertOk, assert } from './helpers';

export async function testCrud() {
  const t = new TestRunner('Admin CRUD Operations');
  console.log('\n🔧 Admin CRUD Tests');

  let testUserId: string | null = null;
  let createdTicketId: string | null = null;
  let createdBatchId: string | null = null;
  let createdLlcId: string | null = null;

  await t.test('Fetch a test user ID', async () => {
    const users = await adminGet('/api/admin/external-users');
    assertOk(users, 'external-users');
    assert(users.data.length > 0, 'Need at least one user');
    testUserId = users.data[0].id;
  });

  await t.test('POST /api/admin/tickets creates a ticket', async () => {
    if (!testUserId) throw new Error('No test user available');
    const res = await adminPost('/api/admin/tickets', {
      title: 'E2E Test Ticket',
      priority: 'low',
      type: 'technical',
      user_id: testUserId,
    });
    assertOk(res, 'create ticket');
    const ticket = res.data?.ticket || res.data;
    assert(!!ticket?.id, 'ticket should have an id');
    createdTicketId = ticket.id;
  });

  await t.test('PATCH /api/admin/tickets/:id updates ticket', async () => {
    if (!createdTicketId) throw new Error('No ticket to update');
    const res = await adminPatch(`/api/admin/tickets/${createdTicketId}`, {
      title: 'Updated E2E Test Ticket',
      priority: 'medium',
    });
    assertOk(res, 'update ticket');
  });

  await t.test('GET /api/admin/tickets/:id returns ticket detail', async () => {
    if (!createdTicketId) throw new Error('No ticket to get');
    const res = await adminGet(`/api/admin/tickets/${createdTicketId}`);
    assertOk(res, 'get ticket');
    assert(typeof res.data === 'object', 'ticket detail should be object');
  });

  await t.test('DELETE /api/admin/tickets/:id removes ticket', async () => {
    if (!createdTicketId) throw new Error('No ticket to delete');
    const res = await adminDelete(`/api/admin/tickets/${createdTicketId}`);
    assertOk(res, 'delete ticket');
  });

  await t.test('POST /api/admin/batches creates a batch', async () => {
    const res = await adminPost('/api/admin/batches', {
      name: 'E2E Test Batch',
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
    });
    assertOk(res, 'create batch');
    const batch = res.data?.batch || res.data;
    assert(!!batch?.id, 'batch should have an id');
    createdBatchId = batch.id;
  });

  await t.test('GET /api/admin/batches/:id returns batch detail', async () => {
    if (!createdBatchId) throw new Error('No batch to get');
    const res = await adminGet(`/api/admin/batches/${createdBatchId}`);
    assertOk(res, 'get batch');
  });

  await t.test('DELETE /api/admin/batches/:id removes batch', async () => {
    if (!createdBatchId) throw new Error('No batch to delete');
    const res = await adminDelete(`/api/admin/batches/${createdBatchId}`);
    assertOk(res, 'delete batch');
  });

  await t.test('POST /api/admin/llc creates an application', async () => {
    if (!testUserId) throw new Error('No test user available');
    const res = await adminPost('/api/admin/llc', {
      user_id: testUserId,
      llc_name: 'E2E Test LLC',
      state: 'Wyoming',
      package_type: 'standard',
    });
    assertOk(res, 'create llc');
    const app = res.data?.application || res.data;
    assert(!!app?.id, 'llc should have an id');
    createdLlcId = app.id;
  });

  await t.test('DELETE /api/admin/llc/:id removes LLC application', async () => {
    if (!createdLlcId) throw new Error('No LLC to delete');
    const res = await adminDelete(`/api/admin/llc/${createdLlcId}`);
    assertOk(res, 'delete llc');
  });

  await t.test('POST /api/admin/access-rules creates a rule', async () => {
    const res = await adminPost('/api/admin/access-rules', {
      plan_slug: 'free',
      resource_type: 'page',
      resource_key: '/test/e2e-page',
      access_level: 'locked',
    });
    assertOk(res, 'create access rule');
    if (res.ok && res.data?.id) {
      await adminDelete(`/api/admin/access-rules/${res.data.id}`);
    }
  });

  await t.test('GET /api/admin/dashboard returns comprehensive stats', async () => {
    const res = await adminGet('/api/admin/dashboard');
    assertOk(res, 'dashboard');
    const d = res.data;
    const expectedKeys = ['totalExternalUsers', 'totalProducts', 'totalCourses', 'totalLeads', 'hotLeads', 'openTickets'];
    for (const key of expectedKeys) {
      assert(key in d, `Dashboard missing key: ${key}`);
    }
  });

  return t.printSummary();
}
