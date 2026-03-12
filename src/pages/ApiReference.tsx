import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";
import { ArrowLeft, Key, Code, Gauge, AlertCircle, ChevronRight } from "lucide-react";

const endpoints = [
  {
    method: "POST",
    path: "/api/generate-script",
    desc: "Generate a research-backed YouTube video script using Gemini AI.",
    body: [
      { field: "niche", type: "string", required: true, note: "Content category, e.g. 'Personal Finance'" },
      { field: "topic", type: "string", required: true, note: "Specific video topic, max 200 chars" },
    ],
    response: '{ "script": "string" }',
    tag: "AI",
  },
  {
    method: "POST",
    path: "/api/market-research",
    desc: "Run trend analysis with live Google Search grounding. Returns opportunity scores, competitor data, and content gaps.",
    body: [
      { field: "niche", type: "string", required: true, note: "Content niche" },
      { field: "topic", type: "string", required: true, note: "Research topic" },
    ],
    response: '{ "research": { trendScore, searchVolume, competition, ... }, "sources": [...] }',
    tag: "AI",
  },
  {
    method: "POST",
    path: "/api/generate-voice",
    desc: "Generate text-to-speech audio using Sarvam AI Bulbul v3.",
    body: [
      { field: "text", type: "string", required: true, note: "Script text, max 5000 chars" },
      { field: "speaker", type: "string", required: true, note: "Voice ID: roger | sarah | george | lily | brian | jessica | amelia | tanya | neha" },
      { field: "speed", type: "number", required: false, note: "Playback rate 0.5–2.0" },
    ],
    response: '{ "audio_base64": "string", "request_id": "string", "speaker": "string" }',
    tag: "MEDIA",
  },
  {
    method: "POST",
    path: "/api/generate-video",
    desc: "Create a video from scenes or query the status of an existing render job.",
    body: [
      { field: "action", type: '"create" | "query"', required: true, note: "Operation type" },
      { field: "prompt", type: "string", required: false, note: "Required for create. Scene description, max 500 chars" },
      { field: "task_id", type: "string", required: false, note: "Required for query. Job ID from create response" },
      { field: "media_urls", type: "string[]", required: false, note: "Pexels URLs for scene assets" },
      { field: "duration", type: "number", required: false, note: "Target scene duration in seconds (1–60)" },
    ],
    response: '{ "task_id": "string", "status": "submitted | processing | completed | failed", "video_url": "string | null" }',
    tag: "MEDIA",
  },
  {
    method: "POST",
    path: "/api/stock-media",
    desc: "Search Pexels for stock photos and video clips.",
    body: [
      { field: "query", type: "string", required: true, note: "Search terms, max 200 chars" },
      { field: "type", type: '"photos" | "videos"', required: false, note: "Default: photos" },
      { field: "per_page", type: "number", required: false, note: "Results per page, 1–30. Default: 10" },
      { field: "orientation", type: '"landscape" | "portrait" | "square"', required: false, note: "Default: landscape" },
    ],
    response: '{ "type": "photos | videos", "results": [...], "total": number }',
    tag: "MEDIA",
  },
  {
    method: "POST",
    path: "/api/compliance-check",
    desc: "Analyze a script for YouTube monetization compliance. Returns structured scores and recommendations.",
    body: [
      { field: "script", type: "string", required: true, note: "Full script text" },
      { field: "topic", type: "string", required: true, note: "Video topic" },
      { field: "niche", type: "string", required: false, note: "Content niche" },
    ],
    response: '{ "overall": number, "scores": { originality, value, misinformation, monetization }, "warnings": [...], "recommendations": [...], "disclosureNeeded": boolean }',
    tag: "COMPLIANCE",
  },
  {
    method: "POST",
    path: "/api/generate-captions",
    desc: "Generate platform-optimized captions, titles, and hashtags for YouTube, Instagram, TikTok, and Shorts.",
    body: [
      { field: "script", type: "string", required: true, note: "Full script text" },
      { field: "topic", type: "string", required: true, note: "Video topic" },
      { field: "niche", type: "string", required: false, note: "Content niche" },
      { field: "platforms", type: "string[]", required: false, note: "Default: ['youtube', 'instagram']. Options: youtube | instagram | tiktok | shorts" },
    ],
    response: '{ "captions": { youtube: {...}, instagram: {...}, tiktok: {...}, shorts: {...} } }',
    tag: "CONTENT",
  },
];

const tagColors: Record<string, string> = {
  AI: "text-primary bg-primary/10 border-primary/20",
  MEDIA: "text-accent bg-accent/10 border-accent/20",
  COMPLIANCE: "text-gold bg-gold/10 border-gold/20",
  CONTENT: "text-arctic bg-arctic/10 border-arctic/20",
};

