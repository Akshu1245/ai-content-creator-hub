# VORAX — AI YouTube Video Creator (v3.4)

## Overview
VORAX is a full-stack AI-powered platform for creating faceless YouTube videos. It generates scripts, voiceovers, video edits, market research, captions, and monetization compliance checks using various AI APIs. Target users are Indian faceless content creators on YouTube, TikTok, and Instagram. Core differentiator: pre-publish monetization compliance scoring (Monetization Shield) + flat INR billing (₹999/mo, no dollar conversion). Changelog current version: v3.4.

## Architecture
- **Frontend**: React 18 + Vite + TypeScript, served on port 5000 in development
- **Backend**: Express.js + TypeScript (`server/index.ts`), served on port 3001
- **Auth/DB**: Supabase (authentication + database)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6 (future flags enabled for v7 compatibility)

## Running the App
```
npm run dev
```
This runs both Vite (port 5000) and the Express API server (port 3001) concurrently via `concurrently`.

## Key Scripts
- `npm run dev` — Start dev servers (frontend + backend)
- `npm run build` — Build frontend and compile server TypeScript
- `npm run start` — Run the compiled production server

## Pages & Routes
| Path | Component | Auth Required |
|------|-----------|---------------|
| `/` | Index (Landing) | No |
| `/auth` | Auth (Login/Signup) | No |
| `/dashboard` | Dashboard | Yes |
| `/new-project` | NewProject (8-step wizard) | Yes |
| `/project/:id` | ProjectDetail | Yes |
| `/analytics` | Analytics | Yes |
| `/settings` | Settings | Yes |
| `/why-vorax` | WhyVORAX (comparison) | No |
| `/blog` | Blog | No |
| `/changelog` | Changelog | No |
| `/documentation` | Documentation | No |
| `/api-reference` | ApiReference | No |
| `/help-center` | HelpCenter | No |
| `/terms` | TermsOfService | No |
| `/privacy` | PrivacyPolicy | No |

## API Routes (Express server)
All routes are prefixed `/api/` and proxied from Vite to the Express server:
- `POST /api/generate-script` — AI script generation (Gemini)
- `POST /api/market-research` — YouTube market research (Gemini + Google Search)
- `POST /api/generate-voice` — Text-to-speech (Sarvam AI Bulbul v3)
- `POST /api/generate-video` — Video creation/query (JSON2Video)
- `POST /api/stock-media` — Stock photo/video search (Pexels)
- `POST /api/generate-captions` — Social media captions (Gemini)
- `POST /api/compliance-check` — YouTube policy compliance (Lovable AI gateway)
- `POST /api/compliance-fix` — Auto-fix compliance issues (Lovable AI gateway)
- `POST /api/copyright-scan` — Copyright risk analysis (Lovable AI gateway)
- `POST /api/auto-edit` — AI video editing plan (Lovable AI gateway)
- `POST /api/check-subscription` — Stripe subscription check
- `POST /api/create-checkout` — Stripe checkout session
- `POST /api/customer-portal` — Stripe billing portal

## Environment Variables Required
Set these as Replit Secrets:
| Secret | Used for |
|--------|---------|
| `GEMINI_API_KEY` | Google Gemini 2.5 Flash — scripts, market research, captions |
| `SARVAM_API_KEY` | Sarvam AI Bulbul v3 — text-to-speech |
| `JSON2VIDEO_API_KEY` | JSON2Video — video rendering |
| `PEXELS_API_KEY` | Pexels — stock photos and video |
| `STRIPE_SECRET_KEY` | Stripe — payments and subscriptions |
| `LOVABLE_API_KEY` | Lovable AI gateway — compliance, copyright, auto-edit |

Public (already in .env):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## Subscription Tiers (Stripe)
| Tier | Product ID | Price | Videos/mo |
|------|-----------|-------|-----------|
| Starter | — | Free | 2 |
| Pro | `prod_U6yBkwG9ZXJEeL` | ₹999/mo | 20 |
| Agency | `prod_U6yCvdsoEtkd1u` | ₹2,999/mo | Unlimited |

## Replit Migration Notes
- Vite dev server configured to `host: "0.0.0.0"`, port `5000`, `allowedHosts: true` for Replit preview compatibility
- Express static file serving is gated behind `NODE_ENV === "production"` to avoid conflicts in dev mode
- Vite proxies `/api/*` to `http://localhost:3001` for clean client/server separation
- `AuthContext.checkSubscription` calls `/api/check-subscription` (Express) — not a Supabase Edge Function
- `Settings.tsx` API_URL uses empty string (`""`) so Vite proxy handles routing
- React Router v7 future flags enabled to eliminate console warnings

## Market-Ready Features Implemented
- Cinematic portal intro with auto-open (3.2s) and skip button
- Rich Blog with 4 full articles, dates, reading times, email subscription
- Full Changelog with version history and categorized release notes (v3.3 current)
- Comprehensive Documentation with step-by-step guides and troubleshooting
- Expandable Help Center FAQ with 18 answered questions across 4 sections
- Full API Reference with endpoint schemas, field types, error codes
- Cookie consent banner, Terms of Service, Privacy Policy pages
- GDPR-ready data handling disclosure

## Competitive Positioning (v3.3)
VORAX beats all major competitors on the following dimensions:
1. **Pre-publish compliance scoring** — ZERO competitors have this (InVideo, Pictory, Fliki, HeyGen, Synthesia, Lumen5 all lack it)
2. **INR pricing** — ₹999/mo vs ₹2,300-2,500/mo that Indian users actually pay for dollar-priced tools (USD × 83 + 18% GST + 3% FX)
3. **Indian language voices** — Sarvam AI with Hindi, Tamil, Telugu, Kannada, Bengali, Marathi (not a translation layer)
4. **YPP progress tracker** — Unique to VORAX
5. **Revenue estimator** — Pre-publish earnings forecast, unique to VORAX

Competitor research completed March 2026:
- InVideo Plus: $25-35/mo USD (~₹2,500/mo in India) · 50+ languages · Sora 2 + VEO 3.1 · 16M+ stock · NO compliance
- Pictory Pro: $29/mo USD (~₹2,400/mo in India) · ElevenLabs voices · 18M+ media · NO compliance
- Fliki Standard: $28/mo USD (~₹2,300/mo in India) · 2,500+ voices · 80+ languages · NO compliance
- HeyGen Creator: $29/mo USD (~₹2,000/mo in India) · Avatar-focused · 175 languages · NO compliance
- Synthesia Creator: $64/mo USD · Avatar-only · 230+ avatars · NOT for faceless creators
- Lumen5: $15-79/mo USD · Blog-to-video specialist · Limited AI generation

## Landing Page Sections (in order)
Navbar → HeroSection → StatsSection → HowItWorksSection → FeaturesSection → IndiaFirstSection → TestimonialsSection → PricingSection → FAQSection → CTASection → Footer
