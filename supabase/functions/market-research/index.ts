import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { niche, topic } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

    if (!niche || !topic) throw new Error("Missing niche or topic");

    const prompt = `You are a YouTube market research analyst. Analyze this topic for a faceless YouTube video:

Niche: ${niche}
Topic: ${topic}

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
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API error [${response.status}]: ${errorBody}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = rawText;
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    let research;
    try {
      research = JSON.parse(jsonStr);
    } catch {
      // If JSON parsing fails, return raw text with defaults
      research = {
        trendScore: 70,
        searchVolume: "N/A",
        competition: "Medium",
        idealLength: "8-12 min",
        bestPostTime: "Tue 6PM",
        competitors: [],
        trendingAngles: [],
        audienceInsight: rawText,
        contentGaps: [],
        suggestedTitle: topic,
        keySearchTerms: [],
      };
    }

    // Extract grounding metadata (search sources)
    const groundingMetadata = data.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "",
      url: chunk.web?.uri || "",
    })) || [];

    return new Response(JSON.stringify({ research, sources }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("market-research error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
