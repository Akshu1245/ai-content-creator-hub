// supabase/functions/publish-instagram/index.ts
// Instagram Graph API Integration for Video Publishing
// Requires: INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET, INSTAGRAM_ACCESS_TOKEN

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

    const { action, videoUrl, caption, projectId } = await req.json();

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

    // Get user's Instagram credentials
    const { data: igCredentials } = await supabaseClient
      .from("user_integrations")
      .select("*")
      .eq("user_id", user.id)
      .eq("provider", "instagram")
      .single();

    if (!igCredentials?.access_token) {
      return new Response(JSON.stringify({ 
        error: "Instagram not connected",
        connectUrl: "/settings?integrations=instagram"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Refresh token if needed
    let accessToken = igCredentials.access_token;
    const tokenExpiry = new Date(igCredentials.expires_at);
    
    if (tokenExpiry < new Date()) {
      const refreshed = await refreshInstagramToken(igCredentials.refresh_token);
      accessToken = refreshed.access_token;
      
      await supabaseClient
        .from("user_integrations")
        .update({
          access_token: refreshed.access_token,
          expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
        })
        .eq("user_id", user.id)
        .eq("provider", "instagram");
    }

    if (action === "publish") {
      // Step 1: Create media container
      const container = await createMediaContainer(accessToken, videoUrl, caption);
      
      if (container.id) {
        // Step 2: Publish the container
        const published = await publishMedia(accessToken, container.id);
        
        // Save to scheduled posts
        await supabaseClient
          .from("scheduled_posts")
          .insert({
            project_id: projectId,
            platform: "instagram",
            status: "published",
            external_id: published.id,
            published_at: new Date().toISOString()
          });

        return new Response(JSON.stringify({ 
          success: true, 
          postId: published.id,
          url: `https://instagram.com/p/${published.id}`
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ 
        error: "Failed to create media container",
        details: container
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "schedule") {
      // Schedule for later
      const { scheduledAt } = await req.json();
      
      // Save to scheduled posts table
      await supabaseClient
        .from("scheduled_posts")
        .insert({
          project_id: projectId,
          platform: "instagram",
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
      // Get Instagram business account info
      const profile = await getInstagramProfile(accessToken);
      
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

async function refreshInstagramToken(refreshToken: string) {
  const appId = Deno.env.get("INSTAGRAM_APP_ID");
  const appSecret = Deno.env.get("INSTAGRAM_APP_SECRET");

  const res = await fetch(
    `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${refreshToken}`
  );

  return await res.json();
}

async function createMediaContainer(accessToken: string, videoUrl: string, caption: string) {
  // First, get the Instagram business account ID
  const accountsRes = await fetch(
    `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
  );
  
  const accountsData = await accountsRes.json();
  const igBusinessAccount = accountsData.data?.find(
    (a: any) => a.instagram_business_account
  );

  if (!igBusinessAccount?.instagram_business_account) {
    // Try direct Instagram Graph API
    const igRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,media_count&access_token=${accessToken}`
    );
    
    const igData = await igRes.json();
    
    // Create video container
    const createRes = await fetch(
      `https://graph.instagram.com/${igData.id}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          access_token: accessToken,
          media_type: "VIDEO",
          video_url: videoUrl,
          caption: caption,
          cover_url: videoUrl.replace('.mp4', '_thumb.jpg'),
          location_id: "",
          user_tags: ""
        })
      }
    );

    return await createRes.json();
  }

  const igAccountId = igBusinessAccount.instagram_business_account.id;

  // Create media container
  const res = await fetch(
    `https://graph.facebook.com/v18.0/${igAccountId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        access_token: accessToken,
        media_type: "VIDEO",
        video_url: videoUrl,
        caption: caption,
        location_id: "",
        user_tags: ""
      })
    }
  );

  return await res.json();
}

async function publishMedia(accessToken: string, containerId: string) {
  // Get Instagram business account
  const accountsRes = await fetch(
    `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
  );
  
  const accountsData = await accountsRes.json();
  const igBusinessAccount = accountsData.data?.find(
    (a: any) => a.instagram_business_account
  );

  let igAccountId = "";
  
  if (igBusinessAccount?.instagram_business_account) {
    igAccountId = igBusinessAccount.instagram_business_account.id;
  } else {
    // Try direct
    const igRes = await fetch(
      `https://graph.instagram.com/me?fields=id&access_token=${accessToken}`
    );
    const igData = await igRes.json();
    igAccountId = igData.id;
  }

  const res = await fetch(
    `https://graph.facebook.com/v18.0/${igAccountId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        access_token: accessToken,
        creation_id: containerId
      })
    }
  );

  return await res.json();
}

async function getInstagramProfile(accessToken: string) {
  const res = await fetch(
    `https://graph.instagram.com/me?fields=id,username,media_count,account_type,follows_count,followed_by_count&access_token=${accessToken}`
  );

  return await res.json();
}
