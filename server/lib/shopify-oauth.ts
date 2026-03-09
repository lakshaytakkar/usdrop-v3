import crypto from 'crypto';

function normalizeShopDomain(shop: string): string {
  let normalized = shop.trim().toLowerCase();
  normalized = normalized.replace(/^https?:\/\//, '');
  normalized = normalized.replace(/\/$/, '');
  if (!normalized.includes('.')) {
    normalized = `${normalized}.myshopify.com`;
  } else if (!normalized.includes('.myshopify.com')) {
    const match = normalized.match(/^([a-zA-Z0-9-]+)/);
    if (match) {
      normalized = `${match[1]}.myshopify.com`;
    }
  }
  return normalized;
}

export { normalizeShopDomain };

export function verifyShopifyHmac(query: Record<string, any>): boolean {
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!clientSecret) return false;

  const hmac = query.hmac;
  if (!hmac) return false;

  const params = { ...query };
  delete params.hmac;

  const sortedKeys = Object.keys(params).sort();
  const message = sortedKeys.map(k => `${k}=${params[k]}`).join('&');

  const digest = crypto.createHmac('sha256', clientSecret).update(message).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(String(hmac)));
}

export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function getOAuthRedirectUri(): string {
  if (process.env.SHOPIFY_REDIRECT_URI) {
    return process.env.SHOPIFY_REDIRECT_URI;
  }
  const domain = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
  const protocol = domain.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${domain}/api/shopify-stores/oauth/callback`;
}

export function buildShopifyOAuthUrl(shop: string, state: string): string {
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const redirectUri = getOAuthRedirectUri();
  const scopes = process.env.SHOPIFY_SCOPES || 'read_products,read_orders,read_customers,read_inventory';

  if (!clientId) {
    throw new Error('SHOPIFY_CLIENT_ID environment variable is not set');
  }

  const normalizedShop = normalizeShopDomain(shop);
  const params = new URLSearchParams({
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
    state: state,
  });

  return `https://${normalizedShop}/admin/oauth/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(
  shop: string,
  code: string
): Promise<{ access_token: string; scope: string }> {
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET are required');
  }

  const normalizedShop = normalizeShopDomain(shop);
  const tokenUrl = `https://${normalizedShop}/admin/oauth/access_token`;

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to exchange code for token: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error('Access token not received from Shopify');
  }

  return { access_token: data.access_token, scope: data.scope || '' };
}

export async function fetchShopifyStoreInfo(
  accessToken: string,
  shop: string
): Promise<{
  name: string;
  domain: string;
  email: string;
  currency: string;
  plan_name: string;
  myshopify_domain: string;
}> {
  const normalizedShop = normalizeShopDomain(shop);
  const apiUrl = `https://${normalizedShop}/admin/api/2024-01/shop.json`;

  const response = await fetch(apiUrl, {
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch store info: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  if (!data.shop) {
    throw new Error('Store information not received from Shopify');
  }

  return {
    name: data.shop.name || normalizedShop.replace('.myshopify.com', ''),
    domain: data.shop.domain || normalizedShop,
    email: data.shop.email || '',
    currency: data.shop.currency || 'USD',
    plan_name: data.shop.plan_name || 'basic',
    myshopify_domain: data.shop.myshopify_domain || normalizedShop,
  };
}

export async function fetchShopifyProducts(accessToken: string, shop: string): Promise<any[]> {
  const normalizedShop = normalizeShopDomain(shop);
  const allProducts: any[] = [];
  let url: string | null = `https://${normalizedShop}/admin/api/2024-01/products.json?limit=250`;

  while (url) {
    const response = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    allProducts.push(...(data.products || []));

    const linkHeader = response.headers.get('link');
    if (linkHeader && linkHeader.includes('rel="next"')) {
      const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      url = match ? match[1] : null;
    } else {
      url = null;
    }
  }

  return allProducts;
}

export async function fetchShopifyOrders(accessToken: string, shop: string): Promise<any[]> {
  const normalizedShop = normalizeShopDomain(shop);
  const allOrders: any[] = [];
  let url: string | null = `https://${normalizedShop}/admin/api/2024-01/orders.json?limit=250&status=any`;

  while (url) {
    const response = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }

    const data = await response.json();
    allOrders.push(...(data.orders || []));

    const linkHeader = response.headers.get('link');
    if (linkHeader && linkHeader.includes('rel="next"')) {
      const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      url = match ? match[1] : null;
    } else {
      url = null;
    }
  }

  return allOrders;
}

export function mapShopifyPlan(planName: string): 'basic' | 'shopify' | 'advanced' | 'plus' {
  const lower = planName.toLowerCase();
  if (lower.includes('plus')) return 'plus';
  if (lower.includes('advanced')) return 'advanced';
  if (lower.includes('shopify') && !lower.includes('basic')) return 'shopify';
  return 'basic';
}
