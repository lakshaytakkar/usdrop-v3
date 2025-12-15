-- Comprehensive Course Seeding Script
-- This script inserts all courses from academy/data/courses.ts
-- Run this via Supabase MCP or Supabase CLI

-- Helper: Parse duration string to minutes
-- "8 hours" = 480, "45 min" = 45, "1h 30m" = 90

-- Course 1: Dropshipping Fundamentals (already inserted)
-- Course ID: e09cbc1b-291b-4a34-90b3-e01dfaa498ac

-- Insert remaining courses (2-10)
WITH inserted_courses AS (
  INSERT INTO courses (title, slug, description, instructor_id, thumbnail, duration_minutes, lessons_count, students_count, rating, price, category, level, featured, published, published_at, tags, learning_objectives, prerequisites)
  VALUES 
    ('Product Research & Discovery Mastery', 'product-research-discovery-mastery', 'Discover winning products using USDrop''s powerful research tools. Learn data-driven methods to find profitable products and build a successful product portfolio.', NULL, '/images/thumbnail-product-research.png', 600, 35, 3890, 4.7, 79, 'Research', 'Intermediate', false, true, NOW(), '["Product Research", "USDrop", "Analytics", "Trending"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
    ('Store Setup & Design Optimization', 'store-setup-design-optimization', 'Build a high-converting Shopify store from scratch. Learn design principles, UX best practices, and optimization techniques to maximize sales.', NULL, '/images/thumbnail-store-setup.png', 540, 32, 4234, 4.6, 69, 'Setup', 'Intermediate', false, true, NOW(), '["Shopify", "Store Design", "UX", "Conversion"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
    ('Supplier Management & Logistics', 'supplier-management-logistics', 'Master supplier relationships, shipping strategies, and order fulfillment. Learn to use USDrop''s supplier directory and shipping calculator effectively.', NULL, '/images/thumbnail-supplier-management.png', 420, 28, 3120, 4.7, 59, 'Operations', 'Intermediate', false, true, NOW(), '["Suppliers", "Logistics", "Fulfillment", "Shipping"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
    ('Financial Planning & Profitability', 'financial-planning-profitability', 'Master the financial side of dropshipping. Learn pricing strategies, use USDrop''s profit calculator, manage cash flow, and ensure long-term profitability.', NULL, '/images/thumbnail-financial-planning.png', 360, 24, 2780, 4.8, 69, 'Finance', 'Intermediate', false, true, NOW(), '["Pricing", "Profit", "Finance", "Calculator"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
    ('AI-Powered Marketing Tools', 'ai-powered-marketing-tools', 'Leverage USDrop''s AI Studio tools to create professional marketing assets. Master Image Studio, Model Studio, Brand Studio, and Ad Studio to scale your marketing.', NULL, '/images/thumbnail-ai-marketing.png', 480, 30, 3650, 4.9, 89, 'Marketing', 'Intermediate', false, true, NOW(), '["AI", "Marketing", "Automation", "Creative"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
    ('Advanced Facebook Ads & Campaign Management', 'advanced-facebook-ads-campaign-management', 'Master Facebook and Meta advertising to scale your dropshipping business. Learn to use Campaign Studio, optimize campaigns, and scale profitable ads.', NULL, '/images/thumbnail-advanced-facebook-ads.png', 720, 42, 4156, 4.9, 99, 'Marketing', 'Advanced', false, true, NOW(), '["Facebook", "Meta Ads", "Advertising", "Campaigns"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
    ('Store Research & Competitive Analysis', 'store-research-competitive-analysis', 'Learn to analyze competitor stores, estimate revenue, and identify winning strategies. Master USDrop''s store research tools to gain competitive intelligence.', NULL, '/images/thumbnail-store-research.png', 420, 26, 2890, 4.7, 79, 'Research', 'Intermediate', false, true, NOW(), '["Competitor Analysis", "Research", "Intelligence", "Analytics"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
    ('Scaling & Automation Strategies', 'scaling-automation-strategies', 'Take your dropshipping business to the next level. Learn when and how to scale, automate operations, expand product lines, and build a team.', NULL, '/images/thumbnail-scaling-automation.png', 600, 38, 2340, 4.8, 119, 'Growth', 'Advanced', false, true, NOW(), '["Automation", "Scaling", "Growth", "Operations"]'::jsonb, '[]'::jsonb, '[]'::jsonb),
    ('Legal Compliance & Business Operations', 'legal-compliance-business-operations', 'Ensure your dropshipping business is legally compliant. Learn about e-commerce laws, privacy policies, tax obligations, and international regulations.', NULL, '/images/thumbnail-legal-compliance.png', 360, 24, 1980, 4.6, 59, 'Operations', 'Intermediate', false, true, NOW(), '["Legal", "Compliance", "GDPR", "Tax"]'::jsonb, '[]'::jsonb, '[]'::jsonb)
  ON CONFLICT (slug) DO NOTHING
  RETURNING id, slug, title
)
SELECT * FROM inserted_courses;

-- Note: Modules and chapters will need to be inserted separately
-- This can be done programmatically or via additional SQL scripts

