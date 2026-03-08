import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const JSON2VIDEO_API_BASE = 'https://api.json2video.com/v2';

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

    const JSON2VIDEO_API_KEY = Deno.env.get('JSON2VIDEO_API_KEY');
    if (!JSON2VIDEO_API_KEY) throw new Error('JSON2VIDEO_API_KEY is not configured');

    const { action, prompt, task_id, duration, aspect_ratio, media_urls } = await req.json();

    const apiHeaders = {
      'x-api-key': JSON2VIDEO_API_KEY,
      'Content-Type': 'application/json',
    };

    if (action === 'create') {
      const safePrompt = (prompt ?? "").substring(0, 500).replace(/[\x00-\x1f]/g, "");
      if (!safePrompt) {
        return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const sceneDuration = duration ? Math.min(Math.max(Number(duration), 1), 60) : 5;
      const urls: string[] = (media_urls || []).slice(0, 20);

      let scenes;
      if (urls.length > 0) {
        const perSceneDuration = Math.max(3, Math.round(sceneDuration * 3 / urls.length));
        scenes = urls.map((url: string, i: number) => {
          const isVideo = url.includes('.mp4') || url.includes('/video/') || url.includes('videos.pexels');
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
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(movieJson),
      });

      if (!response.ok) {
        console.error("JSON2Video create error:", response.status, await response.text());
        throw new Error("Video creation failed");
      }

      const vData = await response.json();
      return new Response(JSON.stringify({ task_id: vData.project, status: 'submitted' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'query') {
      const safeTaskId = (task_id ?? "").substring(0, 100).replace(/[^a-zA-Z0-9_-]/g, "");
      if (!safeTaskId) {
        return new Response(JSON.stringify({ error: "Missing task_id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const response = await fetch(`${JSON2VIDEO_API_BASE}/movies?project=${safeTaskId}`, {
        method: 'GET',
        headers: apiHeaders,
      });

      if (!response.ok) {
        console.error("JSON2Video query error:", response.status, await response.text());
        throw new Error("Video query failed");
      }

      const qData = await response.json();
      const movie = qData.movie || qData;
      let status = movie.status;
      if (status === 'rendering') status = 'processing';
      if (status === 'done') status = 'completed';
      if (status === 'error') status = 'failed';

      return new Response(JSON.stringify({
        task_id: movie.project || safeTaskId,
        status,
        video_url: movie.url || null,
        duration: movie.duration || null,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Video generation error:', error);
    return new Response(JSON.stringify({ error: "Request failed, please try again" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
