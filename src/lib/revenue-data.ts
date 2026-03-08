// Revenue Estimator — Niche RPM data & Affiliate Programs database

export const NICHE_RPM_DATA: Record<string, { min_rpm: number; max_rpm: number; avg_rpm: number }> = {
  Finance:          { min_rpm: 12.0, max_rpm: 45.0, avg_rpm: 28.0 },
  Technology:       { min_rpm: 8.0,  max_rpm: 22.0, avg_rpm: 14.0 },
  Health:           { min_rpm: 6.0,  max_rpm: 18.0, avg_rpm: 11.0 },
  Business:         { min_rpm: 10.0, max_rpm: 35.0, avg_rpm: 20.0 },
  Motivation:       { min_rpm: 2.5,  max_rpm: 8.0,  avg_rpm: 4.5 },
  "True Crime":     { min_rpm: 3.0,  max_rpm: 9.0,  avg_rpm: 5.5 },
  Horror:           { min_rpm: 2.0,  max_rpm: 6.0,  avg_rpm: 3.5 },
  History:          { min_rpm: 3.0,  max_rpm: 10.0, avg_rpm: 6.0 },
  Gaming:           { min_rpm: 1.5,  max_rpm: 5.0,  avg_rpm: 3.0 },
  Science:          { min_rpm: 4.0,  max_rpm: 12.0, avg_rpm: 7.5 },
  Psychology:       { min_rpm: 4.0,  max_rpm: 14.0, avg_rpm: 8.0 },
  Travel:           { min_rpm: 2.0,  max_rpm: 7.0,  avg_rpm: 4.0 },
};

export interface AffiliateProgram {
  id: string;
  name: string;
  niches: string[];
  keywords: string[];
  commissionType: "CPA" | "CPS" | "CPL" | "recurring";
  commissionValue: string;
  commissionNumeric: number;
  affiliateUrl: string;
  signupUrl: string;
  descriptionTemplate: string;
  conversionRate: number;
  clicksPer1kViews: number;
  requiresApproval: boolean;
  payoutThreshold: string;
  cookieDurationDays: number;
}

