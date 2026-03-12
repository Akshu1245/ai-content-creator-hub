import { TrendingUp, Shield, Brain, Globe, Star, Zap, DollarSign, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

const features = [
  {
    icon: Shield,
    title: "Monetization Shield",
    desc: "Every script scored against YouTube's ad policy before you render a frame. Know exactly what's risky and get the rewrite — not a post-publish demonetization notice.",
    color: "accent",
    tag: "ZERO COMPETITORS OFFER THIS",
    tagColor: "accent",
    tagStyle: "glowPulse 3s ease-in-out infinite",
  },
  {
    icon: DollarSign,
    title: "Paycheck Preview",
    desc: "See projected monthly earnings per video based on your niche's live RPM data. Pick topics worth ₹30K+/month — not just topics that sound good.",
    color: "gold",
    tag: "ZERO COMPETITORS OFFER THIS",
    tagColor: "gold",
  },
  {
    icon: TrendingUp,
    title: "Niche Goldmine Finder",
    desc: "AI-powered gap analysis finds underserved angles in your niche with high search demand and low competition. Find the video nobody made that everyone's looking for.",
    color: "primary",
  },
  {
    icon: BookOpen,
    title: "Monetization Countdown",
    desc: "Real-time YPP tracker showing your exact progress toward 1,000 subscribers and 4,000 watch hours. Know your ETA to your first YouTube paycheck.",
    color: "primary",
    tag: "ZERO COMPETITORS OFFER THIS",
    tagColor: "accent",
  },
  {
    icon: Brain,
    title: "Style Memory",
    desc: "VORAX learns your channel's voice, pacing, and structure — then applies it to every video automatically. Your 100th video sounds as consistent as your 1st.",
    color: "mauve",
  },
  {
    icon: Zap,
    title: "9 Native AI Voices",
    desc: "9 premium voices via Sarvam AI — Hindi, Tamil, Telugu, Kannada, Bengali, Marathi. Not a translation filter. A purpose-trained Indian TTS model with real regional inflection.",
    color: "ochre",
  },
  {
    icon: Globe,
    title: "4-Platform Blitz",
    desc: "One creation session outputs YouTube long-form, YouTube Shorts, TikTok, and Instagram Reels — each auto-optimized for aspect ratio, duration, and captions.",
    color: "arctic",
  },
  {
    icon: Star,
    title: "Growth Blueprint",
    desc: "Discover what makes your top videos earn more. Pattern-match against your winners and replicate at scale with AI-generated topic variations.",
    color: "gold",
  },
];

const FeaturesSection = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section id="features" className="py-28 px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-20">
          <span className="font-label text-accent tracking-widest" style={{
            animation: mounted ? "slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0s both" : "none",
            display: "inline-block",
          }}>THE ARSENAL</span>
          <h2 className="text-3xl md:text-5xl font-display text-foreground font-bold tracking-tight mt-4 mb-4" style={{
            animation: mounted ? "slideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both" : "none",
          }}>
            Tools competitors{" "}
            <span className="bg-gradient-to-r from-gold to-primary bg-clip-text text-transparent" style={{
              backgroundSize: "200% 100%",
              animation: mounted ? "gradientShift 4s ease-in-out infinite" : "none",
            }}>don't have</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto" style={{
            animation: mounted ? "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both" : "none",
          }}>
            3 of these 8 features don't exist anywhere else. Not in InVideo, Pictory, Fliki, HeyGen, or Synthesia. Not even close.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={f.title} className="surface-raised p-7 surface-hover group relative overflow-hidden border border-border/50 cursor-pointer" style={{
              animation: mounted ? `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + (i * 0.06)}s both` : "none",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `hsl(var(--${f.color}) / 0.08)`,
                  animation: "blobFloat 6s ease-in-out infinite",
                }}
              />

              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110"
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
                  <span className="inline-flex items-center gap-1 mt-4 px-2.5 py-1 rounded-full text-[8px] font-label border transition-all duration-300"
                    style={{
                      color: `hsl(var(--${f.tagColor}))`,
                      background: `hsl(var(--${f.tagColor}) / 0.08)`,
                      borderColor: `hsl(var(--${f.tagColor}) / 0.2)`,
                      animation: "glowPulse 3s ease-in-out infinite",
                    }}
                  >
                    ★ {f.tag}
                  </span>
                )}

                <div className="mt-5 h-px w-full bg-gradient-to-r from-primary/0 via-primary/25 to-primary/0 group-hover:via-primary/50 transition-colors duration-300" />
                <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Built for Indian creators</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
