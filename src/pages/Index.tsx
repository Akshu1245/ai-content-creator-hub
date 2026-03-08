import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, ChevronRight, Play, Star, Check, Brain, Globe, ArrowRight, Zap, BarChart3 } from "lucide-react";
import WordCycler from "@/components/shared/WordCycler";
import AnimatedNumber from "@/components/shared/AnimatedNumber";
import ComplianceGauge from "@/components/dashboard/ComplianceGauge";

const features = [
  { icon: TrendingUp, title: "Trend Intelligence", desc: "Real-time niche analysis with opportunity scoring. Know what to create before you press record." },
  { icon: Shield, title: "Compliance Scorer", desc: "Multi-layer analysis checks your content against YouTube monetization policies. Fix issues before posting.", featured: true },
  { icon: Brain, title: "Consistency Engine", desc: "Channel DNA memory ensures your creator voice stays cohesive across every video in a series.", featured: true },
  { icon: Globe, title: "Multi-Platform Export", desc: "One video, four platforms. Optimized for YouTube, Shorts, TikTok, and Reels automatically." },
];

const pricingPlans = [
  { name: "Starter", price: "Free", period: "", features: ["2 videos/month", "YouTube only", "Basic compliance score", "2 voice options"], cta: "Get Started" },
  { name: "Pro", price: "₹999", period: "/mo", features: ["20 videos/month", "All 4 platforms", "Full compliance + auto-fix", "Consistency Engine", "All 6 voices", "AI growth insights"], cta: "Upgrade to Pro", popular: true },
  { name: "Agency", price: "₹2,999", period: "/mo", features: ["Unlimited videos", "Everything in Pro", "Full analytics history", "API access", "Priority queue", "Custom branding"], cta: "Contact Sales" },
];

