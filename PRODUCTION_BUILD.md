# VORAX - Production Build for 100+ Concurrent Users

## PERFORMANCE OPTIMIZATION STRATEGY

### 1. Frontend Optimizations (Vite + React)

```typescript
// vite.config.ts - Production optimizations
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['@radix-ui/react-*', 'lucide-react'],
          'vendor-charts': ['recharts'],
        }
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-query'],
  }
})
```

### 2. Caching Strategy (Critical for 100 users)

```typescript
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

// Implement Redis-like caching in Supabase Edge Functions
// Cache common API responses
```

### 3. Database Indexing (Critical)

```sql
-- Add to Supabase SQL Editor
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_project ON scheduled_posts(project_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_at ON scheduled_posts(scheduled_at);

-- Optimize profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
```

### 4. API Rate Limiting

```typescript
// supabase/functions/middleware/rate-limit.ts
const RATE_LIMIT = 100; // requests per minute
const userRequests = new Map<string, number[]>();

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const windowStart = now - 60000;
  
  const requests = userRequests.get(identifier) || [];
  const recentRequests = requests.filter(t => t > windowStart);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return false;
  }
  
  recentRequests.push(now);
  userRequests.set(identifier, recentRequests);
  return true;
}
```

---

## COMPLETE FEATURE IMPLEMENTATIONS

### 1. Background Music (Complete)

```typescript
// Update src/lib/music.ts to use edge function
export async function fetchMusicFromAPI(genre?: string, mood?: string) {
  const { data, error } = await supabase.functions.invoke('generate-music', {
    body: { action: 'list', genre, mood }
  });
  
  if (error) throw error;
  return data.tracks;
}
```

### 2. Thumbnail Generation

```typescript
// supabase/functions/generate-thumbnail/index.ts
// Uses Stability AI or Pexels
// Returns 3-5 thumbnail options
```

### 3. YouTube Analytics Real Data

```typescript
// supabase/functions/youtube-analytics/index.ts
// OAuth flow + Data API v3
// Returns: views, watchTime, subscribers, revenue
```

### 4. Multi-Platform Publishing

```typescript
// supabase/functions/publish-instagram/index.ts
// supabase/functions/publish-tiktok/index.ts
// supabase/functions/publish-linkedin/index.ts
```

---

## INFRASTRUCTURE FOR 100 USERS

### Required Upgrades

| Component | Current | Needed for 100 Users |
|-----------|---------|---------------------|
| Supabase Pro | $599/mo | $599/mo (enough) |
| API Caching | None | Redis $20/mo |
| Video Storage | 1GB | 100GB $50/mo |
| CDN | None | $50/mo |
| Workers | 1 | 5 parallel |

### Architecture Diagram

```
Users (100)
    ↓
CDN (Cloudflare - $50/mo)
    ↓
Vercel/Netlify Frontend
    ↓
Supabase (Auth + DB)
    ↓
Edge Functions (Video Processing)
    ↓
External APIs (OpenAI, Sarvam, etc.)
```

---

## COMPLETE FILE CHANGES NEEDED

### 1. vite.config.ts - Optimize
### 2. src/lib/api.ts - Add caching
### 3. src/lib/music.ts - Connect to edge function
### 4. Create: supabase/functions/generate-thumbnail/
### 5. Create: supabase/functions/youtube-analytics/
### 6. Create: supabase/functions/publish-instagram/
### 7. Create: supabase/functions/publish-tiktok/
### 8. Database: Add indexes
### 9. Create: Rate limiting middleware
### 10. Create: Redis caching layer

---

## QUICK START - Copy These Files

Let me create all the critical files now for production readiness.
