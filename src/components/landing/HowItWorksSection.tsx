import { Search, Cpu, ShieldCheck, Rocket } from "lucide-react";

const steps = [
  {
    step: "01",
    time: "30 sec",
    title: "Find your goldmine topic",
    desc: "Tell VORAX your niche. AI scans real-time search trends and finds high-demand, low-competition angles worth creating — with estimated monthly revenue shown upfront.",
    icon: Search,
    iconColor: "primary",
    detail: "Niche gap analysis + RPM preview before you decide",
  },
  {
    step: "02",
    time: "4–6 min",
    title: "AI builds the whole video",
    desc: "Script, voiceover in your chosen voice, stock footage, captions, and music — assembled automatically. No timeline editing. No recording. Just your topic in, full video out.",
    icon: Cpu,
    iconColor: "gold",
    detail: "Gemini script · Sarvam voice · Pexels footage · Auto-captions",
  },
  {
    step: "03",
    time: "Instant",
    title: "Compliance scored, risk eliminated",
    desc: "Every video gets a Monetization Shield score before you can export. Risky lines are flagged. Auto-fix rewrites them. Your video is either safe or fixed — never published blind.",
    icon: ShieldCheck,
    iconColor: "accent",
    detail: "Unique to VORAX · No competitor does this step",
  },
  {
    step: "04",
    time: "1 click",
    title: "Publish to 4 platforms at once",
    desc: "Push optimized exports to YouTube (long-form + Shorts), TikTok, and Instagram Reels — each auto-sized and captioned for the platform. One creation, four audiences.",
    icon: Rocket,
    iconColor: "mauve",
    detail: "YouTube · Shorts · TikTok · Reels — all from one export",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="howitworks" className="py-28 px-6 relative z-10">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-20">
          <span className="font-label text-primary tracking-widest">HOW IT WORKS</span>
          <h2 className="text-3xl md:text-5xl font-display text-foreground font-bold tracking-tight mt-4">
            Idea to paid in{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">under 10 minutes</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto">
            The only 4-step pipeline in the world where step 3 is a monetization safety check — not an afterthought.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <div key={item.step} className="relative group">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 right-0 w-full h-[1px] translate-x-1/2 bg-gradient-to-r from-primary/30 to-transparent z-0" />
              )}
              <div className="surface-raised p-7 surface-hover relative z-10 h-full border border-border/50 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="text-[64px] font-display font-bold leading-none text-muted/30 absolute -top-2 -right-1 select-none pointer-events-none">
                  {item.step}
                </span>

                {/* Time badge */}
                <div className="inline-flex items-center gap-1 mb-4 px-2 py-0.5 rounded-full text-[9px] font-label border border-primary/20 bg-primary/8 text-primary">
                  ⏱ {item.time}
                </div>

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--${item.iconColor}) / 0.12), hsl(var(--${item.iconColor}) / 0.04))`,
                    border: `1px solid hsl(var(--${item.iconColor}) / 0.15)`,
                  }}
                >
                  <item.icon className="w-5 h-5" style={{ color: `hsl(var(--${item.iconColor}))` }} />
                </div>
                <h3 className="text-base font-display text-foreground mb-2 tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{item.desc}</p>

                <div className="h-px bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 mb-3" />
                <p className="text-[9px] font-label text-muted-foreground/60">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
