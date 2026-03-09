import { Express, Request, Response, NextFunction } from 'express';
import { supabaseRemote } from '../lib/supabase-remote';
import { updateShopifyProductPrice } from '../lib/shopify-oauth';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

interface ShopifyAppRequest extends Request {
  shopifyStore?: any;
}

function verifyShopifyHmac(query: Record<string, any>): boolean {
  const secret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!secret) return false;

  const hmac = query.hmac;
  if (!hmac) return false;

  const params = { ...query };
  delete params.hmac;

  const sortedKeys = Object.keys(params).sort();
  const message = sortedKeys.map(k => `${k}=${params[k]}`).join('&');

  const computed = crypto.createHmac('sha256', secret).update(message).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(hmac, 'hex'));
}

function normalizeShopDomain(shop: string): string {
  let s = shop.trim().toLowerCase();
  if (!s.includes('.')) s = `${s}.myshopify.com`;
  return s;
}

function isValidShopDomain(shop: string): boolean {
  return /^[a-z0-9][a-z0-9\-]*\.myshopify\.com$/i.test(shop);
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

  const hmac = req.query.hmac as string;
  if (hmac) {
    if (!verifyShopifyHmac(req.query as Record<string, any>)) {
      return res.status(401).json({ error: 'Invalid HMAC signature' });
    }
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

  app.get('/shopify-app', (req: Request, res: Response) => {
    const shop = (req.query.shop as string || '').trim().toLowerCase();
    const host = req.query.host as string || '';

    if (shop && !isValidShopDomain(normalizeShopDomain(shop))) {
      return res.status(400).send('Invalid shop domain');
    }

    const safeShop = normalizeShopDomain(shop || 'unknown');
    const appHtmlPath = path.join(import.meta.dirname, '..', 'shopify-app', 'index.html');

    try {
      let html = fs.readFileSync(appHtmlPath, 'utf-8');
      html = html.replace('{{SHOP}}', safeShop.replace(/[^a-z0-9.\-]/g, ''));
      html = html.replace('{{HOST}}', host.replace(/[^a-zA-Z0-9=]/g, ''));
      html = html.replace('{{SHOPIFY_CLIENT_ID}}', process.env.SHOPIFY_CLIENT_ID || '');
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Security-Policy', `frame-ancestors https://${safeShop.replace(/[^a-z0-9.\-]/g, '')} https://admin.shopify.com;`);
      return res.send(html);
    } catch {
      return res.status(500).send('App not available');
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
