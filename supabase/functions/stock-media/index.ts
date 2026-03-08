import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

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

    const PEXELS_API_KEY = Deno.env.get("PEXELS_API_KEY");
    if (!PEXELS_API_KEY) throw new Error("PEXELS_API_KEY not configured");

    const { query, type, per_page, orientation } = await req.json();
    const safeQuery = (query ?? "").substring(0, 200).replace(/[\x00-\x1f]/g, "");
    if (!safeQuery) {
      return new Response(JSON.stringify({ error: "Missing search query" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const mediaType = type === "videos" ? "videos" : "photos";
    const baseUrl = mediaType === "videos"
      ? "https://api.pexels.com/videos/search"
      : "https://api.pexels.com/v1/search";

    const safePP = Math.min(Math.max(Number(per_page) || 10, 1), 30);
    const safeOrientation = ["landscape", "portrait", "square"].includes(orientation) ? orientation : "landscape";

    const params = new URLSearchParams({ query: safeQuery, per_page: String(safePP), orientation: safeOrientation });

    const response = await fetch(`${baseUrl}?${params}`, {
      headers: { Authorization: PEXELS_API_KEY },
    });

    if (!response.ok) {
      console.error("Pexels API error:", response.status, await response.text());
      throw new Error("Media search failed");
    }

    const pData = await response.json();

    if (mediaType === "videos") {
      const videos = (pData.videos || []).map((v: any) => ({
        id: v.id, url: v.url, image: v.image, duration: v.duration,
        width: v.width, height: v.height,
        videoFiles: v.video_files?.map((f: any) => ({
          link: f.link, quality: f.quality, width: f.width, height: f.height, fileType: f.file_type,
        })) || [],
        photographer: v.user?.name || "",
      }));
      return new Response(JSON.stringify({ type: "videos", results: videos, total: pData.total_results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const photos = (pData.photos || []).map((p: any) => ({
        id: p.id, url: p.url, alt: p.alt, photographer: p.photographer,
        src: { original: p.src?.original, large: p.src?.large, medium: p.src?.medium, small: p.src?.small, landscape: p.src?.landscape },
      }));
      return new Response(JSON.stringify({ type: "photos", results: photos, total: pData.total_results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.error("stock-media error:", e);
    return new Response(JSON.stringify({ error: "Request failed, please try again" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
