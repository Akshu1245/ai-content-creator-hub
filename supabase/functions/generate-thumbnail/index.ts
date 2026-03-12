// supabase/functions/generate-thumbnail/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { action, projectId, videoUrl, title, script } = await req.json();

    // Get user auth
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "generate") {
      // Generate 3-5 thumbnail options using AI
      const thumbnails = await generateThumbnails({
        videoUrl,
        title: title || "Video",
        script: script || ""
      });

      // Save to project
      if (projectId) {
        await supabaseClient
          .from("projects")
          .update({ thumbnails })
          .eq("id", projectId);
      }

      return new Response(JSON.stringify({ thumbnails }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "select") {
      // User selects a thumbnail
      const { thumbnailUrl } = await req.json();

      if (projectId) {
        const { data: project } = await supabaseClient
          .from("projects")
          .select("thumbnail_url")
          .eq("id", projectId)
          .single();

        await supabaseClient
          .from("projects")
          .update({ 
            thumbnail_url: thumbnailUrl,
            thumbnail_history: [...(project?.thumbnail_history || []), thumbnailUrl]
          })
          .eq("id", projectId);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

interface ThumbnailOptions {
  videoUrl?: string;
  title: string;
  script: string;
}

async function generateThumbnails({ videoUrl, title, script }: ThumbnailOptions) {
  // Strategy 1: Use Pexels for stock images
  const pexelsKey = Deno.env.get("PEXELS_API_KEY");
  
  // Extract keywords from title and script
  const keywords = extractKeywords(title + " " + script);
  
  const thumbnails = [];

  // Try Pexels first (free tier: 200 requests/month)
  if (pexelsKey) {
    try {
      const searchQuery = keywords.slice(0, 3).join(" ");
      const pexelsRes = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=5&orientation=landscape`,
        {
          headers: { Authorization: pexelsKey }
        }
      );
      
      if (pexelsRes.ok) {
        const pexelsData = await pexelsRes.json();
        for (const photo of pexelsData.photos || []) {
          thumbnails.push({
            id: `pexels-${photo.id}`,
            url: photo.src.large,
            thumbnail_url: photo.src.medium,
            source: "pexels",
            photographer: photo.photographer,
            width: photo.width,
            height: photo.height
          });
        }
      }
    } catch (e) {
      console.error("Pexels error:", e);
    }
  }

  // Strategy 2: Use AI image generation (Stability AI - free tier: 1500 credits)
  const stabilityKey = Deno.env.get("STABILITY_API_KEY");
  
  if (stabilityKey && thumbnails.length < 3) {
    try {
      const prompt = `Professional YouTube thumbnail for "${title}" - ${keywords.join(", ")}, high contrast, eye-catching, vibrant colors, trending style`;
      
      const stabilityRes = await fetch(
        "https://api.stability.ai/v2beta/image-to-image",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${stabilityKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text_prompts: [{ text: prompt, weight: 1 }],
            cfg_scale: 7,
            samples: 3,
            steps: 30
          })
        }
      );

      if (stabilityRes.ok) {
        const stabilityData = await stabilityRes.json();
        for (const art of stabilityData.artifacts || []) {
          thumbnails.push({
            id: `ai-${art.seed}`,
            url: `data:image/png;base64,${art.base64}`,
            thumbnail_url: `data:image/png;base64,${art.base64}`,
            source: "stability-ai",
            width: 1024,
            height: 576
          });
        }
      }
    } catch (e) {
      console.error("Stability AI error:", e);
    }
  }

  // Strategy 3: Generate text overlay thumbnails
  const textThumbnails = generateTextThumbnails(title, 3);
  thumbnails.push(...textThumbnails);

  return thumbnails.slice(0, 5); // Return max 5 thumbnails
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "must", "shall", "can", "need",
    "this", "that", "these", "those", "i", "you", "he", "she", "it", "we",
    "they", "what", "which", "who", "whom", "whose", "where", "when", "why",
    "how", "all", "each", "every", "both", "few", "more", "most", "other",
    "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than",
    "too", "very", "just", "also", "now", "here", "there", "then", "once"
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  // Count frequency
  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  // Return top keywords
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => w);
}

function generateTextThumbnails(title: string, count: number) {
  const styles = [
    { bg: "#FF0000", text: "#FFFFFF", accent: "#000000" },
    { bg: "#000000", text: "#FFFFFF", accent: "#FFFF00" },
    { bg: "#1E3A8A", text: "#FFFFFF", accent: "#F59E0B" },
    { bg: "#065F46", text: "#FFFFFF", accent: "#10B981" },
    { bg: "#7C3AED", text: "#FFFFFF", accent: "#F472B6" }
  ];

  const thumbnails = [];
  
  for (let i = 0; i < count; i++) {
    const style = styles[i % styles.length];
    // Generate SVG thumbnail with text
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
        <rect width="1280" height="720" fill="${style.bg}"/>
        <rect x="40" y="40" width="1200" height="640" fill="none" stroke="${style.accent}" stroke-width="8"/>
        <text x="640" y="320" font-family="Arial Black, sans-serif" font-size="72" 
              fill="${style.text}" text-anchor="middle" dominant-baseline="middle">
          ${truncateText(title, 30)}
        </text>
        <text x="640" y="420" font-family="Arial, sans-serif" font-size="36" 
              fill="${style.accent}" text-anchor="middle">
          VORAX
        </text>
      </svg>
    `;
    
    thumbnails.push({
      id: `text-${i}`,
      url: `data:image/svg+xml;base64,${btoa(svg)}`,
      thumbnail_url: `data:image/svg+xml;base64,${btoa(svg)}`,
      source: "generated",
      width: 1280,
      height: 720
    });
  }

  return thumbnails;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
