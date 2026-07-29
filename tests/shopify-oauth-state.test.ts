/* Regression guard for the Shopify "Connect store" outage (2026-07-29).
   OAuth state used to live in an in-memory Map, which cannot survive the hop
   between the two Vercel lambdas that serve the start and callback requests —
   every connect attempt died with error=invalid_state. Section 2 is the guard. */
process.env.SHOPIFY_CLIENT_SECRET = 'test-secret-abc123';

import crypto from 'crypto';
import {
  createOAuthState,
  verifyOAuthState,
  verifyShopifyHmac,
  normalizeShopDomain,
} from '../server/lib/shopify-oauth';

let pass = 0, fail = 0;
function check(name: string, cond: boolean) {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}`); }
}

const USER = '11111111-2222-3333-4444-555555555555';

console.log('\n1. Round trip (the real flow)');
const state = createOAuthState(USER, 'my-cool-store');
const decoded = verifyOAuthState(state);
check('state verifies', decoded !== null);
check('userId preserved', decoded?.userId === USER);
check('shop normalized', decoded?.shop === 'my-cool-store.myshopify.com');

console.log('\n2. Cross-instance: a *fresh module registry* (new lambda) still verifies');
// Simulate a cold lambda: import a *separate* module instance (cache-busted URL),
// so every piece of module-level state is brand new — exactly the condition that
// made the old in-memory Map lose the state between the two requests.
const fresh: any = await import('../server/lib/shopify-oauth.ts?cold=' + Date.now());
check('state minted on instance A verifies on instance B', fresh.verifyOAuthState(state) !== null);
check('userId survives the hop', fresh.verifyOAuthState(state)?.userId === USER);

console.log('\n3. Tamper resistance');
check('rejects garbage', verifyOAuthState('not-a-state') === null);
check('rejects empty', verifyOAuthState('') === null);
check('rejects missing signature', verifyOAuthState(state.split('.')[0]) === null);
check('rejects bad signature', verifyOAuthState(`${state.split('.')[0]}.${'0'.repeat(64)}`) === null);

// Forge a payload claiming to be a different user, signed with the wrong key.
const forgedBody = Buffer.from(JSON.stringify({
  userId: 'attacker', shop: 'evil.myshopify.com', iat: Date.now(), nonce: 'x',
})).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const forgedSig = crypto.createHmac('sha256', 'wrong-secret').update(forgedBody).digest('hex');
check('rejects forged payload signed with wrong secret', verifyOAuthState(`${forgedBody}.${forgedSig}`) === null);

// Swap the payload but keep a valid-looking signature from the original.
check('rejects payload swap', verifyOAuthState(`${forgedBody}.${state.split('.')[1]}`) === null);

console.log('\n4. Expiry');
const oldBody = Buffer.from(JSON.stringify({
  userId: USER, shop: 'a.myshopify.com', iat: Date.now() - 11 * 60 * 1000, nonce: 'x',
})).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const oldSig = crypto.createHmac('sha256', 'test-secret-abc123').update(oldBody).digest('hex');
check('rejects state older than 10 min', verifyOAuthState(`${oldBody}.${oldSig}`) === null);

const freshBody = Buffer.from(JSON.stringify({
  userId: USER, shop: 'a.myshopify.com', iat: Date.now() - 9 * 60 * 1000, nonce: 'x',
})).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const freshSig = crypto.createHmac('sha256', 'test-secret-abc123').update(freshBody).digest('hex');
check('accepts state inside the 10 min window', verifyOAuthState(`${freshBody}.${freshSig}`) !== null);

console.log('\n5. State is URL-safe (it travels through Shopify as a query param)');
check('no chars needing escaping', encodeURIComponent(state) === state);

console.log('\n6. HMAC verification against the RAW query string (host= carries base64 padding)');
const secret = 'test-secret-abc123';
// Build a callback query the way Shopify sends it, including an encoded `=` in host.
const pairs = [
  'code=abc123',
  'host=ZXhhbXBsZS5teXNob3BpZnkuY29t%3D',
  'shop=my-cool-store.myshopify.com',
  `state=${state}`,
  'timestamp=1700000000',
];
const rawMessage = [...pairs].sort().join('&');
const realHmac = crypto.createHmac('sha256', secret).update(rawMessage).digest('hex');
const rawQuery = `${pairs.join('&')}&hmac=${realHmac}`;

// Express-style decoded query object (note host is now decoded — the old bug).
const decodedQuery: Record<string, string> = {
  code: 'abc123',
  host: 'ZXhhbXBsZS5teXNob3BpZnkuY29t=',
  shop: 'my-cool-store.myshopify.com',
  state,
  timestamp: '1700000000',
  hmac: realHmac,
};
check('accepts a genuine Shopify HMAC computed over the raw query', verifyShopifyHmac(decodedQuery, rawQuery));
check('rejects a tampered HMAC', !verifyShopifyHmac({ ...decodedQuery, hmac: '0'.repeat(64) }, rawQuery.replace(realHmac, '0'.repeat(64))));
check('rejects when a param was altered in flight',
  !verifyShopifyHmac({ ...decodedQuery, shop: 'evil.myshopify.com' },
    rawQuery.replace('shop=my-cool-store.myshopify.com', 'shop=evil.myshopify.com')));
check('no throw on short hmac (timingSafeEqual length guard)',
  verifyShopifyHmac({ ...decodedQuery, hmac: 'ab' }, rawQuery.replace(realHmac, 'ab')) === false);

console.log('\n7. Legacy decoded-form HMAC still accepted (back-compat)');
const legacyMessage = Object.keys(decodedQuery).filter(k => k !== 'hmac').sort()
  .map(k => `${k}=${decodedQuery[k]}`).join('&');
const legacyHmac = crypto.createHmac('sha256', secret).update(legacyMessage).digest('hex');
check('accepts legacy decoded-form HMAC', verifyShopifyHmac({ ...decodedQuery, hmac: legacyHmac }, ''));

console.log('\n8. Shop normalization');
check('bare name', normalizeShopDomain('my-store') === 'my-store.myshopify.com');
check('full url', normalizeShopDomain('https://my-store.myshopify.com/') === 'my-store.myshopify.com');
check('custom domain reduced to shop', normalizeShopDomain('my-store.com') === 'my-store.myshopify.com');

console.log(`\n${'='.repeat(50)}\n  ${pass} passed, ${fail} failed\n${'='.repeat(50)}`);
process.exit(fail === 0 ? 0 : 1);
