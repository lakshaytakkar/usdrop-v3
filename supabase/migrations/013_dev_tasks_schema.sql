-- Migration: Development Tasks Schema
-- Description: Creates tables for development task management with comments, attachments, and history tracking
-- Date: 2025-01-XX

-- Create dev_tasks table
CREATE TABLE IF NOT EXISTS dev_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'in-review', 'completed', 'blocked')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_task_id UUID REFERENCES dev_tasks(id) ON DELETE CASCADE,
  project_id UUID, -- For future project grouping
  phase INTEGER,
  estimated_hours NUMERIC,
  actual_hours NUMERIC,
  due_date TIMESTAMP WITH TIME ZONE,
  figma_link TEXT,
  doc_links JSONB DEFAULT '[]'::jsonb,
  related_files JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dev_task_attachments table
CREATE TABLE IF NOT EXISTS dev_task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES dev_tasks(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dev_task_comments table
CREATE TABLE IF NOT EXISTS dev_task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES dev_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  is_system_log BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dev_task_history table
CREATE TABLE IF NOT EXISTS dev_task_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES dev_tasks(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dev_tasks_status ON dev_tasks(status);
CREATE INDEX IF NOT EXISTS idx_dev_tasks_priority ON dev_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_dev_tasks_assigned_to ON dev_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_dev_tasks_created_by ON dev_tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_dev_tasks_parent_task_id ON dev_tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_dev_tasks_project_id ON dev_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_dev_tasks_created_at ON dev_tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dev_tasks_updated_at ON dev_tasks(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_dev_tasks_due_date ON dev_tasks(due_date);

CREATE INDEX IF NOT EXISTS idx_dev_task_attachments_task_id ON dev_task_attachments(task_id);
CREATE INDEX IF NOT EXISTS idx_dev_task_attachments_uploaded_by ON dev_task_attachments(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_dev_task_comments_task_id ON dev_task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_dev_task_comments_user_id ON dev_task_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_dev_task_comments_created_at ON dev_task_comments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_dev_task_history_task_id ON dev_task_history(task_id);
CREATE INDEX IF NOT EXISTS idx_dev_task_history_changed_by ON dev_task_history(changed_by);
CREATE INDEX IF NOT EXISTS idx_dev_task_history_created_at ON dev_task_history(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_dev_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_dev_tasks_updated_at ON dev_tasks;
CREATE TRIGGER update_dev_tasks_updated_at
  BEFORE UPDATE ON dev_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_dev_tasks_updated_at();

-- Function to track field changes in history
CREATE OR REPLACE FUNCTION track_dev_task_changes()
RETURNS TRIGGER AS $$
DECLARE
  field TEXT;
  old_val TEXT;
  new_val TEXT;
BEGIN
  -- Track status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO dev_task_history (task_id, field_name, old_value, new_value, changed_by)
    VALUES (NEW.id, 'status', OLD.status::TEXT, NEW.status::TEXT, NEW.created_by);
    
    -- Auto-create system log comment for status changes
    INSERT INTO dev_task_comments (task_id, user_id, comment_text, is_system_log)
    VALUES (NEW.id, NEW.created_by, 
      'Status changed from ' || OLD.status || ' to ' || NEW.status,
      true);
  END IF;

  -- Track priority changes
  IF OLD.priority IS DISTINCT FROM NEW.priority THEN
    INSERT INTO dev_task_history (task_id, field_name, old_value, new_value, changed_by)
    VALUES (NEW.id, 'priority', OLD.priority::TEXT, NEW.priority::TEXT, NEW.created_by);
  END IF;

  -- Track assignment changes
  IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
    INSERT INTO dev_task_history (task_id, field_name, old_value, new_value, changed_by)
    VALUES (NEW.id, 'assigned_to', 
      COALESCE(OLD.assigned_to::TEXT, 'unassigned'), 
      COALESCE(NEW.assigned_to::TEXT, 'unassigned'),
      NEW.created_by);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tracking changes
DROP TRIGGER IF EXISTS track_dev_task_changes ON dev_tasks;
CREATE TRIGGER track_dev_task_changes
  AFTER UPDATE ON dev_tasks
  FOR EACH ROW
  EXECUTE FUNCTION track_dev_task_changes();

-- Enable Row Level Security
ALTER TABLE dev_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_task_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dev_tasks
-- Internal users (admin, superadmin, manager, executive) can view all tasks
CREATE POLICY "dev_tasks_select_all_internal" ON dev_tasks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.internal_role IN ('superadmin', 'admin', 'manager', 'executive')
    )
  );

-- Users can view tasks they created or are assigned to
CREATE POLICY "dev_tasks_select_own" ON dev_tasks
  FOR SELECT
  USING (
    created_by = auth.uid() OR assigned_to = auth.uid()
  );

-- Internal users can insert tasks
CREATE POLICY "dev_tasks_insert_internal" ON dev_tasks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.internal_role IN ('superadmin', 'admin', 'manager', 'executive')
    )
    AND created_by = auth.uid()
  );

-- Internal users can update all tasks
CREATE POLICY "dev_tasks_update_internal" ON dev_tasks
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.internal_role IN ('superadmin', 'admin', 'manager', 'executive')
    )
  );

