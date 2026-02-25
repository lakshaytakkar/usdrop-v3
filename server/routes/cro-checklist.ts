import { Router, type Express, type Request, type Response } from 'express';
import { supabaseRemote } from '../lib/supabase-remote';
import { requireAuth } from '../lib/auth';

export function registerCROChecklistRoutes(app: Express) {
  const router = Router();

  router.get('/state', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { data, error } = await supabaseRemote
        .from('cro_checklist_state')
        .select('checked_items')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        return res.status(500).json({ error: 'Failed to load checklist state' });
      }

      return res.json({ checked_items: data?.checked_items || {} });
    } catch (err) {
      console.error('CRO checklist GET error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.put('/state', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { checked_items } = req.body;
      if (typeof checked_items !== 'object') {
        return res.status(400).json({ error: 'Invalid checked_items' });
      }

      const { error } = await supabaseRemote
        .from('cro_checklist_state')
        .upsert(
          { user_id: userId, checked_items, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error('CRO checklist upsert error:', error);
        return res.status(500).json({ error: 'Failed to save checklist state' });
      }

      return res.json({ success: true });
    } catch (err) {
      console.error('CRO checklist PUT error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/api/cro-checklist', router);
}
