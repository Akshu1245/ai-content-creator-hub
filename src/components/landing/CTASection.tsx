import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-28 px-6 relative z-10">
      <div className="container mx-auto max-w-2xl text-center">
        <div className="relative">
          <div className="absolute -inset-12 rounded-3xl blur-3xl opacity-30 pointer-events-none" style={{
            background: "radial-gradient(ellipse at center, hsl(12 76% 56% / 0.12), hsl(158 32% 45% / 0.06), transparent 70%)",
          }} />

          <div className="surface-overlay p-16 relative">
            <h2 className="text-3xl md:text-5xl font-display text-foreground font-bold tracking-tight mb-4">
              Ready to create?
            </h2>
            <p className="text-muted-foreground mb-10 text-sm max-w-sm mx-auto">
              Start with 2 free videos. No credit card required. Join 3,200+ creators.
            </p>
            <Link to="/auth">
              <button className="btn-primary text-sm px-12 py-4 flex items-center gap-2 mx-auto group">
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
