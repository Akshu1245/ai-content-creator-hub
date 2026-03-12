import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.API_PORT || "3001");

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
const JSON2VIDEO_API_KEY = process.env.JSON2VIDEO_API_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;

const JSON2VIDEO_API_BASE = "https://api.json2video.com/v2";

function sanitize(str: unknown, maxLen = 200): string {
  return String(str ?? "").substring(0, maxLen).replace(/[\x00-\x1f]/g, "");
}

app.post("/api/generate-script", async (req, res) => {
  try {
    if (!GEMINI_API_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    const { niche, topic } = req.body;
    const safeNiche = sanitize(niche, 100);
    const safeTopic = sanitize(topic, 200);
    if (!safeNiche || !safeTopic) return res.status(400).json({ error: "Missing niche or topic" });

    const systemPrompt = `You are a world-class YouTube scriptwriter who creates faceless video content that is genuinely insightful, intellectually honest, and deeply researched. You do NOT write generic motivational content or recycled self-help clichés.

YOUR WRITING PRINCIPLES:
- Lead with a SPECIFIC, surprising insight or counterintuitive truth — not a vague "what if" or clickbait hook
- Present NUANCED arguments. Acknowledge complexity. Avoid false dichotomies ("X beats Y" oversimplifications)
- Back every claim with concrete data, named studies, real examples, or historical events — never vague assertions
- Challenge popular wisdom when warranted. Show the viewer something they haven't considered
- Use clear cause-and-effect reasoning. Every point should build on the previous one
- Write in a conversational but authoritative tone — like an expert explaining to a smart friend, not a guru lecturing
- Avoid these overused patterns: "Here's what nobody tells you", "This will change your life", "unfair advantage", empty urgency
- Include genuine trade-offs and limitations. Credibility comes from honesty, not hype

YOUR CONTENT RULES:
- NO filler sentences. Every line must add new information or deepen understanding
- Provide ACTIONABLE frameworks, not just motivational platitudes
- When discussing a concept, explain the MECHANISM — why it works, not just that it works
- Use specific numbers, names, dates, and sources wherever possible
- End with a thought-provoking question or reframe, not a generic "subscribe" push

OUTPUT FORMAT — mark these sections:
[HOOK - First 5 seconds] — A specific, surprising fact or counterintuitive claim that creates genuine curiosity
[SECTION 1 - Title] — Establish the problem or misconception with evidence
[SECTION 2 - Title] — Introduce your core insight with supporting data/examples
[SECTION 3 - Title] — Practical application or framework the viewer can use
[SECTION 4 - Title] — Address objections or edge cases honestly
[CTA - Contextual] — Tie the CTA naturally to the content (not forced)
[OUTRO] — A memorable reframe or thought-provoking closer

Write 700-1000 words for a 5-7 minute video. Prioritize depth and originality over engagement tricks.`;
    const userPrompt = `Write a faceless YouTube video script about "${safeTopic}" in the ${safeNiche} niche.

Requirements:
- Research-backed with specific data points, named studies, or real-world examples
- Present a fresh angle or counterintuitive perspective — not the standard take everyone already knows
- Acknowledge nuance and complexity rather than oversimplifying
- Include at least one concrete framework, mental model, or actionable system the viewer can apply
- Maintain intellectual honesty — mention limitations and trade-offs where relevant`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 2048 },
        }),
      }
    );
    if (!response.ok) throw new Error("AI generation failed");
    const data = await response.json();
    const script = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.json({ script });
  } catch (e: any) {
    console.error("generate-script error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

app.post("/api/market-research", async (req, res) => {
  try {
    if (!GEMINI_API_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    const { niche, topic } = req.body;
    const safeNiche = sanitize(niche, 100);
    const safeTopic = sanitize(topic, 200);
    if (!safeNiche || !safeTopic) return res.status(400).json({ error: "Missing niche or topic" });

    const prompt = `You are a YouTube market research analyst. Analyze this topic for a faceless YouTube video:

Niche: ${safeNiche}
Topic: ${safeTopic}

Research the internet and provide a comprehensive market analysis with REAL, current data. Return your analysis in this exact JSON format (no markdown, just raw JSON):

{
  "trendScore": <number 0-100 based on current search interest>,
  "searchVolume": "<estimated weekly search volume like '12.4K/wk'>",
  "competition": "<Low|Medium|High based on existing content saturation>",
  "idealLength": "<recommended video length like '8-12 min'>",
  "bestPostTime": "<best day and time to post like 'Tue 6PM'>",
  "competitors": [
    {
      "title": "<real competing video title found online>",
      "views": "<view count like '2.1M'>",
      "retention": "<estimated retention percentage>",
      "likes": "<like count>"
    }
  ],
  "trendingAngles": ["<angle 1>", "<angle 2>", "<angle 3>"],
  "audienceInsight": "<brief paragraph about the target audience and what they want>",
  "contentGaps": ["<gap 1>", "<gap 2>", "<gap 3>"],
  "suggestedTitle": "<optimized video title for maximum CTR>",
  "keySearchTerms": ["<term1>", "<term2>", "<term3>", "<term4>", "<term5>"]
}

Include 4-5 real competitors. Base everything on actual current internet data. Be specific with numbers.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
        }),
      }
    );
    if (!response.ok) throw new Error("Market research failed");
    const apiData = await response.json();
    const rawText = apiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let jsonStr = rawText;
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();

    let research;
    try {
      research = JSON.parse(jsonStr);
    } catch {
      research = {
        trendScore: 70, searchVolume: "N/A", competition: "Medium",
        idealLength: "8-12 min", bestPostTime: "Tue 6PM", competitors: [],
        trendingAngles: [], audienceInsight: rawText, contentGaps: [],
        suggestedTitle: safeTopic, keySearchTerms: [],
      };
    }
    const groundingMetadata = apiData.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "",
      url: chunk.web?.uri || "",
    })) || [];
    res.json({ research, sources });
  } catch (e: any) {
    console.error("market-research error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

app.post("/api/generate-voice", async (req, res) => {
  try {
    if (!SARVAM_API_KEY) return res.status(500).json({ error: "SARVAM_API_KEY not configured" });
    const { text, speaker, speed } = req.body;
    const safeText = sanitize(text, 5000);
    const safeSpeaker = sanitize(speaker, 50).replace(/[^a-zA-Z0-9_-]/g, "");
    if (!safeText || !safeSpeaker) return res.status(400).json({ error: "Missing required fields: text, speaker" });

    const speakerMap: Record<string, string> = {
      roger: "shubh", sarah: "priya", george: "ratan", lily: "simran",
      brian: "amit", jessica: "shreya", amelia: "amelia", tanya: "tanya", neha: "neha",
    };
    const sarvamSpeaker = speakerMap[safeSpeaker] || "shubh";

    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: { "api-subscription-key": SARVAM_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        text: safeText,
        target_language_code: "en-IN",
        model: "bulbul:v3",
        speaker: sarvamSpeaker,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        ...(speed && { pace: speed }),
      }),
    });
    if (!response.ok) throw new Error("Voice generation failed");
    const voiceData = await response.json();
    res.json({ audio_base64: voiceData.audios?.[0] || null, request_id: voiceData.request_id, speaker: sarvamSpeaker });
  } catch (e: any) {
    console.error("generate-voice error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

app.post("/api/generate-video", async (req, res) => {
  try {
    if (!JSON2VIDEO_API_KEY) return res.status(500).json({ error: "JSON2VIDEO_API_KEY not configured" });
    const { action, prompt, task_id, duration, media_urls } = req.body;
    const apiHeaders = { "x-api-key": JSON2VIDEO_API_KEY, "Content-Type": "application/json" };

    if (action === "create") {
      const safePrompt = sanitize(prompt, 500);
      if (!safePrompt) return res.status(400).json({ error: "Missing prompt" });
      const sceneDuration = duration ? Math.min(Math.max(Number(duration), 1), 60) : 5;
      const urls: string[] = (media_urls || []).slice(0, 20);
      let scenes;
      if (urls.length > 0) {
        const perSceneDuration = Math.max(3, Math.round(sceneDuration * 3 / urls.length));
        scenes = urls.map((url: string, i: number) => {
          const isVideo = url.includes(".mp4") || url.includes("/video/") || url.includes("videos.pexels");
          return {
            duration: perSceneDuration,
            elements: [
              { type: isVideo ? "video" : "image", src: url, duration: perSceneDuration },
              ...(i === 0 ? [{ type: "text", text: safePrompt.slice(0, 120), style: "001", duration: Math.min(3, perSceneDuration) }] : []),
            ],
          };
        });
      } else {
        scenes = [{ duration: sceneDuration, elements: [{ type: "text", text: safePrompt, style: "001", duration: sceneDuration }] }];
      }
      const movieJson = { resolution: "full-hd", scenes };
      const response = await fetch(`${JSON2VIDEO_API_BASE}/movies`, {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify(movieJson),
      });
      if (!response.ok) throw new Error("Video creation failed");
      const vData = await response.json();
      return res.json({ task_id: vData.project, status: "submitted" });
    }

    if (action === "query") {
      const safeTaskId = sanitize(task_id, 100).replace(/[^a-zA-Z0-9_-]/g, "");
      if (!safeTaskId) return res.status(400).json({ error: "Missing task_id" });
      const response = await fetch(`${JSON2VIDEO_API_BASE}/movies?project=${safeTaskId}`, {
        method: "GET",
        headers: apiHeaders,
      });
      if (!response.ok) throw new Error("Video query failed");
      const qData = await response.json();
      const movie = qData.movie || qData;
      let status = movie.status;
      if (status === "rendering") status = "processing";
      if (status === "done") status = "completed";
      if (status === "error") status = "failed";
      return res.json({ task_id: movie.project || safeTaskId, status, video_url: movie.url || null, duration: movie.duration || null });
    }

    res.status(400).json({ error: "Unknown action" });
  } catch (e: any) {
    console.error("generate-video error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

app.post("/api/stock-media", async (req, res) => {
  try {
    if (!PEXELS_API_KEY) return res.status(500).json({ error: "PEXELS_API_KEY not configured" });
    const { query, type, per_page, orientation } = req.body;
    const safeQuery = sanitize(query, 200);
    if (!safeQuery) return res.status(400).json({ error: "Missing search query" });
    const mediaType = type === "videos" ? "videos" : "photos";
    const baseUrl = mediaType === "videos" ? "https://api.pexels.com/videos/search" : "https://api.pexels.com/v1/search";
    const safePP = Math.min(Math.max(Number(per_page) || 10, 1), 30);
    const safeOrientation = ["landscape", "portrait", "square"].includes(orientation) ? orientation : "landscape";
    const params = new URLSearchParams({ query: safeQuery, per_page: String(safePP), orientation: safeOrientation });
    const response = await fetch(`${baseUrl}?${params}`, { headers: { Authorization: PEXELS_API_KEY } });
    if (!response.ok) throw new Error("Media search failed");
    const pData = await response.json();
    if (mediaType === "videos") {
      const videos = (pData.videos || []).map((v: any) => ({
        id: v.id, url: v.url, image: v.image, duration: v.duration,
        width: v.width, height: v.height,
        videoFiles: v.video_files?.map((f: any) => ({ link: f.link, quality: f.quality, width: f.width, height: f.height, fileType: f.file_type })) || [],
        photographer: v.user?.name || "",
      }));
      return res.json({ type: "videos", results: videos, total: pData.total_results });
    } else {
      const photos = (pData.photos || []).map((p: any) => ({
        id: p.id, url: p.url, alt: p.alt, photographer: p.photographer,
        src: { original: p.src?.original, large: p.src?.large, medium: p.src?.medium, small: p.src?.small, landscape: p.src?.landscape },
      }));
      return res.json({ type: "photos", results: photos, total: pData.total_results });
    }
  } catch (e: any) {
    console.error("stock-media error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

app.post("/api/generate-captions", async (req, res) => {
  try {
    if (!GEMINI_API_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    const { script, topic, niche, platforms } = req.body;
    const safeScript = sanitize(script, 10000);
    const safeTopic = sanitize(topic, 200);
    const safeNiche = sanitize(niche, 100);
    if (!safeScript || !safeTopic) return res.status(400).json({ error: "Missing script or topic" });
    const allowedPlatforms = ["youtube", "instagram", "tiktok", "shorts"];
    const safePlatforms = (platforms || ["youtube", "instagram"]).filter((p: string) => allowedPlatforms.includes(p));
    const platformList = safePlatforms.join(", ");

    const prompt = `You are a social media expert. Generate optimized captions and metadata for posting a video on these platforms: ${platformList}.

Video topic: ${safeTopic}
Niche: ${safeNiche || "general"}
Script summary (first 500 chars): ${safeScript.substring(0, 500)}

Return ONLY valid JSON (no markdown) with this structure:
{
  "youtube": { "title": "<SEO optimized title, max 100 chars>", "description": "<full description, 200-500 words>", "tags": ["<tag1>", "...up to 15"], "hashtags": ["#tag1", "...3-5"] },
  "instagram": { "caption": "<engaging caption, 150-300 words>", "hashtags": ["#tag1", "...up to 30"], "altText": "<alt text>" },
  "tiktok": { "caption": "<short caption, max 150 chars>", "hashtags": ["#tag1", "...5-10"] },
  "shorts": { "title": "<catchy title, max 100 chars>", "description": "<short description>", "hashtags": ["#Shorts", "#tag1"] }
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
        }),
      }
    );
    if (!response.ok) throw new Error("Caption generation failed");
    const apiData = await response.json();
    const rawText = apiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let captions;
    try {
      let jsonStr = rawText;
      const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) jsonStr = jsonMatch[1].trim();
      captions = JSON.parse(jsonStr);
    } catch {
      captions = { raw: rawText };
    }
    res.json({ captions });
  } catch (e: any) {
    console.error("generate-captions error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

app.post("/api/compliance-check", async (req, res) => {
  try {
    if (!LOVABLE_API_KEY) return res.status(500).json({ error: "LOVABLE_API_KEY not configured" });
    const { script, topic, niche } = req.body;
    const safeScript = sanitize(script, 10000);
    const safeTopic = sanitize(topic, 200);
    const safeNiche = sanitize(niche, 100);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        tools: [{
          type: "function",
          function: {
            name: "compliance_report",
            description: "Return a compliance analysis report for a YouTube video script",
            parameters: {
              type: "object",
              properties: {
                overall: { type: "number" },
                scores: { type: "object", properties: { originality: { type: "number" }, value: { type: "number" }, misinformation: { type: "number" }, monetization: { type: "number" } }, required: ["originality", "value", "misinformation", "monetization"] },
                warnings: { type: "array", items: { type: "string" } },
                recommendations: { type: "array", items: { type: "string" } },
                disclosureNeeded: { type: "boolean" },
              },
              required: ["overall", "scores", "warnings", "recommendations", "disclosureNeeded"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "compliance_report" } },
        messages: [
          { role: "system", content: "You are a YouTube policy compliance expert. Analyze video scripts for monetization risks, originality, value delivery, and misinformation. Score each dimension 0-100 (100 = fully safe)." },
          { role: "user", content: `Analyze this ${safeNiche} video script about "${safeTopic}" for YouTube compliance:\n\n${safeScript}` },
        ],
      }),
    });
    if (!response.ok) {
      const status = response.status;
      if (status === 429) return res.status(429).json({ error: "Rate limited, please try again" });
      if (status === 402) return res.status(402).json({ error: "Credits exhausted" });
      throw new Error("AI analysis failed");
    }
    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      return res.json(JSON.parse(toolCall.function.arguments));
    }
    throw new Error("No tool call response from AI");
  } catch (e: any) {
    console.error("compliance-check error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

app.post("/api/compliance-fix", async (req, res) => {
  try {
    if (!LOVABLE_API_KEY) return res.status(500).json({ error: "LOVABLE_API_KEY not configured" });
    const { script, warnings, recommendations } = req.body;
    const safeScript = sanitize(script, 10000);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an expert script editor specializing in YouTube monetization compliance. Fix the given script to address all compliance warnings and recommendations. Maintain the script's intellectual depth, nuance, and specific data points. Do NOT dumb down the content or replace substantive arguments with generic filler. Keep the same structure, tone, and approximate length. Return ONLY the fixed script text, no explanations." },
          { role: "user", content: `Fix this script to address these compliance issues while preserving its quality and depth:\n\nWarnings: ${JSON.stringify(warnings)}\nRecommendations: ${JSON.stringify(recommendations)}\n\nScript:\n${safeScript}` },
        ],
      }),
    });
    if (!response.ok) {
      const status = response.status;
      if (status === 429) return res.status(429).json({ error: "Rate limited, please try again" });
      if (status === 402) return res.status(402).json({ error: "Credits exhausted" });
      throw new Error("AI error");
    }
    const aiData = await response.json();
    const fixedScript = aiData.choices?.[0]?.message?.content || "";
    res.json({ fixedScript });
  } catch (e: any) {
    console.error("compliance-fix error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

app.post("/api/copyright-scan", async (req, res) => {
  try {
    if (!LOVABLE_API_KEY) return res.status(500).json({ error: "LOVABLE_API_KEY not configured" });
    const { script, topic, niche } = req.body;
    const safeScript = sanitize(script, 10000);
    const safeTopic = sanitize(topic, 200);
    const safeNiche = sanitize(niche, 100);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a copyright risk analyzer for YouTube videos. Analyze the provided script for potential copyright issues. You MUST respond with valid JSON only, no markdown.`,
          },
          {
            role: "user",
            content: `Topic: "${safeTopic}" (Niche: ${safeNiche})\n\nScript to analyze:\n${safeScript}\n\nReturn this exact JSON structure:\n{\n  "overallRisk": "safe|caution|high_risk",\n  "audioRisk": { "status": "safe", "detail": "AI-generated voiceover — no copyright risk" },\n  "visualRisk": { "status": "safe", "watermarksDetected": false },\n  "scriptRisk": { "status": "safe|caution|high_risk", "originalityScore": 0-100 },\n  "issues": [{ "type": "audio|visual|script", "severity": "low|medium|high", "text": "description", "fix": "suggestion" }],\n  "safeMusicAlternatives": ["YouTube Audio Library", "Pixabay Music", "Incompetech (Kevin MacLeod — CC BY)"],\n  "channelRiskSummary": "one sentence summary"\n}`,
          },
        ],
        temperature: 0.3,
      }),
    });
    if (!response.ok) throw new Error("AI analysis failed");
    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse AI response");
    res.json(JSON.parse(jsonMatch[0]));
  } catch (e: any) {
    console.error("copyright-scan error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

app.post("/api/auto-edit", async (req, res) => {
  try {
    if (!LOVABLE_API_KEY) return res.status(500).json({ error: "LOVABLE_API_KEY not configured" });
    const { script, duration, captions } = req.body;
    const safeScript = sanitize(script, 10000);
    const safeDuration = Math.min(Math.max(Number(duration) || 0, 1), 3600);
    if (!safeScript || !safeDuration) return res.status(400).json({ error: "script and duration are required" });

    const systemPrompt = `You are a professional video editor AI specializing in faceless YouTube content. Given a script, video duration, and optional captions, generate a precise editing plan that enhances the content's impact.

Your editing philosophy:
- Highlight KEY INSIGHTS with text overlays, not generic phrases — pull the most surprising data points, counterintuitive claims, or actionable frameworks from the script
- Time overlays to reinforce what the narrator is saying at that exact moment
- Use trim to cut dead air or weak openings — start where the substance begins
- Suggest edits that improve pacing and visual engagement without cheapening the content
- Text overlays should be concise (3-8 words max) and positioned to not obstruct the main content
- Generate 4-8 well-timed overlays that emphasize the script's strongest moments`;
    const userPrompt = `Script: "${safeScript}"\nVideo duration: ${safeDuration} seconds\n${captions ? `Captions/metadata: ${JSON.stringify(captions).substring(0, 2000)}` : "No captions provided."}\n\nGenerate a precise auto-edit plan. Focus overlays on the most impactful data points, quotes, and actionable takeaways from the script.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "apply_edits",
            description: "Apply a full auto-edit plan to the video editor.",
            parameters: {
              type: "object",
              properties: {
                trim: { type: "object", properties: { start: { type: "number" }, end: { type: "number" } }, required: ["start", "end"] },
                overlays: { type: "array", items: { type: "object", properties: { text: { type: "string" }, x: { type: "number" }, y: { type: "number" }, fontSize: { type: "number" }, color: { type: "string" }, fontWeight: { type: "string", enum: ["normal", "bold"] }, align: { type: "string", enum: ["left", "center", "right"] }, startTime: { type: "number" }, endTime: { type: "number" } }, required: ["text", "x", "y", "fontSize", "color", "fontWeight", "align", "startTime", "endTime"], additionalProperties: false } },
                suggestions: { type: "array", items: { type: "string" } },
              },
              required: ["trim", "overlays", "suggestions"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "apply_edits" } },
      }),
    });
    if (!response.ok) {
      const status = response.status;
      if (status === 429) return res.status(429).json({ error: "Rate limited, please try again" });
      if (status === 402) return res.status(402).json({ error: "Credits exhausted" });
      throw new Error("AI gateway error");
    }
    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) throw new Error("AI did not return structured edit data");
    res.json(JSON.parse(toolCall.function.arguments));
  } catch (e: any) {
    console.error("auto-edit error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

app.post("/api/check-subscription", async (req, res) => {
  try {
    if (!STRIPE_SECRET_KEY) return res.json({ subscribed: false });
    const { email } = req.body;
    if (!email) return res.json({ subscribed: false });

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" as any });
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length === 0) return res.json({ subscribed: false });

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 1 });
    const hasActiveSub = subscriptions.data.length > 0;
    let productId = null;
    let subscriptionEnd = null;
    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date((subscription as any).current_period_end * 1000).toISOString();
      productId = subscription.items.data[0].price.product;
    }
    res.json({ subscribed: hasActiveSub, product_id: productId, subscription_end: subscriptionEnd });
  } catch (e: any) {
    console.error("check-subscription error:", e);
    res.json({ subscribed: false });
  }
});

app.post("/api/create-checkout", async (req, res) => {
  try {
    if (!STRIPE_SECRET_KEY) return res.status(500).json({ error: "STRIPE_SECRET_KEY not configured" });
    const { email, priceId, origin } = req.body;
    if (!email || !priceId) return res.status(400).json({ error: "Missing email or priceId" });

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" as any });
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customerId = customers.data.length > 0 ? customers.data[0].id : undefined;
    const safeOrigin = origin || (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "http://localhost:5173");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${safeOrigin}/dashboard?checkout=success`,
      cancel_url: `${safeOrigin}/settings?checkout=cancelled`,
    });
    res.json({ url: session.url });
  } catch (e: any) {
    console.error("create-checkout error:", e);
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/customer-portal", async (req, res) => {
  try {
    if (!STRIPE_SECRET_KEY) return res.status(500).json({ error: "STRIPE_SECRET_KEY not configured" });
    const { email, origin } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });

    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" as any });
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length === 0) return res.status(404).json({ error: "No Stripe customer found" });
    const safeOrigin = origin || (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "http://localhost:5173");
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${safeOrigin}/settings`,
    });
    res.json({ url: portalSession.url });
  } catch (e: any) {
    console.error("customer-portal error:", e);
    res.status(500).json({ error: e.message });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
