// supabase/functions/youtube-analytics/index.ts
// YouTube Data API v3 Integration for Real Analytics
// Requires: YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN

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

    const { action, channelId } = await req.json();

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

    // Get user's YouTube credentials
    const { data: ytCredentials } = await supabaseClient
      .from("user_integrations")
      .select("*")
      .eq("user_id", user.id)
      .eq("provider", "youtube")
      .single();

    if (!ytCredentials?.access_token) {
      return new Response(JSON.stringify({ 
        error: "YouTube not connected",
        connectUrl: "/settings?integrations=youtube"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Refresh token if needed
    let accessToken = ytCredentials.access_token;
    const tokenExpiry = new Date(ytCredentials.expires_at);
    
    if (tokenExpiry < new Date()) {
      const refreshed = await refreshYouTubeToken(ytCredentials.refresh_token);
      accessToken = refreshed.access_token;
      
      await supabaseClient
        .from("user_integrations")
        .update({
          access_token: refreshed.access_token,
          expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
        })
        .eq("user_id", user.id)
        .eq("provider", "youtube");
    }

    if (action === "channel") {
      // Get channel statistics
      const channelData = await getChannelStats(accessToken, channelId || "mine");
      
      return new Response(JSON.stringify(channelData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "analytics") {
      // Get video analytics
      const { videoId, startDate, endDate } = await req.json();
      const analytics = await getVideoAnalytics(accessToken, videoId, startDate, endDate);
      
      return new Response(JSON.stringify(analytics), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "videos") {
      // List user's videos
      const { maxResults = 10 } = await req.json();
      const videos = await listUserVideos(accessToken, maxResults);
      
      return new Response(JSON.stringify({ videos }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "recent") {
      // Get recent video performance
      const videos = await listUserVideos(accessToken, 5);
      const analytics = await Promise.all(
        videos.items.map(v => getVideoAnalytics(accessToken, v.id))
      );

      return new Response(JSON.stringify({
        videos: videos.items.map((v, i) => ({
          ...v,
          analytics: analytics[i]
        }))
      }), {
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

async function refreshYouTubeToken(refreshToken: string) {
  const clientId = Deno.env.get("YOUTUBE_CLIENT_ID");
  const clientSecret = Deno.env.get("YOUTUBE_CLIENT_SECRET");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    })
  });

  return await res.json();
}

async function getChannelStats(accessToken: string, channelId: string) {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet,contentDetails&id=${channelId}&mine=true`,
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );

  const data = await res.json();
  
  if (!data.items?.length) {
    return { error: "No channel found" };
  }

  const channel = data.items[0];
  return {
    id: channel.id,
    title: channel.snippet.title,
    description: channel.snippet.description,
    thumbnail: channel.snippet.thumbnails?.medium?.url,
    subscriberCount: parseInt(channel.statistics.subscriberCount),
    viewCount: parseInt(channel.statistics.viewCount),
    videoCount: parseInt(channel.statistics.videoCount),
    uploadsPlaylist: channel.contentDetails.relatedPlaylists.uploads
  };
}

async function getVideoAnalytics(
  accessToken: string, 
  videoId: string, 
  startDate?: string, 
  endDate?: string
) {
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const end = endDate || new Date().toISOString().split("T")[0];

  const res = await fetch(
    `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&startDate=${start}&endDate=${end}&metrics=views,watchTime,likes,comments,subscribersGained,subscribersLost&dimensions=video&filters=video==${videoId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );

  if (!res.ok) {
    return { error: "Failed to fetch analytics" };
  }

  const data = await res.json();
  
  if (!data.rows?.length) {
    return { views: 0, watchTime: 0, likes: 0, comments: 0 };
  }

  const row = data.rows[0];
  return {
    views: row[1],
    watchTime: row[2],
    likes: row[3],
    comments: row[4],
    subscribersGained: row[5],
    subscribersLost: row[6]
  };
}

async function listUserVideos(accessToken: string, maxResults: number) {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/mine/videos?part=snippet,statistics&maxResults=${maxResults}&myRating=like`,
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );

  const data = await res.json();
  return data;
}
