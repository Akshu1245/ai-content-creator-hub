import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const JSON2VIDEO_API_BASE = 'https://api.json2video.com/v2';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const JSON2VIDEO_API_KEY = Deno.env.get('JSON2VIDEO_API_KEY');
    if (!JSON2VIDEO_API_KEY) {
      throw new Error('JSON2VIDEO_API_KEY is not configured');
    }

    const { action, prompt, task_id, duration, aspect_ratio, media_urls } = await req.json();

    const apiHeaders = {
      'x-api-key': JSON2VIDEO_API_KEY,
      'Content-Type': 'application/json',
    };

    // CREATE a new video rendering job
    if (action === 'create') {
      if (!prompt) throw new Error('Missing prompt for video generation');

      const sceneDuration = duration ? Number(duration) : 5;
      const urls: string[] = media_urls || [];

      // Build scenes: if media URLs provided, create a scene per media item
      // Otherwise fall back to a text-only scene
      let scenes;
      if (urls.length > 0) {
        const perSceneDuration = Math.max(3, Math.round(sceneDuration * 3 / urls.length));
        scenes = urls.map((url: string, i: number) => {
          const isVideo = url.includes('.mp4') || url.includes('/video/') || url.includes('videos.pexels');
          return {
            duration: perSceneDuration,
            elements: [
              {
                type: isVideo ? "video" : "image",
                src: url,
                duration: perSceneDuration,
              },
              {
                type: "text",
                text: i === 0 ? prompt.slice(0, 120) : "",
                style: "001",
                duration: Math.min(3, perSceneDuration),
              }
            ].filter(el => el.type !== "text" || el.text),
          };
        });
      } else {
        scenes = [
          {
            duration: sceneDuration,
            elements: [
              {
                type: "text",
                text: prompt,
                style: "001",
                duration: sceneDuration,
              }
            ]
          }
        ];
      }

      const movieJson = {
        resolution: "full-hd",
        scenes,
      };

      console.log('JSON2Video create payload:', JSON.stringify(movieJson));

      const response = await fetch(`${JSON2VIDEO_API_BASE}/movies`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(movieJson),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`JSON2Video API create error [${response.status}]: ${errorBody}`);
      }

      const data = await response.json();
      return new Response(JSON.stringify({
        task_id: data.project,
        status: 'submitted',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // QUERY task status
    if (action === 'query') {
      if (!task_id) throw new Error('Missing task_id for query');

      const response = await fetch(`${JSON2VIDEO_API_BASE}/movies?project=${task_id}`, {
        method: 'GET',
        headers: apiHeaders,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`JSON2Video API query error [${response.status}]: ${errorBody}`);
      }

      const data = await response.json();
      console.log('JSON2Video query raw response:', JSON.stringify(data));

      const movie = data.movie || data;

      // JSON2Video statuses: "rendering", "done", "error"
      let status = movie.status;
      if (status === 'rendering') status = 'processing';
      if (status === 'done') status = 'completed';
      if (status === 'error') status = 'failed';

      return new Response(JSON.stringify({
        task_id: movie.project || task_id,
        status: status,
        video_url: movie.url || null,
        duration: movie.duration || null,
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
