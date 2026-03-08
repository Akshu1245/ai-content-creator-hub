import { TrendingUp, Sparkles, Shield, ArrowUpRight } from "lucide-react";

const steps = [
  { step: "01", title: "Pick your niche", desc: "Choose a topic and discover high-opportunity angles with AI trend analysis.", icon: TrendingUp, accent: "accent" },
  { step: "02", title: "AI generates", desc: "Script, voiceover, visuals — assembled automatically in minutes.", icon: Sparkles, accent: "primary" },
  { step: "03", title: "Review & comply", desc: "Get a monetization score with actionable fixes before publishing.", icon: Shield, accent: "emerald" },
  { step: "04", title: "Publish", desc: "Push optimized videos to YouTube, Shorts, TikTok & Reels.", icon: ArrowUpRight, accent: "accent" },
];

const HowItWorksSection = () => {
  return (
    <section id="how" className="py-28 px-6 relative z-10">
      {/* Background filmstrip effect */}
      <div className="absolute left-6 top-0 bottom-0 w-[1px] hidden md:block" style={{ background: "linear-gradient(180deg, transparent, hsl(225 12% 18%), transparent)" }} />
      <div className="absolute right-6 top-0 bottom-0 w-[1px] hidden md:block" style={{ background: "linear-gradient(180deg, transparent, hsl(225 12% 18%), transparent)" }} />

      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-accent/40" />
            <span className="font-label text-accent tracking-widest">HOW IT WORKS</span>
            <div className="w-8 h-[1px] bg-accent/40" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display text-foreground font-bold tracking-tight">
            Idea to published in{" "}
            <span className="bg-gradient-to-r from-accent to-[hsl(270,70%,60%)] bg-clip-text text-transparent">minutes</span>
          </h2>
        </div>

        {/* Timeline layout */}
        <div className="relative">
          {/* Central timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] hidden md:block -translate-x-1/2" style={{ background: "linear-gradient(180deg, transparent, hsl(225 12% 20%), hsl(225 12% 20%), transparent)" }} />

          <div className="space-y-8 md:space-y-16">
            {steps.map((item, i) => (
              <div
                key={item.step}
                className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              >
                {/* Card */}
                <div className="flex-1 w-full">
                  <div className="surface-raised p-8 group surface-hover relative overflow-hidden">
                    {/* Step number watermark */}
                    <span
                      className="absolute -top-4 -right-2 text-[80px] font-display font-bold leading-none pointer-events-none select-none"
                      style={{ color: "hsl(225 12% 12%)" }}
                    >
                      {item.step}
                    </span>

                    <div className="relative z-10">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, hsl(var(--${item.accent}) / 0.15), hsl(var(--${item.accent}) / 0.05))`,
                          border: `1px solid hsl(var(--${item.accent}) / 0.2)`,
                        }}
                      >
                        <item.icon className={`w-6 h-6 text-${item.accent}`} />
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground/50 tracking-widest block mb-2">
                        STEP {item.step}
                      </span>
                      <h3 className="text-lg font-display text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="hidden md:flex items-center justify-center w-12 h-12 shrink-0">
                  <div
                    className="w-4 h-4 rounded-full border-2 relative"
                    style={{
                      borderColor: `hsl(var(--${item.accent}))`,
                      background: "hsl(225, 20%, 7%)",
                    }}
                  >
                    <div
                      className="absolute inset-1 rounded-full"
                      style={{ background: `hsl(var(--${item.accent}))` }}
                    />
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
