// supabase/functions/publish-tiktok/index.ts
// TikTok Upload API Integration
// Note: TikTok has strict API access - most developers use manual upload workflow
// This function handles the video upload and metadata

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

    const { action, videoUrl, caption, projectId, videoFile } = await req.json();

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

    // Get user's TikTok credentials
    const { data: tiktokCredentials } = await supabaseClient
      .from("user_integrations")
      .select("*")
      .eq("user_id", user.id)
      .eq("provider", "tiktok")
      .single();

    // TikTok requires manual upload workflow - we prepare the data
    if (action === "prepare-upload") {
      // Generate upload URL from TikTok
      const uploadUrl = await getTikTokUploadUrl();
      
      return new Response(JSON.stringify({
        uploadUrl: uploadUrl.upload_url,
        uploadId: uploadUrl.upload_id,
        endpoint: "https://upload.tiktok.com/v2/"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "publish") {
      // Note: TikTok's API requires special approval
      // Most common approach: Generate download link for manual upload
      
      // Option 1: If user has direct API access (rare)
      if (tiktokCredentials?.access_token) {
        // This would require TikTok's Video Kit API (limited access)
        // For now, we'll prepare a download link
      }

      // Option 2: Generate a shareable download link
      const { data: project } = await supabaseClient
        .from("projects")
        .select("video_url")
        .eq("id", projectId)
        .single();

      // Save to scheduled posts
      await supabaseClient
        .from("scheduled_posts")
        .insert({
          project_id: projectId,
          platform: "tiktok",
          status: "ready_for_upload",
          video_url: project?.video_url || videoUrl,
          caption: caption,
          notes: "TikTok requires manual upload. Download video and upload via TikTok app."
        });

      return new Response(JSON.stringify({
        success: true,
        downloadUrl: project?.video_url || videoUrl,
        instructions: [
          "1. Download the video using the link above",
          "2. Open TikTok app",
          "3. Tap + to create new video",
          "4. Upload the downloaded video",
          "5. Add caption and publish"
        ],
        caption: caption,
        hashtags: generateTikTokHashtags(caption)
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "schedule") {
      const { scheduledAt } = await req.json();
      
      await supabaseClient
        .from("scheduled_posts")
        .insert({
          project_id: projectId,
          platform: "tiktok",
          status: "scheduled",
          video_url: videoUrl,
          caption,
          scheduled_at: scheduledAt
        });

      return new Response(JSON.stringify({ 
        success: true, 
        scheduledFor: scheduledAt
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get-profile") {
      // Get TikTok account info (if API access available)
      if (!tiktokCredentials?.access_token) {
        return new Response(JSON.stringify({ 
          connected: false,
          message: "Connect TikTok in Settings to enable analytics"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const profile = await getTikTokProfile(tiktokCredentials.access_token);
      
      return new Response(JSON.stringify(profile), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "trending") {
      // Get trending sounds and hashtags
      const trending = await getTikTokTrending();
      
      return new Response(JSON.stringify(trending), {
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

// TikTok Upload API (requires special permission)
async function getTikTokUploadUrl() {
  const clientKey = Deno.env.get("TIKTOK_CLIENT_KEY");
  const clientSecret = Deno.env.get("TIKTOK_CLIENT_SECRET");
  
  // This endpoint requires TikTok's Video Kit API
  // Most developers don't have access - they use manual workflow
  
  // Return mock for now
  return {
    upload_url: "https://upload.tiktok.com/v2/",
    upload_id: `upload_${Date.now()}`
  };
}

async function getTikTokProfile(accessToken: string) {
  // TikTok Profile API (if available)
  const res = await fetch(
    "https://open.tiktokapis.com/v2/user/info/",
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );

  if (!res.ok) {
    return { error: "Failed to fetch profile" };
  }

  return await res.json();
}

async function getTikTokTrending() {
  // Return trending data (this would typically come from a third-party API)
  // since TikTok doesn't provide a public trending API
  
  return {
    sounds: [
      { id: "sound_1", title: "Original Sound", duration: 15 },
      { id: "sound_2", title: "Trending Beat", duration: 30 },
      { id: "sound_3", title: "Viral Song", duration: 10 }
    ],
    hashtags: [
      { id: "tag_1", name: "fyp", count: "1B+" },
      { id: "tag_2", name: "viral", count: "500M+" },
      { id: "tag_3", name: "trending", count: "300M+" },
      { id: "tag_4", name: "new", count: "200M+" },
      { id: "tag_5", name: "fashion", count: "150M+" }
    ],
    tips: [
      "Use trending sounds within 3 days of trending",
      "Keep videos under 15 seconds for better retention",
      "Add text overlays for accessibility"
    ]
  };
}

function generateTikTokHashtags(caption: string): string[] {
  const defaultTags = ["fyp", "foryou", "viral", "trending"];
  
  // Extract keywords from caption
  const words = caption
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3);
  
  // Add relevant hashtags
  const tags = [...defaultTags];
  
  // Add topic-based hashtags
  if (caption.includes("dance")) tags.push("dance", "dancing");
  if (caption.includes("music")) tags.push("music", "song");
  if (caption.includes("funny")) tags.push("funny", "comedy", "lol");
  if (caption.includes("food")) tags.push("food", "foodie", "yummy");
  if (caption.includes("travel")) tags.push("travel", "wanderlust", "adventure");
  if (caption.includes("fashion")) tags.push("fashion", "style", "ootd");
  if (caption.includes("tech")) tags.push("tech", "technology", "gadgets");
  if (caption.includes("gaming")) tags.push("gaming", "gamer", "play");
  
  // Return top 5 unique tags
  return [...new Set(tags)].slice(0, 5);
}
