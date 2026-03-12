// supabase/functions/channel-dna/index.ts
// Channel DNA - Learns your style from past videos and suggests personalized content

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

    const { action, projectId, analysis } = await req.json();

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

    // =========================================================================
    // ACTION: LEARN - Analyze a completed video and learn from it
    // =========================================================================
    if (action === "learn") {
      // Get project data
      const { data: project } = await supabaseClient
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (!project) {
        return new Response(JSON.stringify({ error: "Project not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Extract DNA from project
      const dna = extractDNA(project);
      
      // Store in user's channel DNA
      await supabaseClient
        .from("channel_dna")
        .upsert({
          user_id: user.id,
          niche: dna.niche,
          tone: dna.tone,
          topics: dna.topics,
          style: dna.style,
          avg_duration: dna.avgDuration,
          voice_type: dna.voiceType,
          music_preference: dna.musicPreference,
          caption_style: dna.captionStyle,
          posting_frequency: dna.postingFrequency,
          best_days: dna.bestDays,
          best_times: dna.bestTimes,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "user_id"
        });

      return new Response(JSON.stringify({
        success: true,
        dna,
        message: "Channel DNA updated based on this video!"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =========================================================================
    // ACTION: GET - Get user's channel DNA
    // =========================================================================
    if (action === "get") {
      const { data: dna } = await supabaseClient
        .from("channel_dna")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!dna) {
        // Return default DNA
        return new Response(JSON.stringify({
          dna: {
            niche: "general",
            tone: "professional",
            topics: [],
            style: "modern",
            avg_duration: 300,
            voice_type: "female",
            music_preference: "upbeat",
            caption_style: "modern",
            posting_frequency: "daily",
            best_days: ["Saturday", "Sunday"],
            best_times: ["09:00", "12:00", "18:00"]
          },
          isDefault: true
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ dna, isDefault: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =========================================================================
    // ACTION: SUGGEST - Get personalized suggestions based on DNA
    // =========================================================================
    if (action === "suggest") {
      const { data: dna } = await supabaseClient
        .from("channel_dna")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const suggestions = generateSuggestions(dna);

      return new Response(JSON.stringify({ suggestions }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =========================================================================
    // ACTION: OPTIMIZE - Optimize next video based on DNA
    // =========================================================================
    if (action === "optimize") {
      const { niche, targetDuration } = await req.json();

      const { data: dna } = await supabaseClient
        .from("channel_dna")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const optimization = optimizeVideo(niche || dna?.niche, targetDuration, dna);

      return new Response(JSON.stringify({ optimization }), {
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

// Extract DNA from a completed project
function extractDNA(project: any) {
  return {
    niche: project.niche || "general",
    tone: project.tone || "professional",
    topics: project.script?.topics || [],
    style: determineStyle(project),
    avgDuration: project.duration || 300,
    voiceType: project.voice_id || "female",
    musicPreference: project.music_mood || "upbeat",
    captionStyle: determineCaptionStyle(project),
    postingFrequency: "daily",
    bestDays: ["Saturday", "Sunday"],
    bestTimes: ["09:00", "12:00", "18:00"]
  };
}

function determineStyle(project: any) {
  const scripts = project.script?.content || "";
  
  if (scripts.includes("!") || scripts.includes("amazing")) return "energetic";
  if (scripts.includes("?") || scripts.includes("think")) return "educational";
  if (scripts.includes("story") || scripts.includes("remember")) return "storytelling";
  
  return "modern";
}

function determineCaptionStyle(project: any) {
  const hasEmojis = (project.script?.content || "").includes("🎬");
  return hasEmojis ? "emoji-rich" : "minimal";
}

function generateSuggestions(dna: any) {
  const suggestions = [];

  // Topic suggestions based on niche
  const topicSuggestions = getTopicSuggestions(dna?.niche || "general");
  suggestions.push({
    type: "topics",
    title: "Trending Topics",
    items: topicSuggestions
  });

  // Timing suggestions
  suggestions.push({
    type: "timing",
    title: "Best Times to Post",
    items: dna?.best_times || ["09:00", "12:00", "18:00"]
  });

  // Style suggestions
  suggestions.push({
    type: "style",
    title: "Your Style Profile",
    items: [
      `Your channel has a ${dna?.tone || "professional"} tone`,
      `Average video length: ${Math.round((dna?.avg_duration || 300) / 60)} minutes`,
      `Preferred voice: ${dna?.voice_type || "female"}`,
      `Music style: ${dna?.music_preference || "upbeat"}`
    ]
  });

  return suggestions;
}

function getTopicSuggestions(niche: string) {
  const topicsByNiche: Record<string, string[]> = {
    tech: ["AI tools 2024", "Budget gadgets", "Phone reviews", "Coding tips"],
    finance: ["Investment tips", "Save money", "Stock market", "Budgeting"],
    lifestyle: ["Morning routine", "Productivity hacks", "Home decor", "Fitness"],
    gaming: ["New releases", "Game reviews", "Streaming tips", "E-sports"],
    education: ["Learn coding", "Language tips", "Study hacks", "Online courses"],
    entertainment: ["Movie reviews", "Music trends", "Celebrity news", "Trending"],
    business: ["Startup tips", "Marketing", "Side hustles", "Leadership"],
    health: ["Workout tips", "Healthy recipes", "Mental health", "Sleep"]
  };

  return topicsByNiche[niche] || topicsByNiche.lifestyle;
}

function optimizeVideo(niche: string, targetDuration: number, dna: any) {
  return {
    recommendedDuration: targetDuration || dna?.avg_duration || 300,
    suggestedTone: dna?.tone || "professional",
    suggestedStyle: dna?.style || "modern",
    recommendedVoice: dna?.voice_type || "female",
    musicMood: dna?.music_preference || "upbeat",
    captionStyle: dna?.caption_style || "modern",
    bestTimeToPost: dna?.best_times?.[0] || "09:00",
    seoKeywords: getTopicSuggestions(niche).slice(0, 5),
    thumbnailStyle: determineThumbnailStyle(dna?.style),
    ctaType: determineCTAType(niche)
  };
}

function determineThumbnailStyle(style: string) {
  const styles: Record<string, string> = {
    energetic: "high-contrast",
    educational: "clean-minimal",
    storytelling: "emotional",
    modern: "bold-text"
  };
  return styles[style] || "bold-text";
}

function determineCTAType(niche: string) {
  const ctas: Record<string, string> = {
    tech: "Like and subscribe for more tech tips!",
    finance: "Follow for daily financial wisdom!",
    lifestyle: "Like, share, and follow for more!",
    gaming: "Drop a follow if you enjoyed!",
    education: "Subscribe to never miss a lesson!",
    entertainment: "Follow for more entertainment!",
    business: "Like and follow for business insights!",
    health: "Follow for more health tips!"
  };
  return ctas[niche] || "Like and subscribe for more!";
}
