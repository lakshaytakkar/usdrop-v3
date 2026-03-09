import { Express, Request, Response, NextFunction } from 'express';
import { supabaseRemote } from '../lib/supabase-remote';
import {
  updateShopifyProductPrice,
  normalizeShopDomain,
  verifyShopifyHmac,
  exchangeCodeForToken,
  fetchShopifyStoreInfo,
  mapShopifyPlan,
} from '../lib/shopify-oauth';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

interface ShopifyAppRequest extends Request {
  shopifyStore?: any;
}

const embeddedOAuthStates = new Map<string, { shop: string; createdAt: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of embeddedOAuthStates) {
    if (now - val.createdAt > 10 * 60 * 1000) {
      embeddedOAuthStates.delete(key);
    }
  }
}, 60 * 1000);

function isValidShopDomain(shop: string): boolean {
  return /^[a-z0-9][a-z0-9\-]*\.myshopify\.com$/i.test(shop);
}

function getAppBaseUrl(req: Request): string {
  const domain = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_DOMAINS?.split(',')[0] || req.get('host') || 'localhost:5000';
  const protocol = domain.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${domain}`;
}

async function requireShopifyShop(req: ShopifyAppRequest, res: Response, next: NextFunction) {
  const shop = (req.query.shop as string || '').trim().toLowerCase();
  if (!shop) {
    return res.status(400).json({ error: 'Missing shop parameter' });
  }

  const normalizedShop = normalizeShopDomain(shop);
  if (!isValidShopDomain(normalizedShop)) {
    return res.status(400).json({ error: 'Invalid shop domain' });
  }

  const { data: store, error } = await supabaseRemote
    .from('shopify_stores')
    .select('*')
    .eq('shop_domain', normalizedShop)
    .eq('is_active', true)
    .single();

  if (error || !store) {
    return res.status(401).json({ error: 'Store not found or not connected' });
  }

  req.shopifyStore = store;
  next();
}

export function registerShopifyAppRoutes(app: Express) {

  app.get('/shopify-app', async (req: Request, res: Response) => {
    const shop = (req.query.shop as string || '').trim().toLowerCase();
    const host = req.query.host as string || '';
    const hmac = req.query.hmac as string;
    const baseUrl = getAppBaseUrl(req);

    if (!shop) {
      return res.status(400).send('Missing shop parameter. This app must be opened from Shopify Admin.');
    }

    const normalizedShop = normalizeShopDomain(shop);
    if (!isValidShopDomain(normalizedShop)) {
      return res.status(400).send('Invalid shop domain');
    }

    if (hmac) {
      const queryObj: Record<string, string> = {};
      for (const [k, v] of Object.entries(req.query)) {
        queryObj[k] = String(v);
      }
      if (!verifyShopifyHmac(queryObj)) {
        return res.status(401).send('Invalid HMAC signature');
      }
    }

    const { data: store } = await supabaseRemote
      .from('shopify_stores')
      .select('id, is_active')
      .eq('shop_domain', normalizedShop)
      .eq('is_active', true)
      .single();

    if (!store) {
      const clientId = process.env.SHOPIFY_CLIENT_ID;
      const scopes = process.env.SHOPIFY_SCOPES || 'read_products,write_products,read_orders,read_customers,read_inventory';
      const redirectUri = `${baseUrl}/shopify-app/auth/callback`;

      const state = crypto.randomBytes(32).toString('hex');
      embeddedOAuthStates.set(state, { shop: normalizedShop, createdAt: Date.now() });

      const oauthUrl = `https://${normalizedShop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

      return res.send(`
        <!DOCTYPE html>
        <html><head><title>Installing USDrop</title></head>
        <body>
          <script>
            window.top.location.href = "${oauthUrl}";
          </script>
          <p>Redirecting to authorize USDrop...</p>
        </body></html>
      `);
    }

    const safeShop = normalizedShop.replace(/[^a-z0-9.\-]/g, '');
    const safeHost = host.replace(/[^a-zA-Z0-9=]/g, '');
    const appHtmlPath = path.join(import.meta.dirname, '..', 'shopify-app', 'index.html');

    try {
      let html = fs.readFileSync(appHtmlPath, 'utf-8');
      html = html.replace('{{SHOP}}', safeShop);
      html = html.replace('{{HOST}}', safeHost);
      html = html.replace('{{SHOPIFY_CLIENT_ID}}', process.env.SHOPIFY_CLIENT_ID || '');
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Security-Policy', `frame-ancestors https://${safeShop} https://admin.shopify.com;`);
      return res.send(html);
    } catch {
      return res.status(500).send('App not available');
    }
  });

  app.get('/shopify-app/auth/callback', async (req: Request, res: Response) => {
    try {
      const { code, state, shop, error: oauthError, hmac } = req.query;
      const baseUrl = getAppBaseUrl(req);

      if (oauthError) {
        return res.status(400).send(`Authorization failed: ${oauthError}`);
      }

      if (!code || !shop || !state) {
        return res.status(400).send('Missing required parameters');
      }

      if (hmac) {
        const queryObj: Record<string, string> = {};
        for (const [k, v] of Object.entries(req.query)) {
          queryObj[k] = String(v);
        }
        if (!verifyShopifyHmac(queryObj)) {
          return res.status(401).send('HMAC verification failed');
        }
      }

      const stateStr = String(state);
      const storedState = embeddedOAuthStates.get(stateStr);
      if (!storedState) {
        return res.status(400).send('Invalid or expired state. Please try installing the app again from Shopify Admin.');
      }

      const shopStr = String(shop);
      const normalizedShop = normalizeShopDomain(shopStr);
      if (normalizedShop !== storedState.shop) {
        embeddedOAuthStates.delete(stateStr);
        return res.status(400).send('Shop mismatch');
      }
      embeddedOAuthStates.delete(stateStr);

      const { access_token } = await exchangeCodeForToken(shopStr, String(code));
      const storeInfo = await fetchShopifyStoreInfo(access_token, shopStr);
      const normalizedDomain = normalizeShopDomain(storeInfo.myshopify_domain);
      const plan = mapShopifyPlan(storeInfo.plan_name);
      const now = new Date().toISOString();

      const { data: existingStore } = await supabaseRemote
        .from('shopify_stores')
        .select('id, user_id')
        .eq('shop_domain', normalizedDomain)
        .single();

      if (existingStore) {
        await supabaseRemote
          .from('shopify_stores')
          .update({
            store_name: storeInfo.name,
            store_email: storeInfo.email,
            access_token: access_token,
            is_active: true,
            currency: storeInfo.currency,
            plan: plan,
            updated_at: now,
          })
          .eq('id', existingStore.id);
      } else {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html><head><title>USDrop</title>
          <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="bg-gray-50 flex items-center justify-center min-h-screen">
            <div class="max-w-md text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
              <div class="h-12 w-12 mx-auto mb-4 rounded-xl bg-blue-500 flex items-center justify-center">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h1 class="text-xl font-bold text-gray-900 mb-2">Connect via USDrop First</h1>
              <p class="text-sm text-gray-600 mb-4">To use USDrop tools inside Shopify, please first connect your store through the USDrop platform. This links your store to your USDrop account.</p>
              <a href="https://usdrop.ai" target="_blank" class="inline-block px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">Go to USDrop</a>
              <p class="text-xs text-gray-400 mt-4">After connecting, come back to Shopify and open the app again.</p>
            </div>
          </body></html>
        `);
      }

      const redirectUrl = `https://${normalizedDomain}/admin/apps/${process.env.SHOPIFY_CLIENT_ID || ''}`;
      return res.redirect(redirectUrl);
    } catch (error: any) {
      console.error('Shopify app OAuth callback error:', error);
      return res.status(500).send('Installation failed. Please try again from Shopify Admin.');
    }
  });

  app.get('/shopify-app/api/products', requireShopifyShop, async (req: ShopifyAppRequest, res: Response) => {
    try {
      const store = req.shopifyStore;
      const { data, error } = await supabaseRemote
        .from('shopify_store_products')
        .select('*')
        .eq('store_id', store.id)
        .order('title', { ascending: true });

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch products' });
      }

      return res.json({ products: data || [] });
    } catch {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/shopify-app/api/orders', requireShopifyShop, async (req: ShopifyAppRequest, res: Response) => {
    try {
      const store = req.shopifyStore;
      const { data, error } = await supabaseRemote
        .from('shopify_store_orders')
        .select('*')
        .eq('store_id', store.id)
        .order('shopify_created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch orders' });
      }

      return res.json({ orders: data || [] });
    } catch {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/shopify-app/api/products/:productId/price', requireShopifyShop, async (req: ShopifyAppRequest, res: Response) => {
    try {
      const store = req.shopifyStore;
      const { productId } = req.params;
      const { price, compare_at_price } = req.body;

      const numPrice = Number(price);
      if (price == null || !Number.isFinite(numPrice) || numPrice < 0) {
        return res.status(400).json({ error: 'Valid price is required (must be a non-negative number)' });
      }

      if (compare_at_price != null) {
        const numCompare = Number(compare_at_price);
        if (!Number.isFinite(numCompare) || numCompare < 0) {
          return res.status(400).json({ error: 'Compare-at price must be a non-negative number' });
        }
      }

      const { data: product } = await supabaseRemote
        .from('shopify_store_products')
        .select('shopify_product_id')
        .eq('id', productId)
        .eq('store_id', store.id)
        .single();

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await updateShopifyProductPrice(
        store.access_token,
        store.shop_domain,
        product.shopify_product_id,
        numPrice,
        compare_at_price != null ? Number(compare_at_price) : undefined
      );

      await supabaseRemote
        .from('shopify_store_products')
        .update({
          price: numPrice,
          compare_at_price: compare_at_price != null ? Number(compare_at_price) : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId);

      return res.json({ success: true, price: numPrice, compare_at_price: compare_at_price != null ? Number(compare_at_price) : null });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to update price' });
    }
  });
}
