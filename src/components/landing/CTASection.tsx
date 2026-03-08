import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-28 px-6 relative z-10">
      <div className="container mx-auto max-w-2xl text-center">
        <div className="relative">
          {/* Background glow */}
          <div
            className="absolute -inset-8 rounded-3xl blur-3xl opacity-30"
            style={{
              background: "radial-gradient(ellipse at center, hsl(42 78% 58% / 0.15), hsl(200 80% 62% / 0.08), transparent 70%)",
            }}
          />

          <div className="surface-overlay p-14 relative">
            {/* Corner viewfinder marks */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-accent/20" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-accent/20" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-accent/20" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-accent/20" />

            <h2 className="text-3xl md:text-4xl font-display text-foreground font-bold tracking-tight mb-4">
              Ready to create?
            </h2>
            <p className="text-muted-foreground mb-10 text-sm">
              Start with 2 free videos. No credit card required.
            </p>
            <Link to="/new-project">
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
