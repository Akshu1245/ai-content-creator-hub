import { Star } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Faceless Creator · 240K subs",
    quote: "VORAX cut my production time from 8 hours to 20 minutes. The compliance scorer alone saved me from 3 demonetizations.",
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

const TestimonialCard = ({ t, i, mobile = false }: { t: (typeof testimonials)[number]; i: number; mobile?: boolean }) => {
  const revealRef = useScrollReveal(0.1);
  return (
    <div
      ref={revealRef}
      className={`surface-raised p-7 surface-hover relative group overflow-hidden border scroll-reveal ${i < 4 ? `scroll-reveal-delay-${i + 1}` : ""} ${i === 0 ? "border-primary/35" : "border-border/40"} ${mobile ? "w-[88vw] max-w-[360px] shrink-0 snap-center" : ""}`}
      style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute top-4 right-4 text-[80px] font-display text-[hsl(199_89%_48%_/_0.15)] leading-none select-none pointer-events-none">"</div>

      {i === 0 && (
        <div className="absolute left-6 top-5 px-2.5 py-1 rounded-full text-[9px] font-label bg-primary/12 text-primary border border-primary/25">TOP CREATOR</div>
      )}

      <div className={`flex items-center gap-1 ${i === 0 ? "mb-6 mt-6" : "mb-4"}`}>
        {Array.from({ length: t.rating }).map((_, j) => (
          <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed mb-6 relative z-10">"{t.quote}"</p>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-border flex items-center justify-center">
          <span className="text-xs font-display font-bold text-foreground">{t.avatar}</span>
        </div>
        <div>
          <p className="text-xs font-medium text-foreground">{t.name}</p>
          <p className="text-[10px] text-muted-foreground">{t.role}</p>
        </div>
      </div>

      <div className="mt-4 inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-[9px] text-emerald-500">Verified Creator</span>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const dots = useMemo(() => testimonials.map((_, i) => i), []);

  const handleMobileScroll = () => {
    if (!mobileTrackRef.current) return;
    const { scrollLeft, clientWidth } = mobileTrackRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    setActiveMobileIndex(Math.max(0, Math.min(index, testimonials.length - 1)));
  };

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

        <div className="hidden md:grid md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} i={i} />
          ))}
        </div>

        <div
          ref={mobileTrackRef}
          onScroll={handleMobileScroll}
          className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={`${t.name}-mobile`} t={t} i={i} mobile />
          ))}
        </div>

        <div className="md:hidden mt-4 flex items-center justify-center gap-2">
          {dots.map((i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${activeMobileIndex === i ? "w-5 bg-primary" : "w-1.5 bg-border"}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
