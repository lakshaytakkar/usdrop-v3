// Shopify OAuth helper functions for client-side use
// Note: Token exchange with client_secret is handled server-side only

/**
 * Generate a secure random state token for OAuth flow
 */
export function generateOAuthState(): string {
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 32; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Build Shopify OAuth URL
 */
export function buildShopifyOAuthUrl(shop: string, state: string): string {
  const clientId = import.meta.env.VITE_SHOPIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SHOPIFY_REDIRECT_URI || `${window.location.origin}/api/shopify-stores/oauth/callback`;
  const scopes = import.meta.env.VITE_SHOPIFY_SCOPES || 'read_products,read_orders,read_customers,read_inventory';

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

/**
 * Fetch store information via server-side API route (keeps credentials secure)
 */
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

/**
 * Validate OAuth state token
 */
export function validateOAuthState(state: string, storedState: string): boolean {
  return state === storedState;
}

/**
 * Map Shopify plan name to our plan enum
 */
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
