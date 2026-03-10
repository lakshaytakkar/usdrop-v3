-- SMS Templates table
CREATE TABLE IF NOT EXISTS sms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'utility' CHECK (category IN ('utility', 'marketing', 'transactional')),
  type TEXT NOT NULL DEFAULT 'notification',
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SMS Automations table
CREATE TABLE IF NOT EXISTS sms_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  trigger TEXT NOT NULL,
  conditions JSONB DEFAULT '[]'::jsonb,
  template_id UUID REFERENCES sms_templates(id) ON DELETE SET NULL,
  delay INTEGER NOT NULL DEFAULT 0,
  delay_unit TEXT NOT NULL DEFAULT 'minutes' CHECK (delay_unit IN ('minutes', 'hours', 'days')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  target_audience TEXT NOT NULL DEFAULT 'all',
  plan_levels JSONB DEFAULT '[]'::jsonb,
  channel TEXT NOT NULL DEFAULT 'sms',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SMS Logs table
CREATE TABLE IF NOT EXISTS sms_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_phone TEXT NOT NULL,
  recipient_id UUID,
  template_id UUID REFERENCES sms_templates(id) ON DELETE SET NULL,
  automation_id UUID REFERENCES sms_automations(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'delivered')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sms_automations_trigger ON sms_automations(trigger);
CREATE INDEX IF NOT EXISTS idx_sms_automations_active ON sms_automations(is_active);
CREATE INDEX IF NOT EXISTS idx_sms_logs_recipient_id ON sms_logs(recipient_id);
CREATE INDEX IF NOT EXISTS idx_sms_logs_status ON sms_logs(status);
CREATE INDEX IF NOT EXISTS idx_sms_logs_created_at ON sms_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_sms_templates_category ON sms_templates(category);

-- Updated_at trigger function (reuse if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-update updated_at on sms_templates
DROP TRIGGER IF EXISTS set_sms_templates_updated_at ON sms_templates;
CREATE TRIGGER set_sms_templates_updated_at
  BEFORE UPDATE ON sms_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on sms_automations
DROP TRIGGER IF EXISTS set_sms_automations_updated_at ON sms_automations;
CREATE TRIGGER set_sms_automations_updated_at
  BEFORE UPDATE ON sms_automations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;

-- Service role policies (server-side access)
CREATE POLICY "Service role full access on sms_templates"
  ON sms_templates FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on sms_automations"
  ON sms_automations FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on sms_logs"
  ON sms_logs FOR ALL
  USING (true) WITH CHECK (true);
