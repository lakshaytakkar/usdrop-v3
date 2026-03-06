import { TestRunner, adminGet, assertOk, assertArray, assert } from './helpers';

export async function testUsers() {
  const t = new TestRunner('Admin Users');
  console.log('\n👤 Admin Users Tests');

  await t.test('GET /api/admin/external-users returns user list', async () => {
    const res = await adminGet('/api/admin/external-users');
    assertOk(res, 'external-users');
    assertArray(res.data, 'external users data');
  });

  await t.test('GET /api/admin/internal-users returns staff list', async () => {
    const res = await adminGet('/api/admin/internal-users');
    assertOk(res, 'internal-users');
    assertArray(res.data, 'internal users data');
  });

  await t.test('External users have profile fields', async () => {
    const res = await adminGet('/api/admin/external-users');
    assertOk(res, 'external-users');
    if (res.data.length > 0) {
      const user = res.data[0];
      assert('id' in user, `User missing id. Keys: ${Object.keys(user).join(', ')}`);
      assert('email' in user, `User missing email. Keys: ${Object.keys(user).join(', ')}`);
    }
  });

  return t.printSummary();
}
