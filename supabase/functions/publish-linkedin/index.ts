// supabase/functions/publish-linkedin/index.ts
// LinkedIn Video Publishing API

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

    const { action, videoUrl, title, description, projectId } = await req.json();

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

    // Get user's LinkedIn credentials
    const { data: linkedinCredentials } = await supabaseClient
      .from("user_integrations")
      .select("*")
      .eq("user_id", user.id)
      .eq("provider", "linkedin")
      .single();

    if (!linkedinCredentials?.access_token) {
      return new Response(JSON.stringify({ 
        error: "LinkedIn not connected",
        connectUrl: "/settings?integrations=linkedin"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "publish") {
      // Upload video to LinkedIn
      const result = await uploadToLinkedIn(
        linkedinCredentials.access_token,
        videoUrl,
        title,
        description
      );

      // Save to scheduled posts
      await supabaseClient
        .from("scheduled_posts")
        .insert({
          project_id: projectId,
          platform: "linkedin",
          status: "published",
          external_id: result.id,
          published_at: new Date().toISOString()
        });

      return new Response(JSON.stringify({ 
        success: true, 
        postId: result.id,
        url: `https://linkedin.com/feed/update/${result.id}`
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
          platform: "linkedin",
          status: "scheduled",
          video_url: videoUrl,
          title,
          description,
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
      const profile = await getLinkedInProfile(linkedinCredentials.access_token);
      
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

async function uploadToLinkedIn(
  accessToken: string, 
  videoUrl: string, 
  title: string, 
  description: string
) {
  // LinkedIn Video Upload API
  // Step 1: Register upload
  // Step 2: Upload video to LinkedIn's server
  // Step 3: Create post with video

  const registerRes = await fetch(
    "https://api.linkedin.com/v2/assets",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0"
      },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-video"],
          owner: "urn:li:person:ME",
          serviceRelationships: [{
            relationshipType: "OWNER",
            identifier: "urn:li:serviceRelationship:1"
          }]
        }
      })
    }
  );

  const registerData = await registerRes.json();
  
  // In production, upload video file to the uploadUrl
  // Then create the post
  
  // Mock response
  return {
    id: `urn:li:video:${Date.now()}`,
    title,
    description
  };
}

async function getLinkedInProfile(accessToken: string) {
  const res = await fetch(
    "https://api.linkedin.com/v2/me",
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );

  return await res.json();
}
