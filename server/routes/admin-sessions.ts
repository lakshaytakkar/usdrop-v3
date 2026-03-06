import { type Express, Router, Request, Response } from 'express';
import { requireAdmin, requireAuth } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';

export function registerAdminSessionRoutes(app: Express) {
  const adminRouter = Router();
  adminRouter.use(requireAdmin);

  adminRouter.get('/sessions', async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string;
      const published = req.query.published as string;

      let query = supabaseRemote
        .from('mentorship_sessions')
        .select('*')
        .order('order_index', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }
      if (published === 'true') {
        query = query.eq('is_published', true);
      } else if (published === 'false') {
        query = query.eq('is_published', false);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Fetch sessions error:', error);
        return res.status(500).json({ error: 'Failed to fetch sessions' });
      }

      res.json(data || []);
    } catch (err) {
      console.error('Sessions error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.post('/sessions', async (req: Request, res: Response) => {
    try {
      const { title, description, url, category, duration, session_date, order_index, is_published } = req.body;

      if (!title || !url || !category) {
        return res.status(400).json({ error: 'title, url, and category are required' });
      }

      const { data, error } = await supabaseRemote
        .from('mentorship_sessions')
        .insert({
          title,
          description: description || '',
          url,
          category,
          duration: duration || null,
          session_date: session_date || null,
          order_index: order_index || 0,
          is_published: is_published !== false,
        })
        .select()
        .single();

      if (error) {
        console.error('Create session error:', error);
        return res.status(500).json({ error: 'Failed to create session' });
      }

      res.status(201).json(data);
    } catch (err) {
      console.error('Session create error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.patch('/sessions/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates: Record<string, any> = {};
      const allowedFields = ['title', 'description', 'url', 'category', 'duration', 'session_date', 'order_index', 'is_published'];

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }
      updates.updated_at = new Date().toISOString();

      const { data, error } = await supabaseRemote
        .from('mentorship_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update session error:', error);
        return res.status(500).json({ error: 'Failed to update session' });
      }

      res.json(data);
    } catch (err) {
      console.error('Session update error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.delete('/sessions/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { error } = await supabaseRemote
        .from('mentorship_sessions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete session error:', error);
        return res.status(500).json({ error: 'Failed to delete session' });
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Session delete error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.get('/enrollments', async (req: Request, res: Response) => {
    try {
      const courseId = req.query.course_id as string;
      const status = req.query.status as string;

      let query = supabaseRemote
        .from('course_enrollments')
        .select(`
          *,
          user:profiles!course_enrollments_user_id_fkey(id, full_name, email, avatar_url, account_type),
          course:courses!course_enrollments_course_id_fkey(id, title, slug, category, level, thumbnail)
        `)
        .order('enrolled_at', { ascending: false });

      if (courseId) {
        query = query.eq('course_id', courseId);
      }
      if (status === 'completed') {
        query = query.not('completed_at', 'is', null);
      } else if (status === 'active') {
        query = query.is('completed_at', null);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Fetch enrollments error:', error);
        return res.status(500).json({ error: 'Failed to fetch enrollments' });
      }

      res.json(data || []);
    } catch (err) {
      console.error('Enrollments error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.post('/enrollments', async (req: Request, res: Response) => {
    try {
      const { user_id, course_id, progress_percentage } = req.body;

      if (!user_id || !course_id) {
        return res.status(400).json({ error: 'user_id and course_id are required' });
      }

      const { data, error } = await supabaseRemote
        .from('course_enrollments')
        .upsert({
          user_id,
          course_id,
          progress_percentage: progress_percentage || 0,
          enrolled_at: new Date().toISOString(),
        }, { onConflict: 'course_id,user_id' })
        .select(`
          *,
          user:profiles!course_enrollments_user_id_fkey(id, full_name, email, avatar_url),
          course:courses!course_enrollments_course_id_fkey(id, title, slug, category)
        `)
        .single();

      if (error) {
        console.error('Create enrollment error:', error);
        return res.status(500).json({ error: 'Failed to create enrollment' });
      }

      res.status(201).json(data);
    } catch (err) {
      console.error('Enrollment create error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.patch('/enrollments/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates: Record<string, any> = {};

      if (req.body.progress_percentage !== undefined) {
        updates.progress_percentage = req.body.progress_percentage;
      }
      if (req.body.completed_at !== undefined) {
        updates.completed_at = req.body.completed_at;
      }
      if (req.body.mark_complete) {
        updates.completed_at = new Date().toISOString();
        updates.progress_percentage = 100;
      }
      if (req.body.reset_progress) {
        updates.completed_at = null;
        updates.progress_percentage = 0;
      }

      const { data, error } = await supabaseRemote
        .from('course_enrollments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update enrollment error:', error);
        return res.status(500).json({ error: 'Failed to update enrollment' });
      }

      res.json(data);
    } catch (err) {
      console.error('Enrollment update error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.delete('/enrollments/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { error } = await supabaseRemote
        .from('course_enrollments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete enrollment error:', error);
        return res.status(500).json({ error: 'Failed to delete enrollment' });
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Enrollment delete error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.get('/users/:userId/journey', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const [enrollmentsRes, contentAccessRes, sessionsRes, coursesRes] = await Promise.all([
        supabaseRemote
          .from('course_enrollments')
          .select(`
            *,
            course:courses!course_enrollments_course_id_fkey(id, title, slug, category, level, thumbnail)
          `)
          .eq('user_id', userId),
        supabaseRemote
          .from('user_content_access')
          .select('*')
          .eq('user_id', userId),
        supabaseRemote
          .from('mentorship_sessions')
          .select('*')
          .eq('is_published', true)
          .order('order_index'),
        supabaseRemote
          .from('courses')
          .select('id, title, slug, category, level, thumbnail, published')
          .eq('published', true)
          .order('created_at'),
      ]);

      const enrollments = enrollmentsRes.data || [];
      const contentAccess = contentAccessRes.data || [];
      const allSessions = sessionsRes.data || [];
      const allCourses = coursesRes.data || [];

      const enrolledCourseIds = new Set(enrollments.map((e: any) => e.course_id));
      const unlockedSessions = contentAccess.filter((c: any) => c.content_type === 'session' && c.is_unlocked);
      const unlockedChapters = contentAccess.filter((c: any) => c.content_type === 'chapter' && c.is_unlocked);
      const unlockedSessionIds = new Set(unlockedSessions.map((s: any) => s.content_id));

      const sessionsByCategory: Record<string, { total: number; unlocked: number }> = {};
      for (const s of allSessions) {
        if (!sessionsByCategory[s.category]) {
          sessionsByCategory[s.category] = { total: 0, unlocked: 0 };
        }
        sessionsByCategory[s.category].total++;
        if (unlockedSessionIds.has(s.id)) {
          sessionsByCategory[s.category].unlocked++;
        }
      }

      res.json({
        enrollments,
        contentAccess,
        allSessions,
        allCourses,
        summary: {
          totalCourses: allCourses.length,
          enrolledCourses: enrolledCourseIds.size,
          completedCourses: enrollments.filter((e: any) => e.completed_at).length,
          totalSessions: allSessions.length,
          unlockedSessions: unlockedSessions.length,
          unlockedChapters: unlockedChapters.length,
          sessionsByCategory,
        },
      });
    } catch (err) {
      console.error('User journey error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.post('/users/:userId/unlock-journey', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { action, category, course_id } = req.body;

      if (!action) {
        return res.status(400).json({ error: 'action is required' });
      }

      const adminId = req.user!.id;

      if (action === 'unlock_all_sessions' || action === 'unlock_category') {
        let sessionsQuery = supabaseRemote
          .from('mentorship_sessions')
          .select('id')
          .eq('is_published', true);

        if (action === 'unlock_category' && category) {
          sessionsQuery = sessionsQuery.eq('category', category);
        }

        const { data: sessions } = await sessionsQuery;
        if (sessions && sessions.length > 0) {
          const rows = sessions.map((s: any) => ({
            user_id: userId,
            content_type: 'session',
            content_id: s.id,
            is_unlocked: true,
            unlocked_by: adminId,
            unlocked_at: new Date().toISOString(),
          }));
          await supabaseRemote
            .from('user_content_access')
            .upsert(rows, { onConflict: 'user_id,content_type,content_id' });
        }
      }

      if (action === 'unlock_all_courses' || action === 'unlock_everything') {
        const { data: courses } = await supabaseRemote
          .from('courses')
          .select('id')
          .eq('published', true);

        if (courses && courses.length > 0) {
          const enrollRows = courses.map((c: any) => ({
            user_id: userId,
            course_id: c.id,
            progress_percentage: 0,
            enrolled_at: new Date().toISOString(),
          }));
          await supabaseRemote
            .from('course_enrollments')
            .upsert(enrollRows, { onConflict: 'course_id,user_id' });
        }
      }

      if (action === 'enroll_course' && course_id) {
        await supabaseRemote
          .from('course_enrollments')
          .upsert({
            user_id: userId,
            course_id,
            progress_percentage: 0,
            enrolled_at: new Date().toISOString(),
          }, { onConflict: 'course_id,user_id' });
      }

      if (action === 'unenroll_course' && course_id) {
        await supabaseRemote
          .from('course_enrollments')
          .delete()
          .eq('user_id', userId)
          .eq('course_id', course_id);
      }

      if (action === 'unlock_everything') {
        const { data: sessions } = await supabaseRemote
          .from('mentorship_sessions')
          .select('id')
          .eq('is_published', true);

        if (sessions && sessions.length > 0) {
          const rows = sessions.map((s: any) => ({
            user_id: userId,
            content_type: 'session',
            content_id: s.id,
            is_unlocked: true,
            unlocked_by: adminId,
            unlocked_at: new Date().toISOString(),
          }));
          await supabaseRemote
            .from('user_content_access')
            .upsert(rows, { onConflict: 'user_id,content_type,content_id' });
        }
      }

      if (action === 'lock_everything') {
        await supabaseRemote
          .from('user_content_access')
          .update({ is_unlocked: false })
          .eq('user_id', userId);

        await supabaseRemote
          .from('course_enrollments')
          .delete()
          .eq('user_id', userId);
      }

      if (action === 'lock_all_sessions') {
        await supabaseRemote
          .from('user_content_access')
          .update({ is_unlocked: false })
          .eq('user_id', userId)
          .eq('content_type', 'session');
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Unlock journey error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/api/admin', adminRouter);

  const publicRouter = Router();
  publicRouter.use(requireAuth);

  publicRouter.get('/', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseRemote
        .from('mentorship_sessions')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Fetch public sessions error:', error);
        return res.status(500).json({ error: 'Failed to fetch sessions' });
      }

      res.json(data || []);
    } catch (err) {
      console.error('Public sessions error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/api/sessions', publicRouter);
}
