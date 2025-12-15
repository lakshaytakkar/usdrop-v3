-- Migration: Onboarding System Schema
-- Description: Creates tables and columns for onboarding video tracking system
-- Date: 2025-12-15

-- Add onboarding_progress column to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'onboarding_progress'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN onboarding_progress INTEGER DEFAULT 0 
    CHECK (onboarding_progress >= 0 AND onboarding_progress <= 100);
  END IF;
END $$;

-- Ensure onboarding_completed and onboarding_completed_at exist (they may already exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'onboarding_completed_at'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN onboarding_completed_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Create onboarding_modules table
CREATE TABLE IF NOT EXISTS onboarding_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create onboarding_videos table
CREATE TABLE IF NOT EXISTS onboarding_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES onboarding_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  video_duration INTEGER, -- Duration in seconds
  thumbnail TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create onboarding_progress table
CREATE TABLE IF NOT EXISTS onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES onboarding_videos(id) ON DELETE CASCADE,
  module_id UUID REFERENCES onboarding_modules(id) ON DELETE SET NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  watch_duration INTEGER DEFAULT 0, -- Total seconds watched
  last_position INTEGER DEFAULT 0, -- Last position in seconds (for resume)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id) -- One progress record per user per video
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_onboarding_videos_module_id ON onboarding_videos(module_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_videos_order_index ON onboarding_videos(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user_id ON onboarding_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_video_id ON onboarding_progress(video_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_completed ON onboarding_progress(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_onboarding_modules_order_index ON onboarding_modules(order_index);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_onboarding_modules_updated_at ON onboarding_modules;
CREATE TRIGGER update_onboarding_modules_updated_at
  BEFORE UPDATE ON onboarding_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_onboarding_videos_updated_at ON onboarding_videos;
CREATE TRIGGER update_onboarding_videos_updated_at
  BEFORE UPDATE ON onboarding_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_onboarding_progress_updated_at ON onboarding_progress;
CREATE TRIGGER update_onboarding_progress_updated_at
  BEFORE UPDATE ON onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE onboarding_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for onboarding_modules (public read, admin write)
CREATE POLICY "onboarding_modules_select" ON onboarding_modules
  FOR SELECT
  USING (true); -- Everyone can read modules

CREATE POLICY "onboarding_modules_insert" ON onboarding_modules
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.internal_role IS NOT NULL
    )
  ); -- Only internal users (admins) can insert

CREATE POLICY "onboarding_modules_update" ON onboarding_modules
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.internal_role IS NOT NULL
    )
  ); -- Only internal users (admins) can update

-- RLS Policies for onboarding_videos (public read, admin write)
CREATE POLICY "onboarding_videos_select" ON onboarding_videos
  FOR SELECT
  USING (true); -- Everyone can read videos

CREATE POLICY "onboarding_videos_insert" ON onboarding_videos
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.internal_role IS NOT NULL
    )
  ); -- Only internal users (admins) can insert

CREATE POLICY "onboarding_videos_update" ON onboarding_videos
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.internal_role IS NOT NULL
    )
  ); -- Only internal users (admins) can update

-- RLS Policies for onboarding_progress (users can only see/update their own progress)
CREATE POLICY "onboarding_progress_select" ON onboarding_progress
  FOR SELECT
  USING (auth.uid() = user_id); -- Users can only see their own progress

CREATE POLICY "onboarding_progress_insert" ON onboarding_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id); -- Users can only insert their own progress

CREATE POLICY "onboarding_progress_update" ON onboarding_progress
  FOR UPDATE
  USING (auth.uid() = user_id); -- Users can only update their own progress

-- Add comments for documentation
COMMENT ON TABLE onboarding_modules IS 'Onboarding course modules containing groups of videos';
COMMENT ON TABLE onboarding_videos IS 'Individual onboarding videos that users must watch';
COMMENT ON TABLE onboarding_progress IS 'Tracks user progress through onboarding videos';
COMMENT ON COLUMN profiles.onboarding_progress IS 'Percentage of onboarding videos completed (0-100)';
COMMENT ON COLUMN profiles.onboarding_completed IS 'Whether user has completed all onboarding videos';
COMMENT ON COLUMN profiles.onboarding_completed_at IS 'Timestamp when user completed all onboarding videos';

