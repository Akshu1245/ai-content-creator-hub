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

---

## 🔑 API Keys & Secrets

| Secret Name | Service | Purpose |
|-------------|---------|---------|
| `GEMINI_API_KEY` | Google AI | Script generation + market research with Search grounding |
| `SARVAM_API_KEY` | Sarvam AI | Text-to-speech with 6 unique voices |
| `KLING_ACCESS_KEY` | Kling AI | Video generation (JWT auth) |
| `KLING_SECRET_KEY` | Kling AI | Video generation (JWT signing) |
| `LOVABLE_API_KEY` | Lovable Cloud | Auto-provisioned, used for AI gateway |

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

---

## 📄 Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Index.tsx` | Landing page with hero, features, pricing |
| `/dashboard` | `Dashboard.tsx` | Project overview dashboard |
| `/new-project` | `NewProject.tsx` | 6-step video creation wizard |
| `/analytics` | `Analytics.tsx` | Channel analytics |
| `/settings` | `Settings.tsx` | Account, API connections, billing |
| `/project/:id` | `ProjectDetail.tsx` | Individual project details |

---

## 🧙 Video Creation Wizard (6 Steps)

### Step 1: Niche Selection (`StepNiche.tsx`)
- 10 preset niches · Suggested trending topics · Revenue estimator · Custom topic input

### Step 2: Trend Intelligence (`StepTrends.tsx`) — **LIVE**
- Calls Gemini with Google Search grounding for real-time market research
- Trend score, search volume, competition, ideal length, best post time
- Competitor video analysis · Trending angles · Content gaps · Audience insights
- Key search terms · Cited web sources

### Step 3: Script Generation (`StepScript.tsx`) — **LIVE**
- AI-generated via Gemini 2.5 Flash · Structured sections · Editable

### Step 4: Voice & Style (`StepVoice.tsx`) — **LIVE**
- 6 unique AI voices via Sarvam AI · Real audio preview
- Fallback to Web Speech API · 4 visual styles · Speed control

### Step 5: Compliance Review (`StepCompliance.tsx`)
- YouTube policy check · Copyright scan · Auto-fix

### Step 6: Publish (`StepPublish.tsx`)
- Platform selection · Scheduling

---

## 🎨 Design System

**Aesthetic**: Editorial magazine / warm earth tones
- **Primary**: Terracotta · **Accent**: Sage green · **Highlight**: Ochre/gold
- **Background**: Deep charcoal
- **Fonts**: Syne (headings) + Inter (body)

---

## 🚀 Video Generation Pipeline

1. User completes 6-step wizard → clicks "Launch Video"
2. **Phase 1**: Sarvam AI generates voiceover from script
3. **Phase 2**: Kling AI generates video from topic + style prompt
4. Polls Kling every 5s until ready (max 5 min timeout)
5. Video plays inline · Download video + audio-only

---

## 📋 Changelog

### 2026-03-08
- ✅ Integrated Sarvam AI TTS with 6 unique speaker voices
- ✅ Integrated Kling AI for real video generation with JWT auth
- ✅ Added market research with Gemini + Google Search grounding (real internet data)
- ✅ StepTrends now shows live research: competitors, trends, gaps, sources
- ✅ Switched script generation to direct Gemini API (user's own key)
- ✅ Added video download + audio-only download
- ✅ Error handling, retry flows, loading states
- ✅ Created comprehensive README documentation

### Previous
- Landing page with editorial warm earth-tone design
- 6-step video creation wizard (UI)
- Dashboard, Analytics, Settings pages
- Compliance check & copyright scan edge functions
- Revenue estimator & differentiator components

---

## Project Setup

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
```

Built with: Vite · TypeScript · React · shadcn/ui · Tailwind CSS
