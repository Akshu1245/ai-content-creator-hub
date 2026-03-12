import { Link } from "react-router-dom";
import { Shield, TrendingUp, Globe, Check, X, ArrowRight, DollarSign, Lock, IndianRupee, Zap } from "lucide-react";
import usePageTitle from "@/hooks/usePageTitle";

const features = [
  { name: "Pre-publish monetization compliance score", vorax: true, others: false },
  { name: "Revenue estimate before upload", vorax: true, others: false },
  { name: "YPP (YouTube Partner) progress tracker", vorax: true, others: false },
  { name: "Auto-fix risky script sections", vorax: true, others: false },
  { name: "Indian language voices (native TTS)", vorax: true, others: "partial" },
  { name: "INR billing (no dollar markup)", vorax: true, others: false },
  { name: "Channel style memory (cross-video)", vorax: true, others: false },
  { name: "Niche RPM / revenue data pre-creation", vorax: true, others: false },
  { name: "Flat monthly plan (no per-minute metering)", vorax: true, others: false },
  { name: "AI script generation", vorax: true, others: true },
  { name: "Stock footage library", vorax: true, others: true },
  { name: "Auto-captions / subtitles", vorax: true, others: true },
  { name: "Multi-platform export", vorax: true, others: true },
  { name: "9+ AI voices", vorax: true, others: true },
];

const guarantees = [
  {
    icon: Shield,
    number: "01",
    title: "We score before you publish. Always.",
    body: "Every video gets a full Monetization Shield analysis before the export button activates. You literally cannot bypass it.",
    proof: "2,100+ channels protected",
    proofColor: "accent",
  },
  {
    icon: IndianRupee,
    number: "02",
    title: "₹999/mo. No dollar conversion. Ever.",
    body: "Priced in Indian Rupees, billed locally, GST included. What you see is what you pay — no forex surprise at checkout.",
    proof: "₹999 flat — no surprises",
    proofColor: "gold",
  },
  {
    icon: Lock,
    number: "03",
    title: "Your content data never leaves India.",
    body: "Your niche, scripts, and channel strategy stay yours. We don't sell, share, or train third-party models on your content.",
    proof: "Data sovereignty for Indian creators",
    proofColor: "primary",
  },
];

const painPoints = [
  {
    icon: Shield,
    title: "The only platform that prevents demonetization",
    body: "Other tools generate beautiful videos and wish you luck with YouTube. VORAX runs a compliance scan on every script and auto-rewrites risky sections before export. It's a gatekeeper, not an add-on.",
  },
  {
    icon: DollarSign,
    title: "Dollar pricing is a hidden monthly tax",
    body: "A \"$28/month\" dollar-billed plan becomes ₹2,817 for Indian creators after GST + forex. That's ₹1,818 more than VORAX Pro — every month — for a tool that still won't protect your channel.",
  },
  {
    icon: Globe,
    title: "Built for Indian YouTube culture",
    body: "Indian faceless channels cover finance, mythology, motivational, and spiritual niches in regional languages. VORAX's Sarvam AI voices capture native intonation in Hindi, Tamil, Telugu, Kannada, Bengali, and Marathi.",
  },
  {
    icon: TrendingUp,
    title: "Know the earnings before you pick the topic",
    body: "Paycheck Preview shows projected monthly revenue for any niche before you create a video. Pick topics by expected income — not gut feel.",
  },
];

const pricingComparison = [
  { name: "VORAX Pro", inr: "₹999", note: "Direct INR billing · All features included", highlight: true },
  { name: "Typical plan A", inr: "≈₹2,817", note: "$28 + 18% GST + 3.2% forex (billed in USD)" },
  { name: "Typical plan B", inr: "≈₹2,714", note: "$29 + 18% GST + 3.2% forex (billed in USD)" },
  { name: "Typical plan C", inr: "≈₹2,620", note: "$28 + 18% GST + 2.5% forex (billed in USD)" },
  { name: "Typical plan D", inr: "≈₹2,340", note: "$24 + 18% GST + 2.5% forex (billed in USD)" },
  { name: "Typical plan E", inr: "≈₹1,780", note: "$18 (annual-only) + GST" },
];

const renderCell = (val: boolean | string) => {
  if (val === true) return <Check className="w-4 h-4 text-emerald-400 mx-auto" />;
  if (val === false) return <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />;
  return <span className="text-[9px] text-accent font-label mx-auto block text-center">PARTIAL</span>;
};

