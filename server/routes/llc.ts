import { Express, Request, Response } from 'express';
import { requireAuth } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';
import { triggerAutomation } from '../lib/email-automation';
import { triggerSmsAutomation } from '../lib/sms-automation';

/* Phase A — client-facing LLC. The in-portal guided LLC formation experience
   (replaces the old static affiliate landing). Reads/writes the same
   llc_applications table the admin desk works (admin-llc.ts). Status pipeline:
   pending -> filed -> ein_received -> boi_filed -> bank_opened -> stripe_connected -> complete.
   Single "Dropshipper LLC" package; fulfillment is handled by the LegalNations
   desk (sync is representational for now). */

const DROPSHIPPER_LLC_PACKAGE = 'dropshipper_llc';

export function registerLLCRoutes(app: Express) {
  // The signed-in user's LLC application (most recent), or null.
  app.get('/api/llc/me', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { data, error } = await supabaseRemote
        .from('llc_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching LLC application:', error);
        return res.status(500).json({ error: 'Failed to fetch your LLC application' });
      }
      return res.json({ application: (data && data[0]) || null });
    } catch (err) {
      console.error('Unexpected error fetching LLC application:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Start a Dropshipper LLC application for the signed-in user.
  app.post('/api/llc', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const body = req.body || {};
      const llcName = body.llc_name ? String(body.llc_name).slice(0, 160).trim() : '';
      const state = body.state ? String(body.state).slice(0, 60) : null;

      if (!llcName) return res.status(400).json({ error: 'Please enter your desired LLC name.' });

      // One active application per user — return the existing one if present.
      const { data: existing } = await supabaseRemote
        .from('llc_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      if (existing && existing[0] && existing[0].status !== 'complete') {
        return res.json({ application: existing[0], existing: true });
      }

      const { data, error } = await supabaseRemote
        .from('llc_applications')
        .insert({
          user_id: user.id,
          llc_name: llcName,
          state,
          package_type: DROPSHIPPER_LLC_PACKAGE,
          status: 'pending',
        })
        .select('*')
        .single();

      if (error || !data) {
        console.error('Error creating LLC application:', error);
        return res.status(500).json({ error: 'Failed to start your LLC application' });
      }

      // Notify the desk (same automation the admin flow uses).
      const meta = { 'llc.status': 'pending', 'llc.name': llcName, llc_status: 'pending', llc_name: llcName };
      triggerAutomation('llc_status_changed', user.id, meta).catch(() => {});
      triggerSmsAutomation('llc_status_changed', user.id, meta).catch(() => {});

      return res.status(201).json({ application: data });
    } catch (err) {
      console.error('Unexpected error creating LLC application:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}
