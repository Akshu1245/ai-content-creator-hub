import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { script, topic, niche } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
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
                overall: { type: "number", description: "Overall compliance score 0-100" },
                scores: {
                  type: "object",
                  properties: {
                    originality: { type: "number" },
                    value: { type: "number" },
                    misinformation: { type: "number" },
                    monetization: { type: "number" },
                  },
                  required: ["originality", "value", "misinformation", "monetization"],
                },
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
          {
            role: "system",
            content: `You are a YouTube policy compliance expert. Analyze video scripts for monetization risks, originality, value delivery, and misinformation. Score each dimension 0-100 (100 = fully safe). Be thorough and specific in warnings and recommendations. Consider: advertiser-friendly guidelines, recycled content policies, AI disclosure requirements, clickbait policies, and community guidelines.`
          },
          {
            role: "user",
            content: `Analyze this ${niche} video script about "${topic}" for YouTube compliance:\n\n${script}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("No tool call response from AI");
  } catch (e) {
    console.error("compliance-check error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
