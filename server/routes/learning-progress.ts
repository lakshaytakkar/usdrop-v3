import { Router, type Express, type Request, type Response } from 'express';
import { requireAuth, requireAdmin } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';

let tableEnsured = false;

async function ensureTable() {
  if (tableEnsured) return;
  try {
    const { error } = await supabaseRemote.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_lesson_progress (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          lesson_id TEXT NOT NULL,
          completed_at TIMESTAMPTZ DEFAULT now(),
          source TEXT DEFAULT 'free-learning',
          UNIQUE(user_id, lesson_id)
        );
        CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
      `
    });
    if (error) {
      const { error: checkError } = await supabaseRemote
        .from('user_lesson_progress')
        .select('id')
        .limit(0);
      if (checkError && checkError.message?.includes('does not exist')) {
        console.warn('user_lesson_progress table does not exist and could not be created via RPC. Table may need manual creation.');
        return;
      }
    }
    tableEnsured = true;
  } catch (err) {
    const { error: checkError } = await supabaseRemote
      .from('user_lesson_progress')
      .select('id')
      .limit(0);
    if (!checkError) {
      tableEnsured = true;
    }
  }
}

export function registerLearningProgressRoutes(app: Express) {
  const router = Router();

  router.post('/progress', requireAuth, async (req: Request, res: Response) => {
    try {
      await ensureTable();
      const user = req.user!;
      const { lesson_id } = req.body;

      if (!lesson_id || typeof lesson_id !== 'string') {
        return res.status(400).json({ error: 'lesson_id is required' });
      }

      const { data: existing } = await supabaseRemote
        .from('user_lesson_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lesson_id)
        .maybeSingle();

      if (existing) {
        return res.json({ success: true, already_completed: true });
      }

      const { error } = await supabaseRemote
        .from('user_lesson_progress')
        .insert({
          user_id: user.id,
          lesson_id,
          source: 'free-learning',
        });

      if (error) {
        if (error.code === '23505') {
          return res.json({ success: true, already_completed: true });
        }
        if (error.message?.includes('does not exist')) {
          return res.json({ success: true, table_missing: true });
        }
        console.error('Error inserting lesson progress:', error);
        return res.status(500).json({ error: 'Failed to save progress' });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error('Error in POST /api/learning/progress:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/progress', requireAuth, async (req: Request, res: Response) => {
    try {
      await ensureTable();
      const user = req.user!;

      const { data, error } = await supabaseRemote
        .from('user_lesson_progress')
        .select('lesson_id, completed_at, source')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: true });

      if (error) {
        if (error.message?.includes('does not exist')) {
          return res.json({ lessons: [] });
        }
        console.error('Error fetching lesson progress:', error);
        return res.status(500).json({ error: 'Failed to fetch progress' });
      }

      return res.json({ lessons: data || [] });
    } catch (error) {
      console.error('Error in GET /api/learning/progress:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/api/learning', router);

  const adminRouter = Router();
  adminRouter.use(requireAdmin);

  adminRouter.get('/external-users/:id/learning-progress', async (req: Request, res: Response) => {
    try {
      await ensureTable();
      const { id } = req.params;

      const { data, error } = await supabaseRemote
        .from('user_lesson_progress')
        .select('lesson_id, completed_at, source')
        .eq('user_id', id)
        .order('completed_at', { ascending: true });

      if (error) {
        if (error.message?.includes('does not exist')) {
          return res.json({ lessons: [] });
        }
        console.error('Error fetching user lesson progress:', error);
        return res.status(500).json({ error: 'Failed to fetch progress' });
      }

      return res.json({ lessons: data || [] });
    } catch (error) {
      console.error('Error in GET /api/admin/external-users/:id/learning-progress:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/api/admin', adminRouter);
}
