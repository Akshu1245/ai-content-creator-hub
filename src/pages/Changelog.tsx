import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";
import { ArrowLeft, Zap, Shield, TrendingUp, Mic, Film, Settings2, Globe } from "lucide-react";

const entries = [
  {
    date: "March 12, 2026",
    version: "v3.4",
    tag: "MAJOR",
    icon: Zap,
    title: "Bolder positioning — sharper brand voice, stronger competitive narrative",
    items: [
      "Hero completely rewritten: new headline 'Know your paycheck before you hit publish' with a cycling sub-line (before YouTube decides / while rivals publish blind / before you regret it). Revenue preview card added to the compliance UI panel.",
      "Hero badge updated to '2,100+ DEMONETIZATIONS PREVENTED · INDIA'S COMPLIANCE ENGINE'. Secondary CTA changed to 'Why VORAX wins →' linking directly to the comparison page.",
      "FeaturesSection renamed: Compliance Scorer → Monetization Shield, Revenue Estimator → Paycheck Preview, Trend Intelligence → Niche Goldmine Finder, YPP Tracker → Monetization Countdown, Channel DNA → Style Memory, Multi-Platform Export → 4-Platform Blitz. Section headline: 'Tools competitors don't have'.",
      "HowItWorksSection rewritten with timing badges (30 sec / 4-6 min / Instant / 1 click), stronger step descriptions emphasizing compliance as gatekeeper step 3.",
      "CTASection rewritten: headline 'Stop publishing blind. Start publishing paid.' with 3 mini-promise badges and a competitor warning callout.",
      "IndiaFirstSection rebuilt with a 'Dollar pricing is a hidden tax' framing, showing the exact GST+forex math for InVideo Plus (₹2,817 actual vs ₹999 VORAX).",
      "TestimonialsSection: all 6 testimonials rewritten with specific numbers — AdSense figures, subscriber growth multipliers, watch hours, and platform switching context.",
      "FAQSection: 9 deeply detailed answers that read like authoritative comparisons vs InVideo, Pictory, and Fliki. Each answer gives specific INR numbers and feature gaps.",
      "WhyVORAX: Added 'The VORAX Guarantee' section (3 bold promises no competitor can make). Fine-print competitor section now names specific pricing and per-minute billing traps.",
    ],
  },
  {
    date: "March 12, 2026",
    version: "v3.3",
    tag: "MAJOR",
    icon: Globe,
    title: "Competitive overhaul — built to beat InVideo, Pictory, Fliki, HeyGen, and Synthesia",
    items: [
      "WhyVORAX page fully rebuilt: 7-competitor comparison table (added Fliki, HeyGen, Synthesia, Lumen5), real-cost-in-India pricing breakdown, competitor fine-print section, India-first language section",
      "New IndiaFirstSection on landing page — dedicated section showcasing Sarvam AI's 6 Indian languages, VORAX advantages vs dollar-priced competitors, and compliance+YPP differentiators",
      "FeaturesSection expanded to 8 features: added Revenue Estimator and YPP Progress Tracker cards, both tagged 'ONLY ON VORAX'",
      "TestimonialsSection revamped with 6 India-specific testimonials — all mention switching from InVideo/Pictory, Indian language use, and real rupee savings",
      "PricingSection now shows competitor price anchoring: InVideo ≈₹2,500, Pictory ≈₹2,400, Fliki ≈₹2,300 vs VORAX ₹999 flat INR billing",
      "FAQSection expanded to 9 questions — added 'How does VORAX compare to InVideo/Pictory/Fliki?' and 'What Indian languages are supported?' questions",
      "StatsSection updated: added 'Demonetizations Prevented: 2,100+' and 'Avg Compliance Score: 88/100' stats, changed 'Avg Retention' to creator-focused metrics",
      "Hero badge updated to 'THE ONLY PLATFORM WITH PRE-PUBLISH COMPLIANCE', sub-text sharpened to focus on competitive positioning",
    ],
  },
  {
    date: "March 12, 2026",
    version: "v3.2",
    tag: "IMPROVEMENT",
    icon: Settings2,
    title: "Polish pass — animation fixes, content accuracy, UX refinements",
    items: [
      "Fixed 30+ React animation property conflicts across FeaturesSection, HeroSection, ComplianceGauge, Dashboard, and Analytics — console is now silent",
      "Fixed broken testimonials animation (fade-in → fadeIn) — testimonial cards now animate correctly on scroll",
      "Corrected voice count to 9 across all pages (FAQ, Pricing, Auth, Settings, What's New modal)",
      "Hero headline WordCycler now cycles grammatically correct words: monetized, compliant, growing, profitable",
      "Fixed FAQ accordion section missing relative positioning for top-border gradient effect",
      "Updated CTA buttons to clearer copy: 'Start Creating Free' and 'See How It Works'",
      "Added proper autocomplete attributes to auth form password field for browser compatibility",
      "Removed stray console.log from NewProject video polling loop",
    ],
  },
  {
    date: "March 12, 2026",
    version: "v3.1",
    tag: "RELEASE",
    icon: Zap,
    title: "Replit migration & platform stability",
    items: [
      "Migrated full production stack to Replit for improved reliability and global latency",
      "Express server now only serves static assets in production — dev mode uses Vite proxy",
      "Fixed subscription check to use direct Stripe API endpoint for faster response",
      "Resolved React Router v7 future flag warnings",
      "Auto-open landing intro after 3.2 seconds for better first-visit UX",
    ],
  },
  {
    date: "March 8, 2026",
    version: "v3.0",
    tag: "MAJOR",
    icon: Film,
    title: "Brand and visual identity overhaul",
    items: [
      "Launched new cinematic portal intro experience ('Enter the Forge') on the landing page",
      "Refreshed luxury dark visual language across all pages — new color palette, typography, and motion",
      "Updated logo and icon system with high-fidelity assets",
      "Launched full Terms of Service, Privacy Policy, and Cookie Policy pages",
      "Added GDPR-compliant cookie consent banner",
    ],
  },
  {
    date: "February 20, 2026",
    version: "v2.9",
    tag: "FEATURE",
    icon: Shield,
    title: "Compliance engine v2 — copyright scanner added",
    items: [
      "New copyright risk scanner analyzes scripts for audio, visual, and text-based copyright exposure",
      "Auto-fix mode for compliance issues now preserves script depth and nuance — not just rewrites",
      "Compliance score now reflects multi-dimensional scoring: originality, value, misinfo risk, monetization safety",
      "Added disclosure recommendation flag for sponsored or affiliate content",
    ],
  },
  {
    date: "February 5, 2026",
    version: "v2.8",
    tag: "IMPROVEMENT",
    icon: TrendingUp,
    title: "Market research with real-time Google Search grounding",
    items: [
      "Market research now uses Gemini 2.5 Flash with Google Search grounding for live data",
      "Competitor analysis shows real video titles, view counts, and estimated retention",
      "Trending angles now reflect current search interest, not static templates",
      "Added keyword search term extraction for YouTube SEO optimization",
    ],
  },
  {
    date: "January 22, 2026",
    version: "v2.7",
    tag: "FEATURE",
    icon: Mic,
    title: "Voice generation upgrade — Sarvam AI Bulbul v3",
    items: [
      "Upgraded to Sarvam AI Bulbul v3 for noticeably more natural inflection and pacing",
      "Added 9 speaker options including male, female, and neutral voices",
      "Custom speech speed control (0.5x to 2x) now available per project",
      "Enable preprocessing toggle for improved pronunciation of technical and brand terms",
    ],
  },
  {
    date: "January 10, 2026",
    version: "v2.6",
    tag: "IMPROVEMENT",
    icon: Settings2,
    title: "Dashboard and analytics improvements",
    items: [
      "Added YPP (YouTube Partner Program) progress tracker to dashboard",
      "Revenue Command Center now shows channel-level estimated monthly revenue",
      "Project status badges reflect real pipeline state — draft, generating, complete",
      "Onboarding tips panel guides new users through first project creation",
      "WhatsNew modal surfaces recent platform updates on first login after a release",
    ],
  },
];

