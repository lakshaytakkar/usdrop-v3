import { type Express, Router, Request, Response } from 'express';
import { requireAuth } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';
import type { AuthUser } from '../lib/auth';

// The shared Suprans bug tracker (public.bug_reports) that team.suprans.in
// /hq/bugs reads. Its POST /api/bugs is intentionally open, so no secret is
// needed. Overridable per-env; falls back to production.
const SUPRANS_BUG_ENDPOINT = process.env.SUPRANS_BUG_ENDPOINT || 'https://team.suprans.in/api/bugs';

/**
 * Mirror an EXTERNAL user's support ticket into the shared Suprans bug tracker.
 * Only fires for non-@suprans.in reporters — internal staff already work bugs in
 * team.suprans.in, so their test reports must not pollute the customer inbox.
 * Fire-and-forget: never blocks or fails the ticket response.
 */
function forwardExternalBug(
  user: AuthUser,
  ticket: { title: string; type: string; description?: string; page_url?: string },
): void {
  const email = (user.email || '').trim().toLowerCase();
  if (!email || email.endsWith('@suprans.in')) return; // internal → skip

  const body = {
    type: ticket.type === 'feature_request' ? 'feature' : 'bug',
    description: [ticket.title, ticket.description].filter(Boolean).join('\n\n'),
    severity: 'normal',
    page_url: ticket.page_url || 'usdrop.ai',
    reporter_id: user.id,
    reporter_name: `[USDrop] ${user.full_name || email}`.slice(0, 200),
  };

  // Detached — the customer's submit must not wait on (or fail because of) this.
  void fetch(SUPRANS_BUG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch((err) => console.error('[user-tickets] forward to Suprans bug tracker failed:', err));
}

export function registerUserTicketRoutes(app: Express) {
  const router = Router();
  router.use(requireAuth);

  router.get('/', async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      const { data, error } = await supabaseRemote
        .from('support_tickets')
        .select('id, title, type, priority, status, created_at, updated_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user tickets:', error);
        return res.status(500).json({ error: 'Failed to fetch tickets' });
      }

      return res.json(data || []);
    } catch (error) {
      console.error('Unexpected error fetching user tickets:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { title, type, description, page_url } = req.body;

      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const validTypes = ['bug', 'feature_request', 'technical', 'billing', 'account', 'content', 'other'];
      const ticketType = validTypes.includes(type) ? type : 'other';

      const { data: ticket, error: ticketError } = await supabaseRemote
        .from('support_tickets')
        .insert({
          user_id: userId,
          title: title.trim(),
          type: ticketType,
          priority: 'medium',
          status: 'open',
        })
        .select('id, title, type, priority, status, created_at')
        .single();

      if (ticketError || !ticket) {
        console.error('Error creating user ticket:', ticketError);
        return res.status(500).json({ error: 'Failed to create ticket' });
      }

      if (description && description.trim().length > 0) {
        await supabaseRemote
          .from('ticket_messages')
          .insert({
            ticket_id: ticket.id,
            sender_id: userId,
            content: description.trim(),
            is_internal: false,
          });
      }

      // Mirror EXTERNAL (non-@suprans) reports into the shared Suprans bug
      // tracker so customer bugs land in /hq/bugs too. Internal staff skipped.
      forwardExternalBug(req.user!, {
        title: title.trim(),
        type: ticketType,
        description: typeof description === 'string' ? description.trim() : undefined,
        page_url: typeof page_url === 'string' ? page_url : undefined,
      });

      return res.status(201).json(ticket);
    } catch (error) {
      console.error('Unexpected error creating user ticket:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const { data: ticket, error } = await supabaseRemote
        .from('support_tickets')
        .select('id, title, type, priority, status, resolution_notes, created_at, updated_at')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      const { data: messages } = await supabaseRemote
        .from('ticket_messages')
        .select(`
          id, content, is_internal, created_at,
          sender:profiles!ticket_messages_sender_id_fkey(id, full_name, internal_role)
        `)
        .eq('ticket_id', id)
        .eq('is_internal', false)
        .order('created_at', { ascending: true });

      return res.json({ ticket, messages: messages || [] });
    } catch (error) {
      console.error('Unexpected error fetching user ticket:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/:id/reply', async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { content } = req.body;

      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ error: 'Message content is required' });
      }

      const { data: ticket } = await supabaseRemote
        .from('support_tickets')
        .select('id')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      const { data: message, error } = await supabaseRemote
        .from('ticket_messages')
        .insert({
          ticket_id: id,
          sender_id: userId,
          content: content.trim(),
          is_internal: false,
        })
        .select(`
          id, content, is_internal, created_at,
          sender:profiles!ticket_messages_sender_id_fkey(id, full_name, internal_role)
        `)
        .single();

      if (error) {
        console.error('Error creating reply:', error);
        return res.status(500).json({ error: 'Failed to send reply' });
      }

      await supabaseRemote
        .from('support_tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id);

      return res.status(201).json(message);
    } catch (error) {
      console.error('Unexpected error creating reply:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/api/support/tickets', router);
}
