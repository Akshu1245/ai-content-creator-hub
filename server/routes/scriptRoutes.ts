import { Router } from "express";

const router = Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function sanitize(str: unknown, maxLen = 200): string {
  return Array.from(String(str ?? "").substring(0, maxLen))
    .filter((char) => char.charCodeAt(0) >= 32)
    .join("");
}

router.post("/generate-script", async (req, res) => {
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

router.post("/market-research", async (req, res) => {
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

router.post("/generate-captions", async (req, res) => {
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

export default router;
