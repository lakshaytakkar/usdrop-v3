import { type Express, Router, Request, Response } from 'express';
import { requireAdmin } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';

export async function recalculateLeadScore(userId: string): Promise<void> {
  const [lessonsResult, activityResult, profileResult] = await Promise.all([
    supabaseRemote
      .from('user_activity_log')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('activity_type', 'lesson_complete'),
    supabaseRemote
      .from('user_activity_log')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('activity_type', 'page_view'),
    supabaseRemote
      .from('profiles')
      .select('created_at')
      .eq('id', userId)
      .single(),
  ]);

  const lessonsCompleted = lessonsResult.count || 0;
  const pageViews = activityResult.count || 0;

  let daysActive = 0;
  if (profileResult.data?.created_at) {
    const createdAt = new Date(profileResult.data.created_at);
    const now = new Date();
    daysActive = Math.max(1, Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));
  }

  const score = (lessonsCompleted * 10) + (pageViews * 1) + (daysActive * 2);

  let engagementLevel: string;
  let autoStage: string;

  if (score >= 51) {
    engagementLevel = 'hot';
    autoStage = 'hot';
  } else if (score >= 21) {
    engagementLevel = 'warm';
    autoStage = 'engaged';
  } else {
    engagementLevel = 'cold';
    autoStage = 'new_lead';
  }

  const { error } = await supabaseRemote
    .from('lead_scores')
    .upsert({
      user_id: userId,
      score,
      engagement_level: engagementLevel,
      free_lessons_completed: lessonsCompleted,
      total_page_views: pageViews,
      last_activity_at: new Date().toISOString(),
      auto_stage: autoStage,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) {
    console.error('Error upserting lead score:', error);
    throw error;
  }
}

