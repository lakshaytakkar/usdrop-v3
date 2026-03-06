import { type Express, Router, Request, Response } from 'express';
import { requireAdmin } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';

export function registerAdminTicketRoutes(app: Express) {
  const router = Router();
  router.use(requireAdmin);

  router.get('/tickets', async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string;
      const type = req.query.type as string;
      const priority = req.query.priority as string;
      const search = req.query.search as string;
      const page = parseInt((req.query.page as string) || '1');
      const pageSize = parseInt((req.query.pageSize as string) || '50');

      let countQuery = supabaseRemote.from('support_tickets').select('*', { count: 'exact', head: true });
      let dataQuery = supabaseRemote.from('support_tickets').select(`
        *,
        user:profiles!support_tickets_user_id_fkey(id, full_name, email, avatar_url, account_type),
        assigned:profiles!support_tickets_assigned_to_fkey(id, full_name, email, avatar_url),
        escalated:profiles!support_tickets_escalated_to_fkey(id, full_name, email, avatar_url)
      `);

      if (status) {
        countQuery = countQuery.eq('status', status);
        dataQuery = dataQuery.eq('status', status);
      }
      if (type) {
        countQuery = countQuery.eq('type', type);
        dataQuery = dataQuery.eq('type', type);
      }
      if (priority) {
        countQuery = countQuery.eq('priority', priority);
        dataQuery = dataQuery.eq('priority', priority);
      }
      if (search) {
        countQuery = countQuery.ilike('title', `%${search}%`);
        dataQuery = dataQuery.ilike('title', `%${search}%`);
      }

      dataQuery = dataQuery.order('created_at', { ascending: false });

      const offset = (page - 1) * pageSize;
      dataQuery = dataQuery.range(offset, offset + pageSize - 1);

      const [{ count: totalCount }, { data, error }] = await Promise.all([countQuery, dataQuery]);

      if (error) {
        console.error('Error fetching tickets:', error);
        return res.status(500).json({ error: 'Failed to fetch tickets' });
      }

      return res.json({ tickets: data || [], totalCount: totalCount || 0 });
    } catch (error) {
      console.error('Unexpected error fetching tickets:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/tickets', async (req: Request, res: Response) => {
    try {
      const { user_id, title, type, priority, status: ticketStatus } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'title is required' });
      }

      const { data, error } = await supabaseRemote
        .from('support_tickets')
        .insert({
          user_id: user_id || null,
          title,
          type: type || 'general',
          priority: priority || 'medium',
          status: ticketStatus || 'open',
          assigned_to: req.user!.id,
        })
        .select(`
          *,
          user:profiles!support_tickets_user_id_fkey(id, full_name, email, avatar_url, account_type),
          assigned:profiles!support_tickets_assigned_to_fkey(id, full_name, email, avatar_url)
        `)
        .single();

      if (error) {
        console.error('Error creating ticket:', error);
        return res.status(500).json({ error: 'Failed to create ticket' });
      }

      return res.status(201).json({ ticket: data });
    } catch (error) {
      console.error('Unexpected error creating ticket:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/tickets/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseRemote
        .from('support_tickets')
        .select(`
          *,
          user:profiles!support_tickets_user_id_fkey(id, full_name, email, avatar_url, account_type, phone_number),
          assigned:profiles!support_tickets_assigned_to_fkey(id, full_name, email, avatar_url),
          escalated:profiles!support_tickets_escalated_to_fkey(id, full_name, email, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      return res.json({ ticket: data });
    } catch (error) {
      console.error('Unexpected error fetching ticket:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/tickets/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, type, priority, status: ticketStatus, resolution_notes } = req.body;

      const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
      if (title !== undefined) updateData.title = title;
      if (type !== undefined) updateData.type = type;
      if (priority !== undefined) updateData.priority = priority;
      if (ticketStatus !== undefined) updateData.status = ticketStatus;
      if (resolution_notes !== undefined) updateData.resolution_notes = resolution_notes;

      const { data, error } = await supabaseRemote
        .from('support_tickets')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          user:profiles!support_tickets_user_id_fkey(id, full_name, email, avatar_url, account_type),
          assigned:profiles!support_tickets_assigned_to_fkey(id, full_name, email, avatar_url),
          escalated:profiles!support_tickets_escalated_to_fkey(id, full_name, email, avatar_url)
        `)
        .single();

      if (error || !data) {
        return res.status(500).json({ error: 'Failed to update ticket' });
      }

      return res.json({ ticket: data });
    } catch (error) {
      console.error('Unexpected error updating ticket:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/tickets/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await supabaseRemote.from('ticket_messages').delete().eq('ticket_id', id);
      await supabaseRemote.from('support_tickets').delete().eq('id', id);

      return res.json({ success: true });
    } catch (error) {
      console.error('Unexpected error deleting ticket:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/tickets/:id/messages', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseRemote
        .from('ticket_messages')
        .select(`
          *,
          sender:profiles!ticket_messages_sender_id_fkey(id, full_name, email, avatar_url, internal_role)
        `)
        .eq('ticket_id', id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching ticket messages:', error);
        return res.status(500).json({ error: 'Failed to fetch messages' });
      }

      return res.json({ messages: data || [] });
    } catch (error) {
      console.error('Unexpected error fetching messages:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/tickets/:id/messages', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { content, is_internal } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'content is required' });
      }

      const { data, error } = await supabaseRemote
        .from('ticket_messages')
        .insert({
          ticket_id: id,
          sender_id: req.user!.id,
          content,
          is_internal: is_internal || false,
        })
        .select(`
          *,
          sender:profiles!ticket_messages_sender_id_fkey(id, full_name, email, avatar_url, internal_role)
        `)
        .single();

      if (error) {
        console.error('Error creating ticket message:', error);
        return res.status(500).json({ error: 'Failed to create message' });
      }

      await supabaseRemote
        .from('support_tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id);

      return res.status(201).json({ message: data });
    } catch (error) {
      console.error('Unexpected error creating message:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/tickets/:id/assign', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { assigned_to } = req.body;

      if (!assigned_to) {
        return res.status(400).json({ error: 'assigned_to is required' });
      }

      const { data, error } = await supabaseRemote
        .from('support_tickets')
        .update({
          assigned_to,
          status: 'in_progress',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(`
          *,
          user:profiles!support_tickets_user_id_fkey(id, full_name, email, avatar_url),
          assigned:profiles!support_tickets_assigned_to_fkey(id, full_name, email, avatar_url)
        `)
        .single();

      if (error || !data) {
        return res.status(500).json({ error: 'Failed to assign ticket' });
      }

      return res.json({ ticket: data });
    } catch (error) {
      console.error('Unexpected error assigning ticket:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/tickets/:id/escalate', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { escalated_to } = req.body;

      if (!escalated_to) {
        return res.status(400).json({ error: 'escalated_to is required' });
      }

      const { data, error } = await supabaseRemote
        .from('support_tickets')
        .update({
          escalated_to,
          status: 'escalated',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(`
          *,
          user:profiles!support_tickets_user_id_fkey(id, full_name, email, avatar_url),
          assigned:profiles!support_tickets_assigned_to_fkey(id, full_name, email, avatar_url),
          escalated:profiles!support_tickets_escalated_to_fkey(id, full_name, email, avatar_url)
        `)
        .single();

      if (error || !data) {
        return res.status(500).json({ error: 'Failed to escalate ticket' });
      }

      return res.json({ ticket: data });
    } catch (error) {
      console.error('Unexpected error escalating ticket:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/tickets/:id/resolve', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { resolution_notes } = req.body;

      const { data, error } = await supabaseRemote
        .from('support_tickets')
        .update({
          status: 'resolved',
          resolution_notes: resolution_notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(`
          *,
          user:profiles!support_tickets_user_id_fkey(id, full_name, email, avatar_url),
          assigned:profiles!support_tickets_assigned_to_fkey(id, full_name, email, avatar_url)
        `)
        .single();

      if (error || !data) {
        return res.status(500).json({ error: 'Failed to resolve ticket' });
      }

      return res.json({ ticket: data });
    } catch (error) {
      console.error('Unexpected error resolving ticket:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/api/admin', router);
}
