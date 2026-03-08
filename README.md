# FacelessForge AI

**Create. Comply. Dominate.**

AI-powered faceless video creation platform with built-in YouTube monetization compliance scoring.

---

## 🏗️ Architecture

| Layer | Stack |
|-------|-------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| UI Components | shadcn/ui (Radix primitives) |
| Backend | Lovable Cloud (Supabase Edge Functions) |
| Database | Supabase (PostgreSQL) |
| AI Script | Google Gemini 2.5 Flash (direct API) |
| Market Research | Google Gemini 2.5 Flash + Google Search Grounding |
| Voice Generation | Sarvam AI (Bulbul v3 TTS) |
| Video Generation | Kling AI (text-to-video) |
| Stock Media | Pexels API (free photos & videos) |
| Auto Captions | Google Gemini + Search (platform-specific SEO) |

---

## 🔑 API Keys & Secrets

| Secret Name | Service | Purpose |
|-------------|---------|---------|
| `GEMINI_API_KEY` | Google AI | Script generation + market research + captions |
| `SARVAM_API_KEY` | Sarvam AI | Text-to-speech with 6 unique voices |
| `KLING_ACCESS_KEY` | Kling AI | Video generation (JWT auth) |
| `KLING_SECRET_KEY` | Kling AI | Video generation (JWT signing) |
| `PEXELS_API_KEY` | Pexels | Free stock photos & videos |
| `LOVABLE_API_KEY` | Lovable Cloud | Auto-provisioned |

---

## 📁 Edge Functions

### `generate-script`
- **API**: Google Gemini 2.5 Flash (direct)
- **Input**: `{ niche, topic }`
- **Output**: `{ script }` — structured video script with HOOK, SECTIONS, CTA, OUTRO

### `market-research`
- **API**: Google Gemini 2.5 Flash + Google Search Grounding
- **Input**: `{ niche, topic }`
- **Output**: `{ research, sources }` — trend score, search volume, competitors, content gaps, audience insights
- **Features**: Real-time internet search via Gemini's `google_search` tool, returns grounded sources with URLs

### `generate-voice`
- **API**: Sarvam AI (Bulbul v3)
- **Input**: `{ text, speaker, speed }`
- **Output**: `{ audio_base64, request_id, speaker }`
- **Voice Mapping**:
  - Marcus → `shubh` (deep, authoritative)
  - Sophia → `anushka` (warm, engaging)
  - Atlas → `ratan` (classic documentary)
  - Nova → `meera` (young, energetic)
  - Leo → `amit` (calm, educational)
  - Zara → `advika` (professional, clear)

### `generate-video`
- **API**: Kling AI (official)
- **Input**: `{ action: 'create'|'query', prompt?, task_id?, duration?, aspect_ratio? }`
- **Output**: `{ task_id, status, video_url }`
- **Auth**: JWT token signed with HMAC-SHA256 using access_key/secret_key

### `compliance-check` / `compliance-fix` / `copyright-scan`
- YouTube policy compliance checking and auto-fixing

### `stock-media`
- **API**: Pexels (free)
- **Input**: `{ query, type: 'photos'|'videos', per_page, orientation }`
- **Output**: `{ type, results, total }` — normalized photos/videos with download URLs

### `generate-captions`
- **API**: Google Gemini 2.5 Flash + Google Search
- **Input**: `{ script, topic, niche, platforms }`
- **Output**: `{ captions }` — platform-specific titles, descriptions, hashtags, tags for YouTube, Instagram, TikTok, Shorts

---

## 📄 Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Index.tsx` | Landing page with hero, features, pricing |
| `/dashboard` | `Dashboard.tsx` | Project overview dashboard |
| `/new-project` | `NewProject.tsx` | 8-step video creation wizard |
| `/analytics` | `Analytics.tsx` | Channel analytics |
| `/settings` | `Settings.tsx` | Account, API connections, billing |
| `/project/:id` | `ProjectDetail.tsx` | Individual project details |

---

## 🧙 Video Creation Wizard (8 Steps)

### Step 1: Niche Selection (`StepNiche.tsx`)
- 10 preset niches · Suggested trending topics · Revenue estimator · Custom topic input

### Step 2: Trend Intelligence (`StepTrends.tsx`) — **LIVE**
- Gemini + Google Search grounding for real-time market research
- Trend score, search volume, competition, competitors, content gaps, audience insights

### Step 3: Script Generation (`StepScript.tsx`) — **LIVE**
- AI-generated via Gemini 2.5 Flash · Structured sections · Editable

