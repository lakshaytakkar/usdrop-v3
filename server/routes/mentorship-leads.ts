import { type Express, Request, Response } from 'express';
import { supabaseRemote } from '../lib/supabase-remote';
import { recalculateLeadScore } from './lead-scoring';

export function registerMentorshipLeadRoutes(app: Express) {
  app.post('/api/mentorship-leads', async (req: Request, res: Response) => {
    try {
      const { full_name, email, phone, country_code, experience_level, business_goal, monthly_budget, referral_source } = req.body;

      if (!full_name || !email) {
        return res.status(400).json({ error: 'Full name and email are required' });
      }

      if (!email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email address' });
      }

      const { data, error } = await supabaseRemote.from('mentorship_leads').insert({
        full_name,
        email,
        phone: phone || null,
        country_code: country_code || '+1',
        experience_level: experience_level || null,
        business_goal: business_goal || null,
        monthly_budget: monthly_budget || null,
        referral_source: referral_source || null,
        status: 'new',
      }).select().single();

      if (error) {
        console.error('Error creating mentorship lead:', error);
        return res.status(500).json({ error: 'Failed to submit application' });
      }

      try {
        const { data: profile } = await supabaseRemote
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (profile) {
          await supabaseRemote
            .from('lead_scores')
            .upsert({
              user_id: profile.id,
              engagement_level: 'hot',
              auto_stage: 'hot',
              score: 51,
              notes: 'Mentorship application submitted',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });
        }
      } catch (scoreErr) {
        console.error('Error creating lead score from mentorship lead:', scoreErr);
      }

      return res.json({ success: true, lead: data });
    } catch (err) {
      console.error('Error in mentorship leads route:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}
