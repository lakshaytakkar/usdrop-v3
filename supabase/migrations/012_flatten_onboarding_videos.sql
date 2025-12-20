-- Migration: Flatten Onboarding Videos and Add Video Source Support
-- Description: Adds video_source column to course_modules, flattens onboarding to 6 direct videos with YouTube embeds
-- Date: 2025-01-XX

-- Step 1: Add video_source column to course_modules table
ALTER TABLE course_modules
ADD COLUMN IF NOT EXISTS video_source TEXT DEFAULT 'upload' 
CHECK (video_source IN ('upload', 'embed'));

-- Add comment explaining video_source usage
COMMENT ON COLUMN course_modules.video_source IS 'Video source type: upload (stored in Supabase Storage) or embed (external URL like YouTube)';

-- Step 2: Update existing onboarding course modules to be video modules with YouTube embeds
-- The onboarding course ID is '00000000-0000-0000-0000-000000000001'
-- We'll update the 6 existing modules with YouTube embed URLs

UPDATE course_modules
SET 
  content_type = 'video',
  video_source = 'embed',
  video_url = CASE 
    WHEN order_index = 1 THEN 'https://www.youtube-nocookie.com/embed/F5RKz5T7hxk?theme=light'
    WHEN order_index = 2 THEN 'https://www.youtube-nocookie.com/embed/p1TF_dUDYiQ?theme=light'
    WHEN order_index = 3 THEN 'https://www.youtube-nocookie.com/embed/G-Pxxthwutg?theme=light'
    WHEN order_index = 4 THEN 'https://www.youtube-nocookie.com/embed/orHv5DDJKxg?theme=light'
    WHEN order_index = 5 THEN 'https://www.youtube-nocookie.com/embed/MMui2jaN9RM?theme=light'
    WHEN order_index = 6 THEN NULL -- Leave 6th video empty for now
    ELSE video_url
  END,
  updated_at = NOW()
WHERE course_id = '00000000-0000-0000-0000-000000000001'
  AND order_index BETWEEN 1 AND 6;

-- Note: The 6th video (order_index = 6) will have video_url = NULL and can be set later
-- When a video is uploaded manually, video_source should be set to 'upload' and video_storage_path should be populated