### Step 4: Voice & Style (`StepVoice.tsx`) — **LIVE**
- 6 unique AI voices via Sarvam AI · Real audio preview · 4 visual styles

### Step 5: Stock Media (`StepMedia.tsx`) — **LIVE**
- Pexels API search for B-roll photos & videos
- Grid selection UI · Quick topic-based suggestions

### Step 6: Compliance Review (`StepCompliance.tsx`)
- YouTube policy check · Copyright scan · Auto-fix

### Step 7: Auto Captions (`StepCaptions.tsx`) — **LIVE**
- Gemini generates platform-specific captions, titles, descriptions, hashtags
- Copy-to-clipboard for YouTube, Instagram, TikTok, Shorts
- SEO optimized with trending formats

### Step 8: Publish (`StepPublish.tsx`)
- Platform selection · Scheduling

---

## 🎨 Design System

**Aesthetic**: Editorial magazine / warm earth tones
- **Primary**: Terracotta · **Accent**: Sage green · **Highlight**: Ochre/gold
- **Background**: Deep charcoal
- **Fonts**: Syne (headings) + Inter (body)

---

## 🚀 Video Generation Pipeline

1. User completes 8-step wizard → clicks "Launch Video"
2. **Phase 1**: Sarvam AI generates voiceover from script
3. **Phase 2**: Kling AI generates video from topic + style prompt
4. Polls Kling every 5s until ready (max 5 min timeout)
5. Video plays inline · Download video + audio-only

---

## ✅ Pipeline Status

| Step | Feature | Status | API |
|------|---------|--------|-----|
| 1 | Niche Selection | ✅ Working | — (local) |
| 2 | Market Research | ✅ LIVE | Gemini + Google Search |
| 3 | Script Generation | ✅ LIVE | Gemini 2.5 Flash |
| 4 | Voice Preview | ✅ LIVE | Sarvam AI (6 voices) |
| 5 | Stock Media | ✅ LIVE | Pexels API |
| 6 | Compliance Check | ✅ LIVE | Gemini |
| 7 | Auto Captions | ✅ LIVE | Gemini + Search |
| 8 | Publish Config | ✅ Working | — (local) |
| — | Video Generation | ✅ LIVE | Kling AI |
| — | Voiceover Generation | ✅ LIVE | Sarvam AI |
| — | Video Download | ✅ Working | Direct URL |
| — | Audio Download | ✅ Working | Base64 WAV |
| — | Built-in Video Editor | ✅ LIVE | AI Auto-Edit (Gemini) |
| — | Real Video Export | ✅ LIVE | Canvas MediaRecorder |
| — | Audio-Video Merge | ✅ LIVE | Web Audio API |
| — | Multi-Clip Timeline | ✅ LIVE | Canvas + MediaRecorder |
| — | User Auth & Profiles | ✅ LIVE | Supabase Auth |
| — | Project Persistence | ✅ LIVE | PostgreSQL |
| — | Scheduling System | ✅ LIVE | PostgreSQL |
| — | Mobile Responsive | ✅ Working | CSS + Bottom Nav |
| — | Direct YouTube Upload | 🔲 Planned | YouTube Data API v3 |
| — | YouTube Analytics | 🔲 Planned | YouTube Analytics API |

---

## 📋 Changelog

### 2026-03-08 (Latest)
- ✅ Added user authentication (email signup/login) with auto-confirm
- ✅ Added user profiles (display name, bio, avatar) with RLS
- ✅ Added project persistence — projects saved to database
- ✅ Dashboard now shows real DB-backed projects with delete
- ✅ ProjectDetail page loads real project data with scheduled posts
- ✅ Real video export with Canvas MediaRecorder (burns text overlays)
- ✅ Audio-video merge (combines Sarvam voiceover + Kling video)
- ✅ Multi-clip timeline (arrange stock clips + generated video)
- ✅ Scheduling system (save scheduled posts per platform)
- ✅ Mobile responsive — bottom nav, hamburger menu, touch-friendly
- ✅ AI auto-edit for video editor (Gemini generates overlays + trim)
- ✅ Settings page with real profile editing
- ✅ Protected routes for all dashboard pages

### Previous
- Added Pexels stock media, auto-captions, 8-step wizard
- Integrated Sarvam AI TTS, Kling AI video, Gemini research
- Landing page, Dashboard, Analytics, Settings
- Compliance check & copyright scan edge functions

---

## Project Setup

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
```

Built with: Vite · TypeScript · React · shadcn/ui · Tailwind CSS
