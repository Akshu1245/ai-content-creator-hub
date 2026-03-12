// supabase/functions/affiliate-suggester/index.ts
// Affiliate Auto-Suggester - Suggests relevant affiliate products based on niche and content

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Comprehensive affiliate product database
const AFFILIATE_PRODUCTS: Record<string, AffiliateProduct[]> = {
  tech: [
    { name: "USB-C Hub", price: 49, commission: 15, platform: "Amazon", url: "https://amazon.in/example", category: "accessories" },
    { name: "Wireless Earbuds", price: 1999, commission: 10, platform: "Amazon", url: "https://amazon.in/example", category: "audio" },
    { name: "Phone Stand", price: 799, commission: 12, platform: "Amazon", url: "https://amazon.in/example", category: "accessories" },
    { name: "LED Ring Light", price: 1499, commission: 10, platform: "Amazon", url: "https://amazon.in/example", category: "lighting" },
    { name: "Blue Light Glasses", price: 999, commission: 12, platform: "Amazon", url: "https://amazon.in/example", category: "accessories" },
    { name: "Laptop Sleeve", price: 599, commission: 8, platform: "Amazon", url: "https://amazon.in/example", category: "accessories" },
  ],
  finance: [
    { name: "Premium Trading App", price: 0, commission: 500, platform: "Referral", url: "https://example.com/trading", category: "app" },
    { name: "Credit Card", price: 0, commission: 2000, platform: "Referral", url: "https://example.com/creditcard", category: "finance" },
    { name: "Mutual Fund App", price: 0, commission: 300, platform: "Referral", url: "https://example.com/mf", category: "app" },
    { name: "Gold ETF", price: 0, commission: 100, platform: "Referral", url: "https://example.com/gold", category: "investment" },
  ],
  lifestyle: [
    { name: "Yoga Mat", price: 699, commission: 10, platform: "Amazon", url: "https://amazon.in/example", category: "fitness" },
    { name: "Water Bottle", price: 499, commission: 8, platform: "Amazon", url: "https://amazon.in/example", category: "fitness" },
    { name: "Essential Oil Set", price: 899, commission: 12, platform: "Amazon", url: "https://amazon.in/example", category: "wellness" },
    { name: "Plant Grow Light", price: 1299, commission: 10, platform: "Amazon", url: "https://amazon.in/example", category: "home" },
    { name: "Coffee Maker", price: 2999, commission: 8, platform: "Amazon", url: "https://amazon.in/example", category: "home" },
  ],
  gaming: [
    { name: "Gaming Headset", price: 2499, commission: 10, platform: "Amazon", url: "https://amazon.in/example", category: "audio" },
    { name: "RGB Keyboard", price: 1999, commission: 8, platform: "Amazon", url: "https://amazon.in/example", category: "peripherals" },
    { name: "Gaming Mouse", price: 999, commission: 10, platform: "Amazon", url: "https://amazon.in/example", category: "peripherals" },
    { name: "Phone Cooling Fan", price: 599, commission: 12, platform: "Amazon", url: "https://amazon.in/example", category: "accessories" },
  ],
  education: [
    { name: "Online Course", price: 499, commission: 30, platform: "Udemy", url: "https://udemy.com/example", category: "course" },
    { name: "E-book Reader", price: 9999, commission: 8, platform: "Amazon", url: "https://amazon.in/example", category: "device" },
    { name: "Notebook Set", price: 399, commission: 10, platform: "Amazon", url: "https://amazon.in/example", category: "stationery" },
    { name: "Online Learning App", price: 299, commission: 25, platform: "Referral", url: "https://example.com/learning", category: "app" },
  ],
  health: [
    { name: "Protein Powder", price: 1599, commission: 15, platform: "Amazon", url: "https://amazon.in/example", category: "supplements" },
    { name: "Fitness Tracker", price: 2999, commission: 10, platform: "Amazon", url: "https://amazon.in/example", category: "wearable" },
    { name: "Yoga Pants", price: 899, commission: 12, platform: "Amazon", url: "https://amazon.in/example", category: "apparel" },
    { name: "Air Purifier", price: 7999, commission: 8, platform: "Amazon", url: "https://amazon.in/example", category: "home" },
  ],
  business: [
    { name: "Business Cards", price: 299, commission: 20, platform: "Referral", url: "https://example.com/cards", category: "printing" },
    { name: "Laptop Stand", price: 1499, commission: 10, platform: "Amazon", url: "https://amazon.in/example", category: "accessories" },
    { name: "Zoom Premium", price: 1499, commission: 30, platform: "Referral", url: "https://example.com/zoom", category: "app" },
    { name: "Cloud Storage", price: 499, commission: 25, platform: "Referral", url: "https://example.com/cloud", category: "app" },
  ],
  entertainment: [
    { name: "Streaming Subscription", price: 299, commission: 100, platform: "Referral", url: "https://example.com/stream", category: "subscription" },
    { name: "Movie Tickets", price: 500, commission: 50, platform: "Referral", url: "https://example.com/tickets", category: "entertainment" },
    { name: "Bluetooth Speaker", price: 2999, commission: 8, platform: "Amazon", url: "https://amazon.in/example", category: "audio" },
  ],
};

