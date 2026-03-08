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

    const { script, duration, captions } = await req.json();

    const safeScript = (script ?? "").substring(0, 10000).replace(/[\x00-\x1f]/g, "");
    const safeDuration = Math.min(Math.max(Number(duration) || 0, 1), 3600);

    if (!safeScript || !safeDuration) {
      return new Response(JSON.stringify({ error: "script and duration are required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a professional video editor AI. Given a script, video duration, and optional captions, generate a complete editing plan.

Return a JSON object using the tool provided with:
1. "trim" - optimal start/end times to cut dead space
2. "overlays" - timed text overlays for key moments (3-8 overlays)
3. "suggestions" - 2-4 human-readable editing tips

For positions: x is 0-100 (left to right), y is 0-100 (top to bottom).
Colors available: "hsl(0, 0%, 100%)", "hsl(0, 0%, 0%)", "hsl(12, 76%, 56%)", "hsl(158, 32%, 45%)", "hsl(42, 72%, 52%)", "hsl(48, 100%, 50%)".`;

    const userPrompt = `Script: "${safeScript}"
Video duration: ${safeDuration} seconds
${captions ? `Captions/metadata: ${JSON.stringify(captions).substring(0, 2000)}` : "No captions provided."}

Generate the full auto-edit plan.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
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
                overlays: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" }, x: { type: "number" }, y: { type: "number" },
                      fontSize: { type: "number" }, color: { type: "string" },
                      fontWeight: { type: "string", enum: ["normal", "bold"] },
                      align: { type: "string", enum: ["left", "center", "right"] },
                      startTime: { type: "number" }, endTime: { type: "number" },
                    },
                    required: ["text", "x", "y", "fontSize", "color", "fontWeight", "align", "startTime", "endTime"],
                    additionalProperties: false,
                  },
                },
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
      console.error("AI gateway error:", status, await response.text());
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limited, please try again" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("AI gateway error");
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) throw new Error("AI did not return structured edit data");

    const editPlan = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(editPlan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("auto-edit error:", e);
    return new Response(JSON.stringify({ error: "Request failed, please try again" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
