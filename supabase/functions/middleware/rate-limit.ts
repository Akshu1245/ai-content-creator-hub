// supabase/functions/middleware/rate-limit.ts
// Rate limiting middleware for Supabase Edge Functions
// Uses in-memory store - for production, use Redis

// Rate limit configuration
const RATE_LIMITS: Record<string, { requests: number; window: number }> = {
  // Default: 100 requests per minute
  default: { requests: 100, window: 60000 },
  
  // Generative endpoints - more restrictive (costly operations)
  generate: { requests: 10, window: 60000 },
  "generate-script": { requests: 20, window: 60000 },
  "generate-video": { requests: 5, window: 60000 },
  "generate-voice": { requests: 20, window: 60000 },
  "generate-music": { requests: 30, window: 60000 },
  "generate-thumbnail": { requests: 20, window: 60000 },
  
  // Analytics and data - can be more lenient
  analytics: { requests: 60, window: 60000 },
  "youtube-analytics": { requests: 60, window: 60000 },
  
  // Publishing - important operations
  publish: { requests: 10, window: 60000 },
  "publish-instagram": { requests: 10, window: 60000 },
  "publish-tiktok": { requests: 10, window: 60000 },
  
  // Free tier limits
  free: { requests: 50, window: 60000 },
}

// In-memory store (resets on function cold start)
// For production, integrate with Redis
const requestCounts = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  limit: number
}

export function checkRateLimit(
  identifier: string,
  endpoint: string = 'default'
): RateLimitResult {
  const now = Date.now()
  
  // Determine which limit to apply
  let limit = RATE_LIMITS.default
  
  // Check specific endpoint first
  if (RATE_LIMITS[endpoint]) {
    limit = RATE_LIMITS[endpoint]
  } else if (endpoint.includes('generate')) {
    limit = RATE_LIMITS.generate
  } else if (endpoint.includes('publish')) {
    limit = RATE_LIMITS.publish
  }
  
  const key = `${identifier}:${endpoint}`
  const record = requestCounts.get(key)
  
  // Clean up old entries periodically
  if (requestCounts.size > 10000) {
    cleanupOldEntries(now)
  }
  
  if (!record || now > record.resetTime) {
    // New window
    const resetTime = now + limit.window
    requestCounts.set(key, { count: 1, resetTime })
    
    return {
      allowed: true,
      remaining: limit.requests - 1,
      resetTime,
      limit: limit.requests
    }
  }
  
  if (record.count >= limit.requests) {
    // Rate limited
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      limit: limit.requests
    }
  }
  
  // Increment count
  record.count++
  requestCounts.set(key, record)
  
  return {
    allowed: true,
    remaining: limit.requests - record.count,
    resetTime: record.resetTime,
    limit: limit.requests
  }
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  }
}

function cleanupOldEntries(now: number): void {
  const toDelete: string[] = []
  
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      toDelete.push(key)
    }
  }
  
  toDelete.forEach(key => requestCounts.delete(key))
}

// Example usage in an edge function:
// import { checkRateLimit, getRateLimitHeaders } from "../middleware/rate-limit.ts"
//
// serve(async (req) => {
//   const userId = req.headers.get("Authorization") || "anonymous"
//   const result = checkRateLimit(userId, "generate-script")
//   
//   if (!result.allowed) {
//     return new Response("Rate limit exceeded", {
//       status: 429,
//       headers: {
//         ...getRateLimitHeaders(result),
//         "Retry-After": Math.ceil((result.resetTime - Date.now()) / 1000).toString()
//       }
//     })
//   }
//   
//   // ... rest of handler
// })