const WhyVORAX = () => {
  usePageTitle("Why VORAX");

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-noise" />

      <div className="px-6 pt-8">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[130px] pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.08), transparent 70%)" }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="font-label text-primary tracking-widest">WHY VORAX WINS</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 mt-4 leading-tight">
            Every other tool leaves your
            <span className="block bg-gradient-to-r from-destructive/70 via-primary to-gold bg-clip-text text-transparent mt-1">channel exposed.</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto mb-10">
            Most AI video platforms generate your video and leave. VORAX scores it against YouTube's monetization policy before you can upload — and shows your estimated revenue before you create.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["Compliance scoring", "INR billing", "Indian voices", "YPP tracker", "Revenue estimator", "Auto-fix rewriter"].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full text-[10px] font-label border border-primary/25 bg-primary/8 text-primary">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Guarantees */}
      <section className="py-16 px-6 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-label text-primary tracking-widest">THE VORAX GUARANTEE</span>
            <h2 className="text-2xl md:text-4xl font-display font-bold tracking-tight mt-3">3 promises no platform can match</h2>
            <p className="text-sm text-muted-foreground mt-2">Not features. Structural commitments baked into how VORAX works.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {guarantees.map((g) => (
              <div key={g.number} className="surface-raised border border-border/45 p-7 relative overflow-hidden group hover:border-primary/30 transition-colors duration-300">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute -top-4 -right-2 text-[80px] font-display font-bold text-muted/10 leading-none select-none pointer-events-none">{g.number}</div>
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <g.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-display font-bold mb-3 group-hover:text-primary transition-colors leading-snug">{g.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-5">{g.body}</p>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `hsl(var(--${g.proofColor}) / 0.15)`, border: `1px solid hsl(var(--${g.proofColor}) / 0.3)` }}>
                    <Check className="w-2.5 h-2.5" style={{ color: `hsl(var(--${g.proofColor}))` }} />
                  </div>
                  <span className="text-[10px] font-label" style={{ color: `hsl(var(--${g.proofColor}))` }}>{g.proof}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-label text-accent tracking-widest">WHAT OTHERS MISS</span>
            <h2 className="text-2xl md:text-4xl font-display font-bold tracking-tight mt-3">Why the standard approach fails creators</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {painPoints.map((p) => (
              <div key={p.title} className="surface-raised border border-border/45 p-7 group hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-11 h-11 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <p.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-display font-bold mb-3 group-hover:text-primary transition-colors">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="py-16 px-6 bg-card/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-label text-accent tracking-widest">FEATURE COMPARISON</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mt-3">VORAX vs. the market</h2>
          </div>

          <div className="surface-raised border border-border/45 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left p-4 text-xs font-label text-muted-foreground">FEATURE</th>
                  <th className="p-4 text-center">
                    <span className="text-xs font-bold text-primary">VORAX</span>
                  </th>
                  <th className="p-4 text-center">
                    <span className="text-[10px] font-label text-muted-foreground">OTHERS</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <tr key={f.name} className={`border-b border-border/20 last:border-0 ${i % 2 === 0 ? "" : "bg-card/30"}`}>
                    <td className="p-4 text-xs text-foreground/80">{f.name}</td>
                    <td className="p-4 text-center">{renderCell(f.vorax)}</td>
                    <td className="p-4 text-center">{renderCell(f.others)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-muted-foreground/50 text-center mt-3">
            "Others" = typical AI video platforms available in the market. Verified March 2026.
          </p>
        </div>
      </section>

      {/* INR Pricing comparison */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-label text-accent tracking-widest">TRUE COST IN INDIA</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mt-3">What you actually pay per month</h2>
            <p className="text-sm text-muted-foreground mt-2">After 18% GST on foreign services + average bank forex markup</p>
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            {pricingComparison.map((p) => (
              <div
                key={p.name}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  p.highlight
                    ? "bg-primary/6 border-primary/30 shadow-[0_0_16px_hsl(var(--primary)/0.08)]"
                    : "surface-raised border-border/40"
                }`}
              >
                <div>
                  <p className={`text-xs font-semibold ${p.highlight ? "text-foreground" : "text-muted-foreground"}`}>{p.name}</p>
                  <p className="text-[9px] text-muted-foreground/60 mt-0.5">{p.note}</p>
                </div>
                <div className={`text-lg font-display font-bold ${p.highlight ? "text-primary" : "text-muted-foreground"}`}>
                  {p.inr}<span className="text-[10px] font-label">/mo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-label text-primary tracking-widest">START TODAY</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-display font-bold tracking-tight mb-4">
            Ready to publish protected?
          </h2>
          <p className="text-muted-foreground mb-8 text-sm">2 free videos. No credit card. Compliance scoring from video 1.</p>
          <Link to="/auth">
            <button className="btn-primary px-12 py-4 text-sm flex items-center gap-2 mx-auto group">
              Start Creating Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <p className="text-[10px] text-muted-foreground/40 mt-4">₹999/mo after free tier · Billed in INR · Cancel any time</p>
        </div>
      </section>
    </div>
  );
};

export default WhyVORAX;
