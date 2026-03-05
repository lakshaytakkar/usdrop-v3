import { type Express, Router, Request, Response } from 'express';
import { requireAdmin, requireAuth } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';

export function registerAccessControlRoutes(app: Express) {
  const adminRouter = Router();
  adminRouter.use(requireAdmin);

  adminRouter.get('/access-rules', async (req: Request, res: Response) => {
    try {
      const planFilter = req.query.plan_slug as string;

      let query = supabaseRemote
        .from('access_rules')
        .select('*')
        .order('plan_slug')
        .order('resource_type')
        .order('resource_key');

      if (planFilter) {
        query = query.eq('plan_slug', planFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Fetch access rules error:', error);
        return res.status(500).json({ error: 'Failed to fetch access rules' });
      }

      res.json(data || []);
    } catch (err) {
      console.error('Access rules error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.post('/access-rules', async (req: Request, res: Response) => {
    try {
      const { plan_slug, resource_type, resource_key, access_level, teaser_limit } = req.body;

      if (!plan_slug || !resource_type || !resource_key || !access_level) {
        return res.status(400).json({ error: 'plan_slug, resource_type, resource_key, and access_level are required' });
      }

      const validPlans = ['free', 'pro', 'mentorship'];
      if (!validPlans.includes(plan_slug)) {
        return res.status(400).json({ error: `Invalid plan_slug. Must be one of: ${validPlans.join(', ')}` });
      }

      const validTypes = ['page', 'feature', 'content'];
      if (!validTypes.includes(resource_type)) {
        return res.status(400).json({ error: `Invalid resource_type. Must be one of: ${validTypes.join(', ')}` });
      }

      const validLevels = ['hidden', 'locked', 'teaser', 'full'];
      if (!validLevels.includes(access_level)) {
        return res.status(400).json({ error: `Invalid access_level. Must be one of: ${validLevels.join(', ')}` });
      }

      const { data, error } = await supabaseRemote
        .from('access_rules')
        .upsert({
          plan_slug,
          resource_type,
          resource_key,
          access_level,
          teaser_limit: access_level === 'teaser' ? (teaser_limit || null) : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'plan_slug,resource_key' })
        .select()
        .single();

      if (error) {
        console.error('Upsert access rule error:', error);
        return res.status(500).json({ error: 'Failed to save access rule' });
      }

      res.json(data);
    } catch (err) {
      console.error('Access rule upsert error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.delete('/access-rules/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { error } = await supabaseRemote
        .from('access_rules')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete access rule error:', error);
        return res.status(500).json({ error: 'Failed to delete access rule' });
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Access rule delete error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.get('/users/:userId/content-access', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const { data, error } = await supabaseRemote
        .from('user_content_access')
        .select(`
          *,
          unlocker:profiles!user_content_access_unlocked_by_fkey(id, full_name, email)
        `)
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Fetch user content access error:', error);
        return res.status(500).json({ error: 'Failed to fetch content access' });
      }

      res.json(data || []);
    } catch (err) {
      console.error('User content access error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.post('/users/:userId/content-access', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { content_type, content_id, notes } = req.body;

      if (!content_type || !content_id) {
        return res.status(400).json({ error: 'content_type and content_id are required' });
      }

      const validTypes = ['chapter', 'video', 'session'];
      if (!validTypes.includes(content_type)) {
        return res.status(400).json({ error: `Invalid content_type. Must be one of: ${validTypes.join(', ')}` });
      }

      const { data, error } = await supabaseRemote
        .from('user_content_access')
        .upsert({
          user_id: userId,
          content_type,
          content_id,
          is_unlocked: true,
          unlocked_by: req.user!.id,
          unlocked_at: new Date().toISOString(),
          notes: notes || '',
        }, { onConflict: 'user_id,content_type,content_id' })
        .select()
        .single();

      if (error) {
        console.error('Unlock content error:', error);
        return res.status(500).json({ error: 'Failed to unlock content' });
      }

      res.json(data);
    } catch (err) {
      console.error('Content unlock error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.post('/users/:userId/content-access/bulk', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { items, action } = req.body;

      if (!items || !Array.isArray(items) || !action) {
        return res.status(400).json({ error: 'items (array) and action (unlock/lock) are required' });
      }

      if (action === 'unlock') {
        const rows = items.map((item: { content_type: string; content_id: string }) => ({
          user_id: userId,
          content_type: item.content_type,
          content_id: item.content_id,
          is_unlocked: true,
          unlocked_by: req.user!.id,
          unlocked_at: new Date().toISOString(),
        }));

        const { error } = await supabaseRemote
          .from('user_content_access')
          .upsert(rows, { onConflict: 'user_id,content_type,content_id' });

        if (error) {
          console.error('Bulk unlock error:', error);
          return res.status(500).json({ error: 'Failed to bulk unlock' });
        }
      } else if (action === 'lock') {
        for (const item of items) {
          await supabaseRemote
            .from('user_content_access')
            .update({ is_unlocked: false })
            .eq('user_id', userId)
            .eq('content_type', item.content_type)
            .eq('content_id', item.content_id);
        }
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Bulk content access error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.delete('/users/:userId/content-access/:id', async (req: Request, res: Response) => {
    try {
      const { userId, id } = req.params;

      const { error } = await supabaseRemote
        .from('user_content_access')
        .update({ is_unlocked: false })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('Revoke content access error:', error);
        return res.status(500).json({ error: 'Failed to revoke content access' });
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Content revoke error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/api/admin', adminRouter);

  const userRouter = Router();
  userRouter.use(requireAuth);

  userRouter.get('/check', async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const planSlug = user.account_type === 'pro' ? 'pro' : 'free';

      const [rulesResult, contentResult] = await Promise.all([
        supabaseRemote
          .from('access_rules')
          .select('*')
          .eq('plan_slug', planSlug),
        supabaseRemote
          .from('user_content_access')
          .select('content_type, content_id, is_unlocked')
          .eq('user_id', user.id)
          .eq('is_unlocked', true),
      ]);

      const rules = rulesResult.data || [];
      const unlockedContent = contentResult.data || [];

      const accessMap: Record<string, { level: string; teaserLimit?: number }> = {};
      for (const rule of rules) {
        accessMap[rule.resource_key] = {
          level: rule.access_level,
          teaserLimit: rule.teaser_limit || undefined,
        };
      }

      const unlockedItems = unlockedContent.map((c: any) => ({
        type: c.content_type,
        id: c.content_id,
      }));

      res.json({
        plan: planSlug,
        accessMap,
        unlockedContent: unlockedItems,
      });
    } catch (err) {
      console.error('Access check error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/api/access', userRouter);
}
