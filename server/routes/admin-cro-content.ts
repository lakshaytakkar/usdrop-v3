import { type Express, Router, Request, Response } from 'express';
import { requireAdmin, requireAuth } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';

export function registerAdminCROContentRoutes(app: Express) {
  const adminRouter = Router();
  adminRouter.use(requireAdmin);

  adminRouter.get('/', async (req: Request, res: Response) => {
    try {
      const { data: categories, error: catErr } = await supabaseRemote
        .from('cro_categories')
        .select('*')
        .order('order_index', { ascending: true });

      if (catErr) throw catErr;

      const { data: items, error: itemErr } = await supabaseRemote
        .from('cro_items')
        .select('*')
        .order('order_index', { ascending: true });

      if (itemErr) throw itemErr;

      const categoriesWithItems = (categories || []).map((cat: any) => ({
        ...cat,
        items: (items || []).filter((i: any) => i.category_id === cat.id),
      }));

      res.json(categoriesWithItems);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  adminRouter.post('/categories', async (req: Request, res: Response) => {
    try {
      const { id, title, icon, color_config, order_index, is_published } = req.body;
      if (!id || !title) return res.status(400).json({ error: 'id and title are required' });

      const { data, error } = await supabaseRemote
        .from('cro_categories')
        .insert({ id, title, icon: icon || null, color_config: color_config || {}, order_index: order_index ?? 0, is_published: is_published ?? true })
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  adminRouter.put('/categories/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, icon, color_config, order_index, is_published } = req.body;

      const updates: any = { updated_at: new Date().toISOString() };
      if (title !== undefined) updates.title = title;
      if (icon !== undefined) updates.icon = icon;
      if (color_config !== undefined) updates.color_config = color_config;
      if (order_index !== undefined) updates.order_index = order_index;
      if (is_published !== undefined) updates.is_published = is_published;

      const { data, error } = await supabaseRemote
        .from('cro_categories')
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

  adminRouter.delete('/categories/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { error } = await supabaseRemote
        .from('cro_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  adminRouter.post('/items', async (req: Request, res: Response) => {
    try {
      const { id, category_id, label, description, priority, order_index, is_published } = req.body;
      if (!id || !category_id || !label) return res.status(400).json({ error: 'id, category_id, and label are required' });

      const { data, error } = await supabaseRemote
        .from('cro_items')
        .insert({ id, category_id, label, description: description || '', priority: priority || 'medium', order_index: order_index ?? 0, is_published: is_published ?? true })
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  adminRouter.put('/items/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { category_id, label, description, priority, order_index, is_published } = req.body;

      const updates: any = { updated_at: new Date().toISOString() };
      if (category_id !== undefined) updates.category_id = category_id;
      if (label !== undefined) updates.label = label;
      if (description !== undefined) updates.description = description;
      if (priority !== undefined) updates.priority = priority;
      if (order_index !== undefined) updates.order_index = order_index;
      if (is_published !== undefined) updates.is_published = is_published;

      const { data, error } = await supabaseRemote
        .from('cro_items')
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

  adminRouter.delete('/items/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { error } = await supabaseRemote
        .from('cro_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.use('/api/admin/cro-content', adminRouter);

  const publicRouter = Router();
  publicRouter.use(requireAuth);

  publicRouter.get('/', async (req: Request, res: Response) => {
    try {
      const { data: categories, error: catErr } = await supabaseRemote
        .from('cro_categories')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (catErr) throw catErr;

      const { data: items, error: itemErr } = await supabaseRemote
        .from('cro_items')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (itemErr) throw itemErr;

      const categoriesWithItems = (categories || []).map((cat: any) => ({
        id: cat.id,
        title: cat.title,
        icon: cat.icon,
        color: cat.color_config,
        items: (items || [])
          .filter((i: any) => i.category_id === cat.id)
          .map((i: any) => ({
            id: i.id,
            label: i.label,
            description: i.description,
            priority: i.priority,
          })),
      }));

      res.json(categoriesWithItems);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.use('/api/cro-content', publicRouter);
}
