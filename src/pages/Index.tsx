import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Shield, TrendingUp, Video, BarChart3, Upload, ChevronRight, Play, Star, Check } from "lucide-react";

const features = [
  { icon: TrendingUp, title: "Trend Intelligence", desc: "AI finds trending topics in your niche with opportunity scoring" },
  { icon: Zap, title: "Auto Script Generation", desc: "GPT-powered scripts optimized for 70%+ audience retention" },
  { icon: Video, title: "Full Video Assembly", desc: "Stock footage, voiceover, captions — all automated" },
  { icon: Shield, title: "Compliance Scorer", desc: "AI checks monetization safety before you publish", highlight: true },
  { icon: Upload, title: "Multi-Platform Publish", desc: "YouTube, Shorts, TikTok, Reels — one click" },
  { icon: BarChart3, title: "Smart Analytics", desc: "AI-powered insights to improve every video" },
];

const pricingPlans = [
  { name: "Free", price: "₹0", period: "/mo", features: ["2 videos/month", "YouTube only", "Basic compliance", "2 voice options"], cta: "Get Started" },
  { name: "Pro", price: "₹999", period: "/mo", features: ["20 videos/month", "All platforms", "Full compliance + auto-fix", "All 6 voices", "Consistency Engine", "90-day analytics"], cta: "Start Pro", popular: true },
  { name: "Agency", price: "₹2,999", period: "/mo", features: ["Unlimited videos", "All platforms", "Full compliance + auto-fix", "Custom voice cloning", "API access", "Full analytics history"], cta: "Go Agency" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border/30">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">FacelessForge<span className="text-primary">AI</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start Free <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(160 84% 50% / 0.12) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 80% 50%, hsl(270 60% 60% / 0.08) 0%, transparent 50%)" }} />
        
        <div className="container mx-auto max-w-4xl text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8 animate-fade-in">
            <Shield className="w-4 h-4" />
            AI Compliance Scorer — No other tool has this
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            Faceless Videos.
            <br />
            <span className="gradient-text">Fully Automated.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Pick a niche. AI finds trends, writes scripts, generates voiceovers, assembles videos with captions, and publishes — while ensuring monetization safety.
          </p>

          <div className="flex items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/dashboard">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-base px-8 h-12">
                Start Creating <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary h-12 px-6">
              <Play className="w-4 h-4 mr-2" /> Watch Demo
            </Button>
          </div>

          {/* Pipeline preview */}
          <div className="mt-16 glass rounded-2xl p-6 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
              {["Trend Analysis", "Script", "Voiceover", "Visuals", "Captions", "Compliance", "Publish"].map((step, i) => (
                <div key={step} className="flex items-center gap-2 shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${i < 3 ? "bg-primary/20 text-primary" : i === 3 ? "bg-accent/20 text-accent" : "bg-secondary text-muted-foreground"}`}>
                    {i < 3 ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium whitespace-nowrap ${i < 3 ? "text-primary" : i === 3 ? "text-accent" : "text-muted-foreground"}`}>{step}</span>
                  {i < 6 && <ChevronRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />}
                </div>
              ))}
            </div>
            <div className="mt-4 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full w-[45%] rounded-full" style={{ background: "var(--gradient-primary)" }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-mono">Generating visuals for section 3/7 — ETA: 2m 14s</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Everything You Need</h2>
          <p className="text-muted-foreground text-center mb-14 max-w-lg mx-auto">From trend discovery to publishing — the entire faceless content pipeline, automated.</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className={`glass rounded-xl p-6 glass-hover group ${f.highlight ? "gradient-border" : ""}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${f.highlight ? "bg-primary/15" : "bg-secondary"}`}>
                  <f.icon className={`w-5 h-5 ${f.highlight ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Scorer Spotlight */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="glass rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10" style={{ background: "radial-gradient(circle, hsl(160 84% 50%), transparent)" }} />
            <div className="flex items-start gap-3 mb-6">
              <Shield className="w-8 h-8 text-primary shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">AI Compliance Scorer</h2>
                <p className="text-muted-foreground">The feature no competitor has. Protect your monetization before publishing.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4 mt-8">
              {[
                { label: "Originality", score: 92, color: "text-primary" },
                { label: "Monetization Safety", score: 88, color: "text-primary" },
                { label: "Value Score", score: 95, color: "text-primary" },
                { label: "Overall", score: 91, color: "text-primary" },
              ].map((s) => (
                <div key={s.label} className="bg-background/50 rounded-xl p-4 text-center">
                  <div className={`text-3xl font-bold font-mono ${s.color}`}>{s.score}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm">
              <span className="px-3 py-1 rounded-full bg-primary/15 text-primary font-medium">🟢 Safe to Publish</span>
              <span className="text-muted-foreground">No policy violations detected</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className="text-muted-foreground text-center mb-14">Start free. Scale when you're ready.</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`glass rounded-2xl p-6 relative ${plan.popular ? "gradient-border glow-primary" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground flex items-center gap-1">
                    <Star className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/dashboard">
                  <Button className={`w-full ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">FacelessForge<span className="text-primary">AI</span></span>
          </div>
          <p>© 2026 FacelessForge AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
