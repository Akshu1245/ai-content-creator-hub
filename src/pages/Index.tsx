import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, ChevronRight, Play, Star, Check, Brain, Globe, ArrowRight, Zap, BarChart3, Sparkles, ArrowUpRight } from "lucide-react";
import WordCycler from "@/components/shared/WordCycler";
import AnimatedNumber from "@/components/shared/AnimatedNumber";
import ComplianceGauge from "@/components/dashboard/ComplianceGauge";
import VideoPlayerGate from "@/components/shared/VideoPlayerGate";

const features = [
  { icon: TrendingUp, title: "Trend Intelligence", desc: "Real-time niche analysis with opportunity scoring before you create.", color: "text-accent" },
  { icon: Shield, title: "Compliance Scorer", desc: "Check content against YouTube monetization policies. Fix issues before posting.", featured: true, color: "text-primary" },
  { icon: Brain, title: "Consistency Engine", desc: "Channel DNA memory keeps your creator voice cohesive across every video.", color: "text-emerald" },
  { icon: Globe, title: "Multi-Platform Export", desc: "One video optimized for YouTube, Shorts, TikTok, and Reels automatically.", color: "text-accent" },
];

const pricingPlans = [
  { name: "Starter", price: "Free", period: "", features: ["2 videos/month", "YouTube only", "Basic compliance score", "2 voice options"], cta: "Start Free" },
  { name: "Pro", price: "₹999", period: "/mo", features: ["20 videos/month", "All 4 platforms", "Full compliance + auto-fix", "Consistency Engine", "All 6 voices", "AI growth insights"], cta: "Go Pro", popular: true },
  { name: "Agency", price: "₹2,999", period: "/mo", features: ["Unlimited videos", "Everything in Pro", "Full analytics history", "API access", "Priority queue", "Custom branding"], cta: "Contact Us" },
];

