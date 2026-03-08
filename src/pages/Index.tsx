import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Shield, TrendingUp, Video, ChevronRight, Play, Star, Check, Brain, Globe, Layers } from "lucide-react";
import ParticleField from "@/components/canvas/ParticleField";
import WordCycler from "@/components/shared/WordCycler";
import AnimatedNumber from "@/components/shared/AnimatedNumber";
import ComplianceGauge from "@/components/dashboard/ComplianceGauge";
import TiltCard from "@/components/shared/TiltCard";
import FloatingVideoCard from "@/components/shared/FloatingVideoCard";

const features = [
  { icon: TrendingUp, title: "Trend Intelligence", desc: "Real-time niche analysis with opportunity scoring using engagement ratio data", color: "cyan", borderColor: "14,165,233" },
  { icon: Shield, title: "AI Compliance Scorer", desc: "Multi-layer analysis protects monetization before publishing. No competitor has this.", color: "mint", borderColor: "6,214,160", highlight: true },
  { icon: Brain, title: "Consistency Engine", desc: "Channel DNA memory ensures every video sounds like the same creator across a series.", color: "cyan", borderColor: "14,165,233", highlight: true },
  { icon: Globe, title: "Multi-Platform Publish", desc: "One generation → YouTube, Shorts, TikTok, Reels. Each optimized for its algorithm.", color: "mint", borderColor: "6,214,160" },
];

const pricingPlans = [
  { name: "Free", price: "₹0", period: "/mo", features: ["2 videos/month", "YouTube only", "Basic compliance score", "2 voice options", "7-day analytics"], cta: "Get Started" },
  { name: "Pro", price: "₹999", period: "/mo", features: ["20 videos/month", "All 4 platforms", "Full compliance + auto-fix", "Consistency Engine", "All 6 voices", "90-day analytics + AI insights"], cta: "Start Pro", popular: true },
  { name: "Agency", price: "₹2,999", period: "/mo", features: ["Unlimited videos", "Everything in Pro", "Full analytics history", "API access", "Priority processing", "Custom brand watermark"], cta: "Go Agency" },
];

