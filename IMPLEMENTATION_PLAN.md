# VORAX - 3-Month Implementation Plan

## Month 1: Core Features Completion

### Week 1-2: Background Music Integration
**Goal**: Complete the background music feature end-to-end

**Frontend** (Done)
- [x] `src/lib/music.ts` - Music service library ✅
- [x] `src/components/wizard/StepMusic.tsx` - Music selection UI ✅
- [x] Updated NewProject wizard ✅

**Backend Needed**:
- [ ] Create Supabase edge function: `generate-music`
- [ ] Integrate with free music API (Pixabay, Free Music Archive)
- [ ] Add music mixing with voiceover
- [ ] Store music selection in project

**File to create**: `ai-content-creator-hub/supabase/functions/generate-music/index.ts`

### Week 3-4: Thumbnail Generation
**Goal**: Auto-generate eye-catching thumbnails

**Frontend** (Framework done)
- [x] `src/lib/thumbnails.ts` - Thumbnail service ✅

**Backend Needed**:
- [ ] Create thumbnail generation function using Stability AI or Replicate
- [ ] Generate 3-5 thumbnail options per video
- [ ] Add thumbnail selection to wizard (after video generation)

### Week 5-6: YouTube Data API Integration
**Goal**: Connect real YouTube analytics

**Backend Needed**:
- [ ] Create `youtube-analytics` edge function
- [ ] Implement OAuth flow for YouTube
- [ ] Fetch: views, watch time, subscribers, revenue
- [ ] Update Analytics page to show real data

### Week 7-8: Testing & Bug Fixes
**Goal**: Stabilize core features

- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Fix all critical bugs
- [ ] Performance optimization

---

## Month 2: Multi-Platform Publishing

### Week 9-10: Instagram & TikTok Support
**Goal**: Publish to multiple platforms

**Backend Needed**:
- [ ] Create `publish-instagram` function
- [ ] Create `publish-tiktok` function
- [ ] Handle video format conversion (9:16 for Reels/TikTok)
- [ ] Add platform selection to wizard

### Week 11-12: LinkedIn & Twitter
**Goal**: Complete multi-platform support

- [ ] LinkedIn Video API integration
- [ ] Twitter/X Video upload
- [ ] Unified scheduling system
- [ ] Cross-platform analytics

---

## Month 3: Scale & Launch

### Week 13-14: Team Features
**Goal**: Support teams and agencies

**Database Changes**:
- [ ] Create `teams` table
- [ ] Create `team_members` table
- [ ] Add team management in settings
- [ ] Shared project library

### Week 15-16: Developer API
**Goal**: Enable automation

**Backend Needed**:
- [ ] API key management
- [ ] RESTful endpoints for:
  - Project CRUD
  - Video generation
  - Analytics fetch
- [ ] Rate limiting
- [ ] API documentation

### Week 17-18: Performance & Launch
**Goal**: Production ready

- [ ] Caching layer (Redis)
- [ ] CDN for media files
- [ ] Monitoring & alerts
- [ ] Load testing
- [ ] Production deployment
- [ ] Marketing launch

---

## Critical Files to Create/Modify

### Backend Edge Functions Needed

```
supabase/functions/
├── generate-music/        # NEW - Background music
├── generate-thumbnail/    # NEW - AI thumbnails  
├── youtube-analytics/     # NEW - Real analytics
├── publish-instagram/     # NEW - IG publishing
├── publish-tiktok/        # NEW - TikTok publishing
├── publish-linkedin/      # NEW - LinkedIn publishing
└── developer-api/         # NEW - REST API
```

### Database Schema Changes

```sql
-- Teams (Month 3)
CREATE TABLE teams (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP
);

CREATE TABLE team_members (
  team_id UUID REFERENCES teams(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT DEFAULT 'member',
  PRIMARY KEY (team_id, user_id)
);

-- Music library (Month 1)
ALTER TABLE projects ADD COLUMN music_track TEXT;
ALTER TABLE projects ADD COLUMN music_volume INT DEFAULT 30;

-- Thumbnails (Month 1)
ALTER TABLE projects ADD COLUMN thumbnail_url TEXT;
```

---

## Quick Wins This Week

### 1. Complete Background Music (Est: 2 hours)
```typescript
// supabase/functions/generate-music/index.ts
// - Use Pixabay API (free, no auth needed)
// - Return music URL
// - Support trimming to video length
```

### 2. Simple Thumbnail (Est: 3 hours)
```typescript
// supabase/functions/generate-thumbnail/index.ts
// - Use Pexels to search related images
// - Overlay video title on image
// - Return 3 thumbnail options
```

### 3. YouTube Analytics (Est: 4 hours)
```typescript
// supabase/functions/youtube-analytics/index.ts
// - Use YouTube Data API v3
// - Fetch channel statistics
// - Return real numbers to frontend
```

---

## Resources Needed

### External APIs to Sign Up
| API | Purpose | Cost | Time |
|-----|---------|------|------|
| Pixabay | Music | FREE | 30 min |
| Stability AI | Thumbnails | $20/mo | 1 day |
| YouTube Data API | Analytics | FREE | 3 days |
| Instagram Graph API | Publishing | FREE | 1 week |
| TikTok API | Publishing | FREE | 1 week |

### Development Time Estimate
| Feature | Hours |
|---------|-------|
| Background Music | 8 |
| Thumbnails | 12 |
| YouTube Analytics | 16 |
| Instagram Publishing | 20 |
| TikTok Publishing | 20 |
| Team Features | 24 |
| Developer API | 16 |
| Testing & Polish | 24 |
| **Total** | **140 hours** |

---

## Next Immediate Action

Start with **Background Music Backend**:

1. Create `supabase/functions/generate-music/index.ts`
2. Use Pixabay API (free) for music search
3. Return audio URL to frontend
4. Update frontend to play selected music

Would you like me to create the background music edge function now?
