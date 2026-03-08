import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data, error: authError } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (authError || !data?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

    const { script, topic, niche, platforms } = await req.json();

    const safeScript = (script ?? "").substring(0, 10000).replace(/[\x00-\x1f]/g, "");
    const safeTopic = (topic ?? "").substring(0, 200).replace(/[\x00-\x1f]/g, "");
    const safeNiche = (niche ?? "").substring(0, 100).replace(/[\x00-\x1f]/g, "");
    if (!safeScript || !safeTopic) {
      return new Response(JSON.stringify({ error: "Missing script or topic" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

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
          tools: [{ google_search: {} }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error:", response.status, await response.text());
      throw new Error("Caption generation failed");
    }

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

    return new Response(JSON.stringify({ captions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-captions error:", e);
    return new Response(JSON.stringify({ error: "Request failed, please try again" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
