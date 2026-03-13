import { Router } from "express";

const router = Router();
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;

function sanitize(str: unknown, maxLen = 200): string {
  return Array.from(String(str ?? "").substring(0, maxLen))
    .filter((char) => char.charCodeAt(0) >= 32)
    .join("");
}

router.post("/compliance-check", async (req, res) => {
  try {
    if (!LOVABLE_API_KEY) return res.status(500).json({ error: "LOVABLE_API_KEY not configured" });
    const { script, topic, niche } = req.body;
    const safeScript = sanitize(script, 10000);
    const safeTopic = sanitize(topic, 200);
    const safeNiche = sanitize(niche, 100);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
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
                overall: { type: "number" },
                scores: { type: "object", properties: { originality: { type: "number" }, value: { type: "number" }, misinformation: { type: "number" }, monetization: { type: "number" } }, required: ["originality", "value", "misinformation", "monetization"] },
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
          { role: "system", content: "You are a YouTube policy compliance expert. Analyze video scripts for monetization risks, originality, value delivery, and misinformation. Score each dimension 0-100 (100 = fully safe)." },
          { role: "user", content: `Analyze this ${safeNiche} video script about "${safeTopic}" for YouTube compliance:\n\n${safeScript}` },
        ],
      }),
    });
    if (!response.ok) {
      const status = response.status;
      if (status === 429) return res.status(429).json({ error: "Rate limited, please try again" });
      if (status === 402) return res.status(402).json({ error: "Credits exhausted" });
      throw new Error("AI analysis failed");
    }
    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      return res.json(JSON.parse(toolCall.function.arguments));
    }
    throw new Error("No tool call response from AI");
  } catch (e: any) {
    console.error("compliance-check error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

router.post("/compliance-fix", async (req, res) => {
  try {
    if (!LOVABLE_API_KEY) return res.status(500).json({ error: "LOVABLE_API_KEY not configured" });
    const { script, warnings, recommendations } = req.body;
    const safeScript = sanitize(script, 10000);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an expert script editor specializing in YouTube monetization compliance. Fix the given script to address all compliance warnings and recommendations. Maintain the script's intellectual depth, nuance, and specific data points. Do NOT dumb down the content or replace substantive arguments with generic filler. Keep the same structure, tone, and approximate length. Return ONLY the fixed script text, no explanations." },
          { role: "user", content: `Fix this script to address these compliance issues while preserving its quality and depth:\n\nWarnings: ${JSON.stringify(warnings)}\nRecommendations: ${JSON.stringify(recommendations)}\n\nScript:\n${safeScript}` },
        ],
      }),
    });
    if (!response.ok) {
      const status = response.status;
      if (status === 429) return res.status(429).json({ error: "Rate limited, please try again" });
      if (status === 402) return res.status(402).json({ error: "Credits exhausted" });
      throw new Error("AI error");
    }
    const aiData = await response.json();
    const fixedScript = aiData.choices?.[0]?.message?.content || "";
    res.json({ fixedScript });
  } catch (e: any) {
    console.error("compliance-fix error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

router.post("/copyright-scan", async (req, res) => {
  try {
    if (!LOVABLE_API_KEY) return res.status(500).json({ error: "LOVABLE_API_KEY not configured" });
    const { script, topic, niche } = req.body;
    const safeScript = sanitize(script, 10000);
    const safeTopic = sanitize(topic, 200);
    const safeNiche = sanitize(niche, 100);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a copyright risk analyzer for YouTube videos. Analyze the provided script for potential copyright issues. You MUST respond with valid JSON only, no markdown.`,
          },
          {
            role: "user",
            content: `Topic: "${safeTopic}" (Niche: ${safeNiche})\n\nScript to analyze:\n${safeScript}\n\nReturn this exact JSON structure:\n{\n  "overallRisk": "safe|caution|high_risk",\n  "audioRisk": { "status": "safe", "detail": "AI-generated voiceover — no copyright risk" },\n  "visualRisk": { "status": "safe", "watermarksDetected": false },\n  "scriptRisk": { "status": "safe|caution|high_risk", "originalityScore": 0-100 },\n  "issues": [{ "type": "audio|visual|script", "severity": "low|medium|high", "text": "description", "fix": "suggestion" }],\n  "safeMusicAlternatives": ["YouTube Audio Library", "Pixabay Music", "Incompetech (Kevin MacLeod — CC BY)"],\n  "channelRiskSummary": "one sentence summary"\n}`,
          },
        ],
        temperature: 0.3,
      }),
    });
    if (!response.ok) throw new Error("AI analysis failed");
    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse AI response");
    res.json(JSON.parse(jsonMatch[0]));
  } catch (e: any) {
    console.error("copyright-scan error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

export default router;