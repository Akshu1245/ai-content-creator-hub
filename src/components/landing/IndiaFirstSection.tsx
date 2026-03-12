import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, Check } from "lucide-react";

const languages = [
  { script: "हिन्दी", name: "Hindi", voices: "Shubh · Priya", flag: "🇮🇳" },
  { script: "தமிழ்", name: "Tamil", voices: "Ratan · Simran", flag: "🇮🇳" },
  { script: "తెలుగు", name: "Telugu", voices: "Amit · Shreya", flag: "🇮🇳" },
  { script: "ಕನ್ನಡ", name: "Kannada", voices: "Amelia · Tanya", flag: "🇮🇳" },
  { script: "বাংলা", name: "Bengali", voices: "Neha · Marcus", flag: "🇮🇳" },
  { script: "मराठी", name: "Marathi", voices: "Luna · Nova", flag: "🇮🇳" },
];

const hiddenTaxBreakdown = [
  { label: "Advertised price (typical dollar plan)", amount: "$28/mo", rupees: "≈₹2,324" },
  { label: "+ 18% GST on foreign services", amount: "+$5.04", rupees: "+₹419" },
  { label: "+ Bank forex markup (avg 3.2%)", amount: "+$0.90", rupees: "+₹74" },
  { label: "What you actually pay", amount: "$33.94", rupees: "≈₹2,817", highlight: true },
];

const IndiaFirstSection = () => {
  return (
    <section className="py-24 px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">

        <div className="text-center mb-14">
          <span className="font-label text-accent tracking-widest">BUILT FOR BHARAT</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mt-4 mb-4">
            Dollar pricing is a{" "}
            <span className="text-destructive/80">hidden tax</span>{" "}
            on Indian creators
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Every dollar-priced platform hits Indian creators with GST + forex markup. That "$28/month" plan? Often over ₹2,800 by the time your bank processes it.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Left: Hidden tax calculator */}
          <div>
            <div className="surface-raised border border-border/45 p-7 mb-5">
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle className="w-4 h-4 text-destructive/70" />
                <span className="text-xs font-label text-muted-foreground tracking-widest">THE REAL COST OF DOLLAR TOOLS</span>
              </div>
              <div className="space-y-3">
                {hiddenTaxBreakdown.map((row) => (
                  <div key={row.label} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${row.highlight ? "bg-destructive/6 border border-destructive/15" : "border border-border/30"}`}>
                    <p className={`text-xs ${row.highlight ? "text-foreground font-medium" : "text-muted-foreground"}`}>{row.label}</p>
                    <div className="text-right">
                      <p className={`text-xs font-mono ${row.highlight ? "text-destructive/80 font-bold" : "text-muted-foreground/60"}`}>{row.amount}</p>
                      <p className={`text-[10px] font-label ${row.highlight ? "text-destructive/70" : "text-muted-foreground/50"}`}>{row.rupees}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">VORAX Pro — same or more features</p>
                <div className="text-right">
                  <p className="text-lg font-display font-bold text-primary">₹999/mo</p>
                  <p className="text-[9px] font-label text-accent">FLAT INR · NO SURPRISES</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                "Billed in INR — your bank never sees a dollar",
                "18% GST included in ₹999 — no add-ons",
                "No forex conversion markup. Ever.",
                "Cancel any time. No annual lock-in required.",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-500" />
                  </div>
                  {item}
                </div>
              ))}
            </div>

            <Link to="/why-vorax" className="inline-flex items-center gap-2 mt-6 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
              See full comparison <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: Indian language voices */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl blur-[80px] opacity-15 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.5), transparent 70%)" }}
            />
            <div className="relative surface-overlay p-8">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-label text-muted-foreground tracking-widest">SARVAM AI — NATIVE INDIAN TTS</p>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-[9px] font-label text-primary">INDIA'S #1 MODEL</span>
              </div>
              <p className="text-[10px] text-muted-foreground/60 mb-6">Purpose-built on Indian speech patterns, tones, and regional inflections — not a translation layer.</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {languages.map((lang) => (
                  <div key={lang.name} className="surface-raised border border-border/45 p-4 rounded-2xl hover:border-primary/40 transition-all duration-300 group cursor-pointer">
                    <div className="text-2xl font-display text-foreground mb-1 group-hover:text-primary transition-colors">{lang.script}</div>
                    <div className="text-xs font-medium text-foreground/80">{lang.flag} {lang.name}</div>
                    <div className="text-[9px] font-label text-muted-foreground/50 mt-0.5">{lang.voices}</div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-border/30">
                <p className="text-[10px] text-muted-foreground/60 text-center">
                  <span className="text-destructive/70 font-label">Most AI video platforms offer no native Indian TTS.</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default IndiaFirstSection;