const metrics = [
  { label: "Videos Generated", value: 12400, suffix: "+" },
  { label: "Avg Retention", value: 72, suffix: "%" },
  { label: "Compliance Checks", value: 48000, suffix: "+" },
  { label: "Creators Active", value: 3200, suffix: "+" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="bg-aurora" />
      <div className="bg-grid" />
      <ParticleField />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50" style={{ background: "rgba(2,4,9,0.7)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(42,72,112,0.2)" }}>
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.25), rgba(6,214,160,0.15))", border: "1px solid rgba(14,165,233,0.3)" }}>
              <Zap className="w-4 h-4 text-cyan" />
            </div>
            <span className="text-lg font-display font-bold tracking-tight">
              Faceless<span className="gradient-text-cyan">Forge</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: "hsl(205 40% 62%)" }}>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#compliance" className="hover:text-foreground transition-colors">Compliance</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground">Log in</Button>
            </Link>
            <Link to="/dashboard">
              <button className="btn-primary text-sm">
                Start Free <ChevronRight className="w-4 h-4 ml-1 inline" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — two-column */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            {/* Left 55% */}
            <div className="lg:w-[55%] text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-8 animate-fade-in font-label tracking-[3px]" style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)", color: "#0EA5E9" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-glow" />
                POWERED BY AI + ELEVENLABS
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[68px] font-display font-extrabold mb-6 animate-slide-up" style={{ lineHeight: 1.05, letterSpacing: "-2.5px" }}>
                Create Faceless Videos
                <br />
                <span className="text-foreground">That Are </span>
                <span className="gradient-text-cyan">
                  <WordCycler words={["Compliant", "Monetized", "Automated", "Dominant"]} interval={2000} />
                </span>
              </h1>

              <p className="text-base md:text-lg max-w-[480px] mb-10 animate-slide-up leading-relaxed" style={{ color: "hsl(205 40% 62%)", animationDelay: "0.1s" }}>
                The only faceless video platform that scores your content against YouTube's monetization guidelines before you post.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Link to="/new-project">
                  <button className="btn-primary text-base px-10 py-4 flex items-center gap-2" style={{ height: 48 }}>
                    Start Creating Free <ChevronRight className="w-5 h-5" />
                  </button>
                </Link>
                <Button variant="ghost" size="lg" className="text-foreground/60 hover:text-foreground gap-2">
                  <Play className="w-4 h-4" /> See How It Works
                </Button>
              </div>

              {/* Trust bar */}
              <div className="flex flex-wrap items-center gap-6 mt-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                {["No credit card required", "2 free videos/month", "YouTube policy compliant"].map((text) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs" style={{ color: "hsl(210 25% 40%)" }}>
                    <Check className="w-3.5 h-3.5 text-mint" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right 45% */}
            <div className="lg:w-[45%] animate-slide-up" style={{ animationDelay: "0.35s" }}>
              <FloatingVideoCard />
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold gradient-text-cyan">
                  <AnimatedNumber value={m.value} suffix={m.suffix} />
                </div>
                <div className="text-xs mt-1 font-label tracking-[2px]" style={{ color: "hsl(210 25% 40%)" }}>{m.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — 2x2 grid */}
      <section id="features" className="py-24 px-4 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <span className="font-label text-xs uppercase tracking-[3px] text-cyan mb-4 block">FEATURE SUITE</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4" style={{ letterSpacing: "-1.5px" }}>Every Tool You Need to Dominate Faceless Content</h2>
            <p className="max-w-lg mx-auto text-sm" style={{ color: "hsl(205 40% 62%)" }}>
              From trend discovery to multi-platform publishing — the entire pipeline, automated.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f) => (
              <TiltCard key={f.title} glowColor={f.borderColor}>
                <div className={`glass p-7 h-full glass-hover cursor-default relative overflow-hidden`} style={{ borderLeft: `3px solid rgba(${f.borderColor},0.5)` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{
                    background: `rgba(${f.borderColor},0.1)`,
                    border: `1px solid rgba(${f.borderColor},0.25)`,
                  }}>
                    <f.icon className="w-5 h-5" style={{ color: `rgb(${f.borderColor})` }} />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2 text-foreground" style={{ letterSpacing: "-0.3px" }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(205 40% 62%)" }}>{f.desc}</p>
                  {f.highlight && (
                    <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-label tracking-[1.5px]" style={{ background: "rgba(14,165,233,0.1)", color: "#0EA5E9" }}>
                      <Star className="w-3 h-3" /> KEY DIFFERENTIATOR
                    </div>
                  )}
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Spotlight */}
      <section id="compliance" className="py-24 px-4 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="glass-elevated p-8 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(6,214,160,0.3), transparent)" }} />
            <div className="absolute bottom-0 left-0 w-60 h-60 opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(14,165,233,0.3), transparent)" }} />

            <div className="relative">
              <div className="flex flex-col md:flex-row items-start gap-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-mint" />
                    <span className="font-label text-[10px] uppercase tracking-[2px] text-mint">CORE DIFFERENTIATOR</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-display font-bold mb-4" style={{ letterSpacing: "-1px" }}>Never Get Demonetized Again</h2>
                  <p className="mb-8 text-sm leading-relaxed" style={{ color: "hsl(205 40% 62%)" }}>
                    Multi-layer AI analysis checks script content, visual diversity, and metadata quality — protecting your monetization before you publish.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Originality", score: 92 },
                      { label: "Value Score", score: 95 },
                      { label: "Monetization", score: 88 },
                      { label: "Metadata", score: 90 },
                    ].map((s) => (
                      <div key={s.label} className="glass p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-label tracking-[1px]" style={{ color: "hsl(210 25% 40%)" }}>{s.label.toUpperCase()}</span>
                          <span className="text-sm font-mono font-bold text-mint">{s.score}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(42,72,112,0.3)" }}>
                          <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: "linear-gradient(90deg, #0EA5E9, #06D6A0)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 shrink-0">
                  <ComplianceGauge score={91} size={200} />
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-display font-bold" style={{ background: "rgba(6,214,160,0.1)", border: "1px solid rgba(6,214,160,0.3)", color: "#06D6A0" }}>
                    <Shield className="w-3.5 h-3.5" /> Safe to Publish
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mt-8 space-y-2">
                {[
                  "Consider adding 2-3 data citations to boost originality score",
                  "Vary visual clip durations between 4-8 seconds for natural pacing",
                  "Add disclosure tag — AI-generated content flag recommended",
                ].map((rec, i) => (
                  <div key={i} className="glass p-3 flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: i === 2 ? "#FFB703" : "#06D6A0" }} />
                    <span className="text-xs" style={{ color: "hsl(205 40% 62%)" }}>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <span className="font-label text-xs uppercase tracking-[3px] text-cyan mb-4 block">PRICING</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4" style={{ letterSpacing: "-1.5px" }}>Simple, Honest Pricing</h2>
            <p className="text-sm" style={{ color: "hsl(205 40% 62%)" }}>Start free. Scale when you're ready.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <TiltCard key={plan.name} glowColor={plan.popular ? "6,214,160" : "42,72,112"}>
                <div className={`glass p-7 relative h-full ${plan.popular ? "gradient-border glow-cyan" : ""}`} style={plan.popular ? { transform: "scale(1.03)" } : {}}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-display font-bold tracking-[1px] flex items-center gap-1.5" style={{ background: "linear-gradient(135deg, #0EA5E9, #06D6A0)", color: "#020409" }}>
                      <Star className="w-3 h-3" /> MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-xl font-display font-bold mb-1 text-foreground">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-display font-bold text-foreground">{plan.price}</span>
                    <span className="text-xs font-label" style={{ color: "hsl(210 25% 40%)" }}>{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "hsl(205 40% 62%)" }}>
                        <Check className="w-4 h-4 text-mint shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/dashboard">
                    {plan.popular ? (
                      <button className="btn-primary w-full flex items-center justify-center">{plan.cta}</button>
                    ) : (
                      <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">{plan.cta}</Button>
                    )}
                  </Link>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4" style={{ borderTop: "1px solid rgba(42,72,112,0.2)" }}>
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan" />
              <span className="font-display font-bold text-foreground">FacelessForge<span className="gradient-text-cyan">AI</span></span>
            </div>
            <div className="flex items-center gap-6 text-xs" style={{ color: "hsl(210 25% 40%)" }}>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <p className="font-label text-[10px] tracking-[2px]" style={{ color: "hsl(210 25% 35%)" }}>CREATE. COMPLY. DOMINATE.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
