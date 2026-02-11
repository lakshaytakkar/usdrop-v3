-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) DEFAULT 0,
  price_yearly DECIMAL(10,2) DEFAULT 0,
  price_annual DECIMAL(10,2),
  features JSONB DEFAULT '[]',
  key_pointers JSONB,
  popular BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  trial_days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  username VARCHAR(100),
  full_name VARCHAR(255),
  avatar_url TEXT,
  subscription_plan_id UUID REFERENCES subscription_plans(id),
  subscription_status VARCHAR(50),
  subscription_started_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  account_type VARCHAR(50) DEFAULT 'free',
  internal_role VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_trial BOOLEAN DEFAULT false,
  trial_ends_at TIMESTAMPTZ,
  credits INTEGER DEFAULT 0,
  phone_number VARCHAR(50),
  ecommerce_experience VARCHAR(100),
  preferred_niche VARCHAR(100),
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMPTZ,
  onboarding_progress INTEGER DEFAULT 0
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  thumbnail TEXT,
  parent_category_id UUID REFERENCES categories(id),
  trending BOOLEAN DEFAULT false,
  product_count INTEGER DEFAULT 0,
  avg_profit_margin DECIMAL(10,2) DEFAULT 0,
  growth_percentage DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  image TEXT,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  buy_price DECIMAL(10,2),
  sell_price DECIMAL(10,2),
  profit_per_order DECIMAL(10,2),
  additional_images JSONB DEFAULT '[]',
  specifications JSONB,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  trend_data JSONB DEFAULT '[]',
  supplier_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Source
CREATE TABLE IF NOT EXISTS product_source (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source_type VARCHAR(100),
  source_id TEXT,
  standardized_at TIMESTAMPTZ,
  standardized_by VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Metadata
CREATE TABLE IF NOT EXISTS product_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  is_winning BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  unlock_price DECIMAL(10,2),
  profit_margin DECIMAL(10,2),
  pot_revenue DECIMAL(12,2),
  revenue_growth_rate DECIMAL(10,2),
  items_sold INTEGER DEFAULT 0,
  avg_unit_price DECIMAL(10,2),
  revenue_trend JSONB DEFAULT '[]',
  found_date TIMESTAMPTZ,
  detailed_analysis JSONB,
  filters JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Research
CREATE TABLE IF NOT EXISTS product_research (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  competitor_pricing JSONB,
  seasonal_demand TEXT,
  audience_targeting JSONB,
  supplier_notes TEXT,
  social_proof JSONB,
  research_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  website TEXT,
  country VARCHAR(100),
  rating DECIMAL(3,2) DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  shipping_time VARCHAR(100),
  min_order_quantity INTEGER DEFAULT 1,
  contact_email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add supplier FK to products
-- ALTER TABLE products ADD CONSTRAINT fk_products_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id);

-- Competitor Stores
CREATE TABLE IF NOT EXISTS competitor_stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  url TEXT,
  logo TEXT,
  category_id UUID REFERENCES categories(id),
  country VARCHAR(100),
  monthly_traffic INTEGER DEFAULT 0,
  monthly_revenue DECIMAL(12,2) DEFAULT 0,
  growth DECIMAL(10,2) DEFAULT 0,
  products_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shopify Stores
CREATE TABLE IF NOT EXISTS shopify_stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  shop_domain VARCHAR(255) NOT NULL,
  access_token TEXT,
  store_name VARCHAR(255),
  store_email VARCHAR(255),
  plan VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE,
  description TEXT,
  instructor_id UUID REFERENCES profiles(id),
  thumbnail TEXT,
  duration_minutes INTEGER DEFAULT 0,
  lessons_count INTEGER DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  category VARCHAR(100),
  level VARCHAR(50),
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  tags JSONB DEFAULT '[]',
  learning_objectives JSONB DEFAULT '[]',
  prerequisites JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_onboarding BOOLEAN DEFAULT false
);

-- Course Modules
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  thumbnail TEXT,
  order_index INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  content_type VARCHAR(50) DEFAULT 'video',
  content JSONB DEFAULT '{}',
  video_url TEXT,
  video_storage_path TEXT,
  video_duration INTEGER,
  video_source VARCHAR(50) DEFAULT 'upload'
);

-- Onboarding Modules
CREATE TABLE IF NOT EXISTS onboarding_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  thumbnail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding Videos
CREATE TABLE IF NOT EXISTS onboarding_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES onboarding_modules(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  video_url TEXT,
  video_duration INTEGER DEFAULT 0,
  thumbnail TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding Progress
CREATE TABLE IF NOT EXISTS onboarding_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES onboarding_videos(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  watch_time INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- User Picklist
CREATE TABLE IF NOT EXISTS user_picklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  shopify_store_id UUID REFERENCES shopify_stores(id),
  order_number VARCHAR(100),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10,2),
  shipping_address JSONB,
  tracking_number VARCHAR(255),
  tracking_url TEXT,
  supplier_order_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions (for JWT auth)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_internal_role ON profiles(internal_role);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_product_metadata_product ON product_metadata(product_id);
CREATE INDEX IF NOT EXISTS idx_product_source_product ON product_source(product_id);
CREATE INDEX IF NOT EXISTS idx_product_research_product ON product_research(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_course_modules_course ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_videos_module ON onboarding_videos(module_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user ON onboarding_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_picklist_user ON user_picklist(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_competitor_stores_category ON competitor_stores(category_id);
CREATE INDEX IF NOT EXISTS idx_shopify_stores_user ON shopify_stores(user_id);
