import { TrendingUp, Sparkles, Shield, ArrowUpRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  { step: "01", title: "Pick your niche", desc: "Choose a topic and discover high-opportunity angles with AI trend analysis.", icon: TrendingUp, iconColor: "primary" },
  { step: "02", title: "AI generates", desc: "Script, voiceover, visuals — assembled automatically in minutes.", icon: Sparkles, iconColor: "gold" },
  { step: "03", title: "Review & comply", desc: "Get a monetization score with actionable fixes before publishing.", icon: Shield, iconColor: "accent" },
  { step: "04", title: "Publish", desc: "Push optimized videos to YouTube, Shorts, TikTok & Reels.", icon: ArrowUpRight, iconColor: "mauve" },
];

const StepCard = ({
  item,
  index,
}: {
  item: (typeof steps)[number];
  index: number;
}) => {
  const revealRef = useScrollReveal(0.12);
  return (
    <div ref={revealRef} className={`relative group scroll-reveal ${index < 4 ? `scroll-reveal-delay-${index + 1}` : ""}`}>
      {index < steps.length - 1 && (
        <div className="hidden md:block absolute top-8 right-0 w-full h-[1px] translate-x-1/2 bg-gradient-to-r from-primary/30 to-transparent z-0" />
      )}
      <div className="surface-raised p-7 surface-hover relative z-10 h-full border border-border/50 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="text-5xl font-display font-black leading-none text-primary/20 absolute top-4 right-4 select-none pointer-events-none">
          {item.step}
        </span>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
          style={{
            background: `linear-gradient(135deg, hsl(var(--${item.iconColor}) / 0.12), hsl(var(--${item.iconColor}) / 0.04))`,
            border: `1px solid hsl(var(--${item.iconColor}) / 0.15)`,
          }}
        >
          <item.icon className="w-5 h-5" style={{ color: `hsl(var(--${item.iconColor}))` }} />
        </div>
        <h3 className="text-base font-display text-foreground mb-2 tracking-tight">{item.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
        <div className="mt-5 h-px bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 relative overflow-hidden">
          <div className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[btnSweep_0.9s_ease-out_forwards]" />
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Step {item.step}</p>
        <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500" />
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  return (
    <section id="howitworks" className="py-28 px-6 relative z-10">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-20">
          <span className="font-label text-primary tracking-widest">HOW IT WORKS</span>
          <h2 className="text-3xl md:text-5xl font-display text-foreground font-bold tracking-tight mt-4">
            Idea to published in{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">minutes</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto">
            A focused four-step production system designed for speed, quality, and monetization safety.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <StepCard key={item.step} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
