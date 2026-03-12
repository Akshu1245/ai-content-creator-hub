-- =============================================================================
-- VORAX Credit System Tables
-- =============================================================================

-- Add credits and plan columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';

-- Create credit transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'purchase', 'bonus')),
  feature TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for credit_transactions
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" 
  ON credit_transactions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" 
  ON credit_transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user 
ON credit_transactions(user_id, created_at DESC);

-- Seed default credits for existing users (10 free credits)
UPDATE profiles 
SET credits = 10 
WHERE credits = 0;

-- Grant permissions
GRANT SELECT, INSERT ON credit_transactions TO service_role;
GRANT UPDATE (credits, plan) ON profiles TO service_role;
