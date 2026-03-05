import { type Express, Router, Request, Response } from 'express';
import { requireAuth } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';
import { recalculateLeadScore } from './lead-scoring';

export function registerActivityTrackingRoutes(app: Express) {
  const router = Router();
  router.use(requireAuth);

  router.post('/track', async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { activity_type, activity_data } = req.body;

      if (!activity_type) {
        return res.status(400).json({ error: 'activity_type is required' });
      }

      const validTypes = ['page_view', 'lesson_complete', 'login', 'signup', 'feature_click'];
      if (!validTypes.includes(activity_type)) {
        return res.status(400).json({ error: `Invalid activity_type. Must be one of: ${validTypes.join(', ')}` });
      }

      const { error: insertError } = await supabaseRemote
        .from('user_activity_log')
        .insert({
          user_id: userId,
          activity_type,
          activity_data: activity_data || {},
        });

      if (insertError) {
        console.error('Error logging activity:', insertError);
        return res.status(500).json({ error: 'Failed to log activity' });
      }

      try {
        await recalculateLeadScore(userId);
      } catch (scoreErr) {
        console.error('Error recalculating lead score:', scoreErr);
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Activity tracking error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/my-activity', async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
      const offset = parseInt(req.query.offset as string) || 0;

      const { data, error, count } = await supabaseRemote
        .from('user_activity_log')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch activity' });
      }

      res.json({ data: data || [], total: count || 0 });
    } catch (err) {
      console.error('Fetch activity error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/api/activity', router);
}
