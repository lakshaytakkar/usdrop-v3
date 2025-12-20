-- Migration: Simplify Subscription Plans
-- Description: Reduce plans to only Free and Pro tiers
-- Date: 2025-12-17
--
-- Changes:
-- 1. Deactivate Premium, Enterprise, and Trial plans (soft delete)
-- 2. Update Free plan description and features
-- 3. Update Pro plan with all features
-- 4. Migrate existing users on deactivated plans to Pro

-- Step 1: Deactivate Premium, Enterprise, and Trial plans
UPDATE subscription_plans 
SET 
  active = false,
  is_public = false,
  updated_at = NOW()
WHERE slug IN ('premium', 'enterprise', 'trial');

-- Step 2: Update Free plan - Dashboard access only
UPDATE subscription_plans 
SET 
  description = 'Access to My Dashboard only',
  features = '["My Dashboard access", "Basic profile management", "View-only mode for locked features"]'::jsonb,
  key_pointers = NULL,
  updated_at = NOW()
WHERE slug = 'free';

-- Step 3: Update Pro plan - Full platform access
UPDATE subscription_plans 
SET 
  description = 'Full access to all platform features',
  price_monthly = 2999, -- $29.99
  price_annual = 29990, -- $299.90
  price_yearly = 29990,
  features = '["Full platform access", "Product Hunt & Winning Products", "Competitor Stores analysis", "AI Toolkit suite", "AI Studio tools", "Shipping Calculator", "Private Suppliers", "Academy & Intelligence", "Priority support", "Export capabilities"]'::jsonb,
  key_pointers = 'Full access to everything',
  popular = true,
  trial_days = 7,
  updated_at = NOW()
WHERE slug = 'pro';

-- Step 4: Migrate users on Premium/Enterprise to Pro (they paid more, so upgrade them)
-- Get the Pro plan ID
DO $$
DECLARE
  pro_plan_id UUID;
BEGIN
  SELECT id INTO pro_plan_id FROM subscription_plans WHERE slug = 'pro' LIMIT 1;
  
  IF pro_plan_id IS NOT NULL THEN
    -- Migrate Premium users to Pro
    UPDATE profiles 
    SET 
      subscription_plan_id = pro_plan_id,
      updated_at = NOW()
    WHERE subscription_plan_id IN (
      SELECT id FROM subscription_plans WHERE slug IN ('premium', 'enterprise')
    );
    
    -- Migrate Trial users to Free (trial expired concept)
    UPDATE profiles 
    SET 
      subscription_plan_id = (SELECT id FROM subscription_plans WHERE slug = 'free' LIMIT 1),
      is_trial = false,
      updated_at = NOW()
    WHERE subscription_plan_id IN (
      SELECT id FROM subscription_plans WHERE slug = 'trial'
    );
  END IF;
END $$;

-- Step 5: Ensure display order is correct
UPDATE subscription_plans SET display_order = 1 WHERE slug = 'free';
UPDATE subscription_plans SET display_order = 2 WHERE slug = 'pro';

-- Log the migration
DO $$
BEGIN
  RAISE NOTICE 'Migration 009_simplify_subscription_plans completed successfully';
  RAISE NOTICE 'Plans simplified to: Free (dashboard only) and Pro (full access)';
END $$;

