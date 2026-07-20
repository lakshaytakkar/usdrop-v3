import { Express, Request, Response } from 'express';
import { requireAuth, AuthUser } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';

/* Phase I — "Build Your Store" (Elite inclusion).
   The user picks a niche + brand basics; we build them a done-for-you Shopify
   store. Requests persist to public.store_build_requests (migration 022). Real
   Shopify-Partner provisioning is deferred — the team advances status + attaches
   the delivered store URL/login via the admin PATCH route. */

const ADMIN_ROLES = ['admin', 'super_admin', 'editor', 'moderator'];

/* Eligible = Elite/Pro tier or admin. Mirrors the lenient server pro check used
   by the fulfillment suite (account_type 'pro'/'elite' or a paid subscription). */
function userIsEligible(user: AuthUser): boolean {
  if (user.internal_role && ADMIN_ROLES.includes(user.internal_role)) return true;
  if (user.account_type === 'pro' || user.account_type === 'elite') return true;
  if (user.subscription_plan_id) return true;
  return false;
}

const VALID_NICHES = [
  'pets', 'electronics', 'fashion', 'home-garden', 'sports-fitness', 'beauty', 'general',
];
const VALID_STATUS = ['requested', 'building', 'ready', 'delivered', 'cancelled'];

export function registerStoreBuilderRoutes(app: Express) {
  // List the signed-in user's store-build requests.
  app.get('/api/store-builder/requests', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { data, error } = await supabaseRemote
        .from('store_build_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching store-build requests:', error);
        return res.status(500).json({ error: 'Failed to fetch requests' });
      }
      return res.json({ requests: data || [] });
    } catch (err) {
      console.error('Unexpected error fetching store-build requests:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/store-builder/requests/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { data, error } = await supabaseRemote
        .from('store_build_requests')
        .select('*')
        .eq('id', req.params.id)
        .eq('user_id', user.id)
        .single();
      if (error || !data) return res.status(404).json({ error: 'Request not found' });
      return res.json({ request: data });
    } catch (err) {
      console.error('Unexpected error fetching store-build request:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Start a store build. Elite-gated.
  app.post('/api/store-builder/requests', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      if (!userIsEligible(user)) {
        return res.status(403).json({ error: 'Build Your Store is an Elite feature. Upgrade to start your build.' });
      }
      const body = req.body || {};
      const niche = VALID_NICHES.includes(body.niche) ? body.niche : null;
      if (!niche) return res.status(400).json({ error: 'Please choose a valid niche.' });

      const insert = {
        user_id: user.id,
        niche,
        store_name: body.store_name ? String(body.store_name).slice(0, 120) : null,
        tagline: body.tagline ? String(body.tagline).slice(0, 200) : null,
        brand_color: body.brand_color ? String(body.brand_color).slice(0, 32) : null,
        products_count: Number.isFinite(body.products_count) ? Math.min(50, Math.max(1, body.products_count)) : 10,
        status: 'requested',
        notes: body.notes ? String(body.notes).slice(0, 2000) : null,
      };

      const { data, error } = await supabaseRemote
        .from('store_build_requests')
        .insert(insert)
        .select('*')
        .single();
      if (error || !data) {
        console.error('Error creating store-build request:', error);
        return res.status(500).json({ error: 'Failed to start your store build' });
      }
      return res.status(201).json({ request: data });
    } catch (err) {
      console.error('Unexpected error creating store-build request:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Admin: advance status + attach the delivered store URL/login.
  app.patch('/api/store-builder/requests/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const isAdmin = user.internal_role != null && ADMIN_ROLES.includes(user.internal_role);
      if (!isAdmin) return res.status(403).json({ error: 'Admin access required' });

      const body = req.body || {};
      const update: Record<string, any> = {};
      if (body.status !== undefined) {
        if (!VALID_STATUS.includes(body.status)) return res.status(400).json({ error: 'Invalid status' });
        update.status = body.status;
      }
      if (body.store_url !== undefined) update.store_url = body.store_url;
      if (body.store_login !== undefined) update.store_login = body.store_login;
      if (body.notes !== undefined) update.notes = body.notes;
      if (Object.keys(update).length === 0) return res.status(400).json({ error: 'No fields to update' });

      const { data, error } = await supabaseRemote
        .from('store_build_requests')
        .update(update)
        .eq('id', req.params.id)
        .select('*')
        .single();
      if (error || !data) return res.status(500).json({ error: 'Failed to update request' });
      return res.json({ request: data });
    } catch (err) {
      console.error('Unexpected error updating store-build request:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}
