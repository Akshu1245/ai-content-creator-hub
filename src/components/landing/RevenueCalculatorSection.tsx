import { useState, useEffect } from "react";
import { TrendingUp, IndianRupee, ChevronRight, Sparkles } from "lucide-react";

const niches = [
  { name: "Finance & Investing", emoji: "💰", rpmMin: 350, rpmMax: 680, label: "Highest RPM niche in India" },
  { name: "Technology", emoji: "📱", rpmMin: 240, rpmMax: 520, label: "Strong CPC from tech brands" },
  { name: "Health & Wellness", emoji: "🏥", rpmMin: 190, rpmMax: 420, label: "Medical advertisers pay well" },
  { name: "Education", emoji: "📚", rpmMin: 170, rpmMax: 360, label: "High watch time boosts RPM" },
  { name: "Self-Help / Motivation", emoji: "🎯", rpmMin: 140, rpmMax: 300, label: "Strong retention = better CPM" },
  { name: "History & Mystery", emoji: "🔮", rpmMin: 110, rpmMax: 250, label: "Huge Indian audience demand" },
  { name: "Cooking & Food", emoji: "🍳", rpmMin: 95, rpmMax: 210, label: "Visual content drives shares" },
  { name: "Gaming", emoji: "🎮", rpmMin: 75, rpmMax: 155, label: "High volume, lower RPM" },
  { name: "Travel & Lifestyle", emoji: "✈️", rpmMin: 88, rpmMax: 195, label: "Seasonal variations apply" },
];

const viewOptions = [10000, 25000, 50000, 100000, 250000, 500000];

function formatViews(v: number) {
  if (v >= 100000) return `${v / 100000}L`;
  if (v >= 1000) return `${v / 1000}K`;
  return String(v);
}

function formatRupees(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${Math.round(n / 1000)}K`;
  return `₹${n}`;
}

const RevenueCalculatorSection = () => {
  const [selectedNiche, setSelectedNiche] = useState(0);
  const [selectedViews, setSelectedViews] = useState(2);
  const [displayed, setDisplayed] = useState({ min: 0, max: 0 });

  const niche = niches[selectedNiche];
  const views = viewOptions[selectedViews];
  const minRevenue = Math.round((views / 1000) * niche.rpmMin);
  const maxRevenue = Math.round((views / 1000) * niche.rpmMax);

  useEffect(() => {
    let frame: number;
    const duration = 600;
    const start = performance.now();
    const startMin = displayed.min;
    const startMax = displayed.max;
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayed({
        min: Math.round(startMin + (minRevenue - startMin) * ease),
        max: Math.round(startMax + (maxRevenue - startMax) * ease),
      });
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [selectedNiche, selectedViews]);

  const invideoCost = 2817;
  const voraxCost = 999;
  const savings = invideoCost - voraxCost;

  return (
    <section className="py-28 px-6 relative z-10">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 w-[600px] h-[300px] -translate-x-1/2 -translate-y-1/2 blur-[120px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.06), transparent 70%)" }}
        />
      </div>

      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <span className="font-label text-accent tracking-widest">PAYCHECK PREVIEW</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight mt-4 mb-4">
            What is your niche actually worth?
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Pick your niche. Set your target views. See your realistic Indian AdSense estimate — before publishing a single video.
            <span className="text-primary font-medium"> No competitor shows you this.</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: niche selector */}
          <div className="lg:col-span-2">
            <p className="text-[10px] font-label text-muted-foreground tracking-widest mb-3">SELECT YOUR NICHE</p>
            <div className="space-y-1.5">
              {niches.map((n, i) => (
                <button
                  key={n.name}
                  onClick={() => setSelectedNiche(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                    selectedNiche === i
                      ? "bg-primary/10 border-primary/40 shadow-[0_0_12px_hsl(var(--primary)/0.12)]"
                      : "bg-card/40 border-border/40 hover:border-border hover:bg-card/70"
                  }`}
                >
                  <span className="text-lg shrink-0">{n.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{n.name}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{n.label}</p>
                  </div>
                  {selectedNiche === i && (
                    <ChevronRight className="w-3 h-3 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: calculator display */}
          <div className="lg:col-span-3 space-y-4">
            {/* View count slider */}
            <div className="surface-raised p-5 border border-border/40">
              <p className="text-[10px] font-label text-muted-foreground tracking-widest mb-4">MONTHLY VIEWS TARGET</p>
              <div className="flex gap-2 flex-wrap">
                {viewOptions.map((v, i) => (
                  <button
                    key={v}
                    onClick={() => setSelectedViews(i)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                      selectedViews === i
                        ? "bg-primary/15 border-primary/50 text-primary"
                        : "bg-card/60 border-border/40 text-muted-foreground hover:border-border"
                    }`}
                  >
                    {formatViews(v)}
                  </button>
                ))}
              </div>
            </div>

            {/* Revenue display */}
            <div
              className="surface-raised p-7 border border-primary/25 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--primary) / 0.04) 100%)" }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <IndianRupee className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-label text-muted-foreground tracking-widest">ESTIMATED MONTHLY ADSENSE</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{niches[selectedNiche].name} · {formatViews(views)} views/mo</p>
                </div>
              </div>

              <div className="mt-5">
                <div
                  className="text-5xl md:text-6xl font-display font-bold tracking-tight"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {formatRupees(displayed.min)} – {formatRupees(displayed.max)}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">per month · based on Indian RPM data Q1 2026</p>
              </div>

              {/* RPM range */}
              <div className="mt-5 pt-4 border-t border-border/30 flex gap-6">
                <div>
                  <p className="text-[9px] font-label text-muted-foreground tracking-widest">RPM RANGE</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">₹{niche.rpmMin} – ₹{niche.rpmMax}</p>
                  <p className="text-[9px] text-muted-foreground">per 1,000 views</p>
                </div>
                <div>
                  <p className="text-[9px] font-label text-muted-foreground tracking-widest">ANNUAL POTENTIAL</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{formatRupees(minRevenue * 12)} – {formatRupees(maxRevenue * 12)}</p>
                  <p className="text-[9px] text-muted-foreground">extrapolated, not guaranteed</p>
                </div>
              </div>
            </div>

            {/* Savings context */}
            <div className="surface-raised p-4 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <p className="text-[10px] font-label text-gold tracking-widest">THE VORAX ADVANTAGE</p>
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                Typical dollar-billed plans cost <span className="line-through text-muted-foreground">₹2,817/mo</span> after GST + forex. VORAX is{" "}
                <span className="text-primary font-semibold">₹999/mo flat.</span> You save{" "}
                <span className="font-bold text-emerald-400">₹{savings.toLocaleString("en-IN")}/mo</span> — that's{" "}
                <span className="font-bold text-foreground">₹{(savings * 12).toLocaleString("en-IN")}/year</span> back in your pocket before your first video earns anything.
              </p>
            </div>

            {/* CTA */}
            <div className="text-center pt-2">
              <a
                href="/auth"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors duration-150"
              >
                <TrendingUp className="w-4 h-4" />
                Start earning — free trial, no card
              </a>
              <p className="text-[10px] text-muted-foreground mt-2">Join 3,200+ Indian creators already using Paycheck Preview</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevenueCalculatorSection;