const methodColors: Record<string, string> = {
  POST: "text-emerald bg-emerald/10 border-emerald/20",
  GET: "text-arctic bg-arctic/10 border-arctic/20",
};

const ApiReference = () => {
  usePageTitle("API Reference");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/3 w-[500px] h-[350px] rounded-full blur-[160px] opacity-20"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.12), transparent 70%)" }} />
      </div>

      <main className="container mx-auto max-w-4xl px-6 py-16 relative z-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-10">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>

        <div className="mb-14">
          <span className="font-label text-accent tracking-widest text-[10px]">DEVELOPER REFERENCE</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-3">API Reference</h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Programmatic access to VORAX's AI generation, media, and compliance endpoints. All routes are proxied through the Express server at <code className="text-xs bg-card px-1.5 py-0.5 rounded border border-border/60">/api/*</code>.
          </p>
        </div>

        <div className="space-y-5 mb-12">
          <div className="surface-raised border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Key className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-display text-foreground">Authentication</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              All API endpoints are server-side and authenticated by environment variables. They are accessed through the Vite dev proxy (or Express in production) — no bearer token is required from the client.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              {[
                { key: "GEMINI_API_KEY", endpoints: "generate-script, market-research, generate-captions" },
                { key: "SARVAM_API_KEY", endpoints: "generate-voice" },
                { key: "JSON2VIDEO_API_KEY", endpoints: "generate-video" },
                { key: "PEXELS_API_KEY", endpoints: "stock-media" },
                { key: "LOVABLE_API_KEY", endpoints: "compliance-check, compliance-fix, copyright-scan, auto-edit" },
                { key: "STRIPE_SECRET_KEY", endpoints: "check-subscription, create-checkout, customer-portal" },
              ].map((item) => (
                <div key={item.key} className="bg-background/50 border border-border/40 rounded-lg p-3">
                  <code className="text-primary font-mono text-[10px]">{item.key}</code>
                  <p className="text-muted-foreground/70 mt-1 text-[10px]">{item.endpoints}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-raised border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Gauge className="w-4 h-4 text-gold" />
              <h2 className="text-sm font-display text-foreground">Rate Limits</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Rate limits are enforced by the upstream providers (Gemini, Sarvam, Pexels, etc.). The VORAX server itself does not apply additional rate limiting in the current version. A <code className="text-xs bg-card px-1 py-0.5 rounded border border-border/60">429</code> response from any endpoint indicates the upstream provider is throttling — wait 60 seconds and retry.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Code className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-display text-foreground">Endpoints</h2>
          </div>
        </div>

        <div className="space-y-4">
          {endpoints.map((ep, i) => (
            <div key={i} className="surface-raised border border-border/50 p-6 group hover:border-primary/25 transition-colors duration-200 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${methodColors[ep.method]}`}>
                  {ep.method}
                </span>
                <code className="text-sm font-mono text-foreground">{ep.path}</code>
                <span className={`ml-auto px-2 py-0.5 rounded-full text-[9px] font-label border ${tagColors[ep.tag]}`}>
                  {ep.tag}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{ep.desc}</p>

              <div className="mb-4">
                <p className="text-[10px] font-label text-muted-foreground/60 tracking-widest mb-2">REQUEST BODY</p>
                <div className="space-y-1.5">
                  {ep.body.map((field) => (
                    <div key={field.field} className="flex items-start gap-3 text-xs">
                      <code className="text-primary font-mono shrink-0">{field.field}</code>
                      <span className="text-muted-foreground/50 font-mono shrink-0">{field.type}</span>
                      {field.required && <span className="text-red-400/70 text-[10px] shrink-0">required</span>}
                      <span className="text-muted-foreground">{field.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-label text-muted-foreground/60 tracking-widest mb-2">RESPONSE</p>
                <code className="text-xs text-muted-foreground/80 font-mono">{ep.response}</code>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 surface-raised border border-border/50 p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-display text-foreground">Error Responses</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            {[
              { code: "400", msg: "Missing or invalid request parameters" },
              { code: "402", msg: "Upstream API credits exhausted" },
              { code: "429", msg: "Upstream rate limit — retry after 60s" },
              { code: "500", msg: "Internal error or API key not configured" },
            ].map((e) => (
              <div key={e.code} className="flex gap-3">
                <code className="text-red-400/70 font-mono shrink-0">{e.code}</code>
                <span>{e.msg}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link to="/documentation" className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors">
            Documentation <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="/help-center" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
            Help Center <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ApiReference;