export function registerLeadScoringRoutes(app: Express) {
  const router = Router();
  router.use(requireAdmin);

  router.get('/pipeline', async (req: Request, res: Response) => {
    try {
      const stageFilter = req.query.stage as string;
      const repFilter = req.query.rep_id as string;

      let query = supabaseRemote
        .from('lead_scores')
        .select(`
          *,
          user:profiles!lead_scores_user_id_fkey(id, email, full_name, avatar_url, account_type, created_at, status),
          rep:profiles!lead_scores_assigned_rep_id_fkey(id, full_name, email, avatar_url)
        `)
        .order('score', { ascending: false });

      if (stageFilter) {
        query = query.or(`auto_stage.eq.${stageFilter},manual_stage_override.eq.${stageFilter}`);
      }
      if (repFilter) {
        query = query.eq('assigned_rep_id', repFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Pipeline fetch error:', error);
        return res.status(500).json({ error: 'Failed to fetch pipeline' });
      }

      const leads = (data || []).map((lead: any) => ({
        ...lead,
        effective_stage: lead.manual_stage_override || lead.auto_stage,
      }));

      res.json(leads);
    } catch (err) {
      console.error('Pipeline error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/pipeline/stats', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseRemote
        .from('lead_scores')
        .select('score, engagement_level, auto_stage, manual_stage_override');

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch pipeline stats' });
      }

      const leads = data || [];
      const totalLeads = leads.length;
      const hotLeads = leads.filter(l => l.engagement_level === 'hot').length;
      const convertedLeads = leads.filter(l => (l.manual_stage_override || l.auto_stage) === 'converted').length;
      const avgScore = totalLeads > 0 ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / totalLeads) : 0;
      const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0.0';

      res.json({ totalLeads, hotLeads, convertedLeads, avgScore, conversionRate });
    } catch (err) {
      console.error('Pipeline stats error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/pipeline/:userId', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { stage_override, assigned_rep_id, notes } = req.body;

      const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
      if (stage_override !== undefined) updateData.manual_stage_override = stage_override;
      if (assigned_rep_id !== undefined) updateData.assigned_rep_id = assigned_rep_id;
      if (notes !== undefined) updateData.notes = notes;

      const { data, error } = await supabaseRemote
        .from('lead_scores')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Pipeline update error:', error);
        return res.status(500).json({ error: 'Failed to update pipeline entry' });
      }

      res.json(data);
    } catch (err) {
      console.error('Pipeline update error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/pipeline/:userId/recalculate', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      await recalculateLeadScore(userId);

      const { data, error } = await supabaseRemote
        .from('lead_scores')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch updated score' });
      }

      res.json(data);
    } catch (err) {
      console.error('Recalculate error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/pipeline/:userId/activity', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
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
      console.error('Activity fetch error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/pipeline/:userId/drawer', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const [
        leadScoreResult,
        profileResult,
        activityResult,
        paymentLinksResult,
        notesResult,
      ] = await Promise.all([
        supabaseRemote
          .from('lead_scores')
          .select(`
            *,
            user:profiles!lead_scores_user_id_fkey(id, email, full_name, avatar_url, account_type, created_at, status, phone_number),
            rep:profiles!lead_scores_assigned_rep_id_fkey(id, full_name, email, avatar_url)
          `)
          .eq('user_id', userId)
          .single(),
        supabaseRemote
          .from('profiles')
          .select('id, email, full_name, avatar_url, account_type, created_at, phone_number, onboarding_completed, onboarding_progress')
          .eq('id', userId)
          .single(),
        supabaseRemote
          .from('user_activity_log')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20),
        supabaseRemote
          .from('payment_links')
          .select(`
            *,
            creator:profiles!payment_links_created_by_fkey(id, full_name, email)
          `)
          .eq('lead_user_id', userId)
          .order('created_at', { ascending: false }),
        supabaseRemote
          .from('user_admin_notes')
          .select('*, profiles!user_admin_notes_admin_id_fkey(id, full_name, email)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20),
      ]);

      const leadScore = leadScoreResult.data;
      const profile = profileResult.data;

      if (!profile) {
        return res.status(404).json({ error: 'User not found' });
      }

      const recentActivity = (activityResult.data || []).map((a: any) => ({
        id: a.id,
        activity_type: a.activity_type,
        description: a.description || a.activity_type,
        metadata: a.metadata,
        created_at: a.created_at,
      }));

      const activitySummary = {
        total_activities: recentActivity.length,
        last_activity_at: recentActivity.length > 0 ? recentActivity[0].created_at : null,
        page_views: recentActivity.filter((a: any) => a.activity_type === 'page_view').length,
        lessons_completed: recentActivity.filter((a: any) => a.activity_type === 'lesson_complete').length,
      };

      const paymentLinks = (paymentLinksResult.data || []).map((pl: any) => ({
        id: pl.id,
        title: pl.title,
        amount: pl.amount,
        currency: pl.currency || 'USD',
        status: pl.status,
        payment_url: pl.payment_url,
        paid_at: pl.paid_at,
        created_at: pl.created_at,
        creator_name: pl.creator?.full_name || null,
      }));

      const notes = (notesResult.data || []).map((n: any) => ({
        id: n.id,
        note: n.note,
        admin_name: n.profiles?.full_name || 'Unknown',
        created_at: n.created_at,
      }));

      res.json({
        profile: {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          avatar_url: profile.avatar_url,
          account_type: profile.account_type,
          phone_number: profile.phone_number,
          onboarding_completed: profile.onboarding_completed,
          onboarding_progress: profile.onboarding_progress,
          created_at: profile.created_at,
        },
        lead_score: leadScore ? {
          score: leadScore.score,
          engagement_level: leadScore.engagement_level,
          auto_stage: leadScore.auto_stage,
          manual_stage_override: leadScore.manual_stage_override,
          effective_stage: leadScore.manual_stage_override || leadScore.auto_stage,
          assigned_rep: leadScore.rep ? {
            id: leadScore.rep.id,
            full_name: leadScore.rep.full_name,
            email: leadScore.rep.email,
          } : null,
          notes: leadScore.notes,
          last_activity_at: leadScore.last_activity_at,
        } : null,
        activity_summary: activitySummary,
        recent_activity: recentActivity,
        payment_links: paymentLinks,
        notes,
      });
    } catch (err) {
      console.error('Pipeline drawer error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/pipeline/:userId/payment-links', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const { data, error } = await supabaseRemote
        .from('payment_links')
        .select(`
          *,
          creator:profiles!payment_links_created_by_fkey(id, full_name, email)
        `)
        .eq('lead_user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Pipeline payment links error:', error);
        return res.status(500).json({ error: 'Failed to fetch payment links' });
      }

      res.json(data || []);
    } catch (err) {
      console.error('Pipeline payment links error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/api/admin', router);
}
