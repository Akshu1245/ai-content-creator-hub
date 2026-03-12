import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles, TrendingUp, Shield, Zap } from "lucide-react";

const tips = [
  { icon: TrendingUp, title: "Pick a trending niche", desc: "AI analyzes real-time data to find high-opportunity topics.", color: "primary" },
  { icon: Sparkles, title: "Generate in minutes", desc: "Script, voice, visuals — all assembled automatically.", color: "gold" },
  { icon: Shield, title: "Check compliance", desc: "Score your content against monetization policies before posting.", color: "accent" },
  { icon: Zap, title: "Publish everywhere", desc: "Export optimized for YouTube, Shorts, TikTok & Reels.", color: "mauve" },
];

const OnboardingTips = () => {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem("ff-onboarding-seen");
    if (!seen) setDismissed(false);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem("ff-onboarding-seen", "1");
  };

  if (dismissed) return null;

  return (
    <div className="surface-raised p-6 mb-8 relative overflow-hidden">
      <div
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl pointer-events-none"
        style={{ background: "hsl(var(--primary) / 0.08)" }}
      />
      <button onClick={dismiss} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
        <X className="w-4 h-4" />
      </button>

      <h3 className="font-display text-base text-foreground font-bold mb-1">Welcome to VORAX 🔥</h3>
      <p className="text-xs text-muted-foreground mb-5">Here's how to create your first monetized video in 4 steps.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {tips.map((tip, i) => (
          <div key={tip.title} className="p-4 rounded-xl bg-secondary/40 border border-border/50">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{
                background: `hsl(var(--${tip.color}) / 0.1)`,
                border: `1px solid hsl(var(--${tip.color}) / 0.15)`,
              }}
            >
              <tip.icon className={`w-3.5 h-3.5 text-${tip.color}`} />
            </div>
            <span className="text-[10px] font-label text-muted-foreground">STEP {i + 1}</span>
            <h4 className="text-xs font-medium text-foreground mt-0.5">{tip.title}</h4>
            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </div>

      <Link to="/new-project">
        <button className="btn-primary text-xs">Create Your First Video →</button>
      </Link>
    </div>
  );
};

export default OnboardingTips;
