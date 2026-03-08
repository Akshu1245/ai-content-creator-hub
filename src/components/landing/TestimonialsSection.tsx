import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Faceless Creator · 240K subs",
    quote: "FacelessForge cut my production time from 8 hours to 20 minutes. The compliance scorer alone saved me from 3 demonetizations.",
    avatar: "AM",
    rating: 5,
  },
  {
    name: "Sarah Kim",
    role: "Finance Niche · 85K subs",
    quote: "I was spending ₹15K/month on freelancers. Now I produce better videos for a fraction. The AI voices sound genuinely natural.",
    avatar: "SK",
    rating: 5,
  },
  {
    name: "Diego Santos",
    role: "Horror Content · 520K subs",
    quote: "The trend analysis feature found me a gap in my niche nobody was covering. That single video hit 2M views in a week.",
    avatar: "DS",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Education Niche · 30K subs",
    quote: "As someone who doesn't want to be on camera, this is a lifesaver. Script to published video in under 10 minutes.",
    avatar: "PS",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-28 px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="font-label text-accent tracking-widest">CREATORS LOVE IT</span>
          <h2 className="text-3xl md:text-5xl font-display text-foreground font-bold tracking-tight mt-4 mb-3">
            Trusted by <span className="bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">3,200+</span> creators
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Real results from faceless content creators across every niche.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="surface-raised p-7 surface-hover relative group"
              style={{ animation: `fade-in 0.5s ease-out ${i * 0.1}s both` }}
            >
              {/* Quote mark */}
              <div className="absolute top-5 right-6 text-[48px] font-display text-muted/20 leading-none select-none pointer-events-none">
                "
              </div>

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
              </div>

              <p className="text-sm text-foreground/80 leading-relaxed mb-6 relative z-10">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-border flex items-center justify-center">
                  <span className="text-xs font-display font-bold text-foreground">{t.avatar}</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
