-- Migration: Ensure Free and Pro plans are active and visible
-- Date: 2025-12-17

UPDATE subscription_plans
SET active = true, is_public = true, updated_at = NOW()
WHERE slug IN ('free', 'pro');

-- Log
DO $$
BEGIN
  RAISE NOTICE 'Migration 011_ensure_free_pro_active: Free/Pro set active & public';
END $$;

