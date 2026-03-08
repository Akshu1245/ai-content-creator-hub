import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const token = authHeader.replace("Bearer ", "");
    const { data, error: authError } = await supabase.auth.getClaims(token);
    if (authError || !data?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { niche, topic } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

    // Input validation
    const safeNiche = (niche ?? "").substring(0, 100).replace(/[\x00-\x1f]/g, "");
    const safeTopic = (topic ?? "").substring(0, 200).replace(/[\x00-\x1f]/g, "");
    if (!safeNiche || !safeTopic) {
      return new Response(JSON.stringify({ error: "Missing niche or topic" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

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

    const userPrompt = `Write a faceless YouTube video script about "${safeTopic}" in the ${safeNiche} niche. Make it highly engaging with specific facts, data points, and a compelling narrative arc.`;

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

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gemini API error:", response.status, errorBody);
      throw new Error("AI generation failed");
    }

    const data2 = await response.json();
    const script = data2.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return new Response(JSON.stringify({ script }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-script error:", e);
    return new Response(JSON.stringify({ error: "Request failed, please try again" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
