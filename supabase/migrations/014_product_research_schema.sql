-- Migration: Product Research Schema
-- Description: Creates table for storing AI-generated product research data including competitor pricing, seasonal demand, audience targeting, supplier notes, and social proof
-- Date: 2025-01-XX

-- Create product_research table
CREATE TABLE IF NOT EXISTS product_research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  competitor_pricing JSONB, -- {competitors: [{name, price, url}], price_range: {min, max, avg}}
  seasonal_demand TEXT, -- Summary of seasonal patterns
  audience_targeting JSONB, -- {demographics: {...}, interests: [...], suggestions: [...]}
  supplier_notes TEXT, -- Supplier/shipping/fulfillment insights
  social_proof JSONB, -- {likes, comments, shares, virality_score}
  research_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_research_product_id ON product_research(product_id);
CREATE INDEX IF NOT EXISTS idx_product_research_research_date ON product_research(research_date DESC);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_product_research_updated_at ON product_research;
CREATE TRIGGER update_product_research_updated_at
  BEFORE UPDATE ON product_research
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE product_research IS 'AI-generated research data for products including competitor analysis, market trends, and audience insights';
COMMENT ON COLUMN product_research.competitor_pricing IS 'JSONB object containing competitor names, prices, and price range analysis';
COMMENT ON COLUMN product_research.seasonal_demand IS 'Text summary of seasonal demand patterns and trends';
COMMENT ON COLUMN product_research.audience_targeting IS 'JSONB object containing demographics, interests, and targeting suggestions';
COMMENT ON COLUMN product_research.supplier_notes IS 'Text notes about suppliers, shipping, and fulfillment options';
COMMENT ON COLUMN product_research.social_proof IS 'JSONB object containing social media metrics and virality scores';