export const AFFILIATE_DATABASE: AffiliateProgram[] = [
  // Finance
  { id: "coinbase_001", name: "Coinbase", niches: ["Finance", "Technology"], keywords: ["crypto", "bitcoin", "ethereum", "investing", "trading", "blockchain"], commissionType: "CPA", commissionValue: "Up to $50/referral", commissionNumeric: 25.0, affiliateUrl: "https://coinbase.com/join/{ref}", signupUrl: "https://coinbase.com/affiliates", descriptionTemplate: "Start investing in crypto with Coinbase — get $10 free when you buy $100: {link}", conversionRate: 0.008, clicksPer1kViews: 12, requiresApproval: false, payoutThreshold: "$50", cookieDurationDays: 30 },
  { id: "robinhood_001", name: "Robinhood", niches: ["Finance"], keywords: ["stocks", "investing", "trading", "portfolio", "dividends"], commissionType: "CPA", commissionValue: "$5–20/signup", commissionNumeric: 12.0, affiliateUrl: "https://robinhood.com/ref/{ref}", signupUrl: "https://robinhood.com/affiliates", descriptionTemplate: "Trade stocks commission-free on Robinhood: {link}", conversionRate: 0.006, clicksPer1kViews: 10, requiresApproval: false, payoutThreshold: "$25", cookieDurationDays: 30 },
  { id: "nordvpn_001", name: "NordVPN", niches: ["Finance", "Technology", "True Crime"], keywords: ["privacy", "vpn", "security", "online", "protection"], commissionType: "recurring", commissionValue: "40% recurring", commissionNumeric: 18.0, affiliateUrl: "https://nordvpn.com/ref/{ref}", signupUrl: "https://nordvpn.com/affiliates", descriptionTemplate: "Protect your online privacy with NordVPN — 68% off: {link}", conversionRate: 0.012, clicksPer1kViews: 15, requiresApproval: false, payoutThreshold: "$10", cookieDurationDays: 30 },
  { id: "wealthfront_001", name: "Wealthfront", niches: ["Finance"], keywords: ["savings", "investing", "robo-advisor", "interest", "bank"], commissionType: "CPA", commissionValue: "$25/funded account", commissionNumeric: 25.0, affiliateUrl: "https://wealthfront.com/ref/{ref}", signupUrl: "https://wealthfront.com/affiliates", descriptionTemplate: "Get 5.0% APY on your savings with Wealthfront: {link}", conversionRate: 0.005, clicksPer1kViews: 8, requiresApproval: true, payoutThreshold: "$50", cookieDurationDays: 45 },
  { id: "personalcapital_001", name: "Empower", niches: ["Finance"], keywords: ["retirement", "net worth", "financial planning", "budget", "wealth"], commissionType: "CPA", commissionValue: "$100/qualified lead", commissionNumeric: 100.0, affiliateUrl: "https://empower.com/ref/{ref}", signupUrl: "https://empower.com/affiliates", descriptionTemplate: "Track your net worth free with Empower: {link}", conversionRate: 0.002, clicksPer1kViews: 6, requiresApproval: true, payoutThreshold: "$100", cookieDurationDays: 45 },
  { id: "acorns_001", name: "Acorns", niches: ["Finance", "Motivation"], keywords: ["micro-investing", "savings", "round-ups", "investing"], commissionType: "CPA", commissionValue: "$10/signup", commissionNumeric: 10.0, affiliateUrl: "https://acorns.com/ref/{ref}", signupUrl: "https://acorns.com/affiliates", descriptionTemplate: "Start investing your spare change with Acorns: {link}", conversionRate: 0.01, clicksPer1kViews: 14, requiresApproval: false, payoutThreshold: "$25", cookieDurationDays: 30 },
  { id: "tradingview_001", name: "TradingView", niches: ["Finance", "Technology"], keywords: ["charts", "trading", "analysis", "stocks", "forex"], commissionType: "CPS", commissionValue: "Up to $50/sale", commissionNumeric: 30.0, affiliateUrl: "https://tradingview.com/ref/{ref}", signupUrl: "https://tradingview.com/affiliates", descriptionTemplate: "Get professional trading charts with TradingView: {link}", conversionRate: 0.007, clicksPer1kViews: 11, requiresApproval: false, payoutThreshold: "$50", cookieDurationDays: 30 },
  { id: "m1finance_001", name: "M1 Finance", niches: ["Finance"], keywords: ["portfolio", "investing", "automated", "finance", "stocks"], commissionType: "CPA", commissionValue: "$30/funded account", commissionNumeric: 30.0, affiliateUrl: "https://m1.com/ref/{ref}", signupUrl: "https://m1.com/affiliates", descriptionTemplate: "Build your custom portfolio free with M1 Finance: {link}", conversionRate: 0.004, clicksPer1kViews: 7, requiresApproval: true, payoutThreshold: "$50", cookieDurationDays: 30 },

  // Technology
  { id: "hostinger_001", name: "Hostinger", niches: ["Technology", "Business"], keywords: ["hosting", "website", "domain", "web", "server"], commissionType: "CPS", commissionValue: "60% per sale", commissionNumeric: 40.0, affiliateUrl: "https://hostinger.com/ref/{ref}", signupUrl: "https://hostinger.com/affiliates", descriptionTemplate: "Build your website with Hostinger — 75% off: {link}", conversionRate: 0.015, clicksPer1kViews: 18, requiresApproval: false, payoutThreshold: "$100", cookieDurationDays: 30 },
  { id: "canva_001", name: "Canva Pro", niches: ["Technology", "Business", "Motivation"], keywords: ["design", "graphics", "thumbnail", "templates", "creator"], commissionType: "CPS", commissionValue: "$36/subscriber", commissionNumeric: 36.0, affiliateUrl: "https://canva.com/ref/{ref}", signupUrl: "https://canva.com/affiliates", descriptionTemplate: "Design like a pro with Canva — free trial: {link}", conversionRate: 0.01, clicksPer1kViews: 14, requiresApproval: false, payoutThreshold: "$10", cookieDurationDays: 30 },
  { id: "surfshark_001", name: "Surfshark", niches: ["Technology", "Gaming"], keywords: ["vpn", "privacy", "streaming", "security"], commissionType: "CPS", commissionValue: "40% per sale", commissionNumeric: 20.0, affiliateUrl: "https://surfshark.com/ref/{ref}", signupUrl: "https://surfshark.com/affiliates", descriptionTemplate: "Secure your browsing with Surfshark VPN: {link}", conversionRate: 0.01, clicksPer1kViews: 13, requiresApproval: false, payoutThreshold: "$50", cookieDurationDays: 30 },
  { id: "namecheap_001", name: "Namecheap", niches: ["Technology", "Business"], keywords: ["domain", "hosting", "website", "ssl"], commissionType: "CPS", commissionValue: "20% per sale", commissionNumeric: 15.0, affiliateUrl: "https://namecheap.com/ref/{ref}", signupUrl: "https://namecheap.com/affiliates", descriptionTemplate: "Get your domain for less with Namecheap: {link}", conversionRate: 0.008, clicksPer1kViews: 10, requiresApproval: false, payoutThreshold: "$50", cookieDurationDays: 30 },
  { id: "notion_001", name: "Notion", niches: ["Technology", "Business", "Motivation"], keywords: ["productivity", "notes", "organize", "workspace"], commissionType: "CPS", commissionValue: "$10/paid user", commissionNumeric: 10.0, affiliateUrl: "https://notion.so/ref/{ref}", signupUrl: "https://notion.so/affiliates", descriptionTemplate: "Organize everything with Notion — free to start: {link}", conversionRate: 0.012, clicksPer1kViews: 16, requiresApproval: false, payoutThreshold: "$25", cookieDurationDays: 30 },
  { id: "expressvpn_001", name: "ExpressVPN", niches: ["Technology", "True Crime"], keywords: ["vpn", "privacy", "streaming", "unblock"], commissionType: "CPS", commissionValue: "$36/sale", commissionNumeric: 36.0, affiliateUrl: "https://expressvpn.com/ref/{ref}", signupUrl: "https://expressvpn.com/affiliates", descriptionTemplate: "Browse securely with ExpressVPN — 3 months free: {link}", conversionRate: 0.009, clicksPer1kViews: 12, requiresApproval: true, payoutThreshold: "$100", cookieDurationDays: 90 },
  { id: "grammarly_001", name: "Grammarly", niches: ["Technology", "Business", "Psychology"], keywords: ["writing", "grammar", "ai", "productivity"], commissionType: "CPA", commissionValue: "$20/premium signup", commissionNumeric: 20.0, affiliateUrl: "https://grammarly.com/ref/{ref}", signupUrl: "https://grammarly.com/affiliates", descriptionTemplate: "Write better with Grammarly — free to start: {link}", conversionRate: 0.015, clicksPer1kViews: 18, requiresApproval: false, payoutThreshold: "$50", cookieDurationDays: 90 },
  { id: "figma_001", name: "Figma", niches: ["Technology"], keywords: ["design", "ui", "prototype", "collaboration"], commissionType: "CPS", commissionValue: "20% recurring", commissionNumeric: 24.0, affiliateUrl: "https://figma.com/ref/{ref}", signupUrl: "https://figma.com/affiliates", descriptionTemplate: "Design and prototype with Figma: {link}", conversionRate: 0.006, clicksPer1kViews: 8, requiresApproval: true, payoutThreshold: "$50", cookieDurationDays: 30 },

  // Health
  { id: "myprotein_001", name: "MyProtein", niches: ["Health"], keywords: ["protein", "supplements", "fitness", "workout", "nutrition"], commissionType: "CPS", commissionValue: "8% per sale", commissionNumeric: 8.0, affiliateUrl: "https://myprotein.com/ref/{ref}", signupUrl: "https://myprotein.com/affiliates", descriptionTemplate: "Fuel your workouts with MyProtein: {link}", conversionRate: 0.012, clicksPer1kViews: 14, requiresApproval: false, payoutThreshold: "$25", cookieDurationDays: 30 },
  { id: "headspace_001", name: "Headspace", niches: ["Health", "Psychology", "Motivation"], keywords: ["meditation", "mindfulness", "mental health", "sleep", "stress"], commissionType: "CPS", commissionValue: "$10/subscription", commissionNumeric: 10.0, affiliateUrl: "https://headspace.com/ref/{ref}", signupUrl: "https://headspace.com/affiliates", descriptionTemplate: "Start meditating with Headspace — free trial: {link}", conversionRate: 0.008, clicksPer1kViews: 12, requiresApproval: false, payoutThreshold: "$50", cookieDurationDays: 30 },
  { id: "athleticgreens_001", name: "AG1", niches: ["Health", "Motivation"], keywords: ["greens", "nutrition", "health", "supplements", "vitamins"], commissionType: "CPA", commissionValue: "$20/first order", commissionNumeric: 20.0, affiliateUrl: "https://athleticgreens.com/ref/{ref}", signupUrl: "https://athleticgreens.com/affiliates", descriptionTemplate: "Get your daily nutrition with AG1: {link}", conversionRate: 0.006, clicksPer1kViews: 10, requiresApproval: true, payoutThreshold: "$50", cookieDurationDays: 60 },
  { id: "whoop_001", name: "WHOOP", niches: ["Health", "Science"], keywords: ["fitness tracker", "recovery", "sleep", "hrv", "health data"], commissionType: "CPA", commissionValue: "$30/membership", commissionNumeric: 30.0, affiliateUrl: "https://whoop.com/ref/{ref}", signupUrl: "https://whoop.com/affiliates", descriptionTemplate: "Optimize your health with WHOOP — 1 month free: {link}", conversionRate: 0.004, clicksPer1kViews: 8, requiresApproval: true, payoutThreshold: "$100", cookieDurationDays: 30 },
  { id: "noom_001", name: "Noom", niches: ["Health"], keywords: ["weight loss", "diet", "psychology", "habits", "nutrition"], commissionType: "CPA", commissionValue: "$15/trial signup", commissionNumeric: 15.0, affiliateUrl: "https://noom.com/ref/{ref}", signupUrl: "https://noom.com/affiliates", descriptionTemplate: "Change your relationship with food — try Noom: {link}", conversionRate: 0.007, clicksPer1kViews: 11, requiresApproval: false, payoutThreshold: "$50", cookieDurationDays: 30 },
  { id: "peloton_001", name: "Peloton", niches: ["Health", "Motivation"], keywords: ["exercise", "cycling", "fitness", "home workout"], commissionType: "CPS", commissionValue: "Up to $100/sale", commissionNumeric: 60.0, affiliateUrl: "https://onepeloton.com/ref/{ref}", signupUrl: "https://onepeloton.com/affiliates", descriptionTemplate: "Get fit at home with Peloton: {link}", conversionRate: 0.003, clicksPer1kViews: 6, requiresApproval: true, payoutThreshold: "$100", cookieDurationDays: 14 },
  { id: "calm_001", name: "Calm", niches: ["Health", "Psychology"], keywords: ["sleep", "meditation", "relaxation", "anxiety", "stress"], commissionType: "CPS", commissionValue: "25% per sale", commissionNumeric: 17.0, affiliateUrl: "https://calm.com/ref/{ref}", signupUrl: "https://calm.com/affiliates", descriptionTemplate: "Sleep better tonight with Calm: {link}", conversionRate: 0.009, clicksPer1kViews: 13, requiresApproval: false, payoutThreshold: "$50", cookieDurationDays: 30 },
  { id: "betterhelp_001", name: "BetterHelp", niches: ["Health", "Psychology", "Motivation"], keywords: ["therapy", "counseling", "mental health", "depression"], commissionType: "CPA", commissionValue: "$150/paid client", commissionNumeric: 150.0, affiliateUrl: "https://betterhelp.com/ref/{ref}", signupUrl: "https://betterhelp.com/affiliates", descriptionTemplate: "Talk to a licensed therapist — get 20% off BetterHelp: {link}", conversionRate: 0.002, clicksPer1kViews: 5, requiresApproval: true, payoutThreshold: "$100", cookieDurationDays: 30 },

  // Motivation / Self-improvement
  { id: "audible_001", name: "Audible", niches: ["Motivation", "Psychology", "History", "Science"], keywords: ["audiobooks", "books", "reading", "learning", "self-help"], commissionType: "CPA", commissionValue: "$5–15/signup", commissionNumeric: 10.0, affiliateUrl: "https://audible.com/ref/{ref}", signupUrl: "https://audible.com/affiliates", descriptionTemplate: "Get your first audiobook free on Audible: {link}", conversionRate: 0.015, clicksPer1kViews: 20, requiresApproval: false, payoutThreshold: "$10", cookieDurationDays: 24 },
  { id: "skillshare_001", name: "Skillshare", niches: ["Motivation", "Technology", "Business"], keywords: ["courses", "learning", "skills", "online class", "tutorial"], commissionType: "CPA", commissionValue: "$7/trial", commissionNumeric: 7.0, affiliateUrl: "https://skillshare.com/ref/{ref}", signupUrl: "https://skillshare.com/affiliates", descriptionTemplate: "Learn new skills on Skillshare — free trial: {link}", conversionRate: 0.02, clicksPer1kViews: 22, requiresApproval: false, payoutThreshold: "$10", cookieDurationDays: 30 },
  { id: "blinkist_001", name: "Blinkist", niches: ["Motivation", "Psychology", "Business"], keywords: ["book summaries", "reading", "knowledge", "learning", "productivity"], commissionType: "recurring", commissionValue: "25% recurring", commissionNumeric: 5.0, affiliateUrl: "https://blinkist.com/ref/{ref}", signupUrl: "https://blinkist.com/affiliates", descriptionTemplate: "Read 15-min book summaries on Blinkist: {link}", conversionRate: 0.018, clicksPer1kViews: 19, requiresApproval: false, payoutThreshold: "$25", cookieDurationDays: 30 },
  { id: "masterclass_001", name: "MasterClass", niches: ["Motivation", "Business", "Science", "History"], keywords: ["masterclass", "expert", "celebrity", "learning", "course"], commissionType: "CPS", commissionValue: "25% per sale", commissionNumeric: 45.0, affiliateUrl: "https://masterclass.com/ref/{ref}", signupUrl: "https://masterclass.com/affiliates", descriptionTemplate: "Learn from the best on MasterClass: {link}", conversionRate: 0.005, clicksPer1kViews: 8, requiresApproval: true, payoutThreshold: "$50", cookieDurationDays: 30 },

  // Horror / True Crime
  { id: "curiositystream_001", name: "CuriosityStream", niches: ["Horror", "True Crime", "History", "Science"], keywords: ["documentary", "streaming", "true crime", "mystery", "history"], commissionType: "CPS", commissionValue: "$5/subscription", commissionNumeric: 5.0, affiliateUrl: "https://curiositystream.com/ref/{ref}", signupUrl: "https://curiositystream.com/affiliates", descriptionTemplate: "Watch thousands of documentaries on CuriosityStream: {link}", conversionRate: 0.01, clicksPer1kViews: 14, requiresApproval: false, payoutThreshold: "$25", cookieDurationDays: 30 },
  { id: "aura_001", name: "Aura", niches: ["Horror", "True Crime", "Technology"], keywords: ["identity theft", "security", "protection", "privacy", "credit"], commissionType: "CPA", commissionValue: "$50/signup", commissionNumeric: 50.0, affiliateUrl: "https://aura.com/ref/{ref}", signupUrl: "https://aura.com/affiliates", descriptionTemplate: "Protect your identity with Aura — 14-day free trial: {link}", conversionRate: 0.003, clicksPer1kViews: 6, requiresApproval: true, payoutThreshold: "$100", cookieDurationDays: 30 },
  { id: "simplisafe_001", name: "SimpliSafe", niches: ["Horror", "True Crime"], keywords: ["home security", "alarm", "camera", "protection", "safe"], commissionType: "CPS", commissionValue: "15% per sale", commissionNumeric: 35.0, affiliateUrl: "https://simplisafe.com/ref/{ref}", signupUrl: "https://simplisafe.com/affiliates", descriptionTemplate: "Protect your home with SimpliSafe — 40% off: {link}", conversionRate: 0.004, clicksPer1kViews: 7, requiresApproval: true, payoutThreshold: "$100", cookieDurationDays: 45 },

  // Gaming
  { id: "gfuel_001", name: "G Fuel", niches: ["Gaming"], keywords: ["energy drink", "gaming", "focus", "performance"], commissionType: "CPS", commissionValue: "10% per sale", commissionNumeric: 4.0, affiliateUrl: "https://gfuel.com/ref/{ref}", signupUrl: "https://gfuel.com/affiliates", descriptionTemplate: "Level up with G Fuel gaming energy: {link}", conversionRate: 0.015, clicksPer1kViews: 18, requiresApproval: false, payoutThreshold: "$25", cookieDurationDays: 30 },
  { id: "secretlab_001", name: "Secretlab", niches: ["Gaming", "Technology"], keywords: ["gaming chair", "desk", "setup", "ergonomic"], commissionType: "CPS", commissionValue: "6% per sale", commissionNumeric: 25.0, affiliateUrl: "https://secretlab.co/ref/{ref}", signupUrl: "https://secretlab.co/affiliates", descriptionTemplate: "Upgrade your setup with Secretlab chairs: {link}", conversionRate: 0.003, clicksPer1kViews: 5, requiresApproval: true, payoutThreshold: "$100", cookieDurationDays: 30 },
  { id: "razer_001", name: "Razer", niches: ["Gaming", "Technology"], keywords: ["mouse", "keyboard", "headset", "gaming gear", "peripheral"], commissionType: "CPS", commissionValue: "5% per sale", commissionNumeric: 8.0, affiliateUrl: "https://razer.com/ref/{ref}", signupUrl: "https://razer.com/affiliates", descriptionTemplate: "Get premium gaming gear from Razer: {link}", conversionRate: 0.006, clicksPer1kViews: 9, requiresApproval: false, payoutThreshold: "$50", cookieDurationDays: 14 },
  { id: "hyperx_001", name: "HyperX", niches: ["Gaming"], keywords: ["headset", "keyboard", "memory", "gaming", "peripheral"], commissionType: "CPS", commissionValue: "5% per sale", commissionNumeric: 6.0, affiliateUrl: "https://hyperx.com/ref/{ref}", signupUrl: "https://hyperx.com/affiliates", descriptionTemplate: "Game with HyperX peripherals: {link}", conversionRate: 0.005, clicksPer1kViews: 8, requiresApproval: false, payoutThreshold: "$50", cookieDurationDays: 30 },

  // History
  { id: "ancestrydna_001", name: "AncestryDNA", niches: ["History"], keywords: ["dna", "ancestry", "genealogy", "heritage", "family tree"], commissionType: "CPS", commissionValue: "$15/kit", commissionNumeric: 15.0, affiliateUrl: "https://ancestry.com/ref/{ref}", signupUrl: "https://ancestry.com/affiliates", descriptionTemplate: "Discover your roots with AncestryDNA: {link}", conversionRate: 0.008, clicksPer1kViews: 10, requiresApproval: true, payoutThreshold: "$50", cookieDurationDays: 14 },
  { id: "thegreatcourses_001", name: "The Great Courses", niches: ["History", "Science", "Psychology"], keywords: ["lectures", "education", "professor", "history course", "learning"], commissionType: "CPS", commissionValue: "20% per sale", commissionNumeric: 20.0, affiliateUrl: "https://thegreatcourses.com/ref/{ref}", signupUrl: "https://thegreatcourses.com/affiliates", descriptionTemplate: "Learn from top professors at The Great Courses: {link}", conversionRate: 0.006, clicksPer1kViews: 9, requiresApproval: false, payoutThreshold: "$50", cookieDurationDays: 30 },

  // Science
  { id: "brilliant_001", name: "Brilliant", niches: ["Science", "Technology", "Psychology"], keywords: ["math", "science", "problem solving", "interactive", "learning"], commissionType: "CPA", commissionValue: "$20/subscription", commissionNumeric: 20.0, affiliateUrl: "https://brilliant.org/ref/{ref}", signupUrl: "https://brilliant.org/affiliates", descriptionTemplate: "Think like a scientist with Brilliant — 20% off: {link}", conversionRate: 0.012, clicksPer1kViews: 16, requiresApproval: false, payoutThreshold: "$50", cookieDurationDays: 30 },
  { id: "nebula_001", name: "Nebula", niches: ["Science", "History", "Technology"], keywords: ["educational", "creators", "streaming", "documentary", "science"], commissionType: "CPS", commissionValue: "$5/subscription", commissionNumeric: 5.0, affiliateUrl: "https://nebula.tv/ref/{ref}", signupUrl: "https://nebula.tv/affiliates", descriptionTemplate: "Watch ad-free educational content on Nebula: {link}", conversionRate: 0.01, clicksPer1kViews: 14, requiresApproval: false, payoutThreshold: "$25", cookieDurationDays: 30 },

  // Psychology
  { id: "talkspace_001", name: "Talkspace", niches: ["Psychology", "Health"], keywords: ["therapy", "mental health", "counseling", "anxiety", "depression"], commissionType: "CPA", commissionValue: "$100/paid client", commissionNumeric: 100.0, affiliateUrl: "https://talkspace.com/ref/{ref}", signupUrl: "https://talkspace.com/affiliates", descriptionTemplate: "Get therapy on your schedule with Talkspace: {link}", conversionRate: 0.002, clicksPer1kViews: 5, requiresApproval: true, payoutThreshold: "$100", cookieDurationDays: 30 },
];

