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

    const systemPrompt = `You are an expert YouTube scriptwriter specializing in faceless content. Your scripts are optimized for:
- 70%+ audience retention (hook in first 3 seconds)
- Pattern interrupts every 30 seconds
- Clear value delivery (no filler)
- A strong CTA at 80% mark, not the end

Output a complete video script with these sections marked:
[HOOK - First 3 seconds]
[SECTION 1 - Title]
[SECTION 2 - Title]
[SECTION 3 - Title]
[CTA - 80% Mark]
[OUTRO]

Each section should have clear narration text. Write 600-900 words total for a 4-6 minute video. Make it engaging, specific, and packed with value. No filler.`;

    const userPrompt = `Write a faceless YouTube video script about "${topic}" in the ${niche} niche. Make it highly engaging with specific facts, data points, and a compelling narrative arc.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
          ],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API error [${response.status}]: ${errorBody}`);
    }

    const data = await response.json();
    const script = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return new Response(JSON.stringify({ script }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-script error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
