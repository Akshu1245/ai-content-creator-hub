import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SARVAM_API_KEY = Deno.env.get('SARVAM_API_KEY');
    if (!SARVAM_API_KEY) {
      throw new Error('SARVAM_API_KEY is not configured');
    }

    const { text, speaker, speed } = await req.json();

    if (!text || !speaker) {
      throw new Error('Missing required fields: text, speaker');
    }

    // Map our voice IDs to Sarvam speaker names
    const speakerMap: Record<string, string> = {
      roger: "shubh",      // Deep, authoritative
      sarah: "priya",      // Warm, engaging
      george: "ratan",     // Classic documentary
      lily: "simran",      // Young, energetic
      brian: "amit",       // Calm, educational
      jessica: "shreya",   // Professional, clear
      amelia: "amelia",    // Soft, storytelling
      tanya: "tanya",      // Bold, confident
      neha: "neha",        // Friendly, conversational
    };

    const sarvamSpeaker = speakerMap[speaker] || "shubh";

    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        target_language_code: "en-IN",
        model: "bulbul:v3",
        speaker: sarvamSpeaker,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        ...(speed && { pace: speed }),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Sarvam API error [${response.status}]: ${errorBody}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify({
      audio_base64: data.audios?.[0] || null,
      request_id: data.request_id,
      speaker: sarvamSpeaker,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Voice generation error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
