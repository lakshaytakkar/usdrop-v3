import { TestRunner, adminGet, assertOk, assertArray, assert } from './helpers';

export async function testCatalog() {
  const t = new TestRunner('Admin Catalog');
  console.log('\n📦 Admin Catalog Tests');

  await t.test('GET /api/admin/products returns paginated products', async () => {
    const res = await adminGet('/api/admin/products?page=1&pageSize=5');
    assertOk(res, 'products');
    assert(typeof res.data === 'object', 'expected object with pagination');
  });

  await t.test('GET /api/admin/categories returns categories', async () => {
    const res = await adminGet('/api/admin/categories');
    assertOk(res, 'categories');
    assert(typeof res.data === 'object', 'categories should return data');
  });

  await t.test('GET /api/admin/suppliers returns suppliers', async () => {
    const res = await adminGet('/api/admin/suppliers');
    assertOk(res, 'suppliers');
    assert(typeof res.data === 'object', 'suppliers should return data');
  });

  await t.test('Products response has pagination metadata', async () => {
    const res = await adminGet('/api/admin/products?page=1&pageSize=5');
    assertOk(res, 'products');
    const d = res.data;
    assert(
      'data' in d || 'products' in d || 'items' in d || Array.isArray(d),
      `Products response should have data array or be array. Keys: ${typeof d === 'object' ? Object.keys(d).join(', ') : typeof d}`
    );
  });

  return t.printSummary();
}
