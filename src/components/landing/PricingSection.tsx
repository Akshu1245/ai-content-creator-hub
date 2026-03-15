import { Link } from "react-router-dom";
import { Check, Zap } from "lucide-react";
import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const pricingPlans = [
  {
    name: "Starter",
    monthlyPrice: "Free",
    yearlyPrice: "Free",
    yearlyBill: "",
    features: ["2 videos/month", "YouTube only", "Basic compliance score", "2 voice options"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: "₹999",
    yearlyPrice: "₹799",
    yearlyBill: "Billed ₹9,588/yr",
    features: ["20 videos/month", "All 4 platforms", "Full compliance + auto-fix", "Consistency Engine", "All 6 voices", "AI growth insights"],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Agency",
    monthlyPrice: "₹2,999",
    yearlyPrice: "₹2,399",
    yearlyBill: "Billed ₹28,788/yr",
    features: ["Unlimited videos", "Everything in Pro", "Full analytics history", "API access", "Priority queue", "Custom branding"],
    cta: "Contact Us",
    popular: false,
  },
];

const PricingCard = ({
  plan,
  isYearly,
  index,
}: {
  plan: (typeof pricingPlans)[number];
  isYearly: boolean;
  index: number;
}) => {
  const revealRef = useScrollReveal(0.12);
  return (
    <div ref={revealRef} className={`relative group overflow-hidden transition-all duration-500 scroll-reveal ${index < 4 ? `scroll-reveal-delay-${index + 1}` : ""} ${plan.popular ? "md:-translate-y-0 lg:-translate-y-3" : ""}`}>
      {plan.popular && (
        <div
          className="absolute -inset-[1px] rounded-[25px] opacity-60"
          style={{
            background: "linear-gradient(135deg, hsl(199 89% 48% / 0.66), hsl(199 89% 65% / 0.56))",
          }}
        />
      )}

      <div className={`surface-raised p-8 relative h-full ${plan.popular ? "border-transparent" : ""}`}
        style={plan.popular ? { background: "linear-gradient(145deg, hsl(222 35% 13%), hsl(222 35% 8%))" } : undefined}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {plan.popular && (
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-b-xl text-[9px] font-label bg-gradient-to-r from-primary to-accent text-background font-bold tracking-widest">
            <Zap className="w-2.5 h-2.5 inline mr-1" /> MOST POPULAR
          </div>
        )}

        <h3 className="text-lg font-display text-foreground mt-2">{plan.name}</h3>
        <div className="flex items-baseline gap-2 mt-3 mb-2">
          {isYearly && plan.monthlyPrice !== "Free" && (
            <span className="text-xs text-muted-foreground line-through">{plan.monthlyPrice}/mo</span>
          )}
          <span className="text-4xl font-display text-foreground font-bold">{isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
          <span className="text-xs text-muted-foreground">{plan.monthlyPrice === "Free" ? "" : "/mo"}</span>
        </div>
        {isYearly && plan.yearlyBill && <p className="text-[10px] text-primary mb-5">{plan.yearlyBill}</p>}
        {!isYearly && <div className="mb-8" />}

        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-6">
          {plan.popular ? "Best for consistent creators" : "Flexible start"}
        </p>

        <ul className="space-y-3 mb-10">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-xs text-muted-foreground">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: plan.popular ? "hsl(var(--primary) / 0.14)" : "hsl(var(--accent) / 0.12)",
                  border: `1px solid ${plan.popular ? "hsl(var(--primary) / 0.26)" : "hsl(var(--accent) / 0.2)"}`,
                }}
              >
                <Check className="w-2.5 h-2.5 text-cyan-400" />
              </div>
              {f}
            </li>
          ))}
        </ul>

        <Link to="/auth" className="block">
          {plan.popular ? <button className="btn-primary w-full text-xs">{plan.cta}</button> : <button className="btn-ghost w-full text-xs">{plan.cta}</button>}
        </Link>

        <p className="mt-4 text-[10px] text-center text-muted-foreground/70">Cancel anytime</p>
      </div>
    </div>
  );
};

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-28 px-6 relative z-10">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-20">
          <span className="font-label text-primary tracking-widest">PRICING</span>
          <h2 className="text-3xl md:text-5xl font-display text-foreground font-bold tracking-tight mt-4 mb-3">
            Built to scale with your output
          </h2>
          <p className="text-muted-foreground text-sm">Start free. Upgrade only when your content engine is ready.</p>

          <div className="mt-8 inline-flex items-center gap-2 p-1 rounded-full border border-border/60 bg-card/60">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded-full text-xs transition-colors ${!isYearly ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded-full text-xs transition-colors ${isYearly ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Yearly <span className="text-emerald">(save 20%)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} isYearly={isYearly} index={index} />
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground text-center">All plans include: Compliance scoring · Indian voices · Multi-platform export</p>
      </div>
    </section>
  );
};

export default PricingSection;
