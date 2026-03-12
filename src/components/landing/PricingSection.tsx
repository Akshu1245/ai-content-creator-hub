import { Link } from "react-router-dom";
import { Check, Zap } from "lucide-react";

const pricingPlans = [
  { name: "Starter", price: "Free", period: "", features: ["2 videos/month", "YouTube only", "Basic compliance score", "2 voice options"], cta: "Start Free", popular: false },
  { name: "Pro", price: "₹999", period: "/mo", features: ["20 videos/month", "All 4 platforms", "Full compliance + auto-fix", "Consistency Engine", "All 6 voices", "AI growth insights"], cta: "Go Pro", popular: true },
  { name: "Agency", price: "₹2,999", period: "/mo", features: ["Unlimited videos", "Everything in Pro", "Full analytics history", "API access", "Priority queue", "Custom branding"], cta: "Contact Us", popular: false },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-28 px-6 relative z-10">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-20">
          <span className="font-label text-primary tracking-widest">PRICING</span>
          <h2 className="text-3xl md:text-5xl font-display text-foreground font-bold tracking-tight mt-4 mb-3">
            Built to scale with your output
          </h2>
          <p className="text-muted-foreground text-sm">Start free. Upgrade only when your content engine is ready.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative group overflow-hidden transition-all duration-500 ${plan.popular ? "md:-translate-y-3" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -inset-[1px] rounded-[25px] opacity-60" style={{
                  background: "linear-gradient(135deg, hsl(var(--primary) / 0.66), hsl(var(--accent) / 0.56))",
                }} />
              )}

              <div className={`surface-raised p-8 relative h-full ${plan.popular ? "border-transparent" : ""}`}
                style={plan.popular ? { background: "linear-gradient(145deg, hsl(218 18% 13%), hsl(216 18% 8%))" } : undefined}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                {plan.popular && (
                  <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-b-xl text-[9px] font-label bg-gradient-to-r from-primary to-accent text-background font-bold tracking-widest">
                    <Zap className="w-2.5 h-2.5 inline mr-1" /> MOST POPULAR
                  </div>
                )}

                <h3 className="text-lg font-display text-foreground mt-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-3 mb-8">
                  <span className="text-4xl font-display text-foreground font-bold">{plan.price}</span>
                  {plan.period && <span className="text-xs text-muted-foreground">{plan.period}</span>}
                </div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-6">
                  {plan.popular ? "Best for consistent creators" : "Flexible start"}
                </p>

                <ul className="space-y-3 mb-10">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: plan.popular ? "hsl(var(--primary) / 0.14)" : "hsl(var(--accent) / 0.12)",
                          border: `1px solid ${plan.popular ? "hsl(var(--primary) / 0.26)" : "hsl(var(--accent) / 0.2)"}`,
                        }}
                      >
                        <Check className={`w-2.5 h-2.5 ${plan.popular ? "text-primary" : "text-accent"}`} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link to="/auth" className="block">
                  {plan.popular ? (
                    <button className="btn-primary w-full text-xs">{plan.cta}</button>
                  ) : (
                    <button className="btn-ghost w-full text-xs">{plan.cta}</button>
                  )}
                </Link>

                <p className="mt-4 text-[10px] text-center text-muted-foreground/70">
                  Cancel anytime
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
