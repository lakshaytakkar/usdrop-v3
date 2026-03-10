import { type Express, Router, Request, Response } from 'express';
import { requireAdmin } from '../lib/auth';
import { supabaseRemote } from '../lib/supabase-remote';
import { sendEmail } from '../lib/resend';
import { DEFAULT_EMAIL_TEMPLATES } from '../lib/email-templates';

export function registerEmailRoutes(app: Express) {
  const router = Router();
  router.use(requireAdmin);

  router.get('/templates', async (req: Request, res: Response) => {
    try {
      const { type, category, page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const offset = (pageNum - 1) * limitNum;

      let query = supabaseRemote
        .from('email_templates')
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
      const { name, subject, type, category, description, html_content, text_content, variables, is_active } = req.body;

      if (!name || !subject || !html_content) {
        return res.status(400).json({ error: 'name, subject, and html_content are required' });
      }

      const { data, error } = await supabaseRemote
        .from('email_templates')
        .insert({
          name,
          subject,
          type: type || 'utility',
          category: category || 'custom',
          description: description || null,
          html_content,
          text_content: text_content || null,
          variables: variables || [],
          is_active: is_active !== false,
          created_by: req.user?.id || null,
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
      const { name, subject, type, category, description, html_content, text_content, variables, is_active } = req.body;

      const updates: Record<string, any> = { updated_at: new Date().toISOString() };
      if (name !== undefined) updates.name = name;
      if (subject !== undefined) updates.subject = subject;
      if (type !== undefined) updates.type = type;
      if (category !== undefined) updates.category = category;
      if (description !== undefined) updates.description = description;
      if (html_content !== undefined) updates.html_content = html_content;
      if (text_content !== undefined) updates.text_content = text_content;
      if (variables !== undefined) updates.variables = variables;
      if (is_active !== undefined) updates.is_active = is_active;

      const { data, error } = await supabaseRemote
        .from('email_templates')
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
        .from('email_templates')
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
        .from('email_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !template) {
        return res.status(404).json({ error: 'Template not found' });
      }

      const sampleVars: Record<string, string> = {
        'user.name': 'John Doe',
        'user.email': 'john.doe@example.com',
        'user.plan': 'Pro',
        'user.credits': '150',
        'user.signupDate': 'January 15, 2024',
        'user.status': 'active',
        'order.id': 'ORD-12345',
        'order.total': '$99.99',
        'order.items': 'Product A, Product B',
        'order.date': 'January 20, 2024',
        'order.shippingAddress': '123 Main St, City, State 12345',
        'order.trackingNumber': 'TRACK123456789',
        'company.name': 'USDrop',
        'company.email': 'support@usdrop.com',
        'company.website': 'https://usdrop.com',
        'currentDate': new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        'unsubscribeLink': 'https://usdrop.com/unsubscribe',
        'resetLink': 'https://usdrop.com/auth/reset-password?token=sample',
      };

      const mergedVars = { ...sampleVars, ...(variables || {}) };

      let rendered = template.html_content;
      Object.keys(mergedVars).forEach(key => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        rendered = rendered.replace(regex, String(mergedVars[key]));
      });

      let renderedSubject = template.subject;
      Object.keys(mergedVars).forEach(key => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        renderedSubject = renderedSubject.replace(regex, String(mergedVars[key]));
      });

      return res.json({
        html: rendered,
        subject: renderedSubject,
        template,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.post('/templates/:id/send-test', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { to } = req.body;

      const recipientEmail = to || req.user?.email;
      if (!recipientEmail) {
        return res.status(400).json({ error: 'Recipient email is required' });
      }

      const { data: template, error } = await supabaseRemote
        .from('email_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !template) {
        return res.status(404).json({ error: 'Template not found' });
      }

      const sampleVars: Record<string, string> = {
        'user.name': req.user?.full_name || 'Test User',
        'user.email': recipientEmail,
        'user.plan': 'Pro',
        'user.credits': '150',
        'user.signupDate': new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        'user.status': 'active',
        'order.id': 'ORD-TEST-12345',
        'order.total': '$99.99',
        'order.items': 'Test Product A, Test Product B',
        'order.date': new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        'order.shippingAddress': '123 Test St, City, State 12345',
        'order.trackingNumber': 'TRACK-TEST-123456789',
        'company.name': 'USDrop',
        'company.email': 'support@usdrop.com',
        'company.website': 'https://usdrop.com',
        'currentDate': new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        'unsubscribeLink': 'https://usdrop.com/unsubscribe',
        'resetLink': 'https://usdrop.com/auth/reset-password?token=test',
      };

      let rendered = template.html_content;
      Object.keys(sampleVars).forEach(key => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        rendered = rendered.replace(regex, String(sampleVars[key]));
      });

      let renderedSubject = `[TEST] ${template.subject}`;
      Object.keys(sampleVars).forEach(key => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        renderedSubject = renderedSubject.replace(regex, String(sampleVars[key]));
      });

      const result = await sendEmail(recipientEmail, renderedSubject, rendered, {
        tags: [{ name: 'type', value: 'test' }, { name: 'template_id', value: String(id) }],
      });

      return res.json({ success: true, messageId: result?.id, to: recipientEmail });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.get('/automations', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseRemote
        .from('email_automations')
        .select('*, email_templates(id, name, subject)')
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
        .from('email_automations')
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
        .from('email_automations')
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
        .from('email_automations')
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
        .from('email_logs')
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
        query = query.or(`recipient_email.ilike.%${search}%,subject.ilike.%${search}%`);
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
      const [sentResult, deliveredResult, openedResult, failedResult, totalResult] = await Promise.all([
        supabaseRemote
          .from('email_logs')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'sent'),
        supabaseRemote
          .from('email_logs')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'delivered'),
        supabaseRemote
          .from('email_logs')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'opened'),
        supabaseRemote
          .from('email_logs')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'failed'),
        supabaseRemote
          .from('email_logs')
          .select('id', { count: 'exact', head: true }),
      ]);

      const total = totalResult.count || 0;
      const sent = sentResult.count || 0;
      const delivered = deliveredResult.count || 0;
      const opened = openedResult.count || 0;
      const failed = failedResult.count || 0;

      return res.json({
        total,
        sent,
        delivered,
        opened,
        failed,
        sentRate: total > 0 ? Math.round((sent / total) * 100) : 0,
        deliveredRate: total > 0 ? Math.round((delivered / total) * 100) : 0,
        openedRate: total > 0 ? Math.round((opened / total) * 100) : 0,
        failedRate: total > 0 ? Math.round((failed / total) * 100) : 0,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  router.post('/send', async (req: Request, res: Response) => {
    try {
      const { to, subject, html, template_id, variables } = req.body;

      if (!to) {
        return res.status(400).json({ error: 'Recipient email is required' });
      }

      let emailHtml = html;
      let emailSubject = subject;

      if (template_id) {
        const { data: template, error } = await supabaseRemote
          .from('email_templates')
          .select('*')
          .eq('id', template_id)
          .single();

        if (error || !template) {
          return res.status(404).json({ error: 'Template not found' });
        }

        emailHtml = template.html_content;
        emailSubject = emailSubject || template.subject;

        if (variables) {
          Object.keys(variables).forEach(key => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            emailHtml = emailHtml.replace(regex, String(variables[key]));
            emailSubject = emailSubject.replace(regex, String(variables[key]));
          });
        }
      }

      if (!emailSubject || !emailHtml) {
        return res.status(400).json({ error: 'subject and html content are required (or provide template_id)' });
      }

      const result = await sendEmail(to, emailSubject, emailHtml, {
        templateId: template_id || undefined,
        tags: [
          { name: 'type', value: 'manual' },
          ...(template_id ? [{ name: 'template_id', value: template_id }] : []),
        ],
      });

      return res.json({ success: true, messageId: result?.id, to });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.use('/api/admin/email', router);
}
