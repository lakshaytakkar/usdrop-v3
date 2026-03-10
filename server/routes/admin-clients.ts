import { type Express, Router, Request, Response } from 'express';
import { requireAdmin } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';
import { triggerAutomation } from '../lib/email-automation';
import { triggerSmsAutomation } from '../lib/sms-automation';

export function registerAdminClientRoutes(app: Express) {
  const router = Router();
  router.use(requireAdmin);

  router.get('/clients', async (req: Request, res: Response) => {
    try {
      const search = req.query.search as string;
      const batchId = req.query.batch_id as string;
      const status = req.query.status as string;
      const week = req.query.week as string;
      const page = parseInt((req.query.page as string) || '1');
      const pageSize = parseInt((req.query.pageSize as string) || '50');

      let query = supabaseRemote
        .from('batch_members')
        .select(`
          *,
          user:profiles!batch_members_user_id_fkey(id, full_name, email, avatar_url, account_type, phone_number, created_at),
          batch:batches!batch_members_batch_id_fkey(id, name, status)
        `, { count: 'exact' });

      if (batchId) {
        query = query.eq('batch_id', batchId);
      }
      if (status) {
        query = query.eq('status', status);
      }
      if (week) {
        query = query.eq('current_week', parseInt(week));
      }

      query = query.order('joined_at', { ascending: false });

      const offset = (page - 1) * pageSize;
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching clients:', error);
        return res.status(500).json({ error: 'Failed to fetch clients' });
      }

      let clients = data || [];

      if (search) {
        const searchLower = search.toLowerCase();
        clients = clients.filter((c: any) => {
          const user = c.user;
          if (!user) return false;
          return (
            (user.full_name && user.full_name.toLowerCase().includes(searchLower)) ||
            (user.email && user.email.toLowerCase().includes(searchLower))
          );
        });
      }

      const now = new Date();
      const stalledThresholdDays = 7;
      const clientsWithStalled = clients.map((c: any) => {
        const lastUpdate = new Date(c.updated_at || c.joined_at);
        const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
        return {
          ...c,
          is_stalled: daysSinceUpdate >= stalledThresholdDays && c.status === 'active',
          days_since_update: daysSinceUpdate,
        };
      });

      return res.json({ clients: clientsWithStalled, totalCount: count || 0 });
    } catch (error) {
      console.error('Unexpected error fetching clients:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/clients/stalled', async (req: Request, res: Response) => {
    try {
      const stalledThresholdDays = 7;
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() - stalledThresholdDays);

      const { data, error } = await supabaseRemote
        .from('batch_members')
        .select(`
          *,
          user:profiles!batch_members_user_id_fkey(id, full_name, email, avatar_url, account_type, phone_number),
          batch:batches!batch_members_batch_id_fkey(id, name, status)
        `)
        .eq('status', 'active')
        .lt('updated_at', thresholdDate.toISOString())
        .order('updated_at', { ascending: true });

      if (error) {
        console.error('Error fetching stalled clients:', error);
        return res.status(500).json({ error: 'Failed to fetch stalled clients' });
      }

      const now = new Date();
      const stalledClients = (data || []).map((c: any) => {
        const lastUpdate = new Date(c.updated_at || c.joined_at);
        const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
        return { ...c, days_since_update: daysSinceUpdate };
      });

      return res.json({ clients: stalledClients, totalCount: stalledClients.length });
    } catch (error) {
      console.error('Unexpected error fetching stalled clients:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/clients/export', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseRemote
        .from('batch_members')
        .select(`
          *,
          user:profiles!batch_members_user_id_fkey(id, full_name, email, phone_number, account_type),
          batch:batches!batch_members_batch_id_fkey(id, name)
        `)
        .order('joined_at', { ascending: false });

      if (error) {
        console.error('Error exporting clients:', error);
        return res.status(500).json({ error: 'Failed to export clients' });
      }

      const rows = (data || []).map((c: any) => ({
        name: c.user?.full_name || '',
        email: c.user?.email || '',
        phone: c.user?.phone_number || '',
        batch: c.batch?.name || '',
        week: c.current_week || 0,
        status: c.status || '',
        joined_at: c.joined_at || '',
      }));

      const headers = ['Name', 'Email', 'Phone', 'Batch', 'Week', 'Status', 'Joined At'];
      const csvLines = [
        headers.join(','),
        ...rows.map(r => [r.name, r.email, r.phone, r.batch, r.week, r.status, r.joined_at].map(v => `"${v}"`).join(',')),
      ];

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=clients-export.csv');
      return res.send(csvLines.join('\n'));
    } catch (error) {
      console.error('Unexpected error exporting clients:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/batches', async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string;

      let query = supabaseRemote.from('batches').select('*');

      if (status) {
        query = query.eq('status', status);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching batches:', error);
        return res.status(500).json({ error: 'Failed to fetch batches' });
      }

      const batches = data || [];

      const batchIds = batches.map((b: any) => b.id);
      let memberCounts: Record<string, number> = {};

      if (batchIds.length > 0) {
        const { data: members } = await supabaseRemote
          .from('batch_members')
          .select('batch_id')
          .in('batch_id', batchIds);

        if (members) {
          for (const m of members) {
            memberCounts[m.batch_id] = (memberCounts[m.batch_id] || 0) + 1;
          }
        }
      }

      const batchesWithCounts = batches.map((b: any) => ({
        ...b,
        member_count: memberCounts[b.id] || 0,
      }));

      return res.json({ batches: batchesWithCounts });
    } catch (error) {
      console.error('Unexpected error fetching batches:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/batches', async (req: Request, res: Response) => {
    try {
      const { name, start_date, end_date, max_size, status: batchStatus } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'name is required' });
      }

      if (!start_date) {
        return res.status(400).json({ error: 'start_date is required' });
      }

      const { data, error } = await supabaseRemote
        .from('batches')
        .insert({
          name,
          start_date,
          end_date: end_date || null,
          max_size: max_size || null,
          status: batchStatus || 'active',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating batch:', error);
        return res.status(500).json({ error: 'Failed to create batch' });
      }

      return res.status(201).json({ batch: data });
    } catch (error) {
      console.error('Unexpected error creating batch:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/batches/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data: batch, error: batchError } = await supabaseRemote
        .from('batches')
        .select('*')
        .eq('id', id)
        .single();

      if (batchError || !batch) {
        return res.status(404).json({ error: 'Batch not found' });
      }

      const { data: members, error: membersError } = await supabaseRemote
        .from('batch_members')
        .select(`
          *,
          user:profiles!batch_members_user_id_fkey(id, full_name, email, avatar_url, account_type, phone_number)
        `)
        .eq('batch_id', id)
        .order('joined_at', { ascending: false });

      if (membersError) {
        console.error('Error fetching batch members:', membersError);
      }

      return res.json({ batch, members: members || [] });
    } catch (error) {
      console.error('Unexpected error fetching batch:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/batches/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, start_date, end_date, max_size, status: batchStatus } = req.body;

      const updateData: Record<string, any> = {};
      if (name !== undefined) updateData.name = name;
      if (start_date !== undefined) updateData.start_date = start_date;
      if (end_date !== undefined) updateData.end_date = end_date;
      if (max_size !== undefined) updateData.max_size = max_size;
      if (batchStatus !== undefined) updateData.status = batchStatus;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const { data, error } = await supabaseRemote
        .from('batches')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        return res.status(500).json({ error: 'Failed to update batch' });
      }

      return res.json({ batch: data });
    } catch (error) {
      console.error('Unexpected error updating batch:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/batches/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await supabaseRemote.from('batch_members').delete().eq('batch_id', id);
      await supabaseRemote.from('batches').delete().eq('id', id);

      return res.json({ success: true });
    } catch (error) {
      console.error('Unexpected error deleting batch:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/batches/:id/members', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseRemote
        .from('batch_members')
        .select(`
          *,
          user:profiles!batch_members_user_id_fkey(id, full_name, email, avatar_url, account_type, phone_number)
        `)
        .eq('batch_id', id)
        .order('joined_at', { ascending: false });

      if (error) {
        console.error('Error fetching batch members:', error);
        return res.status(500).json({ error: 'Failed to fetch batch members' });
      }

      return res.json({ members: data || [] });
    } catch (error) {
      console.error('Unexpected error fetching batch members:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/batches/:id/members', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
      }

      const { data: existing } = await supabaseRemote
        .from('batch_members')
        .select('id')
        .eq('batch_id', id)
        .eq('user_id', user_id)
        .limit(1);

      if (existing && existing.length > 0) {
        return res.status(400).json({ error: 'User is already a member of this batch' });
      }

      const { data: batch } = await supabaseRemote
        .from('batches')
        .select('max_size')
        .eq('id', id)
        .single();

      if (batch?.max_size) {
        const { count } = await supabaseRemote
          .from('batch_members')
          .select('id', { count: 'exact', head: true })
          .eq('batch_id', id);

        if (count && count >= batch.max_size) {
          return res.status(400).json({ error: 'Batch is full' });
        }
      }

      const { data, error } = await supabaseRemote
        .from('batch_members')
        .insert({
          batch_id: id,
          user_id,
          current_week: 1,
          status: 'active',
          joined_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select(`
          *,
          user:profiles!batch_members_user_id_fkey(id, full_name, email, avatar_url, account_type),
          batch:batches!batch_members_batch_id_fkey(id, name)
        `)
        .single();

      if (error) {
        console.error('Error adding batch member:', error);
        return res.status(500).json({ error: 'Failed to add member' });
      }

      const batchName = (data as any)?.batch?.name || '';
      const batchMeta = { 'batch.id': id, 'batch.name': batchName, batch_name: batchName, batch_id: id };
      triggerAutomation('mentorship_assigned', user_id, batchMeta)
        .catch((err) => console.error('[batch-assign] automation trigger error:', err));
      triggerSmsAutomation('mentorship_assigned', user_id, batchMeta)
        .catch((err) => console.error('[batch-assign] sms automation trigger error:', err));

      return res.status(201).json({ member: data });
    } catch (error) {
      console.error('Unexpected error adding batch member:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/batches/:batchId/members/:memberId', async (req: Request, res: Response) => {
    try {
      const { memberId } = req.params;
      const { current_week, status: memberStatus } = req.body;

      const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
      if (current_week !== undefined) updateData.current_week = current_week;
      if (memberStatus !== undefined) updateData.status = memberStatus;

      const { data, error } = await supabaseRemote
        .from('batch_members')
        .update(updateData)
        .eq('id', memberId)
        .select(`
          *,
          user:profiles!batch_members_user_id_fkey(id, full_name, email, avatar_url, account_type)
        `)
        .single();

      if (error || !data) {
        return res.status(500).json({ error: 'Failed to update member' });
      }

      return res.json({ member: data });
    } catch (error) {
      console.error('Unexpected error updating batch member:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/batches/:batchId/members/:memberId', async (req: Request, res: Response) => {
    try {
      const { memberId } = req.params;

      await supabaseRemote.from('batch_members').delete().eq('id', memberId);

      return res.json({ success: true });
    } catch (error) {
      console.error('Unexpected error removing batch member:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/batches/:id/advance-all', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data: members, error: fetchError } = await supabaseRemote
        .from('batch_members')
        .select('id, current_week')
        .eq('batch_id', id)
        .eq('status', 'active');

      if (fetchError) {
        return res.status(500).json({ error: 'Failed to fetch members' });
      }

      if (!members || members.length === 0) {
        return res.json({ success: true, updated: 0 });
      }

      let updated = 0;
      const memberUserIds: string[] = [];

      const { data: memberDetails } = await supabaseRemote
        .from('batch_members')
        .select('id, user_id, current_week')
        .eq('batch_id', id)
        .eq('status', 'active');

      for (const member of members) {
        const { error: updateError } = await supabaseRemote
          .from('batch_members')
          .update({
            current_week: (member.current_week || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', member.id);

        if (!updateError) {
          updated++;
          const detail = (memberDetails || []).find((m: any) => m.id === member.id);
          if (detail?.user_id) {
            memberUserIds.push(detail.user_id);
          }
        }
      }

      for (const userId of memberUserIds) {
        const weekMeta = { 'batch.id': id, batch_id: id, week_number: String(updated?.current_week || '') };
        triggerAutomation('mentorship_week_advanced', userId, weekMeta)
          .catch((err) => console.error('[batch-advance] automation trigger error:', err));
        triggerSmsAutomation('mentorship_week_advanced', userId, weekMeta)
          .catch((err) => console.error('[batch-advance] sms automation trigger error:', err));
      }

      return res.json({ success: true, updated });
    } catch (error) {
      console.error('Unexpected error advancing batch:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/api/admin', router);
}
