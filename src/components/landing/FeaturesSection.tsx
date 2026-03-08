import { TrendingUp, Shield, Brain, Globe, Star, Zap } from "lucide-react";

const features = [
  { icon: TrendingUp, title: "Trend Intelligence", desc: "Real-time niche analysis with opportunity scoring before you create.", color: "primary" },
  { icon: Shield, title: "Compliance Scorer", desc: "Check content against YouTube monetization policies. Fix issues before posting.", color: "accent", tag: "KEY FEATURE" },
  { icon: Brain, title: "Consistency Engine", desc: "Channel DNA memory keeps your creator voice cohesive across every video.", color: "gold" },
  { icon: Globe, title: "Multi-Platform Export", desc: "One video optimized for YouTube, Shorts, TikTok, and Reels automatically.", color: "arctic" },
  { icon: Zap, title: "Instant Voiceover", desc: "6 premium AI voices with natural inflection and emotional range.", color: "ochre" },
  { icon: Star, title: "Growth Analytics", desc: "Track performance, discover winning patterns, and scale what works.", color: "mauve" },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-28 px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-20">
          <span className="font-label text-accent tracking-widest">CAPABILITIES</span>
          <h2 className="text-3xl md:text-5xl font-display text-foreground font-bold tracking-tight mt-4 mb-4">
            Everything in{" "}
            <span className="bg-gradient-to-r from-gold to-primary bg-clip-text text-transparent">one pipeline</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            No switching between tools. From trend discovery to multi-platform publishing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="surface-raised p-7 surface-hover group relative overflow-hidden">
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `hsl(var(--${f.color}) / 0.08)` }}
              />
              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--${f.color}) / 0.12), hsl(var(--${f.color}) / 0.04))`,
                    border: `1px solid hsl(var(--${f.color}) / 0.15)`,
                  }}
                >
                  <f.icon className={`w-5 h-5 text-${f.color}`} />
                </div>
                <h3 className="font-display text-base text-foreground mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                {f.tag && (
                  <span className="inline-flex items-center gap-1 mt-4 px-2.5 py-1 rounded-full text-[9px] font-label text-accent bg-accent/8 border border-accent/15">
                    <Star className="w-2.5 h-2.5" /> {f.tag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
