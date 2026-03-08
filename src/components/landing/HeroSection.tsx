import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import WordCycler from "@/components/shared/WordCycler";
import ComplianceGauge from "@/components/dashboard/ComplianceGauge";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative pt-36 pb-28 px-6 z-10 overflow-hidden">
      {/* Abstract grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(265 85% 65% / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(265 85% 65% / 0.4) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0)" : "translateX(-40px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-label mb-8 border border-primary/20 bg-primary/5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-primary font-bold tracking-widest">AI-POWERED · NOW IN BETA</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl leading-[1.05] font-display font-bold mb-8">
              <span className="text-foreground">Faceless</span>
              <br />
              <span className="text-foreground">videos that</span>
              <br />
              <span className="text-foreground">actually get </span>
              <WordCycler words={["monetized", "compliant", "views", "results"]} interval={2500} />
            </h1>

            <p className="text-base md:text-lg max-w-md mb-10 text-muted-foreground leading-relaxed">
              The only platform that scores your content against YouTube's monetization guidelines{" "}
              <span className="text-accent font-semibold">before you post</span>.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
              <Link to="/new-project">
                <button className="btn-primary text-sm px-10 py-4 flex items-center gap-2 group">
                  <span>Start Creating</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/dashboard">
                <button className="btn-ghost py-4 px-8 text-sm">View Demo</button>
              </Link>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              {["No credit card", "2 free videos/mo", "Policy safe"].map((text) => (
                <span key={text} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald/15 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-emerald" />
                  </div>
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Right — compliance card */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0) rotate(0deg)" : "translateX(40px) rotate(2deg)",
            transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
          }}>
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-8 rounded-3xl blur-3xl opacity-40" style={{
                background: "radial-gradient(ellipse at center, hsl(265 85% 65% / 0.15), hsl(38 95% 60% / 0.08), transparent 70%)",
              }} />

              {/* Status bar */}
              <div className="relative z-10 flex items-center justify-between px-5 py-2 rounded-t-2xl border border-b-0 border-border/60 bg-card">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                  <span className="text-[9px] font-mono text-muted-foreground tracking-widest">LIVE SCAN</span>
                </div>
                <span className="text-[9px] font-mono text-muted-foreground/40">COMPLIANCE v3.0</span>
              </div>

              <div className="surface-overlay rounded-t-none p-8 relative z-10">
                <div className="grid grid-cols-2 gap-8 items-center">
                  <div className="flex justify-center">
                    <ComplianceGauge score={94} size={140} />
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Originality", score: 92, color: "from-primary to-primary/50" },
                      { label: "Monetization", score: 96, color: "from-emerald to-emerald/50" },
                      { label: "Value Score", score: 88, color: "from-accent to-accent/50" },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-label text-muted-foreground">{s.label.toUpperCase()}</span>
                          <span className="text-xs font-mono font-semibold text-foreground">{s.score}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${s.color} transition-all duration-1000`}
                            style={{ width: mounted ? `${s.score}%` : "0%" }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-label bg-emerald/10 text-emerald border border-emerald/20">
                        <Check className="w-3 h-3" /> SAFE TO MONETIZE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
