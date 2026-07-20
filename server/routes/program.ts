import { Express, Request, Response } from 'express';
import { requireAuth, verifyToken } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';

/* GTM — Program / demo requests. A logged-in (usually Free) user requests a
   demo/call for the paid program; we capture it as a high-intent mentorship
   lead (reuses mentorship_leads) for the sales team + POC to close on a call
   and then send a Razorpay payment link (existing payment_links flow). */

export function registerProgramRoutes(app: Express) {
  /* Magic-link "add your number" — PUBLIC (token-authenticated). Emailed to
     users with no phone so they can add it in one tap without logging in. */
  app.get('/api/add-number', async (req: Request, res: Response) => {
    try {
      const payload = verifyToken(String(req.query.token || ''));
      if (!payload?.sub) return res.json({ valid: false });
      const { data } = await supabaseRemote.from('profiles').select('full_name, phone_number').eq('id', payload.sub).single();
      return res.json({ valid: true, name: data?.full_name || null, hasNumber: !!data?.phone_number });
    } catch { return res.json({ valid: false }); }
  });

  app.post('/api/add-number', async (req: Request, res: Response) => {
    try {
      const { token, phone } = req.body || {};
      const payload = verifyToken(String(token || ''));
      if (!payload?.sub) return res.status(401).json({ error: 'This link has expired — please log in and add your number in your profile.' });
      const clean = String(phone || '').replace(/[^0-9+]/g, '').slice(0, 20);
      if (clean.replace(/\D/g, '').length < 8) return res.status(400).json({ error: 'Please enter a valid phone number.' });
      const { error } = await supabaseRemote.from('profiles').update({ phone_number: clean }).eq('id', payload.sub);
      if (error) return res.status(500).json({ error: 'Could not save — please try again.' });

      // A free user who just provided a number becomes a workable lead → assign to
      // the USDrop junior sales rep (Hitesh) in the CRM overlay, mirroring the
      // one-time bridge. Only claim it if not already owned. assigned_rep_id holds
      // an HQ rep id (no FK — team-portal is the rep system of record).
      const HITESH_REP_ID = process.env.USDROP_DEFAULT_REP_ID || '4d1bb27e-144b-48c5-9638-1e0841e01957';
      try {
        const nowIso = new Date().toISOString();
        const { data: ls } = await supabaseRemote.from('lead_scores').select('id, assigned_rep_id').eq('user_id', payload.sub).maybeSingle();
        if (ls?.id) {
          if (!ls.assigned_rep_id) {
            await supabaseRemote.from('lead_scores').update({ assigned_rep_id: HITESH_REP_ID, assigned_at: nowIso, updated_at: nowIso }).eq('id', ls.id);
          }
        } else {
          await supabaseRemote.from('lead_scores').insert({ user_id: payload.sub, assigned_rep_id: HITESH_REP_ID, assigned_at: nowIso, crm_stage: 'new' });
        }
      } catch { /* non-fatal — phone saved either way */ }

      return res.json({ ok: true });
    } catch {
      return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
  });

  app.post('/api/demo-request', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const b = req.body || {};
      const plan = b.plan_interest ? String(b.plan_interest).slice(0, 60) : 'Program';
      const when = b.preferred_time ? String(b.preferred_time).slice(0, 120) : 'Anytime';
      const note = b.note ? String(b.note).slice(0, 800) : '';

      const { error } = await supabaseRemote.from('mentorship_leads').insert({
        full_name: user.full_name || user.email || 'USDrop user',
        email: user.email,
        phone: b.phone ? String(b.phone).slice(0, 20) : null,
        referral_source: 'demo_request',
        business_goal: `[${plan}] Preferred: ${when}${note ? ` — ${note}` : ''}`,
        status: 'new',
      });

      if (error) {
        console.error('demo-request insert error:', error);
        return res.status(500).json({ error: 'Could not submit your request. Please try again.' });
      }
      return res.status(201).json({ ok: true });
    } catch (err) {
      console.error('Unexpected demo-request error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}
