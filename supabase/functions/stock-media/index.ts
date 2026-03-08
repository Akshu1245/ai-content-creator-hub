import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const PEXELS_API_KEY = Deno.env.get("PEXELS_API_KEY");
    if (!PEXELS_API_KEY) throw new Error("PEXELS_API_KEY not configured");

    const { query, type, per_page, orientation } = await req.json();
    if (!query) throw new Error("Missing search query");

    const mediaType = type || "photos"; // "photos" or "videos"
    const baseUrl = mediaType === "videos"
      ? "https://api.pexels.com/videos/search"
      : "https://api.pexels.com/v1/search";

    const params = new URLSearchParams({
      query,
      per_page: String(per_page || 10),
      orientation: orientation || "landscape",
    });

    const response = await fetch(`${baseUrl}?${params}`, {
      headers: { Authorization: PEXELS_API_KEY },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Pexels API error [${response.status}]: ${errorBody}`);
    }

    const data = await response.json();

    // Normalize response
    if (mediaType === "videos") {
      const videos = (data.videos || []).map((v: any) => ({
        id: v.id,
        url: v.url,
        image: v.image,
        duration: v.duration,
        width: v.width,
        height: v.height,
        videoFiles: v.video_files?.map((f: any) => ({
          link: f.link,
          quality: f.quality,
          width: f.width,
          height: f.height,
          fileType: f.file_type,
        })) || [],
        photographer: v.user?.name || "",
      }));
      return new Response(JSON.stringify({ type: "videos", results: videos, total: data.total_results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const photos = (data.photos || []).map((p: any) => ({
        id: p.id,
        url: p.url,
        alt: p.alt,
        photographer: p.photographer,
        src: {
          original: p.src?.original,
          large: p.src?.large,
          medium: p.src?.medium,
          small: p.src?.small,
          landscape: p.src?.landscape,
        },
      }));
      return new Response(JSON.stringify({ type: "photos", results: photos, total: data.total_results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.error("stock-media error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
