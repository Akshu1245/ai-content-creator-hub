import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { script, duration, captions } = await req.json();

    if (!script || !duration) {
      return new Response(
        JSON.stringify({ error: "script and duration are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a professional video editor AI. Given a script, video duration, and optional captions, generate a complete editing plan.

Return a JSON object using the tool provided with:
1. "trim" - optimal start/end times to cut dead space (keep most content, just trim edges if needed)
2. "overlays" - timed text overlays for key moments (titles, callouts, key phrases). Place 3-8 overlays strategically throughout the video. Each overlay should:
   - Use short, impactful text (2-6 words)
   - Be timed to appear for 2-4 seconds
   - Use varied positions (not all centered)
   - Use bold weight for titles, normal for subtitles
   - Alternate between white and accent colors
3. "suggestions" - 2-4 human-readable editing tips the user might want to apply manually

For positions: x is 0-100 (left to right), y is 0-100 (top to bottom). Center is 50,50. Title at top: y=15. Lower third: y=80.
Colors available: "hsl(0, 0%, 100%)" (white), "hsl(0, 0%, 0%)" (black), "hsl(12, 76%, 56%)" (coral), "hsl(158, 32%, 45%)" (teal), "hsl(42, 72%, 52%)" (amber), "hsl(48, 100%, 50%)" (yellow).`;

    const userPrompt = `Script: "${script}"
Video duration: ${duration} seconds
${captions ? `Captions/metadata: ${JSON.stringify(captions)}` : "No captions provided."}

Generate the full auto-edit plan.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "apply_edits",
                description:
                  "Apply a full auto-edit plan to the video editor.",
                parameters: {
                  type: "object",
                  properties: {
                    trim: {
                      type: "object",
                      properties: {
                        start: { type: "number" },
                        end: { type: "number" },
                      },
                      required: ["start", "end"],
                    },
                    overlays: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          text: { type: "string" },
                          x: { type: "number" },
                          y: { type: "number" },
                          fontSize: { type: "number" },
                          color: { type: "string" },
                          fontWeight: {
                            type: "string",
                            enum: ["normal", "bold"],
                          },
                          align: {
                            type: "string",
                            enum: ["left", "center", "right"],
                          },
                          startTime: { type: "number" },
                          endTime: { type: "number" },
                        },
                        required: [
                          "text", "x", "y", "fontSize", "color",
                          "fontWeight", "align", "startTime", "endTime",
                        ],
                        additionalProperties: false,
                      },
                    },
                    suggestions: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                  required: ["trim", "overlays", "suggestions"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "apply_edits" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI gateway error");
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("AI did not return structured edit data");
    }

    const editPlan = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(editPlan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("auto-edit error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
