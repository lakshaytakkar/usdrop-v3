import { type Express, Router, Request, Response } from 'express';
import { requireAdmin } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';

export function registerSmsRoutes(app: Express) {
  const router = Router();
  router.use(requireAdmin);

  router.get('/templates', async (req: Request, res: Response) => {
    try {
      const { type, category, page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const offset = (pageNum - 1) * limitNum;

      let query = supabaseRemote
        .from('sms_templates')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limitNum - 1);

      if (type) {
        query = query.eq('type', type as string);
      }
      if (category) {
        query = query.eq('category', category as string);
      }

      const { data, error, count } = await query;

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json({
        templates: data || [],
        total: count || 0,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil((count || 0) / limitNum),
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.post('/templates', async (req: Request, res: Response) => {
    try {
      const { name, body, type, category, variables, is_active } = req.body;

      if (!name || !body) {
        return res.status(400).json({ error: 'name and body are required' });
      }

      const { data, error } = await supabaseRemote
        .from('sms_templates')
        .insert({
          name,
          body,
          type: type || 'utility',
          category: category || 'utility',
          variables: variables || [],
          is_active: is_active !== false,
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.put('/templates/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, body, type, category, variables, is_active } = req.body;

      const updates: Record<string, any> = { updated_at: new Date().toISOString() };
      if (name !== undefined) updates.name = name;
      if (body !== undefined) updates.body = body;
      if (type !== undefined) updates.type = type;
      if (category !== undefined) updates.category = category;
      if (variables !== undefined) updates.variables = variables;
      if (is_active !== undefined) updates.is_active = is_active;

      const { data, error } = await supabaseRemote
        .from('sms_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: 'Template not found' });
      }

      return res.json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.delete('/templates/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabaseRemote
        .from('sms_templates')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: 'Template not found' });
      }

      return res.json({ success: true, template: data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.post('/templates/:id/preview', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { variables } = req.body;

      const { data: template, error } = await supabaseRemote
        .from('sms_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !template) {
        return res.status(404).json({ error: 'Template not found' });
      }

      const sampleVars: Record<string, string> = {
        'user.name': 'John Doe',
        'user.phone': '+1234567890',
        'user.plan': 'Pro',
        'company.name': 'USDrop',
        'company.website': 'https://usdrop.com',
      };

      const mergedVars = { ...sampleVars, ...(variables || {}) };

      let rendered = template.body;
      Object.keys(mergedVars).forEach(key => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        rendered = rendered.replace(regex, String(mergedVars[key]));
      });

      return res.json({
        rendered,
        template,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.get('/automations', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseRemote
        .from('sms_automations')
        .select('*, sms_templates(id, name, body)')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json({ automations: data || [] });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.post('/automations', async (req: Request, res: Response) => {
    try {
      const { name, description, trigger, conditions, template_id, delay, delay_unit, is_active, target_audience, plan_levels } = req.body;

      if (!name || !trigger) {
        return res.status(400).json({ error: 'name and trigger are required' });
      }

      const { data, error } = await supabaseRemote
        .from('sms_automations')
        .insert({
          name,
          description: description || null,
          trigger,
          conditions: conditions || [],
          template_id: template_id || null,
          delay: delay || 0,
          delay_unit: delay_unit || 'minutes',
          is_active: is_active !== false,
          target_audience: target_audience || 'all',
          plan_levels: plan_levels || [],
          channel: 'sms',
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.put('/automations/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, trigger, conditions, template_id, delay, delay_unit, is_active, target_audience, plan_levels } = req.body;

      const updates: Record<string, any> = { updated_at: new Date().toISOString() };
      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (trigger !== undefined) updates.trigger = trigger;
      if (conditions !== undefined) updates.conditions = conditions;
      if (template_id !== undefined) updates.template_id = template_id;
      if (delay !== undefined) updates.delay = delay;
      if (delay_unit !== undefined) updates.delay_unit = delay_unit;
      if (is_active !== undefined) updates.is_active = is_active;
      if (target_audience !== undefined) updates.target_audience = target_audience;
      if (plan_levels !== undefined) updates.plan_levels = plan_levels;

      const { data, error } = await supabaseRemote
        .from('sms_automations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: 'Automation not found' });
      }

      return res.json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.delete('/automations/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { error } = await supabaseRemote
        .from('sms_automations')
        .delete()
        .eq('id', id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.get('/logs', async (req: Request, res: Response) => {
    try {
      const { status, from, to, search, page = '1', limit = '50' } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const offset = (pageNum - 1) * limitNum;

      let query = supabaseRemote
        .from('sms_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limitNum - 1);

      if (status) {
        query = query.eq('status', status as string);
      }
      if (from) {
        query = query.gte('created_at', from as string);
      }
      if (to) {
        query = query.lte('created_at', to as string);
      }
      if (search) {
        query = query.or(`recipient_phone.ilike.%${search}%,message.ilike.%${search}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json({
        logs: data || [],
        total: count || 0,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil((count || 0) / limitNum),
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.get('/logs/stats', async (req: Request, res: Response) => {
    try {
      const [sentResult, deliveredResult, failedResult, totalResult] = await Promise.all([
        supabaseRemote
          .from('sms_logs')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'sent'),
        supabaseRemote
          .from('sms_logs')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'delivered'),
        supabaseRemote
          .from('sms_logs')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'failed'),
        supabaseRemote
          .from('sms_logs')
          .select('id', { count: 'exact', head: true }),
      ]);

      const total = totalResult.count || 0;
      const sent = sentResult.count || 0;
      const delivered = deliveredResult.count || 0;
      const failed = failedResult.count || 0;

      return res.json({
        total,
        sent,
        delivered,
        failed,
        sentRate: total > 0 ? Math.round((sent / total) * 100) : 0,
        deliveredRate: total > 0 ? Math.round((delivered / total) * 100) : 0,
        failedRate: total > 0 ? Math.round((failed / total) * 100) : 0,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.use('/api/admin/sms', router);
}
