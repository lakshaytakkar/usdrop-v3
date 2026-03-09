import { Express, Request, Response } from 'express';
import { requireAuth } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';
import {
  generateOAuthState,
  buildShopifyOAuthUrl,
  exchangeCodeForToken,
  fetchShopifyStoreInfo,
  fetchShopifyProducts,
  fetchShopifyOrders,
  createShopifyProduct,
  mapShopifyPlan,
  normalizeShopDomain,
  getOAuthRedirectUri,
  verifyShopifyHmac,
} from '../lib/shopify-oauth';

const oauthStates = new Map<string, { userId: string; shop: string; createdAt: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of oauthStates) {
    if (now - val.createdAt > 10 * 60 * 1000) {
      oauthStates.delete(key);
    }
  }
}, 60 * 1000);

function mapStoreFromDB(row: any) {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.store_name || row.shop_domain || '',
    url: row.shop_domain || '',
    shop_domain: row.shop_domain || '',
    logo: null,
    status: row.is_active ? 'connected' : 'disconnected',
    connected_at: row.created_at || new Date().toISOString(),
    last_synced_at: row.last_synced_at || null,
    sync_status: row.last_synced_at ? 'success' : 'never',
    api_key: '',
    access_token: row.access_token ? '••••••••' : '',
    products_count: row.products_count || 0,
    orders_count: row.orders_count || 0,
    monthly_revenue: null,
    monthly_traffic: null,
    niche: null,
    country: null,
    currency: row.currency || 'USD',
    plan: row.plan || 'basic',
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function registerShopifyRoutes(app: Express) {

  app.post('/api/shopify-stores', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { shop } = req.body;

      if (!shop) {
        return res.status(400).json({ error: 'Shop parameter is required' });
      }

      const state = generateOAuthState();

      oauthStates.set(state, {
        userId: user.id,
        shop: shop,
        createdAt: Date.now(),
      });

      const oauthUrl = buildShopifyOAuthUrl(shop, state);

      return res.json({ oauth_url: oauthUrl, state });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  app.get('/api/shopify-stores/oauth/callback', async (req: Request, res: Response) => {
    try {
      const { code, state, shop, error: oauthError, hmac } = req.query;
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      if (oauthError) {
        return res.redirect(`${baseUrl}/framework/my-store?error=${encodeURIComponent(String(oauthError))}`);
      }

      if (!code || !shop) {
        return res.redirect(`${baseUrl}/framework/my-store?error=missing_parameters`);
      }

      if (hmac) {
        const queryObj: Record<string, string> = {};
        for (const [k, v] of Object.entries(req.query)) {
          queryObj[k] = String(v);
        }
        if (!verifyShopifyHmac(queryObj)) {
          return res.redirect(`${baseUrl}/framework/my-store?error=hmac_verification_failed`);
        }
      }

      const stateStr = String(state || '');
      const storedState = oauthStates.get(stateStr);

      if (!storedState) {
        return res.redirect(`${baseUrl}/framework/my-store?error=invalid_state`);
      }

      const shopStr = String(shop);
      const normalizedCallbackShop = normalizeShopDomain(shopStr);
      const normalizedStoredShop = normalizeShopDomain(storedState.shop);
      if (normalizedCallbackShop !== normalizedStoredShop) {
        oauthStates.delete(stateStr);
        return res.redirect(`${baseUrl}/framework/my-store?error=shop_mismatch`);
      }

      const userId = storedState.userId;
      oauthStates.delete(stateStr);

      const { access_token } = await exchangeCodeForToken(shopStr, String(code));
      const storeInfo = await fetchShopifyStoreInfo(access_token, shopStr);
      const normalizedDomain = normalizeShopDomain(storeInfo.myshopify_domain);
      const plan = mapShopifyPlan(storeInfo.plan_name);
      const now = new Date().toISOString();

      const { data: existingStore } = await supabaseRemote
        .from('shopify_stores')
        .select('id')
        .eq('user_id', userId)
        .eq('shop_domain', normalizedDomain)
        .single();

      if (existingStore) {
        const { error: updateError } = await supabaseRemote
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

        if (updateError) {
          return res.redirect(`${baseUrl}/framework/my-store?error=update_failed`);
        }

        await advanceAwaitingClaim(userId, normalizedDomain, storeInfo.name);
        return res.redirect(`${baseUrl}/framework/my-store?success=store_updated`);
      } else {
        const { error: createError } = await supabaseRemote
          .from('shopify_stores')
          .insert({
            user_id: userId,
            shop_domain: normalizedDomain,
            store_name: storeInfo.name,
            store_email: storeInfo.email,
            access_token: access_token,
            is_active: true,
            currency: storeInfo.currency,
            plan: plan,
            created_at: now,
            updated_at: now,
          });

        if (createError) {
          if (createError.code === '23505') {
            return res.redirect(`${baseUrl}/framework/my-store?error=store_already_exists`);
          }
          return res.redirect(`${baseUrl}/framework/my-store?error=create_failed`);
        }

        await advanceAwaitingClaim(userId, normalizedDomain, storeInfo.name);
        return res.redirect(`${baseUrl}/framework/my-store?success=store_connected`);
      }
    } catch (error: any) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      return res.redirect(`${baseUrl}/framework/my-store?error=${encodeURIComponent(error.message || 'oauth_failed')}`);
    }
  });

  app.get('/api/shopify-stores', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;

      const { data, error, count } = await supabaseRemote
        .from('shopify_stores')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch stores' });
      }

      const stores = (data || []).map(mapStoreFromDB);

      const storeIds = (data || []).map((s: any) => s.id);
      if (storeIds.length > 0) {
        const { data: productCounts } = await supabaseRemote
          .from('shopify_store_products')
          .select('store_id')
          .in('store_id', storeIds);

        const { data: orderCounts } = await supabaseRemote
          .from('shopify_store_orders')
          .select('store_id')
          .in('store_id', storeIds);

        const pCountMap: Record<string, number> = {};
        const oCountMap: Record<string, number> = {};

        (productCounts || []).forEach((p: any) => {
          pCountMap[p.store_id] = (pCountMap[p.store_id] || 0) + 1;
        });
        (orderCounts || []).forEach((o: any) => {
          oCountMap[o.store_id] = (oCountMap[o.store_id] || 0) + 1;
        });

        stores.forEach((s: any) => {
          s.products_count = pCountMap[s.id] || 0;
          s.orders_count = oCountMap[s.id] || 0;
        });
      }

      return res.json({ stores, total: count || 0 });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/shopify-stores/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const storeId = req.params.id;

      const { data, error } = await supabaseRemote
        .from('shopify_stores')
        .select('*')
        .eq('id', storeId)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Store not found' });
      }

      const store = mapStoreFromDB(data);

      const { count: productsCount } = await supabaseRemote
        .from('shopify_store_products')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId);

      const { count: ordersCount } = await supabaseRemote
        .from('shopify_store_orders')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId);

      store.products_count = productsCount || 0;
      store.orders_count = ordersCount || 0;

      return res.json(store);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/shopify-stores/:id/products', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const storeId = req.params.id;

      const { data: store } = await supabaseRemote
        .from('shopify_stores')
        .select('id')
        .eq('id', storeId)
        .eq('user_id', user.id)
        .single();

      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }

      const { data: products, error } = await supabaseRemote
        .from('shopify_store_products')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch products' });
      }

      return res.json({ products: products || [] });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/shopify-stores/:id/orders', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const storeId = req.params.id;

      const { data: store } = await supabaseRemote
        .from('shopify_stores')
        .select('id')
        .eq('id', storeId)
        .eq('user_id', user.id)
        .single();

      if (!store) {
        return res.status(404).json({ error: 'Store not found' });
      }

      const { data: orders, error } = await supabaseRemote
        .from('shopify_store_orders')
        .select('*')
        .eq('store_id', storeId)
        .order('shopify_created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch orders' });
      }

      return res.json({ orders: orders || [] });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.patch('/api/shopify-stores/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const storeId = req.params.id;

      const { data: existing } = await supabaseRemote
        .from('shopify_stores')
        .select('id')
        .eq('id', storeId)
        .eq('user_id', user.id)
        .single();

      if (!existing) {
        return res.status(404).json({ error: 'Store not found' });
      }

      const updateFields: Record<string, any> = { updated_at: new Date().toISOString() };
      const body = req.body;

      if (body.name !== undefined) updateFields.store_name = body.name;
      if (body.status !== undefined) updateFields.is_active = body.status === 'connected';
      if (body.plan !== undefined) updateFields.plan = body.plan;

      const { data: result, error } = await supabaseRemote
        .from('shopify_stores')
        .update(updateFields)
        .eq('id', storeId)
        .eq('user_id', user.id)
        .select('*')
        .single();

      if (error || !result) {
        return res.status(500).json({ error: 'Failed to update store' });
      }

      return res.json(mapStoreFromDB(result));
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/shopify-stores/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const storeId = req.params.id;

      const { data: existing } = await supabaseRemote
        .from('shopify_stores')
        .select('id')
        .eq('id', storeId)
        .eq('user_id', user.id)
        .single();

      if (!existing) {
        return res.status(404).json({ error: 'Store not found' });
      }

      await supabaseRemote
        .from('shopify_store_products')
        .delete()
        .eq('store_id', storeId);

      await supabaseRemote
        .from('shopify_store_orders')
        .delete()
        .eq('store_id', storeId);

      await supabaseRemote
        .from('shopify_stores')
        .delete()
        .eq('id', storeId)
        .eq('user_id', user.id);

      return res.json({ success: true, message: 'Store disconnected successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/shopify-stores/:storeId/products/push', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { storeId } = req.params;
      const { product_id } = req.body;

      if (!product_id) {
        return res.status(400).json({ error: 'product_id is required' });
      }

      const { data: store, error: storeError } = await supabaseRemote
        .from('shopify_stores')
        .select('*')
        .eq('id', storeId)
        .eq('user_id', user.id)
        .single();

      if (storeError || !store) {
        return res.status(404).json({ error: 'Store not found' });
      }

      if (!store.is_active) {
        return res.status(400).json({ error: 'Store is disconnected. Please reconnect it first.' });
      }

      if (!store.access_token) {
        return res.status(400).json({ error: 'Store access token is missing. Please reconnect the store.' });
      }

      const { data: product, error: productError } = await supabaseRemote
        .from('products')
        .select('*, categories(id, name, slug)')
        .eq('id', product_id)
        .single();

      if (productError || !product) {
        return res.status(404).json({ error: 'Product not found in USDrop catalog' });
      }

      const shopifyProductData = {
        title: product.title || null,
        description: product.description || null,
        vendor: product.brand || null,
        product_type: product.categories?.name || product.categories?.slug || null,
        tags: product.tags || [],
        image_url: product.image || null,
        price: product.sell_price ?? product.price ?? null,
        compare_at_price: product.compare_at_price ?? null,
      };

      const createdProduct = await createShopifyProduct(
        store.access_token,
        store.shop_domain,
        shopifyProductData
      );

      return res.json({
        success: true,
        message: `Product "${createdProduct.title}" added to Shopify as draft`,
        shopify_product: {
          id: createdProduct.id,
          title: createdProduct.title,
          status: createdProduct.status,
          admin_url: `https://admin.shopify.com/store/${store.shop_domain.replace('.myshopify.com', '')}/products/${createdProduct.id}`,
        },
      });
    } catch (error: any) {
      console.error('Error pushing product to Shopify:', error);
      return res.status(500).json({ error: error.message || 'Failed to push product to Shopify' });
    }
  });

  app.post('/api/shopify-stores/:id/sync', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const storeId = req.params.id;

      const { data: store, error: storeError } = await supabaseRemote
        .from('shopify_stores')
        .select('*')
        .eq('id', storeId)
        .eq('user_id', user.id)
        .single();

      if (storeError || !store) {
        return res.status(404).json({ error: 'Store not found' });
      }

      if (!store.is_active) {
        return res.status(400).json({ error: 'Store must be connected to sync' });
      }

      if (!store.access_token) {
        return res.status(400).json({ error: 'Store access token is missing. Please reconnect the store.' });
      }

      const shopDomain = store.shop_domain;

      let shopifyProducts: any[] = [];
      let shopifyOrders: any[] = [];
      let productsFetchError: string | null = null;
      let ordersFetchError: string | null = null;

      try {
        shopifyProducts = await fetchShopifyProducts(store.access_token, shopDomain);
      } catch (err: any) {
        productsFetchError = err.message || 'Failed to fetch products';
        console.error('Shopify products fetch error:', productsFetchError);
      }

      try {
        shopifyOrders = await fetchShopifyOrders(store.access_token, shopDomain);
      } catch (err: any) {
        ordersFetchError = err.message || 'Failed to fetch orders';
        console.error('Shopify orders fetch error:', ordersFetchError);
      }

      if (productsFetchError && ordersFetchError) {
        return res.status(500).json({
          error: `Sync failed: ${productsFetchError}; ${ordersFetchError}. Try disconnecting and reconnecting the store to grant updated permissions.`,
        });
      }

      let productsUpserted = 0;
      for (const product of shopifyProducts) {
        const firstVariant = product.variants?.[0];
        const productData = {
          store_id: storeId,
          shopify_product_id: String(product.id),
          title: product.title || '',
          body_html: product.body_html || null,
          vendor: product.vendor || null,
          product_type: product.product_type || null,
          status: product.status || 'active',
          tags: product.tags ? product.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
          image_url: product.image?.src || null,
          images: product.images || [],
          variants: product.variants || [],
          price: firstVariant?.price ? parseFloat(firstVariant.price) : null,
          compare_at_price: firstVariant?.compare_at_price ? parseFloat(firstVariant.compare_at_price) : null,
          inventory_quantity: product.variants?.reduce((sum: number, v: any) => sum + (v.inventory_quantity || 0), 0) || 0,
          shopify_created_at: product.created_at || null,
          shopify_updated_at: product.updated_at || null,
          updated_at: new Date().toISOString(),
        };

        const { error: upsertError } = await supabaseRemote
          .from('shopify_store_products')
          .upsert(productData, { onConflict: 'store_id,shopify_product_id' });

        if (!upsertError) productsUpserted++;
      }

      let ordersUpserted = 0;
      for (const order of shopifyOrders) {
        const orderData = {
          store_id: storeId,
          shopify_order_id: String(order.id),
          order_number: order.name || String(order.order_number || ''),
          email: order.email || null,
          financial_status: order.financial_status || null,
          fulfillment_status: order.fulfillment_status || null,
          total_price: order.total_price ? parseFloat(order.total_price) : null,
          subtotal_price: order.subtotal_price ? parseFloat(order.subtotal_price) : null,
          total_tax: order.total_tax ? parseFloat(order.total_tax) : null,
          currency: order.currency || 'USD',
          line_items: order.line_items || [],
          customer: order.customer || null,
          shipping_address: order.shipping_address || null,
          shopify_created_at: order.created_at || null,
          updated_at: new Date().toISOString(),
        };

        const { error: upsertError } = await supabaseRemote
          .from('shopify_store_orders')
          .upsert(orderData, { onConflict: 'store_id,shopify_order_id' });

        if (!upsertError) ordersUpserted++;
      }

      const now = new Date().toISOString();
      await supabaseRemote
        .from('shopify_stores')
        .update({
          last_synced_at: now,
          updated_at: now,
        })
        .eq('id', storeId);

      const warnings: string[] = [];
      if (productsFetchError) warnings.push(`Products: ${productsFetchError}`);
      if (ordersFetchError) warnings.push(`Orders: ${ordersFetchError}`);

      return res.json({
        success: true,
        message: warnings.length > 0
          ? `Partial sync completed. ${warnings.join('; ')}. Try reconnecting the store for full access.`
          : 'Store synced successfully',
        products_synced: productsUpserted,
        orders_synced: ordersUpserted,
        warnings,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Sync failed' });
    }
  });

  app.post('/api/shopify-stores/webhooks/customer-deletion', (_req: Request, res: Response) => {
    res.status(200).json({ received: true });
  });

  app.post('/api/shopify-stores/webhooks/customer-data-request', (_req: Request, res: Response) => {
    res.status(200).json({ received: true });
  });

  app.post('/api/shopify-stores/webhooks/shop-deletion', (_req: Request, res: Response) => {
    res.status(200).json({ received: true });
  });
}

async function advanceAwaitingClaim(userId: string, shopDomain: string, storeName: string) {
  try {
    const { data: claim } = await supabaseRemote
      .from('store_claims')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'awaiting_connection')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!claim) return;

    const slug = shopDomain.replace('.myshopify.com', '');

    await supabaseRemote
      .from('store_claims')
      .update({
        status: 'claimed',
        claimed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        shopify_store_url: `https://${shopDomain}`,
        shopify_admin_url: `https://admin.shopify.com/store/${slug}`,
        notes: `Store "${storeName}" connected successfully via Shopify OAuth.`,
      })
      .eq('id', claim.id);

    console.log(`[store-claims] Claim ${claim.id} advanced to claimed after OAuth connect`);
  } catch (err) {
    console.error('[store-claims] Error advancing claim after OAuth:', err);
  }
}
