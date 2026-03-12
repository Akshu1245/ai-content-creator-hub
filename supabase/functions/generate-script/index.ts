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
