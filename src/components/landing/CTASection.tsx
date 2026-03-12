import { Link } from "react-router-dom";
import { ArrowRight, Shield, IndianRupee, TrendingUp } from "lucide-react";

const promises = [
  { icon: Shield, text: "Compliance scored before every upload" },
  { icon: IndianRupee, text: "Flat ₹999/mo — no dollar conversion ever" },
  { icon: TrendingUp, text: "Revenue estimated before you render" },
];

const CTASection = () => {
  return (
    <section className="py-28 px-6 relative z-10">
      <div className="container mx-auto max-w-3xl text-center">
        <div className="relative">
          <div className="absolute -inset-12 rounded-3xl blur-3xl opacity-30 pointer-events-none" style={{
            background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.16), hsl(var(--accent) / 0.08), transparent 72%)",
          }} />

          <div className="surface-overlay p-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "radial-gradient(circle at 25% 20%, hsl(var(--primary) / 0.12), transparent 46%), radial-gradient(circle at 75% 80%, hsl(var(--accent) / 0.08), transparent 46%)",
            }} />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-destructive/20 bg-destructive/5 text-[10px] font-label text-destructive/80">
              Your competitors are publishing without a compliance check.
            </div>

            <h2 className="text-3xl md:text-5xl font-display text-foreground font-bold tracking-tight mb-3 relative z-10">
              Stop publishing blind.
              <span className="block bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent mt-1">Start publishing paid.</span>
            </h2>
            <p className="text-muted-foreground mb-8 text-sm max-w-md mx-auto relative z-10">
              2 free videos. No credit card. Full compliance scoring from video 1. Join 3,200+ Indian creators who already know what their channel will earn before they hit upload.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-8 relative z-10">
              {promises.map((p) => (
                <div key={p.text} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border/50 text-[10px] text-muted-foreground">
                  <p.icon className="w-3 h-3 text-primary shrink-0" />
                  {p.text}
                </div>
              ))}
            </div>

            <Link to="/auth" className="relative z-10 inline-block">
              <button className="btn-primary text-sm px-14 py-4 flex items-center gap-2 mx-auto group hover:shadow-[0_0_30px_rgba(212,180,117,0.35)] transition-shadow duration-300">
                <span>Start Creating Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <p className="mt-4 text-[10px] text-muted-foreground/50 relative z-10">
              ₹999/mo after free tier · Billed in INR · Cancel any time · No forex charges
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
