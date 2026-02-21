import crypto from 'crypto';

export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function buildShopifyOAuthUrl(shop: string, state: string): string {
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const redirectUri = process.env.SHOPIFY_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || process.env.VITE_APP_URL || ''}/api/shopify-stores/oauth/callback`;
  const scopes = process.env.SHOPIFY_SCOPES || 'read_products,read_orders,read_customers,read_inventory';

  if (!clientId) {
    throw new Error('SHOPIFY_CLIENT_ID environment variable is not set');
  }

  let normalizedShop = shop.trim().toLowerCase();
  normalizedShop = normalizedShop.replace(/^https?:\/\//, '');
  normalizedShop = normalizedShop.replace(/\/$/, '');

  if (!normalizedShop.includes('.')) {
    normalizedShop = `${normalizedShop}.myshopify.com`;
  } else if (!normalizedShop.includes('.myshopify.com')) {
    const match = normalizedShop.match(/^([a-zA-Z0-9-]+)/);
    if (match) {
      normalizedShop = `${match[1]}.myshopify.com`;
    }
  }

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
  code: string,
  state: string
): Promise<{ access_token: string; scope: string }> {
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET environment variables are required');
  }

  let normalizedShop = shop.trim().toLowerCase();
  normalizedShop = normalizedShop.replace(/^https?:\/\//, '');
  normalizedShop = normalizedShop.replace(/\/$/, '');

  if (!normalizedShop.includes('.')) {
    normalizedShop = `${normalizedShop}.myshopify.com`;
  } else if (!normalizedShop.includes('.myshopify.com')) {
    const match = normalizedShop.match(/^([a-zA-Z0-9-]+)/);
    if (match) {
      normalizedShop = `${match[1]}.myshopify.com`;
    }
  }

  const tokenUrl = `https://${normalizedShop}/admin/oauth/access_token`;

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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

  return {
    access_token: data.access_token,
    scope: data.scope || '',
  };
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
  let normalizedShop = shop.trim().toLowerCase();
  normalizedShop = normalizedShop.replace(/^https?:\/\//, '');
  normalizedShop = normalizedShop.replace(/\/$/, '');

  if (!normalizedShop.includes('.')) {
    normalizedShop = `${normalizedShop}.myshopify.com`;
  } else if (!normalizedShop.includes('.myshopify.com')) {
    const match = normalizedShop.match(/^([a-zA-Z0-9-]+)/);
    if (match) {
      normalizedShop = `${match[1]}.myshopify.com`;
    }
  }

  const apiUrl = `https://${normalizedShop}/admin/api/2024-01/shop.json`;

  const response = await fetch(apiUrl, {
    method: 'GET',
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

export function validateOAuthState(state: string, storedState: string): boolean {
  return state === storedState;
}

export function mapShopifyPlan(shopifyPlanName: string): 'basic' | 'shopify' | 'advanced' | 'plus' {
  const planLower = shopifyPlanName.toLowerCase();

  if (planLower.includes('plus')) {
    return 'plus';
  } else if (planLower.includes('advanced')) {
    return 'advanced';
  } else if (planLower.includes('shopify')) {
    return 'shopify';
  } else {
    return 'basic';
  }
}
