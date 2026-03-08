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

    const { script, topic, niche } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const safeScript = (script ?? "").substring(0, 10000).replace(/[\x00-\x1f]/g, "");
    const safeTopic = (topic ?? "").substring(0, 200).replace(/[\x00-\x1f]/g, "");
    const safeNiche = (niche ?? "").substring(0, 100).replace(/[\x00-\x1f]/g, "");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a copyright risk analyzer for YouTube videos. Analyze the provided script for potential copyright issues.

Check:
1. Are any statistics or quotes attributed to identifiable sources that would require permission?
2. Does any section closely paraphrase content from known books, articles, or videos?
3. Are any brand names, product names, or trademarks used in a way that could trigger a claim?
4. Is there any language that closely mirrors Wikipedia or common educational sources?

You MUST respond with valid JSON only, no markdown.`
          },
          {
            role: "user",
            content: `Topic: "${safeTopic}" (Niche: ${safeNiche})

Script to analyze:
${safeScript}

Return this exact JSON structure:
{
  "overallRisk": "safe|caution|high_risk",
  "audioRisk": { "status": "safe", "detail": "AI-generated voiceover — no copyright risk" },
  "visualRisk": { "status": "safe", "watermarksDetected": false },
  "scriptRisk": { "status": "safe|caution|high_risk", "originalityScore": 0-100 },
  "issues": [{ "type": "audio|visual|script", "severity": "low|medium|high", "text": "description", "fix": "suggestion" }],
  "safeMusicAlternatives": ["YouTube Audio Library", "Pixabay Music", "Incompetech (Kevin MacLeod — CC BY)"],
  "channelRiskSummary": "one sentence summary"
}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status, await response.text());
      throw new Error("AI analysis failed");
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse AI response");

    const report = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("copyright-scan error:", e);
    return new Response(JSON.stringify({ error: "Request failed, please try again" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
