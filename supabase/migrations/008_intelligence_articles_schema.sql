-- Migration: Intelligence Articles Schema
-- Description: Creates table for intelligence articles/blog posts
-- Date: 2025-12-16

-- Create intelligence_articles table
CREATE TABLE IF NOT EXISTS intelligence_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL, -- HTML content
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  featured_image TEXT NOT NULL,
  category TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  published_date DATE NOT NULL,
  read_time INTEGER NOT NULL, -- in minutes
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_intelligence_articles_slug ON intelligence_articles(slug);
CREATE INDEX IF NOT EXISTS idx_intelligence_articles_category ON intelligence_articles(category);
CREATE INDEX IF NOT EXISTS idx_intelligence_articles_featured ON intelligence_articles(featured);
CREATE INDEX IF NOT EXISTS idx_intelligence_articles_published_date ON intelligence_articles(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_intelligence_articles_tags ON intelligence_articles USING GIN(tags);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_intelligence_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_intelligence_articles_updated_at ON intelligence_articles;
CREATE TRIGGER update_intelligence_articles_updated_at
  BEFORE UPDATE ON intelligence_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_intelligence_articles_updated_at();

-- Enable Row Level Security
ALTER TABLE intelligence_articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read, admin write)
CREATE POLICY "intelligence_articles_select" ON intelligence_articles
  FOR SELECT
  USING (true); -- Everyone can read articles

CREATE POLICY "intelligence_articles_insert" ON intelligence_articles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.internal_role IS NOT NULL
    )
  ); -- Only internal users (admins) can insert

CREATE POLICY "intelligence_articles_update" ON intelligence_articles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.internal_role IS NOT NULL
    )
  ); -- Only internal users (admins) can update

CREATE POLICY "intelligence_articles_delete" ON intelligence_articles
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.internal_role IS NOT NULL
    )
  ); -- Only internal users (admins) can delete

-- Add comments for documentation
COMMENT ON TABLE intelligence_articles IS 'Intelligence articles/blog posts for USDrop platform';
COMMENT ON COLUMN intelligence_articles.slug IS 'URL-friendly unique identifier for the article';
COMMENT ON COLUMN intelligence_articles.content IS 'Full HTML content of the article';
COMMENT ON COLUMN intelligence_articles.tags IS 'Array of tags as JSONB for filtering and search';

