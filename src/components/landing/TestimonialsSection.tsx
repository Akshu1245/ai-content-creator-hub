import { Star, TrendingUp } from "lucide-react";

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Finance Niche · 310K subs",
    location: "Mumbai",
    quote: "I was paying over ₹2,400/month on another platform and got demonetized twice in 4 months. Switched to VORAX. The Monetization Shield caught an issue on my 3rd video that would have been strike three. Zero demonetizations since. And I'm paying ₹1,400 less per month.",
    avatar: "AM",
    rating: 5,
    tag: "Saved from demonetization",
    highlight: true,
  },
  {
    name: "Kavya Nair",
    role: "Education · Tamil · 68K subs",
    location: "Chennai",
    quote: "I tried other tools for Tamil — they sounded robotic. VORAX's Sarvam AI voice is the first tool where Tamil viewers ask me 'who is your narrator?' My subscriber growth went from 800/month to 3,200/month after switching.",
    avatar: "KN",
    rating: 5,
    tag: "4× subscriber growth",
  },
  {
    name: "Rohit Patel",
    role: "Tech Reviews · 520K subs",
    location: "Ahmedabad",
    quote: "The Paycheck Preview changed everything. I used to publish whatever felt interesting. Now I only publish topics showing ₹8K+ monthly estimates. My AdSense went from ₹31,000/month to ₹58,000/month in 3 months — just by being selective.",
    avatar: "RP",
    rating: 5,
    tag: "+₹27K/mo AdSense",
  },
  {
    name: "Sneha Iyer",
    role: "Lifestyle · 44K subs",
    location: "Bengaluru",
    quote: "My previous platform was '$29' — sounded cheap until my bank showed ₹3,100. After GST and forex, it was painful. VORAX is ₹999 flat and does more. Style Memory keeps all my videos consistent, and retention went from 38% to 61%.",
    avatar: "SI",
    rating: 5,
    tag: "61% retention rate",
  },
  {
    name: "Vikram Reddy",
    role: "Mystery & History · 180K subs",
    location: "Hyderabad",
    quote: "The Monetization Countdown showed me I needed 680 more watch hours. I used the Niche Goldmine Finder to pick 3 high-retention topics. Hit YPP eligibility in 6 weeks. First YouTube payment: ₹12,400. VORAX paid for itself 12× in month one.",
    avatar: "VR",
    rating: 5,
    tag: "YPP hit in 6 weeks",
  },
  {
    name: "Priya Sharma",
    role: "Health & Wellness · 92K subs",
    location: "Delhi",
    quote: "I needed a faceless channel tool, not avatar features. VORAX understands faceless stock-footage YouTube completely. Script to compliant video in 8 minutes. I went from 1 video/week to 4 videos/week.",
    avatar: "PS",
    rating: 5,
    tag: "4× content output",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-28 px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="font-label text-accent tracking-widest">REAL RESULTS</span>
          <h2 className="text-3xl md:text-5xl font-display text-foreground font-bold tracking-tight mt-4 mb-3">
            From creators who switched
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Specific numbers. Specific tools they left. Specific reasons VORAX won.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`surface-raised p-6 surface-hover relative group overflow-hidden border flex flex-col ${t.highlight ? "border-primary/35" : "border-border/40"}`}
              style={{ animation: `fadeIn 0.5s ease-out ${i * 0.08}s both` }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-5 right-5 text-[42px] font-display text-muted/10 leading-none select-none pointer-events-none">"</div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-gold text-gold" />
                  ))}
                </div>
                {t.tag && (
                  <span className="px-2 py-0.5 rounded-full text-[8px] font-label bg-primary/8 text-primary border border-primary/20 whitespace-nowrap">
                    ✓ {t.tag}
                  </span>
                )}
              </div>

              <p className="text-sm text-foreground/85 leading-relaxed mb-5 relative z-10 flex-1">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-border flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-display font-bold text-foreground">{t.avatar}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{t.name}</p>
                  <p className="text-[9px] text-muted-foreground">{t.role}</p>
                  <p className="text-[9px] text-muted-foreground/50 flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-2.5 h-2.5" /> {t.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 rounded-2xl bg-card/60 border border-border/40 text-center">
          <p className="text-xs text-muted-foreground">
            Of VORAX's 3,200+ creators — <strong className="text-foreground">68% switched from another paid platform.</strong>{" "}
            The #1 reason: <strong className="text-primary">demonetization protection + INR billing.</strong>
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
