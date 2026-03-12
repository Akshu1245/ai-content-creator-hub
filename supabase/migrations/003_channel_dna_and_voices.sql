-- =============================================================================
-- VORAX Channel DNA and Voice Tables
-- =============================================================================

-- 1. Channel DNA Table - Stores user's channel learning
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS channel_dna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  niche TEXT DEFAULT 'general',
  tone TEXT DEFAULT 'professional',
  topics TEXT[] DEFAULT '{}',
  style TEXT DEFAULT 'modern',
  avg_duration INTEGER DEFAULT 300,
  voice_type TEXT DEFAULT 'female',
  music_preference TEXT DEFAULT 'upbeat',
  caption_style TEXT DEFAULT 'modern',
  posting_frequency TEXT DEFAULT 'daily',
  best_days TEXT[] DEFAULT ARRAY['Saturday', 'Sunday'],
  best_times TEXT[] DEFAULT ARRAY['09:00', '12:00', '18:00'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for channel_dna
ALTER TABLE channel_dna ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own channel DNA" 
  ON channel_dna FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own channel DNA" 
  ON channel_dna FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own channel DNA" 
  ON channel_dna FOR UPDATE 
  USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_channel_dna_user ON channel_dna(user_id);


-- 2. User Voices Table - Stores cloned voices
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_voices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  voice_name TEXT NOT NULL,
  voice_id TEXT NOT NULL,
  voice_type TEXT DEFAULT 'cloned',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, voice_id)
);

-- RLS for user_voices
ALTER TABLE user_voices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own voices" 
  ON user_voices FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own voices" 
  ON user_voices FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own voices" 
  ON user_voices FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own voices" 
  ON user_voices FOR DELETE 
  USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_voices_user ON user_voices(user_id);


-- 3. Affiliate Products Table (for affiliate suggester)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS affiliate_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2),
  commission_percent DECIMAL(5,2),
  commission_flat DECIMAL(10,2),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  niche TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed some default products
INSERT INTO affiliate_products (name, price, commission_percent, commission_flat, platform, url, category, niche) VALUES
('USB-C Hub', 49, 15, NULL, 'Amazon', 'https://amazon.in/example', 'accessories', ARRAY['tech', 'gaming']),
('Wireless Earbuds', 1999, 10, NULL, 'Amazon', 'https://amazon.in/example', 'audio', ARRAY['tech', 'lifestyle']),
('Yoga Mat', 699, 10, NULL, 'Amazon', 'https://amazon.in/example', 'fitness', ARRAY['lifestyle', 'health']),
('Gaming Headset', 2499, 10, NULL, 'Amazon', 'https://amazon.in/example', 'audio', ARRAY['gaming']),
('Online Course', 499, 30, NULL, 'Udemy', 'https://udemy.com/example', 'course', ARRAY['education']),
('Protein Powder', 1599, 15, NULL, 'Amazon', 'https://amazon.in/example', 'supplements', ARRAY['health']),
('Laptop Stand', 1499, 10, NULL, 'Amazon', 'https://amazon.in/example', 'accessories', ARRAY['tech', 'business']),
('Streaming Subscription', 299, NULL, 100, 'Referral', 'https://example.com/stream', 'subscription', ARRAY['entertainment'])
ON CONFLICT DO NOTHING;

-- RLS for affiliate_products (read-only for users)
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" 
  ON affiliate_products FOR SELECT 
  USING (is_active = true);


-- =============================================================================
-- AFTER RUNNING THIS SCRIPT:
-- 1. Users can now clone voices
-- 2. Channel DNA will learn from user videos
-- 3. Affiliate suggestions will work
-- =============================================================================
