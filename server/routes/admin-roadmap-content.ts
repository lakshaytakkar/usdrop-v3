import { type Express, Router, Request, Response } from 'express';
import { requireAdmin, requireAuth } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';

export function registerAdminRoadmapContentRoutes(app: Express) {
  const adminRouter = Router();
  adminRouter.use(requireAdmin);

  adminRouter.get('/', async (req: Request, res: Response) => {
    try {
      const { data: stages, error: stagesErr } = await supabaseRemote
        .from('roadmap_stages')
        .select('*')
        .order('order_index', { ascending: true });

      if (stagesErr) throw stagesErr;

      const { data: tasks, error: tasksErr } = await supabaseRemote
        .from('roadmap_tasks')
        .select('*')
        .order('order_index', { ascending: true });

      if (tasksErr) throw tasksErr;

      const stagesWithTasks = (stages || []).map((stage: any) => ({
        ...stage,
        tasks: (tasks || []).filter((t: any) => t.stage_id === stage.id),
      }));

      res.json(stagesWithTasks);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  adminRouter.post('/stages', async (req: Request, res: Response) => {
    try {
      const { number, title, phase, order_index, is_published } = req.body;
      if (!title || !phase) return res.status(400).json({ error: 'title and phase are required' });

      const { data, error } = await supabaseRemote
        .from('roadmap_stages')
        .insert({ number: number || 0, title, phase, order_index: order_index ?? 0, is_published: is_published ?? true })
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  adminRouter.put('/stages/reorder', async (req: Request, res: Response) => {
    try {
      const { stages } = req.body;
      if (!Array.isArray(stages)) return res.status(400).json({ error: 'stages array required' });

      for (const s of stages) {
        await supabaseRemote
          .from('roadmap_stages')
          .update({ order_index: s.order_index, updated_at: new Date().toISOString() })
          .eq('id', s.id);
      }

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  adminRouter.put('/stages/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { number, title, phase, order_index, is_published } = req.body;

      const updates: any = { updated_at: new Date().toISOString() };
      if (number !== undefined) updates.number = number;
      if (title !== undefined) updates.title = title;
      if (phase !== undefined) updates.phase = phase;
      if (order_index !== undefined) updates.order_index = order_index;
      if (is_published !== undefined) updates.is_published = is_published;

      const { data, error } = await supabaseRemote
        .from('roadmap_stages')
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

  adminRouter.delete('/stages/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { error } = await supabaseRemote
        .from('roadmap_stages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  adminRouter.post('/tasks', async (req: Request, res: Response) => {
    try {
      const { id, stage_id, task_no, title, link, order_index, is_published } = req.body;
      if (!id || !stage_id || !title) return res.status(400).json({ error: 'id, stage_id, and title are required' });

      const { data, error } = await supabaseRemote
        .from('roadmap_tasks')
        .insert({ id, stage_id, task_no: task_no || 0, title, link: link || null, order_index: order_index ?? 0, is_published: is_published ?? true })
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  adminRouter.put('/tasks/reorder', async (req: Request, res: Response) => {
    try {
      const { tasks } = req.body;
      if (!Array.isArray(tasks)) return res.status(400).json({ error: 'tasks array required' });

      for (const t of tasks) {
        await supabaseRemote
          .from('roadmap_tasks')
          .update({ order_index: t.order_index, updated_at: new Date().toISOString() })
          .eq('id', t.id);
      }

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  adminRouter.put('/tasks/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { stage_id, task_no, title, link, order_index, is_published } = req.body;

      const updates: any = { updated_at: new Date().toISOString() };
      if (stage_id !== undefined) updates.stage_id = stage_id;
      if (task_no !== undefined) updates.task_no = task_no;
      if (title !== undefined) updates.title = title;
      if (link !== undefined) updates.link = link;
      if (order_index !== undefined) updates.order_index = order_index;
      if (is_published !== undefined) updates.is_published = is_published;

      const { data, error } = await supabaseRemote
        .from('roadmap_tasks')
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

  adminRouter.delete('/tasks/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { error } = await supabaseRemote
        .from('roadmap_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.use('/api/admin/roadmap-content', adminRouter);

  const publicRouter = Router();
  publicRouter.use(requireAuth);

  publicRouter.get('/', async (req: Request, res: Response) => {
    try {
      const { data: stages, error: stagesErr } = await supabaseRemote
        .from('roadmap_stages')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (stagesErr) throw stagesErr;

      const { data: tasks, error: tasksErr } = await supabaseRemote
        .from('roadmap_tasks')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (tasksErr) throw tasksErr;

      const stagesWithTasks = (stages || []).map((stage: any) => ({
        id: `stage-${stage.number}`,
        number: stage.number,
        title: stage.title,
        phase: stage.phase,
        tasks: (tasks || [])
          .filter((t: any) => t.stage_id === stage.id)
          .map((t: any) => ({
            id: t.id,
            taskNo: t.task_no,
            title: t.title,
            link: t.link || undefined,
          })),
      }));

      res.json(stagesWithTasks);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.use('/api/roadmap-content', publicRouter);
}