const howItWorks = [
  { step: "01", title: "Pick your niche", desc: "Choose a topic and let our trend engine find high-opportunity angles." },
  { step: "02", title: "AI generates everything", desc: "Script, voiceover, visuals, captions — assembled automatically." },
  { step: "03", title: "Review & comply", desc: "Get a monetization safety score with actionable fixes." },
  { step: "04", title: "Publish everywhere", desc: "One click to push optimized videos to all platforms." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="bg-noise" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display text-base">F</span>
            </div>
            <span className="text-lg font-display text-foreground">FacelessForge</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Log in</Button>
            </Link>
            <Link to="/new-project">
              <button className="btn-primary text-sm">Get Started Free</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — asymmetric editorial layout */}
      <section className="relative pt-36 pb-24 px-6 z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Left — text heavy */}
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-label mb-6 animate-fade-in bg-primary/8 text-primary border border-primary/15">
                <Zap className="w-3 h-3" />
                NOW IN BETA
              </div>

              <h1 className="text-[2.8rem] md:text-[3.6rem] leading-[1.08] font-display font-normal mb-6 animate-slide-up text-foreground">
                Faceless videos{" "}
                <br className="hidden md:block" />
                that actually get{" "}
                <em className="text-primary not-italic">
                  <WordCycler words={["monetized", "compliant", "views", "results"]} interval={2500} />
                </em>
              </h1>

              <p className="text-base md:text-lg max-w-lg mb-8 text-muted-foreground leading-relaxed animate-slide-up font-sans" style={{ animationDelay: "0.1s" }}>
                The only platform that scores your content against YouTube's monetization guidelines before you post. Pick a niche, and the AI handles the rest.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-3 animate-slide-up" style={{ animationDelay: "0.15s" }}>
                <Link to="/new-project">
                  <button className="btn-primary text-base px-8 py-3.5 flex items-center gap-2">
                    Start Creating <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link to="/dashboard">
                  <button className="btn-ghost flex items-center gap-2 py-3.5">
                    <Play className="w-4 h-4" /> Watch Demo
                  </button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-5 mt-8 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: "0.2s" }}>
                {["No credit card", "2 free videos/mo", "Policy safe"].map((text) => (
                  <span key={text} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-primary" /> {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — compliance preview card */}
            <div className="md:col-span-5 mt-4 md:mt-12 animate-slide-up" style={{ animationDelay: "0.25s" }}>
              <div className="surface-raised p-6 relative">
                <div className="absolute -top-3 left-5 px-3 py-1 rounded-full text-[10px] font-label bg-primary text-primary-foreground">
                  COMPLIANCE PREVIEW
                </div>
                <div className="flex items-center justify-center mb-4 pt-2">
                  <ComplianceGauge score={94} size={140} />
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Originality", score: 92, color: "bg-primary" },
                    { label: "Monetization", score: 96, color: "bg-olive" },
                    { label: "Value Score", score: 88, color: "bg-accent" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-3">
                      <span className="text-[11px] font-label text-muted-foreground w-24">{s.label.toUpperCase()}</span>
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.score}%` }} />
                      </div>
                      <span className="text-xs font-mono font-semibold text-foreground w-6 text-right">{s.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="py-14 px-6 z-10 relative border-y border-border bg-card/50">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Videos Created", value: 12400, suffix: "+" },
              { label: "Avg Retention", value: 72, suffix: "%" },
              { label: "Compliance Checks", value: 48000, suffix: "+" },
              { label: "Active Creators", value: 3200, suffix: "+" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-3xl font-display text-foreground">
                  <AnimatedNumber value={m.value} suffix={m.suffix} />
                </div>
                <div className="text-xs mt-1.5 font-label text-muted-foreground">{m.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-14">
            <span className="font-label text-primary block mb-2">THE PROCESS</span>
            <h2 className="text-3xl md:text-4xl font-display text-foreground">From idea to published in minutes</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {howItWorks.map((item) => (
              <div key={item.step} className="flex gap-5">
                <div className="text-4xl font-display text-primary/20 leading-none pt-1">{item.step}</div>
                <div>
                  <h3 className="text-lg font-display text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 relative z-10 bg-card/40">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-14">
            <span className="font-label text-accent block mb-2">CAPABILITIES</span>
            <h2 className="text-3xl md:text-4xl font-display text-foreground">Everything in one pipeline</h2>
            <p className="text-muted-foreground mt-3 max-w-md text-sm">From trend discovery to multi-platform publishing. No switching between tools.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f) => (
              <div key={f.title} className={`surface-raised p-6 ${f.featured ? "border-l-3 border-l-primary" : ""}`} style={{ borderLeftWidth: f.featured ? "3px" : undefined }}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${f.featured ? "bg-primary/10" : "bg-secondary"}`}>
                    <f.icon className={`w-5 h-5 ${f.featured ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-foreground mb-1.5">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    {f.featured && (
                      <span className="inline-flex items-center gap-1 mt-3 text-[11px] font-label text-primary">
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
      <section id="compliance" className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="surface-raised p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="font-label text-accent block mb-2">KEY DIFFERENTIATOR</span>
                <h2 className="text-2xl md:text-3xl font-display text-foreground mb-4">Know before you post</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Our multi-layer analysis checks script content, visual diversity, and metadata quality. Get a score and actionable fixes before publishing — no other tool does this.
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Originality", score: 92 },
                    { label: "Value Score", score: 95 },
                    { label: "Monetization Safety", score: 88 },
                    { label: "Metadata Quality", score: 90 },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-3">
                      <span className="text-[11px] font-label text-muted-foreground w-32">{s.label.toUpperCase()}</span>
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${s.score}%` }} />
                      </div>
                      <span className="text-sm font-mono font-semibold text-foreground w-8 text-right">{s.score}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <ComplianceGauge score={91} size={190} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 relative z-10 bg-card/40">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <span className="font-label text-primary block mb-2">PRICING</span>
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-3">Simple, honest pricing</h2>
            <p className="text-muted-foreground text-sm">Start free. Scale when you're ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`surface-raised p-7 relative ${plan.popular ? "ring-2 ring-primary shadow-lg" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-5 px-3 py-1 rounded-full text-[10px] font-label bg-primary text-primary-foreground">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-display text-foreground">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2 mb-6">
                  <span className="text-3xl font-display text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0" /> {f}
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

      {/* CTA */}
      <section className="py-20 px-6 relative z-10">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-display text-foreground mb-4">Ready to create?</h2>
          <p className="text-muted-foreground mb-8">Start with 2 free videos. No credit card required.</p>
          <Link to="/new-project">
            <button className="btn-primary text-base px-10 py-4 flex items-center gap-2 mx-auto">
              Start Creating Free <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-border">
        <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display text-xs">F</span>
            </div>
            <span className="font-display text-foreground">FacelessForge AI</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 FacelessForge</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
