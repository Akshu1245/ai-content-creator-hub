-- =============================================================================
-- VORAX Database Performance Optimizations
-- Run this in Supabase SQL Editor to improve performance for 100+ users
-- =============================================================================

-- 1. CREATE INDEXES FOR PROJECTS TABLE (Critical for query performance)
-- -----------------------------------------------------------------------------

-- Index for fetching user's projects quickly
CREATE INDEX IF NOT EXISTS idx_projects_user_id 
ON projects(user_id);

-- Index for filtering by status (filtering is common)
CREATE INDEX IF NOT EXISTS idx_projects_status 
ON projects(status);

-- Index for sorting by creation date (most recent first)
CREATE INDEX IF NOT EXISTS idx_projects_created_at 
ON projects(created_at DESC);

-- Composite index for user + status queries
CREATE INDEX IF NOT EXISTS idx_projects_user_status 
ON projects(user_id, status);

-- Index for niche-based filtering
CREATE INDEX IF NOT EXISTS idx_projects_niche 
ON projects(niche);


-- 2. CREATE INDEXES FOR SCHEDULED_POSTS TABLE
-- -----------------------------------------------------------------------------

-- Index for fetching posts by project
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_project 
ON scheduled_posts(project_id);

-- Index for fetching posts scheduled for a time range
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_at 
ON scheduled_posts(scheduled_at);

-- Composite index for platform + status
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_platform_status 
ON scheduled_posts(platform, status);

-- Index for user's scheduled posts
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user 
ON scheduled_posts(user_id, scheduled_at);


-- 3. CREATE INDEXES FOR USER_INTEGRATIONS TABLE
-- -----------------------------------------------------------------------------

-- Index for finding user's integration by provider
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_provider 
ON user_integrations(user_id, provider);

-- Index for finding integration by external ID
CREATE INDEX IF NOT EXISTS idx_user_integrations_external_id 
ON user_integrations(external_id);


-- 4. CREATE INDEXES FOR PROFILES TABLE
-- -----------------------------------------------------------------------------

-- Index for profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_id 
ON profiles(id);

-- Index for username searches
CREATE INDEX IF NOT EXISTS idx_profiles_username 
ON profiles(username) 
WHERE username IS NOT NULL;


-- 5. ANALYZE TABLES (Update statistics for query planner)
-- -----------------------------------------------------------------------------

ANALYZE projects;
ANALYZE scheduled_posts;
ANALYZE user_integrations;
ANALYZE profiles;


-- 6. ENABLE ROW LEVEL SECURITY OPTIMIZATIONS
-- -----------------------------------------------------------------------------

-- Create a function to efficiently check project ownership
CREATE OR REPLACE FUNCTION check_project_owner(p_project_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM projects 
    WHERE id = p_project_id AND user_id = p_user_id
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;


-- 7. CACHE TABLE FOR OFTEN-READ DATA
-- -----------------------------------------------------------------------------

-- Create a cache table for expensive query results
CREATE TABLE IF NOT EXISTS query_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL,
  cached_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  hit_count INT DEFAULT 0
);

-- Index for cache lookups
CREATE INDEX IF NOT EXISTS idx_query_cache_key 
ON query_cache(cache_key);

-- Index for finding expired entries
CREATE INDEX IF NOT EXISTS idx_query_cache_expires 
ON query_cache(expires_at) 
WHERE expires_at > NOW();

-- Function to get or set cache
CREATE OR REPLACE FUNCTION get_cached_result(
  p_cache_key TEXT, 
  p_ttl_seconds INT DEFAULT 300
)
RETURNS JSONB AS $$
  DECLARE
    v_result JSONB;
  BEGIN
    -- Try to get from cache
    SELECT cached_data INTO v_result
    FROM query_cache
    WHERE cache_key = p_cache_key 
      AND expires_at > NOW();
    
    IF v_result IS NOT NULL THEN
      -- Increment hit count
      UPDATE query_cache 
      SET hit_count = hit_count + 1 
      WHERE cache_key = p_cache_key;
      
      RETURN v_result;
    END IF;
    
    RETURN NULL;
  END;
$$ LANGUAGE plpgsql STABLE;

-- Function to set cache
CREATE OR REPLACE FUNCTION set_cached_result(
  p_cache_key TEXT, 
  p_data JSONB, 
  p_ttl_seconds INT DEFAULT 300
)
RETURNS VOID AS $$
  BEGIN
    INSERT INTO query_cache (cache_key, cached_data, expires_at)
    VALUES (p_cache_key, p_data, NOW() + (p_ttl_seconds || ' seconds')::INTERVAL)
    ON CONFLICT (cache_key) DO UPDATE
    SET cached_data = p_data,
        expires_at = NOW() + (p_ttl_seconds || ' seconds')::INTERVAL,
        hit_count = query_cache.hit_count + 1;
  END;
$$ LANGUAGE plpgsql;


-- 8. MONITORING - Create function to get table sizes
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_table_stats()
RETURNS TABLE(
  table_name TEXT,
  row_count BIGINT,
  total_size TEXT,
  index_size TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.relname::TEXT,
    n_live_tup::BIGINT,
    pg_size_pretty(pg_total_relation_size(c.oid))::TEXT,
    pg_size_pretty(pg_indexes_size(c.oid))::TEXT
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  LEFT JOIN pg_stat_user_tables s ON s.relid = c.oid
  WHERE n.nspname = 'public'
    AND c.relkind = 'r'
  ORDER BY pg_total_relation_size(c.oid) DESC;
END;
$$ LANGUAGE plpgsql STABLE;


-- 9. AUTO-CLEANUP - Scheduled job to clean expired cache
-- -----------------------------------------------------------------------------

-- Note: Requires pg_cron extension (available on Supabase Pro)
-- Uncomment if using Supabase Pro:
-- SELECT cron.schedule(
--   'cleanup-expired-cache',
--   '*/5 * * * *',
--   $$DELETE FROM query_cache WHERE expires_at < NOW()$$
-- );


-- =============================================================================
-- AFTER RUNNING THIS SCRIPT:
-- 1. Test your queries to ensure they use the new indexes
-- 2. Monitor performance with: SELECT * FROM get_table_stats();
-- 3. Check for slow queries in Supabase dashboard
-- =============================================================================