export function getAffiliatesForNiche(niche: string): AffiliateProgram[] {
  return AFFILIATE_DATABASE.filter(p => p.niches.includes(niche))
    .sort((a, b) => b.commissionNumeric - a.commissionNumeric);
}

export interface RevenueScenario {
  month1Views: number;
  month3Views: number;
  month6Views: number;
  rpm: number;
  month1Revenue: number;
  month3Revenue: number;
  month6Revenue: number;
}

export interface RevenueEstimate {
  niche: string;
  rpmRange: string;
  avgRpm: number;
  conservative: RevenueScenario;
  realistic: RevenueScenario;
  optimistic: RevenueScenario;
  affiliatePrograms: AffiliateProgram[];
  yppEta: { daysEstimated: number; videosNeeded: number };
  competitionLevel: "Low" | "Medium" | "High" | "Very High";
}

export function calculateRevenue(niche: string, videosPerWeek: number): RevenueEstimate | null {
  const rpm = NICHE_RPM_DATA[niche];
  if (!rpm) return null;

  const monthly = videosPerWeek * 4;

  const buildScenario = (viewMultipliers: [number, number, number], rpmVal: number): RevenueScenario => ({
    month1Views: monthly * viewMultipliers[0],
    month3Views: monthly * viewMultipliers[1],
    month6Views: monthly * viewMultipliers[2],
    rpm: rpmVal,
    month1Revenue: (monthly * viewMultipliers[0] / 1000) * rpmVal,
    month3Revenue: (monthly * viewMultipliers[1] / 1000) * rpmVal,
    month6Revenue: (monthly * viewMultipliers[2] / 1000) * rpmVal,
  });

  const affiliates = getAffiliatesForNiche(niche);

  // YPP estimation: 1000 subs needed, ~15 subs/video conservatively
  const videosNeeded = Math.ceil(1000 / 15);
  const daysEstimated = Math.ceil(videosNeeded / videosPerWeek * 7);

  const competition: Record<string, "Low" | "Medium" | "High" | "Very High"> = {
    Finance: "Very High", Technology: "High", Health: "High", Horror: "Medium",
    Motivation: "Very High", "True Crime": "Medium", History: "Low", Gaming: "Very High",
    Science: "Low", Psychology: "Medium", Business: "High", Travel: "Medium",
  };

  return {
    niche,
    rpmRange: `$${rpm.min_rpm}–$${rpm.max_rpm}`,
    avgRpm: rpm.avg_rpm,
    conservative: buildScenario([150, 800, 3000], rpm.min_rpm),
    realistic: buildScenario([400, 2500, 8000], rpm.avg_rpm),
    optimistic: buildScenario([1000, 8000, 25000], rpm.max_rpm),
    affiliatePrograms: affiliates.slice(0, 5),
    yppEta: { daysEstimated, videosNeeded },
    competitionLevel: competition[niche] || "Medium",
  };
}
