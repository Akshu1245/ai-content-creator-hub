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

    const { action, prompt, task_id, duration, aspect_ratio } = await req.json();

    const apiHeaders = {
      'x-api-key': JSON2VIDEO_API_KEY,
      'Content-Type': 'application/json',
    };

    // CREATE a new video rendering job
    if (action === 'create') {
      if (!prompt) throw new Error('Missing prompt for video generation');

      // Map aspect ratio to resolution
      const resolutionMap: Record<string, [number, number]> = {
        '16:9': [1920, 1080],
        '9:16': [1080, 1920],
        '1:1': [1080, 1080],
        '4:3': [1440, 1080],
        '3:4': [1080, 1440],
      };
      const [width, height] = resolutionMap[aspect_ratio || '16:9'] || [1920, 1080];

      const movieJson = {
        resolution: `${width}x${height}`,
        scenes: [
          {
            duration: duration ? Number(duration) : 5,
            elements: [
              {
                type: "text",
                text: prompt,
                style: "style1",
                position: "center",
                duration: duration ? Number(duration) : 5,
              }
            ]
          }
        ]
      };

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

      // JSON2Video statuses: "rendering", "done", "error"
      let status = data.status;
      if (status === 'rendering') status = 'processing';
      if (status === 'done') status = 'completed';
      if (status === 'error') status = 'failed';

      return new Response(JSON.stringify({
        task_id: data.project,
        status: status,
        video_url: data.url || null,
        duration: data.duration || null,
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
