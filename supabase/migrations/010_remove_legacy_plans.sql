-- Migration: Remove legacy plans (enterprise/premium/trial) and ensure Free/Pro shape
-- Date: 2025-12-17

-- Remove legacy plans entirely to avoid surface in UI/queries
DELETE FROM subscription_plans
WHERE slug IN ('enterprise', 'premium', 'trial');

-- Normalize Free plan content
UPDATE subscription_plans
SET
  description = 'Access to My Dashboard only',
  features = '["My Dashboard access", "Basic profile management", "View-only mode for locked features"]'::jsonb,
  key_pointers = NULL,
  display_order = 1,
  updated_at = NOW()
WHERE slug = 'free';

-- Normalize Pro plan content
UPDATE subscription_plans
SET
  description = 'Full access to all platform features',
  price_monthly = 2999,
  price_annual = 29990,
  price_yearly = 29990,
  features = '["Full platform access", "Product Hunt & Winning Products", "Competitor Stores analysis", "AI Toolkit suite", "AI Studio tools", "Shipping Calculator", "Private Suppliers", "Academy & Intelligence", "Priority support", "Export capabilities"]'::jsonb,
  key_pointers = 'Full access to everything',
  popular = true,
  trial_days = 7,
  display_order = 2,
  updated_at = NOW()
WHERE slug = 'pro';

-- Log
DO $$
BEGIN
  RAISE NOTICE 'Migration 010_remove_legacy_plans applied: legacy plans deleted, Free/Pro normalized';
END $$;

