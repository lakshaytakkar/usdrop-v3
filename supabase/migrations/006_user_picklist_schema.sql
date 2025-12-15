-- Migration: User Picklist Schema
-- Description: Creates table for users to save products to their personal picklist
-- Date: 2025-12-15

-- Create user_picklist table
CREATE TABLE IF NOT EXISTS user_picklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source TEXT NOT NULL DEFAULT 'product-hunt', -- 'product-hunt', 'winning-products', 'other'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure a user can only save a product once
  UNIQUE(user_id, product_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_picklist_user_id ON user_picklist(user_id);
CREATE INDEX IF NOT EXISTS idx_user_picklist_product_id ON user_picklist(product_id);
CREATE INDEX IF NOT EXISTS idx_user_picklist_source ON user_picklist(user_id, source);
CREATE INDEX IF NOT EXISTS idx_user_picklist_created_at ON user_picklist(user_id, created_at DESC);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_user_picklist_updated_at ON user_picklist;
CREATE TRIGGER update_user_picklist_updated_at
  BEFORE UPDATE ON user_picklist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_picklist ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see/manage their own picklist items
CREATE POLICY "user_picklist_select" ON user_picklist
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_picklist_insert" ON user_picklist
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_picklist_update" ON user_picklist
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "user_picklist_delete" ON user_picklist
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE user_picklist IS 'User personal picklist of saved products';
COMMENT ON COLUMN user_picklist.source IS 'Source of the product: product-hunt, winning-products, or other';
COMMENT ON COLUMN user_picklist.user_id IS 'Reference to the user who saved this product';
COMMENT ON COLUMN user_picklist.product_id IS 'Reference to the saved product';

