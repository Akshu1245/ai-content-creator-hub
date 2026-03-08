import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

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

    const SARVAM_API_KEY = Deno.env.get('SARVAM_API_KEY');
    if (!SARVAM_API_KEY) throw new Error('SARVAM_API_KEY is not configured');

    const { text, speaker, speed } = await req.json();

    const safeText = (text ?? "").substring(0, 5000).replace(/[\x00-\x1f]/g, "");
    const safeSpeaker = (speaker ?? "").substring(0, 50).replace(/[^a-zA-Z0-9_-]/g, "");

    if (!safeText || !safeSpeaker) {
      return new Response(JSON.stringify({ error: "Missing required fields: text, speaker" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const speakerMap: Record<string, string> = {
      roger: "shubh", sarah: "priya", george: "ratan", lily: "simran",
      brian: "amit", jessica: "shreya", amelia: "amelia", tanya: "tanya", neha: "neha",
    };

    const sarvamSpeaker = speakerMap[safeSpeaker] || "shubh";

    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: { 'api-subscription-key': SARVAM_API_KEY, 'Content-Type': 'application/json' },
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

    if (!response.ok) {
      console.error("Sarvam API error:", response.status, await response.text());
      throw new Error("Voice generation failed");
    }

    const voiceData = await response.json();

    return new Response(JSON.stringify({
      audio_base64: voiceData.audios?.[0] || null,
      request_id: voiceData.request_id,
      speaker: sarvamSpeaker,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Voice generation error:', error);
    return new Response(JSON.stringify({ error: "Request failed, please try again" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