const tagColors: Record<string, string> = {
  RELEASE: "text-arctic bg-arctic/10 border-arctic/20",
  MAJOR: "text-primary bg-primary/10 border-primary/20",
  FEATURE: "text-accent bg-accent/10 border-accent/20",
  IMPROVEMENT: "text-gold bg-gold/10 border-gold/20",
};

const Changelog = () => {
  usePageTitle("Changelog");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[160px] opacity-20"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.14), transparent 70%)" }} />
      </div>

      <main className="container mx-auto max-w-3xl px-6 py-16 relative z-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-10">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>

        <div className="mb-14">
          <span className="font-label text-accent tracking-widest text-[10px]">PLATFORM UPDATES</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold mt-3 mb-3">Changelog</h1>
          <p className="text-sm text-muted-foreground">Every significant update to VORAX, in reverse chronological order.</p>
        </div>

        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-border/40 to-transparent" />

          <div className="space-y-10">
            {entries.map((entry, i) => {
              const Icon = entry.icon;
              return (
                <div key={i} className="relative pl-12">
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-xl bg-background border border-border/60 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>

                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-xs font-mono text-primary font-semibold">{entry.version}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-label border ${tagColors[entry.tag] || "text-muted-foreground border-border"}`}>
                      {entry.tag}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{entry.date}</span>
                  </div>

                  <h2 className="text-base font-display text-foreground mb-3">{entry.title}</h2>

                  <ul className="space-y-2">
                    {entry.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                        <span className="mt-2 w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 p-6 surface-raised border border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            Want to suggest a feature or report a bug?{" "}
            <a href="mailto:support@vorax.com" className="text-primary hover:underline">support@vorax.com</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Changelog;
