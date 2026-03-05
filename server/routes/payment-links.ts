import { type Express, Router, Request, Response } from 'express';
import { requireAdmin, requireAuth } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';

export function registerPaymentLinkRoutes(app: Express) {
  const adminRouter = Router();
  adminRouter.use(requireAdmin);

  adminRouter.post('/payment-links', async (req: Request, res: Response) => {
    try {
      const { amount, title, description, lead_user_id, expires_at, payment_url } = req.body;

      if (!amount || !title || !lead_user_id) {
        return res.status(400).json({ error: 'amount, title, and lead_user_id are required' });
      }

      const { data, error } = await supabaseRemote
        .from('payment_links')
        .insert({
          lead_user_id,
          amount: parseFloat(amount),
          title,
          description: description || '',
          payment_url: payment_url || '',
          expires_at: expires_at || null,
          created_by: req.user!.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Create payment link error:', error);
        return res.status(500).json({ error: 'Failed to create payment link' });
      }

      res.json(data);
    } catch (err) {
      console.error('Payment link create error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.get('/payment-links', async (req: Request, res: Response) => {
    try {
      const statusFilter = req.query.status as string;

      let query = supabaseRemote
        .from('payment_links')
        .select(`
          *,
          prospect:profiles!payment_links_lead_user_id_fkey(id, full_name, email, avatar_url),
          creator:profiles!payment_links_created_by_fkey(id, full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Fetch payment links error:', error);
        return res.status(500).json({ error: 'Failed to fetch payment links' });
      }

      res.json(data || []);
    } catch (err) {
      console.error('Payment links fetch error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.get('/payment-links/stats', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseRemote
        .from('payment_links')
        .select('amount, status');

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch stats' });
      }

      const links = data || [];
      const totalLinks = links.length;
      const pendingCount = links.filter(l => l.status === 'pending').length;
      const paidCount = links.filter(l => l.status === 'paid').length;
      const totalRevenue = links.filter(l => l.status === 'paid').reduce((sum, l) => sum + Number(l.amount), 0);

      res.json({ totalLinks, pendingCount, paidCount, totalRevenue });
    } catch (err) {
      console.error('Payment link stats error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  adminRouter.patch('/payment-links/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, payment_url } = req.body;

      const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
      if (status) {
        updateData.status = status;
        if (status === 'paid') updateData.paid_at = new Date().toISOString();
      }
      if (payment_url !== undefined) updateData.payment_url = payment_url;

      const { data, error } = await supabaseRemote
        .from('payment_links')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update payment link error:', error);
        return res.status(500).json({ error: 'Failed to update payment link' });
      }

      res.json(data);
    } catch (err) {
      console.error('Payment link update error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/api/admin', adminRouter);

  app.get('/api/payment/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseRemote
        .from('payment_links')
        .select(`
          id, title, description, amount, currency, status, expires_at, paid_at,
          creator:profiles!payment_links_created_by_fkey(full_name)
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Payment link not found' });
      }

      res.json(data);
    } catch (err) {
      console.error('Public payment link error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}
