import { type Express, Router, Request, Response } from 'express';
import { requireAdmin } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';

export function registerAdminLLCRoutes(app: Express) {
  const router = Router();
  router.use(requireAdmin);

  router.get('/llc', async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string;
      const search = req.query.search as string;
      const page = parseInt((req.query.page as string) || '1');
      const pageSize = parseInt((req.query.pageSize as string) || '50');

      let countQuery = supabaseRemote.from('llc_applications').select('*', { count: 'exact', head: true });
      let dataQuery = supabaseRemote.from('llc_applications').select(`
        *,
        user:profiles!llc_applications_user_id_fkey(id, full_name, email, avatar_url, account_type, phone_number)
      `);

      if (status) {
        countQuery = countQuery.eq('status', status);
        dataQuery = dataQuery.eq('status', status);
      }
      if (search) {
        dataQuery = dataQuery.or(`llc_name.ilike.%${search}%`);
        countQuery = countQuery.or(`llc_name.ilike.%${search}%`);
      }

      dataQuery = dataQuery.order('created_at', { ascending: false });

      const offset = (page - 1) * pageSize;
      dataQuery = dataQuery.range(offset, offset + pageSize - 1);

      const [{ count: totalCount }, { data, error }] = await Promise.all([countQuery, dataQuery]);

      if (error) {
        console.error('Error fetching LLC applications:', error);
        return res.status(500).json({ error: 'Failed to fetch LLC applications' });
      }

      return res.json({ applications: data || [], totalCount: totalCount || 0 });
    } catch (error) {
      console.error('Unexpected error fetching LLC applications:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/llc/stats', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseRemote
        .from('llc_applications')
        .select('status');

      if (error) {
        return res.status(500).json({ error: 'Failed to fetch LLC stats' });
      }

      const apps = data || [];
      const statusCounts: Record<string, number> = {};
      for (const app of apps) {
        statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
      }

      return res.json({
        total: apps.length,
        statusCounts,
        pending: statusCounts['pending'] || 0,
        filed: statusCounts['filed'] || 0,
        ein_received: statusCounts['ein_received'] || 0,
        boi_filed: statusCounts['boi_filed'] || 0,
        bank_opened: statusCounts['bank_opened'] || 0,
        stripe_connected: statusCounts['stripe_connected'] || 0,
        complete: statusCounts['complete'] || 0,
      });
    } catch (error) {
      console.error('Unexpected error fetching LLC stats:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/llc', async (req: Request, res: Response) => {
    try {
      const { user_id, llc_name, state, package_type, amount_paid, admin_notes } = req.body;

      if (!user_id || !llc_name) {
        return res.status(400).json({ error: 'user_id and llc_name are required' });
      }

      if (!package_type) {
        return res.status(400).json({ error: 'package_type is required' });
      }

      const { data, error } = await supabaseRemote
        .from('llc_applications')
        .insert({
          user_id,
          llc_name,
          state: state || null,
          package_type: package_type || null,
          amount_paid: amount_paid ? parseFloat(amount_paid) : null,
          status: 'pending',
          admin_notes: admin_notes || null,
        })
        .select(`
          *,
          user:profiles!llc_applications_user_id_fkey(id, full_name, email, avatar_url, account_type, phone_number)
        `)
        .single();

      if (error) {
        console.error('Error creating LLC application:', error);
        return res.status(500).json({ error: 'Failed to create LLC application' });
      }

      return res.status(201).json({ application: data });
    } catch (error) {
      console.error('Unexpected error creating LLC application:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/llc/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseRemote
        .from('llc_applications')
        .select(`
          *,
          user:profiles!llc_applications_user_id_fkey(id, full_name, email, avatar_url, account_type, phone_number)
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'LLC application not found' });
      }

      return res.json({ application: data });
    } catch (error) {
      console.error('Unexpected error fetching LLC application:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/llc/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {
        llc_name,
        state,
        package_type,
        amount_paid,
        status: appStatus,
        admin_notes,
        filed_at,
        ein_at,
        boi_at,
        bank_at,
        stripe_at,
        completed_at,
      } = req.body;

      const updateData: Record<string, any> = { updated_at: new Date().toISOString() };

      if (llc_name !== undefined) updateData.llc_name = llc_name;
      if (state !== undefined) updateData.state = state;
      if (package_type !== undefined) updateData.package_type = package_type;
      if (amount_paid !== undefined) updateData.amount_paid = amount_paid ? parseFloat(amount_paid) : null;
      if (appStatus !== undefined) updateData.status = appStatus;
      if (admin_notes !== undefined) updateData.admin_notes = admin_notes;
      if (filed_at !== undefined) updateData.filed_at = filed_at;
      if (ein_at !== undefined) updateData.ein_at = ein_at;
      if (boi_at !== undefined) updateData.boi_at = boi_at;
      if (bank_at !== undefined) updateData.bank_at = bank_at;
      if (stripe_at !== undefined) updateData.stripe_at = stripe_at;
      if (completed_at !== undefined) updateData.completed_at = completed_at;

      const { data, error } = await supabaseRemote
        .from('llc_applications')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          user:profiles!llc_applications_user_id_fkey(id, full_name, email, avatar_url, account_type, phone_number)
        `)
        .single();

      if (error || !data) {
        return res.status(500).json({ error: 'Failed to update LLC application' });
      }

      return res.json({ application: data });
    } catch (error) {
      console.error('Unexpected error updating LLC application:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/llc/:id/advance', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data: current, error: fetchError } = await supabaseRemote
        .from('llc_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !current) {
        return res.status(404).json({ error: 'LLC application not found' });
      }

      const stageOrder = ['pending', 'filed', 'ein_received', 'boi_filed', 'bank_opened', 'stripe_connected', 'complete'];
      const dateFields: Record<string, string> = {
        filed: 'filed_at',
        ein_received: 'ein_at',
        boi_filed: 'boi_at',
        bank_opened: 'bank_at',
        stripe_connected: 'stripe_at',
        complete: 'completed_at',
      };

      const currentIndex = stageOrder.indexOf(current.status);
      if (currentIndex === -1 || currentIndex >= stageOrder.length - 1) {
        return res.status(400).json({ error: 'Cannot advance further' });
      }

      const nextStage = stageOrder[currentIndex + 1];
      const updateData: Record<string, any> = {
        status: nextStage,
        updated_at: new Date().toISOString(),
      };

      const dateField = dateFields[nextStage];
      if (dateField) {
        updateData[dateField] = new Date().toISOString();
      }

      const { data, error } = await supabaseRemote
        .from('llc_applications')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          user:profiles!llc_applications_user_id_fkey(id, full_name, email, avatar_url, account_type, phone_number)
        `)
        .single();

      if (error || !data) {
        return res.status(500).json({ error: 'Failed to advance LLC application' });
      }

      return res.json({ application: data });
    } catch (error) {
      console.error('Unexpected error advancing LLC application:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/llc/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await supabaseRemote.from('llc_applications').delete().eq('id', id);

      return res.json({ success: true });
    } catch (error) {
      console.error('Unexpected error deleting LLC application:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/api/admin', router);
}
