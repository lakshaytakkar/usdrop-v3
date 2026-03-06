import { TestRunner, adminGet, assert, getAdminToken } from './helpers';

export async function testNavigation() {
  const t = new TestRunner('Admin Navigation & Page Rendering');
  console.log('\n🧭 Admin Navigation Tests');

  const BASE = 'http://localhost:5000';

  const adminPages = [
    '/admin',
    '/admin/pipeline',
    '/admin/clients',
    '/admin/llc',
    '/admin/tickets',
    '/admin/users',
    '/admin/courses',
    '/admin/sessions',
    '/admin/videos',
    '/admin/content/free-learning',
    '/admin/products',
    '/admin/categories',
    '/admin/access-control',
  ];

  for (const page of adminPages) {
    await t.test(`Page ${page} returns HTML (no 404/500)`, async () => {
      const res = await fetch(`${BASE}${page}`);
      assert(res.ok, `${page} returned ${res.status}`);
      const contentType = res.headers.get('content-type') || '';
      assert(contentType.includes('text/html'), `${page} should return HTML, got ${contentType}`);
    });
  }

  const publicPages = [
    '/login',
    '/signup',
    '/',
  ];

  for (const page of publicPages) {
    await t.test(`Public page ${page} returns HTML`, async () => {
      const res = await fetch(`${BASE}${page}`);
      assert(res.ok, `${page} returned ${res.status}`);
    });
  }

  return t.printSummary();
}
