import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, ChevronRight, Play, Star, Check, Brain, Globe, ArrowRight } from "lucide-react";
import WordCycler from "@/components/shared/WordCycler";
import AnimatedNumber from "@/components/shared/AnimatedNumber";
import ComplianceGauge from "@/components/dashboard/ComplianceGauge";

const features = [
  { icon: TrendingUp, title: "Trend Intelligence", desc: "Real-time niche analysis with opportunity scoring from engagement and competition data." },
  { icon: Shield, title: "Compliance Scorer", desc: "Multi-layer analysis checks content, visuals, and metadata against monetization policies.", featured: true },
  { icon: Brain, title: "Consistency Engine", desc: "Channel DNA memory ensures every video matches your creator identity across a series.", featured: true },
  { icon: Globe, title: "Multi-Platform Export", desc: "One generation outputs optimized formats for YouTube, Shorts, TikTok, and Reels." },
];

const pricingPlans = [
  { name: "Starter", price: "₹0", period: "/mo", features: ["2 videos/month", "YouTube only", "Basic compliance score", "2 voice options"], cta: "Get Started" },
  { name: "Pro", price: "₹999", period: "/mo", features: ["20 videos/month", "All 4 platforms", "Full compliance + auto-fix", "Consistency Engine", "All 6 voices", "AI growth insights"], cta: "Upgrade to Pro", popular: true },
  { name: "Agency", price: "₹2,999", period: "/mo", features: ["Unlimited videos", "Everything in Pro", "Full analytics history", "API access", "Priority processing", "Custom watermark"], cta: "Contact Sales" },
];

const stats = [
  { label: "Videos Created", value: 12400, suffix: "+" },
  { label: "Avg Retention", value: 72, suffix: "%" },
  { label: "Compliance Checks", value: 48000, suffix: "+" },
  { label: "Active Creators", value: 3200, suffix: "+" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="bg-noise" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">F</span>
            </div>
            <span className="text-base font-display font-bold tracking-tight text-foreground">
              FacelessForge
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#compliance" className="hover:text-foreground transition-colors">Compliance</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Log in</Button>
            </Link>
            <Link to="/new-project">
              <button className="btn-primary text-sm">Get Started</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 z-10">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-label mb-8 animate-fade-in border border-border text-muted-foreground bg-secondary">
            <div className="status-dot bg-primary" />
            NOW IN BETA
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 animate-slide-up text-foreground" style={{ lineHeight: 1.1 }}>
            Faceless videos that are{" "}
            <span className="text-primary">
              <WordCycler words={["compliant", "monetized", "automated", "consistent"]} interval={2200} />
            </span>
          </h1>

          <p className="text-base md:text-lg max-w-xl mx-auto mb-10 text-muted-foreground leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            The only faceless video platform that scores your content against YouTube's monetization guidelines before you post. Pick a niche, and AI handles the rest.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <Link to="/new-project">
              <button className="btn-primary text-base px-8 py-3 flex items-center gap-2">
                Start Creating <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="btn-ghost flex items-center gap-2">
                <Play className="w-4 h-4" /> Watch Demo
              </button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-muted-foreground animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {["No credit card required", "2 free videos/month", "YouTube policy safe"].map((text) => (
              <span key={text} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-accent" /> {text}
              </span>
            ))}
          </div>
        </div>

        {/* Pipeline preview card */}
        <div className="container mx-auto max-w-2xl mt-16 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="surface-raised p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="status-dot bg-accent" />
              <span className="font-label text-muted-foreground">PIPELINE ACTIVE</span>
            </div>
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
              {["Trends", "Script", "Voice", "Visuals", "Captions", "Compliance", "Export"].map((step, i) => (
                <div key={step} className="flex items-center gap-1.5 shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-semibold ${
                    i < 4 ? "bg-primary text-primary-foreground" : i === 4 ? "bg-secondary text-primary border border-primary/30" : "bg-secondary text-muted-foreground"
                  }`}>
                    {i < 4 ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${i <= 4 ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
                  {i < 6 && <ChevronRight className="w-3 h-3 text-muted-foreground/50" />}
                </div>
              ))}
            </div>
            <div className="mt-4 h-1.5 rounded-full overflow-hidden bg-secondary">
              <div className="h-full w-[62%] rounded-full bg-primary transition-all duration-1000" />
            </div>
            <p className="text-xs mt-2 font-mono text-muted-foreground">
              Generating captions — ETA: 1m 40s
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 relative z-10">
        <div className="container mx-auto max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-3xl font-display font-bold text-foreground">
                  <AnimatedNumber value={m.value} suffix={m.suffix} />
                </div>
                <div className="text-xs mt-1 font-label text-muted-foreground">{m.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-3 text-foreground">Everything in one pipeline</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">From trend discovery to multi-platform publishing. No switching between tools.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.title} className={`surface p-6 surface-hover ${f.featured ? "border-l-2 border-l-primary" : ""}`}>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <f.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    {f.featured && (
                      <span className="inline-flex items-center gap-1 mt-2 text-xs font-label text-primary">
                        <Star className="w-3 h-3" /> UNIQUE TO FACELESSFORGE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance demo */}
      <section id="compliance" className="py-20 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="surface-raised p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start gap-10">
              <div className="flex-1">
                <span className="font-label text-primary mb-3 block">COMPLIANCE SCORING</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 text-foreground">Know before you post</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Our multi-layer analysis checks script content, visual diversity, and metadata quality. Get a score and actionable fixes before publishing.
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Originality", score: 92 },
                    { label: "Value Score", score: 95 },
                    { label: "Monetization Safety", score: 88 },
                    { label: "Metadata Quality", score: 90 },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-3">
                      <span className="text-xs font-label text-muted-foreground w-32">{s.label.toUpperCase()}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${s.score}%` }} />
                      </div>
                      <span className="text-sm font-mono font-semibold text-accent w-8 text-right">{s.score}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center shrink-0">
                <ComplianceGauge score={91} size={180} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-3 text-foreground">Simple pricing</h2>
            <p className="text-muted-foreground text-sm">Start free. Scale when you're ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`surface p-6 relative ${plan.popular ? "border-primary ring-1 ring-primary/20" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-4 px-3 py-0.5 rounded-full text-xs font-display font-semibold bg-primary text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-display font-semibold text-foreground">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1 mb-5">
                  <span className="text-2xl font-display font-bold text-foreground">{plan.price}</span>
                  <span className="text-xs text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-accent shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/dashboard">
                  {plan.popular ? (
                    <button className="btn-primary w-full">{plan.cta}</button>
                  ) : (
                    <button className="btn-ghost w-full">{plan.cta}</button>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-[10px]">F</span>
            </div>
            <span className="font-display font-semibold text-foreground">FacelessForge AI</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <p className="font-label">© 2026 FACELESSFORGE</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
