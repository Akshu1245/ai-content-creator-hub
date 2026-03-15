import { TrendingUp, Shield, Brain, Globe, Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  { icon: TrendingUp, title: "Trend Intelligence", desc: "Real-time niche analysis with opportunity scoring before you create.", color: "primary" },
  { icon: Shield, title: "Compliance Scorer", desc: "Check content against YouTube monetization policies. Fix issues before posting.", color: "accent", tag: "KEY FEATURE" },
  { icon: Brain, title: "Consistency Engine", desc: "Channel DNA memory keeps your creator voice cohesive across every video.", color: "gold" },
  { icon: Globe, title: "Multi-Platform Export", desc: "One video optimized for YouTube, Shorts, TikTok, and Reels automatically.", color: "arctic" },
  { icon: Zap, title: "Instant Voiceover", desc: "6 premium AI voices with natural inflection and emotional range.", color: "ochre" },
  { icon: Star, title: "Growth Analytics", desc: "Track performance, discover winning patterns, and scale what works.", color: "mauve" },
];

const FeatureCard = ({
  f,
  index,
  mounted,
}: {
  f: (typeof features)[number];
  index: number;
  mounted: boolean;
}) => {
  const revealRef = useScrollReveal(0.12);
  const isFeatured = f.title === "Compliance Scorer";
  return (
    <div
      ref={revealRef}
      className={`surface-raised p-7 surface-hover group relative overflow-hidden border cursor-pointer scroll-reveal ${index < 4 ? `scroll-reveal-delay-${index + 1}` : ""} ${isFeatured ? "border-primary/55 bg-[linear-gradient(155deg,hsl(222_35%_11%/_0.95),hsl(222_35%_8%/_0.9))] shadow-[0_0_24px_hsl(199_89%_48%_/_0.2)]" : "border-border/50"}`}
      style={{
        animation: mounted ? "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
        animationDelay: `${0.3 + (index * 0.08)}s`,
        animationFillMode: "both",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `hsl(var(--${f.color}) / 0.08)`,
          animation: "orbFloat 6s ease-in-out infinite",
        }}
      />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-[5deg]"
          style={{
            background: `linear-gradient(135deg, hsl(var(--${f.color}) / 0.12), hsl(var(--${f.color}) / 0.04))`,
            border: `1px solid hsl(var(--${f.color}) / 0.15)`,
          }}
        >
          <f.icon className="w-5 h-5" style={{ color: `hsl(var(--${f.color}))` }} />
        </div>
        <h3 className="font-display text-base text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors duration-300">{f.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
        {f.tag && (
          <span
            className="inline-flex items-center gap-1 mt-4 px-2.5 py-1 rounded-full text-[9px] font-label text-accent bg-accent/8 border border-accent/15 group-hover:bg-accent/15 group-hover:border-accent/40 transition-all duration-300"
            style={{
              animation: "glowPulse 2.5s ease-in-out infinite",
              boxShadow: "0 0 10px hsl(199 89% 48% / 0.4)",
            }}
          >
            <Star className="w-2.5 h-2.5" /> {f.tag}
          </span>
        )}
        {isFeatured && (
          <span className="inline-flex items-center gap-1 mt-2 ml-2 px-2.5 py-1 rounded-full text-[9px] font-label text-primary bg-primary/10 border border-primary/25">
            <Zap className="w-2.5 h-2.5" /> VORAX EXCLUSIVE
          </span>
        )}

        <div className="mt-5 h-px w-full bg-gradient-to-r from-primary/0 via-primary/25 to-primary/0 group-hover:via-primary/50 transition-colors duration-300" />
        <p
          className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70"
          style={{
            animation: mounted ? "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
            animationDelay: `${0.4 + (index * 0.08)}s`,
            animationFillMode: "both",
          }}
        >
          Operational advantage
        </p>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section id="features" className="py-28 px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-20">
          <span className="font-label text-accent tracking-widest" style={{
            animation: mounted ? "slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
            animationFillMode: "both",
            display: "inline-block",
          }}>CAPABILITIES</span>
          <h2 className="text-3xl md:text-5xl font-display text-foreground font-bold tracking-tight mt-4 mb-4" style={{
            animation: mounted ? "slideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
            animationDelay: "0.1s",
            animationFillMode: "both",
          }}>
            Everything in{" "}
            <span className="bg-gradient-to-r from-gold to-primary bg-clip-text text-transparent" style={{
              backgroundSize: "200% 100%",
              animation: mounted ? "gradientShift 4s ease-in-out infinite" : "none",
            }}>one pipeline</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto" style={{
            animation: mounted ? "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
            animationDelay: "0.2s",
            animationFillMode: "both",
          }}>
            No switching between tools. From trend discovery to multi-platform publishing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} f={f} index={i} mounted={mounted} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
