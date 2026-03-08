import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

    const { script, topic, niche, platforms } = await req.json();
    if (!script || !topic) throw new Error("Missing script or topic");

    const platformList = (platforms || ["youtube", "instagram"]).join(", ");

    const prompt = `You are a social media expert. Generate optimized captions and metadata for posting a video on these platforms: ${platformList}.

Video topic: ${topic}
Niche: ${niche || "general"}
Script summary (first 500 chars): ${script.substring(0, 500)}

Return ONLY valid JSON (no markdown) with this structure:
{
  "youtube": {
    "title": "<SEO optimized title, max 100 chars>",
    "description": "<full description with keywords, links placeholder, 200-500 words>",
    "tags": ["<tag1>", "<tag2>", "...up to 15 tags"],
    "hashtags": ["#tag1", "#tag2", "...3-5 hashtags"]
  },
  "instagram": {
    "caption": "<engaging caption with emojis, 150-300 words, include CTA>",
    "hashtags": ["#tag1", "#tag2", "...up to 30 hashtags"],
    "altText": "<accessibility alt text for the video>"
  },
  "tiktok": {
    "caption": "<short punchy caption, max 150 chars>",
    "hashtags": ["#tag1", "#tag2", "...5-10 hashtags"]
  },
  "shorts": {
    "title": "<catchy title for YouTube Shorts, max 100 chars>",
    "description": "<short description>",
    "hashtags": ["#Shorts", "#tag1", "#tag2"]
  }
}

Make captions viral-worthy, platform-native, and SEO optimized. Use trending formats for each platform.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API error [${response.status}]: ${errorBody}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let captions;
    try {
      let jsonStr = rawText;
      const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) jsonStr = jsonMatch[1].trim();
      captions = JSON.parse(jsonStr);
    } catch {
      captions = { raw: rawText };
    }

    return new Response(JSON.stringify({ captions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-captions error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
