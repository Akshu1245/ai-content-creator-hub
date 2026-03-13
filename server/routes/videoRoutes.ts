import { Router } from "express";

const router = Router();
const JSON2VIDEO_API_KEY = process.env.JSON2VIDEO_API_KEY;
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;

const JSON2VIDEO_API_BASE = "https://api.json2video.com/v2";

function sanitize(str: unknown, maxLen = 200): string {
  return Array.from(String(str ?? "").substring(0, maxLen))
    .filter((char) => char.charCodeAt(0) >= 32)
    .join("");
}

router.post("/generate-video", async (req, res) => {
  try {
    if (!JSON2VIDEO_API_KEY) return res.status(500).json({ error: "JSON2VIDEO_API_KEY not configured" });
    const { action, prompt, task_id, duration, media_urls } = req.body;
    const apiHeaders = { "x-api-key": JSON2VIDEO_API_KEY, "Content-Type": "application/json" };

    if (action === "create") {
      const safePrompt = sanitize(prompt, 500);
      if (!safePrompt) return res.status(400).json({ error: "Missing prompt" });
      const sceneDuration = duration ? Math.min(Math.max(Number(duration), 1), 60) : 5;
      const urls: string[] = (media_urls || []).slice(0, 20);
      let scenes;
      if (urls.length > 0) {
        const perSceneDuration = Math.max(3, Math.round(sceneDuration * 3 / urls.length));
        scenes = urls.map((url: string, i: number) => {
          const isVideo = url.includes(".mp4") || url.includes("/video/") || url.includes("videos.pexels");
          return {
            duration: perSceneDuration,
            elements: [
              { type: isVideo ? "video" : "image", src: url, duration: perSceneDuration },
              ...(i === 0 ? [{ type: "text", text: safePrompt.slice(0, 120), style: "001", duration: Math.min(3, perSceneDuration) }] : []),
            ],
          };
        });
      } else {
        scenes = [{ duration: sceneDuration, elements: [{ type: "text", text: safePrompt, style: "001", duration: sceneDuration }] }];
      }
      const movieJson = { resolution: "full-hd", scenes };
      const response = await fetch(`${JSON2VIDEO_API_BASE}/movies`, {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify(movieJson),
      });
      if (!response.ok) throw new Error("Video creation failed");
      const vData = await response.json();
      return res.json({ task_id: vData.project, status: "submitted" });
    }

    if (action === "query") {
      const safeTaskId = sanitize(task_id, 100).replace(/[^a-zA-Z0-9_-]/g, "");
      if (!safeTaskId) return res.status(400).json({ error: "Missing task_id" });
      const response = await fetch(`${JSON2VIDEO_API_BASE}/movies?project=${safeTaskId}`, {
        method: "GET",
        headers: apiHeaders,
      });
      if (!response.ok) throw new Error("Video query failed");
      const qData = await response.json();
      const movie = qData.movie || qData;
      let status = movie.status;
      if (status === "rendering") status = "processing";
      if (status === "done") status = "completed";
      if (status === "error") status = "failed";
      return res.json({ task_id: movie.project || safeTaskId, status, video_url: movie.url || null, duration: movie.duration || null });
    }

    res.status(400).json({ error: "Unknown action" });
  } catch (e: any) {
    console.error("generate-video error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

router.post("/auto-edit", async (req, res) => {
  try {
    if (!LOVABLE_API_KEY) return res.status(500).json({ error: "LOVABLE_API_KEY not configured" });
    const { script, duration, captions } = req.body;
    const safeScript = sanitize(script, 10000);
    const safeDuration = Math.min(Math.max(Number(duration) || 0, 1), 3600);
    if (!safeScript || !safeDuration) return res.status(400).json({ error: "script and duration are required" });

    const systemPrompt = `You are a professional video editor AI specializing in faceless YouTube content. Given a script, video duration, and optional captions, generate a precise editing plan that enhances the content's impact.

Your editing philosophy:
- Highlight KEY INSIGHTS with text overlays, not generic phrases — pull the most surprising data points, counterintuitive claims, or actionable frameworks from the script
- Time overlays to reinforce what the narrator is saying at that exact moment
- Use trim to cut dead air or weak openings — start where the substance begins
- Suggest edits that improve pacing and visual engagement without cheapening the content
- Text overlays should be concise (3-8 words max) and positioned to not obstruct the main content
- Generate 4-8 well-timed overlays that emphasize the script's strongest moments`;
    const userPrompt = `Script: "${safeScript}"\nVideo duration: ${safeDuration} seconds\n${captions ? `Captions/metadata: ${JSON.stringify(captions).substring(0, 2000)}` : "No captions provided."}\n\nGenerate a precise auto-edit plan. Focus overlays on the most impactful data points, quotes, and actionable takeaways from the script.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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
                overlays: { type: "array", items: { type: "object", properties: { text: { type: "string" }, x: { type: "number" }, y: { type: "number" }, fontSize: { type: "number" }, color: { type: "string" }, fontWeight: { type: "string", enum: ["normal", "bold"] }, align: { type: "string", enum: ["left", "center", "right"] }, startTime: { type: "number" }, endTime: { type: "number" } }, required: ["text", "x", "y", "fontSize", "color", "fontWeight", "align", "startTime", "endTime"], additionalProperties: false } },
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
      if (status === 429) return res.status(429).json({ error: "Rate limited, please try again" });
      if (status === 402) return res.status(402).json({ error: "Credits exhausted" });
      throw new Error("AI gateway error");
    }
    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) throw new Error("AI did not return structured edit data");
    res.json(JSON.parse(toolCall.function.arguments));
  } catch (e: any) {
    console.error("auto-edit error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

export default router;