-- Users can update tasks they created or are assigned to
CREATE POLICY "dev_tasks_update_own" ON dev_tasks
  FOR UPDATE
  USING (
    created_by = auth.uid() OR assigned_to = auth.uid()
  );

-- Only internal users can delete tasks
CREATE POLICY "dev_tasks_delete_internal" ON dev_tasks
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.internal_role IN ('superadmin', 'admin')
    )
  );

-- RLS Policies for dev_task_attachments
CREATE POLICY "dev_task_attachments_select_task_access" ON dev_task_attachments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dev_tasks
      WHERE dev_tasks.id = dev_task_attachments.task_id
      AND (
        dev_tasks.created_by = auth.uid()
        OR dev_tasks.assigned_to = auth.uid()
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.internal_role IN ('superadmin', 'admin', 'manager', 'executive')
        )
      )
    )
  );

CREATE POLICY "dev_task_attachments_insert_internal" ON dev_task_attachments
  FOR INSERT
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM dev_tasks
      WHERE dev_tasks.id = dev_task_attachments.task_id
      AND (
        dev_tasks.created_by = auth.uid()
        OR dev_tasks.assigned_to = auth.uid()
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.internal_role IN ('superadmin', 'admin', 'manager', 'executive')
        )
      )
    )
  );

CREATE POLICY "dev_task_attachments_delete_internal" ON dev_task_attachments
  FOR DELETE
  USING (
    uploaded_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.internal_role IN ('superadmin', 'admin')
    )
  );

-- RLS Policies for dev_task_comments
CREATE POLICY "dev_task_comments_select_task_access" ON dev_task_comments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dev_tasks
      WHERE dev_tasks.id = dev_task_comments.task_id
      AND (
        dev_tasks.created_by = auth.uid()
        OR dev_tasks.assigned_to = auth.uid()
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.internal_role IN ('superadmin', 'admin', 'manager', 'executive')
        )
      )
    )
  );

CREATE POLICY "dev_task_comments_insert_task_access" ON dev_task_comments
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM dev_tasks
      WHERE dev_tasks.id = dev_task_comments.task_id
      AND (
        dev_tasks.created_by = auth.uid()
        OR dev_tasks.assigned_to = auth.uid()
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.internal_role IN ('superadmin', 'admin', 'manager', 'executive')
        )
      )
    )
  );

CREATE POLICY "dev_task_comments_delete_own" ON dev_task_comments
  FOR DELETE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.internal_role IN ('superadmin', 'admin')
    )
  );

-- RLS Policies for dev_task_history
CREATE POLICY "dev_task_history_select_task_access" ON dev_task_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dev_tasks
      WHERE dev_tasks.id = dev_task_history.task_id
      AND (
        dev_tasks.created_by = auth.uid()
        OR dev_tasks.assigned_to = auth.uid()
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.internal_role IN ('superadmin', 'admin', 'manager', 'executive')
        )
      )
    )
  );

-- Add comments for documentation
COMMENT ON TABLE dev_tasks IS 'Development tasks and issues tracking';
COMMENT ON TABLE dev_task_attachments IS 'File attachments for development tasks';
COMMENT ON TABLE dev_task_comments IS 'Comments and activity logs for development tasks';
COMMENT ON TABLE dev_task_history IS 'Change history tracking for development tasks';


