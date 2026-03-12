// supabase/functions/credit-system/index.ts
// Credit-Based Pricing System - Pay per video

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Credit costs for each feature
const CREDIT_COSTS = {
  script_generation: 5,
  voice_generation: 10,
  video_generation: 20,
  thumbnail_generation: 2,
  music_generation: 3,
  caption_generation: 3,
  compliance_check: 2,
  ai_editor: 15,
  background_removal: 10,
  voice_cloning: 25,
  channel_dna: 5,
  affiliate_suggestion: 2,
  revenue_estimation: 1
};

// Subscription plans
const PLANS = {
  free: {
    name: "Free",
    credits: 10,
    price: 0,
    features: ["Basic AI", "Watermark"]
  },
  student: {
    name: "Student",
    credits: 100,
    price: 9.99,
    features: ["All AI Features", "No Watermark", "Priority Support"]
  },
  pro: {
    name: "Pro",
    credits: 500,
    price: 24.99,
    features: ["Everything in Student", "Team (5)", "API Access"]
  },
  agency: {
    name: "Agency",
    credits: 2000,
    price: 49.99,
    features: ["Everything in Pro", "Unlimited Team", "White Label"]
  }
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

    const { action, feature, amount, planId } = await req.json();

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
    // ACTION: BALANCE - Get user's credit balance
    // =========================================================================
    if (action === "balance") {
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("credits, plan")
        .eq("id", user.id)
        .single();

      return new Response(JSON.stringify({
        credits: profile?.credits || 0,
        plan: profile?.plan || "free"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =========================================================================
    // ACTION: CHECK - Check if user has enough credits for a feature
    // =========================================================================
    if (action === "check") {
      const cost = CREDIT_COSTS[feature as keyof typeof CREDIT_COSTS] || 10;
      
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();

      const hasEnough = (profile?.credits || 0) >= cost;

      return new Response(JSON.stringify({
        hasEnough,
        cost,
        currentBalance: profile?.credits || 0,
        feature
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =========================================================================
    // ACTION: DEDUCT - Deduct credits for a feature
    // =========================================================================
    if (action === "deduct") {
      const cost = CREDIT_COSTS[feature as keyof typeof CREDIT_COSTS] || 10;
      
      // Get current balance
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();

      const currentCredits = profile?.credits || 0;

      if (currentCredits < cost) {
        return new Response(JSON.stringify({
          success: false,
          error: "Insufficient credits",
          cost,
          currentBalance: currentCredits
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Deduct credits
      await supabaseClient
        .from("profiles")
        .update({ credits: currentCredits - cost })
        .eq("id", user.id);

      return new Response(JSON.stringify({
        success: true,
        cost,
        remainingCredits: currentCredits - cost,
        feature
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =========================================================================
    // ACTION: ADD - Add credits (after purchase)
    // =========================================================================
    if (action === "add") {
      const plan = PLANS[planId as keyof typeof PLANS];
      
      if (!plan) {
        return new Response(JSON.stringify({ error: "Invalid plan" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get current balance
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();

      const currentCredits = profile?.credits || 0;

      // Add credits and update plan
      await supabaseClient
        .from("profiles")
        .update({ 
          credits: currentCredits + plan.credits,
          plan: planId
        })
        .eq("id", user.id);

      return new Response(JSON.stringify({
        success: true,
        creditsAdded: plan.credits,
        totalCredits: currentCredits + plan.credits,
        plan: plan.name
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =========================================================================
    // ACTION: PLANS - Get available plans
    // =========================================================================
    if (action === "plans") {
      return new Response(JSON.stringify({ plans: PLANS }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =========================================================================
    // ACTION: COSTS - Get credit costs for all features
    // =========================================================================
    if (action === "costs") {
      return new Response(JSON.stringify({ costs: CREDIT_COSTS }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =========================================================================
    // ACTION: HISTORY - Get credit transaction history
    // =========================================================================
    if (action === "history") {
      const { data: transactions } = await supabaseClient
        .from("credit_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      return new Response(JSON.stringify({ transactions }), {
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
