import { Express, Request, Response } from 'express';
import { requireAuth, AuthUser } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';

/* Phase H — Fulfillment Suite.
   Merchants ask USDrop's China-warehouse team to fulfill the orders in their
   connected Shopify store. Requests are persisted to public.fulfillment_requests
   (migration 021). Vendor/warehouse ops are representational for now — the team
   advances status manually via the admin PATCH route once a vendor is wired. */

const ADMIN_ROLES = ['admin', 'super_admin', 'editor', 'moderator'];

/* Mirror of the client useUserPlan() pro logic, server-side. Pro = admin role,
   an explicit 'pro' account_type, or any attached paid subscription plan. */
function userIsPro(user: AuthUser): boolean {
  if (user.internal_role && ADMIN_ROLES.includes(user.internal_role)) return true;
  if (user.account_type === 'pro') return true;
  if (user.subscription_plan_id) return true;
  return false;
}

const VALID_STATUS = ['requested', 'quoted', 'processing', 'shipped', 'delivered', 'cancelled'];

export function registerFulfillmentRoutes(app: Express) {
  // List the signed-in user's fulfillment requests (newest first).
  app.get('/api/fulfillment/requests', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { data, error } = await supabaseRemote
        .from('fulfillment_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching fulfillment requests:', error);
        return res.status(500).json({ error: 'Failed to fetch requests' });
      }
      return res.json({ requests: data || [] });
    } catch (err) {
      console.error('Unexpected error fetching fulfillment requests:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Single request (owner-scoped).
  app.get('/api/fulfillment/requests/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { data, error } = await supabaseRemote
        .from('fulfillment_requests')
        .select('*')
        .eq('id', req.params.id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Request not found' });
      }
      return res.json({ request: data });
    } catch (err) {
      console.error('Unexpected error fetching fulfillment request:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create a fulfillment request from a synced order (or manually). Pro-gated.
  app.post('/api/fulfillment/requests', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      if (!userIsPro(user)) {
        return res.status(403).json({ error: 'Fulfillment is a Pro feature. Upgrade to request fulfillment.' });
      }

      const body = req.body || {};
      const items = Array.isArray(body.items) ? body.items : [];
      const quantity = Number.isFinite(body.quantity) && body.quantity > 0
        ? Math.floor(body.quantity)
        : (items.reduce((s: number, it: any) => s + (Number(it?.quantity) || 1), 0) || 1);

      const insert = {
        user_id: user.id,
        store_id: body.store_id ? String(body.store_id) : null,
        shopify_order_id: body.shopify_order_id ? String(body.shopify_order_id) : null,
        order_number: body.order_number ? String(body.order_number) : null,
        items,
        quantity,
        destination_country: body.destination_country ? String(body.destination_country) : 'US',
        status: 'requested',
        notes: body.notes ? String(body.notes).slice(0, 2000) : null,
      };

      const { data, error } = await supabaseRemote
        .from('fulfillment_requests')
        .insert(insert)
        .select('*')
        .single();

      if (error || !data) {
        console.error('Error creating fulfillment request:', error);
        return res.status(500).json({ error: 'Failed to create request' });
      }
      return res.status(201).json({ request: data });
    } catch (err) {
      console.error('Unexpected error creating fulfillment request:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Admin: advance status / attach quote + tracking. Used by the team until a
  // real vendor account drives this automatically.
  app.patch('/api/fulfillment/requests/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const isAdmin = user.internal_role != null && ADMIN_ROLES.includes(user.internal_role);
      if (!isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const body = req.body || {};
      const update: Record<string, any> = {};
      if (body.status !== undefined) {
        if (!VALID_STATUS.includes(body.status)) {
          return res.status(400).json({ error: 'Invalid status' });
        }
        update.status = body.status;
      }
      if (body.quote_amount !== undefined) update.quote_amount = body.quote_amount;
      if (body.carrier !== undefined) update.carrier = body.carrier;
      if (body.tracking_number !== undefined) update.tracking_number = body.tracking_number;
      if (body.notes !== undefined) update.notes = body.notes;

      if (Object.keys(update).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const { data, error } = await supabaseRemote
        .from('fulfillment_requests')
        .update(update)
        .eq('id', req.params.id)
        .select('*')
        .single();

      if (error || !data) {
        return res.status(500).json({ error: 'Failed to update request' });
      }
      return res.json({ request: data });
    } catch (err) {
      console.error('Unexpected error updating fulfillment request:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}
