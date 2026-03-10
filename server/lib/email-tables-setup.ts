import { supabaseRemote } from './supabase-remote';

export async function setupEmailTables() {
  try {
    const { error: templatesError } = await supabaseRemote.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS email_templates (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name text NOT NULL,
          subject text NOT NULL,
          type text NOT NULL DEFAULT 'utility' CHECK (type IN ('utility', 'marketing', 'transactional')),
          category text NOT NULL DEFAULT 'custom',
          description text,
          html_content text NOT NULL,
          text_content text,
          variables jsonb DEFAULT '[]'::jsonb,
          is_active boolean NOT NULL DEFAULT true,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now(),
          created_by text
        );
      `,
    });

    if (templatesError) {
      if (templatesError.message?.includes('already exists') || templatesError.code === '42P07') {
        console.log('[email-setup] email_templates table already exists');
      } else {
        console.warn('[email-setup] Could not create email_templates via RPC, trying direct query...', templatesError.message);
        await createTablesDirectly();
        return;
      }
    } else {
      console.log('[email-setup] email_templates table ready');
    }

    const { error: automationsError } = await supabaseRemote.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS email_automations (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name text NOT NULL,
          description text,
          trigger text NOT NULL,
          conditions jsonb DEFAULT '[]'::jsonb,
          template_id uuid REFERENCES email_templates(id),
          delay integer DEFAULT 0,
          delay_unit text DEFAULT 'minutes' CHECK (delay_unit IN ('minutes', 'hours', 'days')),
          is_active boolean NOT NULL DEFAULT true,
          target_audience text DEFAULT 'all' CHECK (target_audience IN ('all', 'external', 'internal', 'plan_based')),
          plan_levels jsonb DEFAULT '[]'::jsonb,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        );
      `,
    });

    if (automationsError && !automationsError.message?.includes('already exists') && automationsError.code !== '42P07') {
      console.warn('[email-setup] Error creating email_automations:', automationsError.message);
    } else {
      console.log('[email-setup] email_automations table ready');
    }

    const { error: logsError } = await supabaseRemote.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS email_logs (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          recipient_email text NOT NULL,
          recipient_type text DEFAULT 'external_user',
          recipient_id text,
          template_id uuid,
          automation_id uuid,
          subject text NOT NULL,
          status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
          sent_at timestamptz,
          delivered_at timestamptz,
          opened_at timestamptz,
          error_message text,
          metadata jsonb DEFAULT '{}'::jsonb,
          created_at timestamptz NOT NULL DEFAULT now()
        );
      `,
    });

    if (logsError && !logsError.message?.includes('already exists') && logsError.code !== '42P07') {
      console.warn('[email-setup] Error creating email_logs:', logsError.message);
    } else {
      console.log('[email-setup] email_logs table ready');
    }

    console.log('[email-setup] All email tables setup complete');
  } catch (error) {
    console.error('[email-setup] Error setting up email tables:', error);
    await createTablesDirectly();
  }
}

async function createTablesDirectly() {
  try {
    const { error: checkError } = await supabaseRemote
      .from('email_templates')
      .select('id')
      .limit(1);

    if (checkError && checkError.code === '42P01') {
      console.warn(
        '[email-setup] Tables do not exist and RPC is not available.',
        'Please create the tables manually in Supabase SQL Editor:',
      );
      console.warn(getCreateTableSQL());
    } else if (!checkError) {
      console.log('[email-setup] email_templates table already exists (verified via query)');
    }

    const { error: checkAuto } = await supabaseRemote
      .from('email_automations')
      .select('id')
      .limit(1);

    if (!checkAuto) {
      console.log('[email-setup] email_automations table already exists (verified via query)');
    }

    const { error: checkLogs } = await supabaseRemote
      .from('email_logs')
      .select('id')
      .limit(1);

    if (!checkLogs) {
      console.log('[email-setup] email_logs table already exists (verified via query)');
    }
  } catch (directError) {
    console.error('[email-setup] Direct table check failed:', directError);
  }
}

function getCreateTableSQL(): string {
  return `
-- Run this in Supabase SQL Editor if tables don't exist:

CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  type text NOT NULL DEFAULT 'utility' CHECK (type IN ('utility', 'marketing', 'transactional')),
  category text NOT NULL DEFAULT 'custom',
  description text,
  html_content text NOT NULL,
  text_content text,
  variables jsonb DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by text
);

CREATE TABLE IF NOT EXISTS email_automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  trigger text NOT NULL,
  conditions jsonb DEFAULT '[]'::jsonb,
  template_id uuid REFERENCES email_templates(id),
  delay integer DEFAULT 0,
  delay_unit text DEFAULT 'minutes' CHECK (delay_unit IN ('minutes', 'hours', 'days')),
  is_active boolean NOT NULL DEFAULT true,
  target_audience text DEFAULT 'all' CHECK (target_audience IN ('all', 'external', 'internal', 'plan_based')),
  plan_levels jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email text NOT NULL,
  recipient_type text DEFAULT 'external_user',
  recipient_id text,
  template_id uuid,
  automation_id uuid,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
  `.trim();
}
