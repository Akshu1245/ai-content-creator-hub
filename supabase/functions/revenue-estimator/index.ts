// supabase/functions/revenue-estimator/index.ts
// Revenue Estimator - Shows projected earnings before publishing

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// RPM (Revenue Per 1000 views) by niche in India
const NICHE_RPM: Record<string, number> = {
  tech: 3.50,
  finance: 8.00,
  business: 5.50,
  education: 4.00,
  gaming: 2.50,
  lifestyle: 2.00,
  entertainment: 1.80,
  health: 3.00,
  sports: 2.20,
  news: 1.50,
  music: 1.20,
  cooking: 2.80,
  travel: 2.50,
  fashion: 2.30,
  comedy: 1.50,
  diy: 2.70,
  science: 3.50,
  pets: 2.40,
  fitness: 3.20,
  general: 2.00
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

    const { action, niche, title, duration, targetViews, projectId } = await req.json();

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
    // ACTION: ESTIMATE - Calculate revenue projection
    // =========================================================================
    if (action === "estimate") {
      const rpm = NICHE_RPM[niche?.toLowerCase()] || NICHE_RPM.general;
      
      // Get user's historical data if available
      const { data: projects } = await supabaseClient
        .from("projects")
        .select("views, revenue, niche")
        .eq("user_id", user.id)
        .eq("status", "completed");

      // Calculate average views from past videos
      const avgViews = projects?.length 
        ? projects.reduce((sum, p) => sum + (p.views || 0), 0) / projects.length 
        : 1000; // Default estimate

      // Calculate view estimate based on various factors
      const estimatedViews = calculateEstimatedViews(
        avgViews, 
        title, 
        duration, 
        niche
      );

      // Calculate revenue
      const projectedRevenue = (estimatedViews / 1000) * rpm;
      const conservativeRevenue = (estimatedViews * 0.7 / 1000) * rpm;
      const optimisticRevenue = (estimatedViews * 1.3 / 1000) * rpm;

      // Monthly projection (assuming consistent posting)
      const monthlyProjections = {
        daily: projectedRevenue * 30,
        weekly: projectedRevenue * 4,
        monthly: projectedRevenue
      };

      const result = {
        perVideo: {
          estimatedViews,
          projectedRevenue: Math.round(projectedRevenue * 100) / 100,
          conservativeRevenue: Math.round(conservativeRevenue * 100) / 100,
          optimisticRevenue: Math.round(optimisticRevenue * 100) / 100,
          rpm
        },
        monthlyProjections,
        factors: getRevenueFactors(title, duration, niche),
        tips: getOptimizationTips(niche)
      };

      // Save to project if provided
      if (projectId) {
        await supabaseClient
          .from("projects")
          .update({ 
            estimated_views: estimatedViews,
            estimated_revenue: projectedRevenue
          })
          .eq("id", projectId);
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =========================================================================
    // ACTION: GET-NICHE-INFO - Get RPM data for all niches
    // =========================================================================
    if (action === "get-niche-info") {
      const niches = Object.entries(NICHE_RPM).map(([name, rpm]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        rpm,
        description: getNicheDescription(name)
      }));

      return new Response(JSON.stringify({ niches }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =========================================================================
    // ACTION: UPDATE-HISTORICAL - Update with actual views after video publishes
    // =========================================================================
    if (action === "update-historical") {
      const { actualViews, actualRevenue, projectId: updateProjectId } = await req.json();

      await supabaseClient
        .from("projects")
        .update({ 
          views: actualViews,
          revenue: actualRevenue
        })
        .eq("id", updateProjectId)
        .eq("user_id", user.id);

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

function calculateEstimatedViews(
  avgHistoricalViews: number, 
  title: string, 
  duration: number | undefined,
  niche: string | undefined
): number {
  let multiplier = 1.0;
  
  // Title-based factors
  const titleLower = title?.toLowerCase() || "";
  
  // Trending keywords boost
  const trendingKeywords = ["2024", "new", "best", "review", "tutorial", "how to", "vs"];
  for (const keyword of trendingKeywords) {
    if (titleLower.includes(keyword)) {
      multiplier += 0.15;
    }
  }
  
  // Question titles tend to perform well
  if (titleLower.includes("?") || titleLower.includes("why") || titleLower.includes("how")) {
    multiplier += 0.2;
  }
  
  // Numbered lists perform well
  if (/\d+/.test(title)) {
    multiplier += 0.15;
  }
  
  // Duration factors (ideal length varies by niche)
  if (duration) {
    const idealDuration = getIdealDuration(niche);
    const durationDiff = Math.abs(duration - idealDuration);
    if (durationDiff < 60) {
      multiplier += 0.2; // Close to ideal
    } else if (durationDiff < 180) {
      multiplier += 0.1;
    } else {
      multiplier -= 0.1; // Too far from ideal
    }
  }
  
  // Calculate final estimate
  const baseViews = avgHistoricalViews * multiplier;
  
  // Add some variance
  return Math.round(baseViews * (0.8 + Math.random() * 0.4));
}

function getIdealDuration(niche: string | undefined): number {
  const idealDurations: Record<string, number> = {
    tech: 600,      // 10 min
    finance: 480,   // 8 min
    business: 420,  // 7 min
    education: 600, // 10 min
    gaming: 1200,   // 20 min
    lifestyle: 360, // 6 min
    entertainment: 300, // 5 min
    health: 480,   // 8 min
    sports: 600,   // 10 min
  };
  
  return idealDurations[niche?.toLowerCase() || ""] || 480;
}

function getRevenueFactors(title: string, duration: number | undefined, niche: string | undefined) {
  return [
    {
      factor: "Niche RPM",
      value: `₹${NICHE_RPM[niche?.toLowerCase()] || NICHE_RPM.general}/1000 views`,
      impact: niche ? "positive" : "neutral"
    },
    {
      factor: "Video Duration",
      value: duration ? `${Math.floor(duration / 60)} min` : "Not set",
      impact: duration ? (duration >= 300 ? "positive" : "neutral") : "neutral"
    },
    {
      factor: "Title Optimization",
      value: title ? (title.includes("?") || /\d+/.test(title) ? "SEO-friendly" : "Could be improved") : "Not set",
      impact: "positive"
    }
  ];
}

function getOptimizationTips(niche: string | undefined) {
  const tips: Record<string, string[]> = {
    tech: [
      "Tech videos 8-12 minutes perform best",
      "Include product links in description",
      "Comparison videos get high CTR"
    ],
    finance: [
      "Longer watch time = higher RPM",
      "Disclaimer is required",
      "Stock tips content performs well"
    ],
    gaming: [
      "Videos over 15 minutes get more ads",
      "Live gameplay gets high retention",
      "Thumbnail is crucial for CTR"
    ],
    lifestyle: [
      "Quick tips format works well",
      "Consistency matters more than length",
      "Lifestyle vlogs have good RPM"
    ],
    education: [
      "Tutorial format builds subscriber base",
      "Longer videos = better monetization",
      "Part series encourage return viewers"
    ]
  };

  return tips[niche?.toLowerCase() || ""] || tips.lifestyle;
}

function getNicheDescription(niche: string): string {
  const descriptions: Record<string, string> = {
    tech: "Gadgets, software reviews, and tech tutorials",
    finance: "Investment advice, stock market, and personal finance",
    business: "Startup tips, marketing strategies, and entrepreneurship",
    education: "Tutorials, online courses, and educational content",
    gaming: "Game reviews, gameplay, and gaming news",
    lifestyle: "Daily vlogs, fashion, and personal care",
    entertainment: "Movies, music, and celebrity content",
    health: "Fitness tips, diet advice, and wellness"
  };
  
  return descriptions[niche.toLowerCase()] || "General content";
}
