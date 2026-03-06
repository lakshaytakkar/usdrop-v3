import { type Express, Router, Request, Response } from 'express';
import { requireAdmin } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';
import { insertImportantLinkSchema } from '@shared/schema';

export function registerAdminLinkRoutes(app: Express) {
  const router = Router();
  router.use(requireAdmin);

  router.get('/', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseRemote
        .from('important_links')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const parsed = insertImportantLinkSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors[0]?.message || 'Invalid data' });
      }

      const { data, error } = await supabaseRemote
        .from('important_links')
        .insert(parsed.data)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.patch('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const partial = insertImportantLinkSchema.partial().safeParse(req.body);
      if (!partial.success) {
        return res.status(400).json({ error: partial.error.errors[0]?.message || 'Invalid data' });
      }

      const updates = { ...partial.data, updated_at: new Date().toISOString() };

      const { data, error } = await supabaseRemote
        .from('important_links')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { error } = await supabaseRemote
        .from('important_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.use('/api/admin/important-links', router);
}
