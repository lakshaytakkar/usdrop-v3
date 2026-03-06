import { TestRunner, adminGet, assertOk, assertArray, assert } from './helpers';

export async function testContent() {
  const t = new TestRunner('Admin Content');
  console.log('\n📚 Admin Content Tests');

  await t.test('GET /api/admin/courses returns courses', async () => {
    const res = await adminGet('/api/admin/courses');
    assertOk(res, 'courses');
    assert(typeof res.data === 'object', 'courses should return data');
  });

  await t.test('GET /api/admin/sessions returns sessions', async () => {
    const res = await adminGet('/api/admin/sessions');
    assertOk(res, 'sessions');
    assertArray(res.data, 'sessions data');
  });

  await t.test('GET /api/admin/videos returns ad videos', async () => {
    const res = await adminGet('/api/admin/videos');
    assertOk(res, 'videos');
    assertArray(res.data, 'videos data');
  });

  await t.test('GET /api/ad-videos (public) returns published videos', async () => {
    const res = await adminGet('/api/ad-videos');
    assertOk(res, 'public ad-videos');
    assertArray(res.data, 'public ad-videos data');
  });

  await t.test('GET /api/admin/enrollments returns enrollments', async () => {
    const res = await adminGet('/api/admin/enrollments');
    assertOk(res, 'enrollments');
    assertArray(res.data, 'enrollments data');
  });

  return t.printSummary();
}
