import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Shield, TrendingUp, Video, BarChart3, Upload, ChevronRight, Play, Star, Check, Layers, Brain, Globe } from "lucide-react";
import ParticleField from "@/components/canvas/ParticleField";
import WordCycler from "@/components/shared/WordCycler";
import AnimatedNumber from "@/components/shared/AnimatedNumber";
import ComplianceGauge from "@/components/dashboard/ComplianceGauge";
import TiltCard from "@/components/shared/TiltCard";

const features = [
  { icon: TrendingUp, title: "Trend Intelligence", desc: "Real-time niche analysis with opportunity scoring using Google Trends + YouTube engagement data", color: "cyan" },
  { icon: Zap, title: "Script Generation", desc: "GPT-4o powered scripts engineered for 70%+ retention with pattern interrupts every 30 seconds", color: "cyan" },
  { icon: Video, title: "Full Video Assembly", desc: "Auto-matched stock footage, voiceover, captions, branding — assembled into publish-ready video", color: "mint" },
  { icon: Shield, title: "Compliance Scorer", desc: "Multi-layer AI analysis protects monetization before publishing. No competitor has this.", color: "mint", highlight: true },
  { icon: Brain, title: "Consistency Engine", desc: "Channel DNA memory ensures every video sounds like the same creator. Solves narrative coherence.", color: "cyan", highlight: true },
  { icon: Globe, title: "Multi-Platform Publish", desc: "One generation → YouTube, Shorts, TikTok, Reels. Each format optimized for its algorithm.", color: "mint" },
];