interface AffiliateProduct {
  name: string;
  price: number;
  commission: number;
  platform: string;
  url: string;
  category: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { action, niche, script, projectId } = await req.json();

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
    // ACTION: SUGGEST - Get affiliate suggestions based on niche and content
    // =========================================================================
    if (action === "suggest") {
      // Get user's channel DNA for niche
      const { data: dna } = await supabaseClient
        .from("channel_dna")
        .select("niche")
        .eq("user_id", user.id)
        .single();

      const effectiveNiche = niche || dna?.niche || "lifestyle";
      
      // Get products for this niche
      let products = AFFILIATE_PRODUCTS[effectiveNiche] || AFFILIATE_PRODUCTS.lifestyle;

      // Filter based on script content if provided
      if (script) {
        products = filterByScript(products, script);
      }

      // Sort by commission potential
      products = sortByPotential(products);

      // Add CTR estimates (mock data)
      const suggestions = products.slice(0, 5).map(p => ({
        ...p,
        estimatedMonthlyClicks: Math.floor(Math.random() * 500) + 100,
        estimatedMonthlyEarnings: Math.floor(p.commission * (Math.random() * 50 + 10)),
        ctaSuggestion: generateCTASuggestion(p),
        timingSuggestion: "Add at the end of your video"
      }));

      // Save to project if provided
      if (projectId) {
        await supabaseClient
          .from("projects")
          .update({ affiliate_suggestions: suggestions })
          .eq("id", projectId);
      }

      return new Response(JSON.stringify({ 
        suggestions,
        totalPotential: suggestions.reduce((sum, p) => sum + p.estimatedMonthlyEarnings, 0)
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =========================================================================
    // ACTION: GET-CONVERTED - Get high-converting products for niche
    // =========================================================================
    if (action === "get-converting") {
      const effectiveNiche = niche || "lifestyle";
      
      // Get products sorted by conversion rate (mock)
      const products = (AFFILIATE_PRODUCTS[effectiveNiche] || AFFILIATE_PRODUCTS.lifestyle)
        .sort((a, b) => b.commission - a.commission)
        .slice(0, 3)
        .map(p => ({
          ...p,
          conversionRate: Math.random() * 5 + 1, // 1-6%
          avgOrderValue: p.price > 0 ? p.price : 500
        }));

      return new Response(JSON.stringify({ products }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =========================================================================
    // ACTION: TRACK - Track affiliate link click
    // =========================================================================
    if (action === "track") {
      const { productName, platform } = await req.json();

      // Log click (in production, use analytics DB)
      console.log(`Affiliate click: ${productName} on ${platform} by user ${user.id}`);

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

// Filter products based on script content
function filterByScript(products: AffiliateProduct[], script: string): AffiliateProduct[] {
  const scriptLower = script.toLowerCase();
  
  return products.filter(p => {
    const nameLower = p.name.toLowerCase();
    // If product name keywords appear in script, it's more relevant
    return nameLower.split(" ").some(word => 
      word.length > 3 && scriptLower.includes(word)
    );
  });
}

// Sort by earnings potential
function sortByPotential(products: AffiliateProduct[]): AffiliateProduct[] {
  return [...products].sort((a, b) => {
    const aPotential = a.commission * (a.price > 0 ? a.price : 100);
    const bPotential = b.commission * (b.price > 0 ? b.price : 100);
    return bPotential - aPotential;
  });
}

// Generate CTA suggestion for product
function generateCTASuggestion(product: AffiliateProduct): string {
  const ctas: Record<string, string> = {
    "app": `Get started with ${product.name} - link in description!`,
    "course": `Enroll in ${product.name} today - special discount for my followers!`,
    "subscription": `Try ${product.name} free for 30 days - cancel anytime!`,
    "device": `Check out ${product.name} - game changer for my content!`,
    "supplements": `I use ${product.name} daily - link below to buy!`,
    "accessories": `Grab your ${product.name} - affiliate link below!`,
  };

  return ctas[product.category] || `Check out ${product.name} - link in description!`;
}
