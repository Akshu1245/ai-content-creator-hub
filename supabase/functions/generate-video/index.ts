import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const KLING_API_BASE = 'https://api-singapore.klingai.com';

// Generate JWT token for Kling API authentication
async function generateKlingJWT(accessKey: string, secretKey: string): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: accessKey,
    exp: now + 1800, // 30 min expiry
    nbf: now - 5,
    iat: now,
  };

  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${signingInput}.${sigB64}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const KLING_ACCESS_KEY = Deno.env.get('KLING_ACCESS_KEY');
    const KLING_SECRET_KEY = Deno.env.get('KLING_SECRET_KEY');

    if (!KLING_ACCESS_KEY || !KLING_SECRET_KEY) {
      throw new Error('Kling API keys are not configured');
    }

    const { action, prompt, task_id, duration, aspect_ratio } = await req.json();

    const token = await generateKlingJWT(KLING_ACCESS_KEY, KLING_SECRET_KEY);
    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // CREATE a new video generation task
    if (action === 'create') {
      if (!prompt) throw new Error('Missing prompt for video generation');

      const response = await fetch(`${KLING_API_BASE}/v1/videos/text2video`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          model_name: "kling-v1",
          prompt: prompt,
          duration: duration || "5",
          aspect_ratio: aspect_ratio || "16:9",
          mode: "std",
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Kling API create error [${response.status}]: ${errorBody}`);
      }

      const data = await response.json();
      return new Response(JSON.stringify({
        task_id: data.data?.task_id,
        status: 'submitted',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // QUERY task status
    if (action === 'query') {
      if (!task_id) throw new Error('Missing task_id for query');

      const response = await fetch(`${KLING_API_BASE}/v1/videos/text2video/${task_id}`, {
        method: 'GET',
        headers: authHeaders,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Kling API query error [${response.status}]: ${errorBody}`);
      }

      const data = await response.json();
      const taskData = data.data;

      return new Response(JSON.stringify({
        task_id: taskData?.task_id,
        status: taskData?.task_status,
        video_url: taskData?.task_result?.videos?.[0]?.url || null,
        duration: taskData?.task_result?.videos?.[0]?.duration || null,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`Unknown action: ${action}`);
  } catch (error) {
    console.error('Video generation error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
