-- Migration: Flatten Courses Structure
-- Description: Simplifies course structure from Course → Module → Chapter to Course → Module (lesson)
-- Also migrates onboarding data into the courses system
-- Date: 2025-12-16

-- Step 1: Add content fields directly to course_modules table
-- This allows modules to be lessons directly (no chapters needed)
ALTER TABLE course_modules
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'video' CHECK (content_type IN ('video', 'text', 'quiz', 'assignment', 'resource')),
ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS video_storage_path TEXT,
ADD COLUMN IF NOT EXISTS video_duration INTEGER; -- Duration in seconds

-- Add index for content_type
CREATE INDEX IF NOT EXISTS idx_course_modules_content_type ON course_modules(content_type);

-- Step 2: Create the Onboarding course
INSERT INTO courses (
  id,
  title,
  slug,
  description,
  thumbnail,
  category,
  level,
  featured,
  published,
  published_at,
  price,
  tags,
  learning_objectives,
  prerequisites,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- Fixed UUID for onboarding course
  'Getting Started with USDrop',
  'onboarding',
  'Complete this essential course to unlock all platform features. Learn the fundamentals of dropshipping and how to use USDrop effectively.',
  '/images/thumbnail-store-setup.png',
  'Onboarding',
  'Beginner',
  true,
  true,
  NOW(),
  0,
  '["onboarding", "getting-started", "fundamentals"]'::jsonb,
  '["Understand the dropshipping business model", "Navigate the USDrop platform", "Set up your first store", "Find winning products"]'::jsonb,
  '[]'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Step 3: Migrate onboarding_modules to course_modules
-- First, insert onboarding modules as course modules
INSERT INTO course_modules (
  id,
  course_id,
  title,
  description,
  thumbnail,
  order_index,
  duration_minutes,
  is_preview,
  content_type,
  created_at,
  updated_at
)
SELECT
  om.id,
  '00000000-0000-0000-0000-000000000001'::UUID, -- Onboarding course ID
  om.title,
  om.description,
  om.thumbnail,
  om.order_index,
  0, -- Will be updated from videos
  true, -- Onboarding modules are previews
  'video',
  om.created_at,
  om.updated_at
FROM onboarding_modules om
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  thumbnail = EXCLUDED.thumbnail,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Step 4: Migrate onboarding_videos to course_modules as sub-lessons
-- For now, we'll create a course_chapter for each video to maintain compatibility
-- In future, videos can be direct modules
INSERT INTO course_chapters (
  id,
  module_id,
  title,
  description,
  content_type,
  content,
  order_index,
  duration_minutes,
  is_preview,
  created_at,
  updated_at
)
SELECT
  ov.id,
  ov.module_id,
  ov.title,
  ov.description,
  'video',
  jsonb_build_object(
    'video_url', ov.video_url,
    'video_duration', ov.video_duration
  ),
  ov.order_index,
  COALESCE(ov.video_duration / 60, 0), -- Convert seconds to minutes
  true,
  ov.created_at,
  ov.updated_at
FROM onboarding_videos ov
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  order_index = EXCLUDED.order_index,
  duration_minutes = EXCLUDED.duration_minutes,
  updated_at = NOW();

-- Step 5: Update course_modules duration based on their chapters
UPDATE course_modules cm
SET duration_minutes = (
  SELECT COALESCE(SUM(cc.duration_minutes), 0)
  FROM course_chapters cc
  WHERE cc.module_id = cm.id
)
WHERE cm.course_id = '00000000-0000-0000-0000-000000000001';

-- Step 6: Update onboarding course lessons count
UPDATE courses
SET lessons_count = (
  SELECT COUNT(*)
  FROM course_chapters cc
  JOIN course_modules cm ON cc.module_id = cm.id
  WHERE cm.course_id = '00000000-0000-0000-0000-000000000001'
),
duration_minutes = (
  SELECT COALESCE(SUM(cc.duration_minutes), 0)
  FROM course_chapters cc
  JOIN course_modules cm ON cc.module_id = cm.id
  WHERE cm.course_id = '00000000-0000-0000-0000-000000000001'
)
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Step 7: Create module_completions table for tracking progress at module level
-- This is an alias/view for the existing chapter_completions for modules that are direct lessons
CREATE TABLE IF NOT EXISTS module_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_spent_minutes INTEGER DEFAULT 0,
  watch_duration INTEGER DEFAULT 0, -- For video modules
  last_position INTEGER DEFAULT 0, -- For video resume
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(enrollment_id, module_id)
);

-- Indexes for module_completions
CREATE INDEX IF NOT EXISTS idx_module_completions_enrollment_id ON module_completions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_module_completions_module_id ON module_completions(module_id);
CREATE INDEX IF NOT EXISTS idx_module_completions_completed_at ON module_completions(completed_at);

-- Enable RLS on module_completions
ALTER TABLE module_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for module_completions
CREATE POLICY "module_completions_select" ON module_completions
  FOR SELECT
  USING (
    enrollment_id IN (
      SELECT id FROM course_enrollments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "module_completions_insert" ON module_completions
  FOR INSERT
  WITH CHECK (
    enrollment_id IN (
      SELECT id FROM course_enrollments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "module_completions_update" ON module_completions
  FOR UPDATE
  USING (
    enrollment_id IN (
      SELECT id FROM course_enrollments WHERE user_id = auth.uid()
    )
  );

-- Step 8: Create trigger for updated_at on module_completions
DROP TRIGGER IF EXISTS update_module_completions_updated_at ON module_completions;
CREATE TRIGGER update_module_completions_updated_at
  BEFORE UPDATE ON module_completions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 9: Add is_onboarding flag to courses table
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS is_onboarding BOOLEAN DEFAULT false;

-- Mark the onboarding course
UPDATE courses
SET is_onboarding = true
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Create index for finding onboarding course quickly
CREATE INDEX IF NOT EXISTS idx_courses_is_onboarding ON courses(is_onboarding) WHERE is_onboarding = true;

-- Step 10: Add comments for documentation
COMMENT ON COLUMN course_modules.content_type IS 'Type of content: video, text, quiz, assignment, resource';
COMMENT ON COLUMN course_modules.content IS 'JSONB content data (video_url, transcript, quiz questions, etc.)';
COMMENT ON COLUMN course_modules.video_url IS 'Direct video URL for video-type modules';
COMMENT ON COLUMN course_modules.video_duration IS 'Video duration in seconds';
COMMENT ON COLUMN courses.is_onboarding IS 'Whether this is the mandatory onboarding course';
COMMENT ON TABLE module_completions IS 'Tracks user completion of course modules (for simplified 2-level structure)';

-- Note: We keep the onboarding_* tables for backward compatibility
-- They can be deprecated/removed in a future migration after all code is updated
