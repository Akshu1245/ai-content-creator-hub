import { Router } from "express";

const router = Router();
const SARVAM_API_KEY = process.env.SARVAM_API_KEY;

function sanitize(str: unknown, maxLen = 200): string {
  return Array.from(String(str ?? "").substring(0, maxLen))
    .filter((char) => char.charCodeAt(0) >= 32)
    .join("");
}

router.post("/generate-voice", async (req, res) => {
  try {
    if (!SARVAM_API_KEY) return res.status(500).json({ error: "SARVAM_API_KEY not configured" });
    const { text, speaker, speed } = req.body;
    const safeText = sanitize(text, 5000);
    const safeSpeaker = sanitize(speaker, 50).replace(/[^a-zA-Z0-9_-]/g, "");
    if (!safeText || !safeSpeaker) return res.status(400).json({ error: "Missing required fields: text, speaker" });

    const speakerMap: Record<string, string> = {
      roger: "shubh", sarah: "priya", george: "ratan", lily: "simran",
      brian: "amit", jessica: "shreya", amelia: "amelia", tanya: "tanya", neha: "neha",
    };
    const sarvamSpeaker = speakerMap[safeSpeaker] || "shubh";

    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: { "api-subscription-key": SARVAM_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        text: safeText,
        target_language_code: "en-IN",
        model: "bulbul:v3",
        speaker: sarvamSpeaker,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        ...(speed && { pace: speed }),
      }),
    });
    if (!response.ok) throw new Error("Voice generation failed");
    const voiceData = await response.json();
    res.json({ audio_base64: voiceData.audios?.[0] || null, request_id: voiceData.request_id, speaker: sarvamSpeaker });
  } catch (e: any) {
    console.error("generate-voice error:", e);
    res.status(500).json({ error: "Request failed, please try again" });
  }
});

export default router;
