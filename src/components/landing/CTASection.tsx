import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-28 px-6 relative z-10">
      <div className="container mx-auto max-w-2xl text-center">
        <div className="relative">
          <div className="absolute -inset-12 rounded-3xl blur-3xl opacity-30 pointer-events-none" style={{
            background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.16), hsl(var(--accent) / 0.08), transparent 72%)",
          }} />

          <div className="surface-overlay p-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
              background: "radial-gradient(circle at 25% 20%, hsl(var(--primary) / 0.18), transparent 46%)",
            }} />

            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-[10px] font-label text-primary">
              <Sparkles className="w-3 h-3" />
              READY TO LAUNCH YOUR CONTENT ENGINE
            </div>

            <h2 className="text-3xl md:text-5xl font-display text-foreground font-bold tracking-tight mb-4 relative z-10">
              Turn ideas into
              <span className="block bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">monetizable output</span>
            </h2>
            <p className="text-muted-foreground mb-10 text-sm max-w-sm mx-auto relative z-10">
              Start with 2 free videos. No credit card required. Join 3,200+ creators.
            </p>
            <Link to="/auth">
              <button className="btn-primary text-sm px-12 py-4 flex items-center gap-2 mx-auto group relative z-10">
                <span>Start Creating Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