const Index = () => {
  return (
    <VideoPlayerGate>
    <div className="min-h-screen bg-background relative overflow-hidden">

      {/* Ambient glow orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.06), transparent 70%)" }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, rgba(123,47,247,0.06), transparent 70%)" }} />
        <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: "radial-gradient(circle, rgba(248,87,166,0.04), transparent 70%)" }} />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-display text-sm font-bold">F</span>
            </div>
            <span className="text-base font-display text-foreground tracking-tight">FacelessForge</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#how" className="hover:text-primary transition-colors duration-300">How it works</a>
            <a href="#features" className="hover:text-primary transition-colors duration-300">Features</a>
            <a href="#pricing" className="hover:text-primary transition-colors duration-300">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Log in</Button>
            </Link>
            <Link to="/new-project">
              <button className="btn-primary text-xs px-5 py-2.5">Get Started</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-label mb-8 animate-fade-in border border-accent/30"
              style={{ background: "linear-gradient(135deg, hsl(200 80% 62% / 0.12), hsl(270 70% 60% / 0.08))" }}>
              <Sparkles className="w-3 h-3 text-accent" />
              <span className="bg-gradient-to-r from-accent to-[#7b2ff7] bg-clip-text text-transparent font-bold tracking-widest">
                POWERED BY AI · NOW IN BETA
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[1.05] font-display font-bold mb-6 animate-slide-up tracking-tight">
              <span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">Faceless videos</span>
              <br />
              <span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">that actually get </span>
              <WordCycler words={["monetized", "compliant", "views", "results"]} interval={2500} />
            </h1>

            <p className="text-base md:text-lg max-w-xl mx-auto mb-10 text-muted-foreground leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
              The only platform that scores your content against YouTube's monetization guidelines before you post.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.15s" }}>
              <Link to="/new-project">
                <button className="btn-primary text-sm px-10 py-4 flex items-center gap-2">
                  Start Creating <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/dashboard">
                <button className="btn-ghost flex items-center gap-2 py-4">
                  <Play className="w-4 h-4" /> Watch Demo
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: "0.2s" }}>
              {["No credit card", "2 free videos/mo", "Policy safe"].map((text) => (
                <span key={text} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </div>
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Hero card — compliance preview */}
          <div className="max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="surface-overlay p-8 gold-glow">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center">
                  <ComplianceGauge score={94} size={150} />
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Originality", score: 92 },
                    { label: "Monetization", score: 96 },
                    { label: "Value Score", score: 88 },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-label text-muted-foreground">{s.label.toUpperCase()}</span>
                        <span className="text-xs font-mono font-semibold text-foreground">{s.score}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all" style={{ width: `${s.score}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-label bg-emerald/10 text-emerald border border-emerald/20">
                      <Check className="w-3 h-3" /> SAFE TO MONETIZE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-16 px-6 z-10 relative">
        <div className="gradient-strip max-w-4xl mx-auto mb-16" />
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Videos Created", value: 12400, suffix: "+" },
              { label: "Avg Retention", value: 72, suffix: "%" },
              { label: "Compliance Checks", value: 48000, suffix: "+" },
              { label: "Active Creators", value: 3200, suffix: "+" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-3xl md:text-4xl font-display text-foreground font-bold">
                  <AnimatedNumber value={m.value} suffix={m.suffix} />
                </div>
                <div className="text-[10px] mt-2 font-label text-muted-foreground">{m.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <span className="font-label text-primary block mb-3">HOW IT WORKS</span>
            <h2 className="text-3xl md:text-4xl font-display text-foreground font-bold tracking-tight">Idea to published in minutes</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Pick your niche", desc: "Choose a topic and discover high-opportunity angles.", icon: TrendingUp },
              { step: "02", title: "AI generates", desc: "Script, voiceover, visuals — assembled automatically.", icon: Sparkles },
              { step: "03", title: "Review & comply", desc: "Get a monetization score with actionable fixes.", icon: Shield },
              { step: "04", title: "Publish", desc: "Push optimized videos to all platforms.", icon: ArrowUpRight },
            ].map((item) => (
              <div key={item.step} className="surface-raised p-6 text-center group surface-hover">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/15 transition-colors">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[10px] font-label text-primary/50 block mb-2">STEP {item.step}</span>
                <h3 className="text-sm font-display text-foreground mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4">
              <span className="font-label text-accent block mb-3">CAPABILITIES</span>
              <h2 className="text-3xl font-display text-foreground font-bold tracking-tight mb-4">Everything in one pipeline</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">No switching between tools. From trend discovery to multi-platform publishing.</p>
            </div>
            <div className="md:col-span-8 grid sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.title} className="surface-raised p-6 surface-hover">
                  <div className={`w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4`}>
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="font-display text-sm text-foreground mb-2">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  {f.featured && (
                    <span className="inline-flex items-center gap-1 mt-3 text-[9px] font-label text-primary">
                      <Star className="w-2.5 h-2.5" /> KEY FEATURE
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <span className="font-label text-primary block mb-3">PRICING</span>
            <h2 className="text-3xl md:text-4xl font-display text-foreground font-bold tracking-tight mb-3">Simple, transparent pricing</h2>
            <p className="text-muted-foreground text-sm">Start free. Scale when you're ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`surface-raised p-7 relative ${plan.popular ? "ring-1 ring-primary/30 gold-glow" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] font-label bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-lg font-display text-foreground">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2 mb-6">
                  <span className="text-3xl font-display text-foreground font-bold">{plan.price}</span>
                  {plan.period && <span className="text-xs text-muted-foreground">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                      <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-primary" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/dashboard">
                  {plan.popular ? (
                    <button className="btn-primary w-full text-xs">{plan.cta}</button>
                  ) : (
                    <button className="btn-ghost w-full text-xs">{plan.cta}</button>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="surface-overlay p-12 gold-glow">
            <h2 className="text-3xl font-display text-foreground font-bold tracking-tight mb-4">Ready to create?</h2>
            <p className="text-muted-foreground mb-8 text-sm">Start with 2 free videos. No credit card required.</p>
            <Link to="/new-project">
              <button className="btn-primary text-sm px-10 py-4 flex items-center gap-2 mx-auto">
                Start Creating Free <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-border/50">
        <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <span className="text-primary-foreground font-display text-[10px] font-bold">F</span>
            </div>
            <span className="font-display text-foreground text-sm">FacelessForge</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-muted-foreground">© 2026 FacelessForge</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
