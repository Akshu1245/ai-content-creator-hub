import { TrendingUp, Sparkles, Shield, ArrowUpRight } from "lucide-react";

const steps = [
  { step: "01", title: "Pick your niche", desc: "Choose a topic and discover high-opportunity angles with AI trend analysis.", icon: TrendingUp },
  { step: "02", title: "AI generates", desc: "Script, voiceover, visuals — assembled automatically in minutes.", icon: Sparkles },
  { step: "03", title: "Review & comply", desc: "Get a monetization score with actionable fixes before publishing.", icon: Shield },
  { step: "04", title: "Publish", desc: "Push optimized videos to YouTube, Shorts, TikTok & Reels.", icon: ArrowUpRight },
];

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
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <div key={item.step} className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 right-0 w-full h-[1px] translate-x-1/2 bg-gradient-to-r from-border to-transparent z-0" />
              )}
              <div className="surface-raised p-7 surface-hover relative z-10 h-full">
                {/* Step number */}
                <span className="text-[64px] font-display font-bold leading-none text-muted/30 absolute -top-2 -right-1 select-none pointer-events-none">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-primary/10 border border-primary/15 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-display text-foreground mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