const pricingPlans = [
  { name: "Free", price: "₹0", period: "/mo", features: ["2 videos/month", "YouTube only", "Basic compliance", "2 voice options"], cta: "Get Started" },
  { name: "Pro", price: "₹999", period: "/mo", features: ["20 videos/month", "All platforms", "Full compliance + auto-fix", "All 6 voices", "Consistency Engine", "90-day analytics"], cta: "Start Pro", popular: true },
  { name: "Agency", price: "₹2,999", period: "/mo", features: ["Unlimited videos", "All platforms", "Full compliance + auto-fix", "Custom voice cloning", "API access", "Full analytics history"], cta: "Go Agency" },
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
      {/* Animated background */}
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

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-4 overflow-hidden z-10">
        <div className="container mx-auto max-w-5xl text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-8 animate-fade-in font-label" style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)", color: "#0EA5E9" }}>
            <Shield className="w-4 h-4" />
            AI Compliance Scorer — No other tool has this
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight mb-6 animate-slide-up" style={{ lineHeight: 1.05 }}>
            <span className="text-foreground">Faceless Videos.</span>
            <br />
            <span className="gradient-text-hero">
              <WordCycler words={["Fully Automated.", "AI Compliant.", "Multi-Platform.", "Trend-Optimized."]} />
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 animate-slide-up" style={{ color: "hsl(205 40% 62%)", animationDelay: "0.1s" }}>
            Pick a niche. AI finds trends, writes scripts, generates voiceovers, assembles videos with captions, scores compliance, and publishes everywhere.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/new-project">
              <button className="btn-primary text-base px-10 py-3.5 flex items-center gap-2">
                Start Creating <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
            <Button variant="ghost" size="lg" className="text-foreground/70 hover:text-foreground gap-2">
              <Play className="w-4 h-4" /> Watch Demo
            </Button>
          </div>

          {/* Pipeline preview */}
          <div className="mt-20 glass-elevated p-8 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.35s" }}>
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-3">
              {["Trend Analysis", "Script", "Voiceover", "Visuals", "Captions", "Compliance", "Publish"].map((step, i) => (
                <div key={step} className="flex items-center gap-2 shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                    i < 3
                      ? "text-primary-foreground"
                      : i === 3
                      ? "text-primary-foreground"
                      : ""
                  }`} style={{
                    background: i < 3 ? "linear-gradient(135deg, #0EA5E9, #06D6A0)" : i === 3 ? "linear-gradient(135deg, rgba(14,165,233,0.3), rgba(6,214,160,0.2))" : "rgba(42,72,112,0.2)",
                    border: i <= 3 ? "none" : "1px solid rgba(42,72,112,0.3)",
                    color: i < 3 ? "#020409" : i === 3 ? "#0EA5E9" : "hsl(210 25% 35%)"
                  }}>
                    {i < 3 ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium whitespace-nowrap ${i < 3 ? "text-cyan" : i === 3 ? "text-cyan" : ""}`} style={{ color: i > 3 ? "hsl(210 25% 35%)" : undefined }}>
                    {step}
                  </span>
                  {i < 6 && <ChevronRight className="w-3 h-3 shrink-0" style={{ color: "rgba(42,72,112,0.4)" }} />}
                </div>
              ))}
            </div>
            <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background: "rgba(42,72,112,0.2)" }}>
              <div className="h-full w-[45%] rounded-full transition-all duration-1000" style={{ background: "linear-gradient(90deg, #0EA5E9, #06D6A0)" }} />
            </div>
            <p className="text-xs mt-3 font-mono" style={{ color: "hsl(210 25% 40%)" }}>
              Generating visuals for section 3/7 — ETA: 2m 14s
            </p>
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
                <div className="text-sm mt-1 font-label" style={{ color: "hsl(210 25% 40%)" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="font-label text-xs uppercase tracking-[0.2em] text-cyan mb-4 block">Feature Suite</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Everything You Need</h2>
            <p className="max-w-lg mx-auto" style={{ color: "hsl(205 40% 62%)" }}>
              From trend discovery to multi-platform publishing — the entire faceless content pipeline, automated.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <TiltCard key={f.title} glowColor={f.color === "mint" ? "6,214,160" : "14,165,233"}>
                <div className={`glass p-6 h-full ${f.highlight ? "gradient-border" : ""} glass-hover cursor-default`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{
                    background: f.highlight
                      ? "linear-gradient(135deg, rgba(14,165,233,0.2), rgba(6,214,160,0.15))"
                      : "rgba(42,72,112,0.2)",
                    border: `1px solid ${f.highlight ? "rgba(14,165,233,0.3)" : "rgba(42,72,112,0.3)"}`
                  }}>
                    <f.icon className={`w-5 h-5 ${f.highlight ? "text-cyan" : ""}`} style={{ color: f.highlight ? undefined : "hsl(205 40% 62%)" }} />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2 text-foreground">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(205 40% 62%)" }}>{f.desc}</p>
                  {f.highlight && (
                    <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-label" style={{ background: "rgba(14,165,233,0.1)", color: "#0EA5E9" }}>
                      <Star className="w-3 h-3" /> Key Differentiator
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
            {/* Glow accents */}
            <div className="absolute top-0 right-0 w-80 h-80 opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(6,214,160,0.3), transparent)" }} />
            <div className="absolute bottom-0 left-0 w-60 h-60 opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(14,165,233,0.3), transparent)" }} />

            <div className="relative">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-6 h-6 text-mint" />
                    <span className="font-label text-xs uppercase tracking-[0.15em] text-mint">Core Differentiator</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-display font-bold mb-4">AI Compliance Scorer</h2>
                  <p className="mb-8" style={{ color: "hsl(205 40% 62%)" }}>
                    The feature no competitor has. Multi-layer analysis checks script content, visual diversity, and metadata quality — protecting your monetization before you publish.
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
                          <span className="text-xs font-label" style={{ color: "hsl(210 25% 40%)" }}>{s.label}</span>
                          <span className="text-sm font-mono font-bold text-mint">{s.score}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(42,72,112,0.3)" }}>
                          <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: "linear-gradient(90deg, #0EA5E9, #06D6A0)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <ComplianceGauge score={91} size={180} />
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-bold" style={{ background: "rgba(6,214,160,0.1)", border: "1px solid rgba(6,214,160,0.3)", color: "#06D6A0" }}>
                    🟢 Safe to Publish
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {["Script Analysis", "Visual Homogeneity", "Metadata Quality", "Clickbait Detection", "YMYL Compliance", "Auto-Fix"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "rgba(42,72,112,0.2)", border: "1px solid rgba(42,72,112,0.3)", color: "hsl(205 40% 72%)" }}>
                    {tag}
                  </span>
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
            <span className="font-label text-xs uppercase tracking-[0.2em] text-cyan mb-4 block">Pricing</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Simple, Honest Pricing</h2>
            <p style={{ color: "hsl(205 40% 62%)" }}>Start free. Scale when you're ready.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <TiltCard key={plan.name} glowColor={plan.popular ? "6,214,160" : "42,72,112"}>
                <div className={`glass p-7 relative h-full ${plan.popular ? "gradient-border glow-cyan" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-display font-bold flex items-center gap-1.5" style={{ background: "linear-gradient(135deg, #0EA5E9, #06D6A0)", color: "#020409" }}>
                      <Star className="w-3 h-3" /> Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-display font-bold mb-1 text-foreground">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-display font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm" style={{ color: "hsl(210 25% 40%)" }}>{plan.period}</span>
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
                      <button className="btn-primary w-full justify-center flex items-center">{plan.cta}</button>
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
      <footer className="relative z-10 py-10 px-4" style={{ borderTop: "1px solid rgba(42,72,112,0.2)" }}>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm" style={{ color: "hsl(210 25% 40%)" }}>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan" />
            <span className="font-display font-bold text-foreground">FacelessForge<span className="gradient-text-cyan">AI</span></span>
          </div>
          <p className="font-label text-xs">© 2026 FacelessForge AI. Create. Comply. Dominate.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
