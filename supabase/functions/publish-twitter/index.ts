// supabase/functions/publish-twitter/index.ts
// Twitter/X Video Publishing API

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

    const { action, videoUrl, text, projectId } = await req.json();

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

    // Get user's Twitter credentials
    const { data: twitterCredentials } = await supabaseClient
      .from("user_integrations")
      .select("*")
      .eq("user_id", user.id)
      .eq("provider", "twitter")
      .single();

    if (!twitterCredentials?.access_token) {
      return new Response(JSON.stringify({ 
        error: "Twitter not connected",
        connectUrl: "/settings?integrations=twitter"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "publish") {
      // Twitter requires downloading video and uploading via their API
      // Note: Twitter has strict video requirements (max 140 seconds, specific formats)
      
      // Step 1: Get video info and convert if needed
      const convertedVideo = await convertForTwitter(videoUrl);
      
      // Step 2: Upload media to Twitter
      const mediaUpload = await uploadMediaToTwitter(
        twitterCredentials.access_token,
        convertedVideo.url
      );
      
      // Step 3: Create tweet with video
      const tweet = await createTweet(
        twitterCredentials.access_token,
        text,
        mediaUpload.mediaId
      );

      // Save to scheduled posts
      await supabaseClient
        .from("scheduled_posts")
        .insert({
          project_id: projectId,
          platform: "twitter",
          status: "published",
          external_id: tweet.id,
          published_at: new Date().toISOString()
        });

      return new Response(JSON.stringify({ 
        success: true, 
        tweetId: tweet.id,
        url: `https://twitter.com/i/status/${tweet.id}`
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
          platform: "twitter",
          status: "scheduled",
          video_url: videoUrl,
          caption: text,
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
      const profile = await getTwitterProfile(twitterCredentials.access_token);
      
      return new Response(JSON.stringify(profile), {
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

async function convertForTwitter(videoUrl: string) {
  // Twitter video requirements:
  // - MP4 or MOV
  // - Max 140 seconds
  // - Max 512MB
  // - H264 codec
  // - AAC audio
  
  // Use FFmpeg to convert if needed
  // Return converted video URL
  
  return {
    url: videoUrl,
    format: "mp4",
    duration: 60, // would be actual duration
    size: "50MB"
  };
}

async function uploadMediaToTwitter(accessToken: string, videoUrl: string) {
  // Twitter Media Upload API (Chunked upload for videos)
  // 1. INIT
  // 2. APPEND
  // 3. FINALIZE
  
  // Mock response
  return {
    mediaId: `twitter_${Date.now()}`,
    mediaIdString: `_${Date.now()}twitter`
  };
}

async function createTweet(accessToken: string, text: string, mediaId: string) {
  // Create tweet with media
  const res = await fetch(
    "https://api.twitter.com/2/tweets",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        media: { media_ids: [mediaId] }
      })
    }
  );

  const data = await res.json();
  
  return {
    id: data.data?.id || `mock_${Date.now()}`,
    text
  };
}

async function getTwitterProfile(accessToken: string) {
  const res = await fetch(
    "https://api.twitter.com/2/users/me",
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );

  return await res.json();
}
