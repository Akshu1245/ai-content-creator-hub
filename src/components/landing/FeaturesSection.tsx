import { TrendingUp, Shield, Brain, Globe, Star } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Trend Intelligence",
    desc: "Real-time niche analysis with opportunity scoring before you create.",
    accent: "accent",
    tag: null,
  },
  {
    icon: Shield,
    title: "Compliance Scorer",
    desc: "Check content against YouTube monetization policies. Fix issues before posting.",
    accent: "primary",
    tag: "KEY FEATURE",
  },
  {
    icon: Brain,
    title: "Consistency Engine",
    desc: "Channel DNA memory keeps your creator voice cohesive across every video.",
    accent: "emerald",
    tag: null,
  },
  {
    icon: Globe,
    title: "Multi-Platform Export",
    desc: "One video optimized for YouTube, Shorts, TikTok, and Reels automatically.",
    accent: "accent",
    tag: null,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-28 px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-12 gap-16 items-start">
          {/* Left sticky column */}
          <div className="md:col-span-4 md:sticky md:top-32">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-primary/40" />
              <span className="font-label text-primary tracking-widest">CAPABILITIES</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display text-foreground font-bold tracking-tight mb-5">
              Everything in{" "}
              <span className="relative inline-block">
                one pipeline
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M0 6 Q50 0, 100 4 Q150 8, 200 2" stroke="hsl(42, 78%, 58%)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              No switching between tools. From trend discovery to multi-platform publishing — all in one cinematic workflow.
            </p>

            {/* Mini viewfinder decoration */}
            <div
              className="hidden md:block w-32 h-20 rounded-lg relative mt-8"
              style={{
                border: "1px solid hsl(225 12% 20%)",
                background: "linear-gradient(135deg, hsl(225 18% 9%), hsl(225 18% 7%))",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border border-accent/30 rounded-full" />
                <div className="absolute w-[1px] h-full bg-accent/10" />
                <div className="absolute w-full h-[1px] bg-accent/10" />
              </div>
              <span className="absolute bottom-1 right-2 text-[7px] font-mono text-muted-foreground/30">
                4K
              </span>
            </div>
          </div>

          {/* Right features grid */}
          <div className="md:col-span-8 grid sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="surface-raised p-7 surface-hover group relative overflow-hidden"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Hover glow */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: `hsl(var(--${f.accent}) / 0.08)` }}
                />

                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--${f.accent}) / 0.12), hsl(var(--${f.accent}) / 0.04))`,
                      border: `1px solid hsl(var(--${f.accent}) / 0.15)`,
                    }}
                  >
                    <f.icon className={`w-5 h-5 text-${f.accent}`} />
                  </div>
                  <h3 className="font-display text-base text-foreground mb-2">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  {f.tag && (
                    <span className="inline-flex items-center gap-1 mt-4 px-2.5 py-1 rounded-full text-[9px] font-label text-primary bg-primary/8 border border-primary/15">
                      <Star className="w-2.5 h-2.5" /> {f.tag}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
