import { Express, Request, Response } from 'express';
import { requireAuth } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';

export function registerStoreClaimRoutes(app: Express) {

  app.get('/api/store-claims', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { data, error } = await supabaseRemote
        .from('store_claims')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json({ claims: data || [] });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/store-claims/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { id } = req.params;

      const { data, error } = await supabaseRemote
        .from('store_claims')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Claim not found' });
      }

      return res.json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/store-claims', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { store_name, niche } = req.body;

      if (!store_name || typeof store_name !== 'string' || store_name.trim().length < 2) {
        return res.status(400).json({ error: 'Store name must be at least 2 characters' });
      }

      if (store_name.trim().length > 60) {
        return res.status(400).json({ error: 'Store name must be 60 characters or less' });
      }

      const storeName = store_name.trim();
      const storeNiche = niche?.trim() || 'electronics';

      const { data: existing } = await supabaseRemote
        .from('store_claims')
        .select('id, status')
        .eq('user_id', user.id)
        .in('status', ['pending', 'processing', 'ready', 'awaiting_connection'])
        .limit(1);

      if (existing && existing.length > 0) {
        return res.status(409).json({
          error: existing[0].status === 'ready'
            ? 'You have a store ready to claim'
            : 'You already have a store claim in progress',
          existing_claim_id: existing[0].id,
        });
      }

      const { data, error } = await supabaseRemote
        .from('store_claims')
        .insert({
          user_id: user.id,
          store_name: storeName,
          niche: storeNiche,
          status: 'awaiting_connection',
          products_count: 0,
          template_applied: false,
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/store-claims/:id/retry', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { id } = req.params;

      const { data: claim, error: fetchError } = await supabaseRemote
        .from('store_claims')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !claim) {
        return res.status(404).json({ error: 'Claim not found' });
      }

      if (claim.status !== 'failed') {
        return res.status(400).json({ error: 'Only failed claims can be retried' });
      }

      await supabaseRemote
        .from('store_claims')
        .update({
          status: 'awaiting_connection',
          notes: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      return res.json({ success: true, message: 'Claim reset. Please sign up on Shopify and connect your store.' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/store-claims/:id/claim', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { id } = req.params;

      const { data: claim, error: fetchError } = await supabaseRemote
        .from('store_claims')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !claim) {
        return res.status(404).json({ error: 'Claim not found' });
      }

      if (claim.status !== 'ready') {
        return res.status(400).json({ error: 'Store is not ready to be claimed yet' });
      }

      const { data, error } = await supabaseRemote
        .from('store_claims')
        .update({
          status: 'claimed',
          claimed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/store-claims/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { id } = req.params;

      const { data: claim } = await supabaseRemote
        .from('store_claims')
        .select('status')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (!claim) {
        return res.status(404).json({ error: 'Claim not found' });
      }

      if (claim.status === 'claimed') {
        return res.status(400).json({ error: 'Cannot cancel a claimed store' });
      }

      const { error } = await supabaseRemote
        .from('store_claims')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });
}

