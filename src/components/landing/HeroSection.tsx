import { Link } from "react-router-dom";
import { ArrowRight, Play, Check, Sparkles } from "lucide-react";
import WordCycler from "@/components/shared/WordCycler";
import ComplianceGauge from "@/components/dashboard/ComplianceGauge";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative pt-32 pb-24 px-6 z-10">
      {/* Animated grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(200 80% 62% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(200 80% 62% / 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Horizontal scan line */}
      <div
        className="absolute left-0 right-0 h-[1px] pointer-events-none z-20"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(200 80% 62% / 0.15), transparent)",
          animation: "scanDown 8s linear infinite",
        }}
      />

      <div className="container mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-label mb-10 border border-accent/20 backdrop-blur-sm"
            style={{
              background: "linear-gradient(135deg, hsl(200 80% 62% / 0.08), hsl(270 70% 60% / 0.05))",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="bg-gradient-to-r from-accent to-[hsl(270,70%,60%)] bg-clip-text text-transparent font-bold tracking-widest">
              POWERED BY AI · NOW IN BETA
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl leading-[1.02] font-display font-bold mb-8 tracking-tight"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(30px)",
              transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
            }}
          >
            <span className="bg-gradient-to-b from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Faceless videos
            </span>
            <br />
            <span className="bg-gradient-to-b from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              that actually get{" "}
            </span>
            <WordCycler words={["monetized", "compliant", "views", "results"]} interval={2500} />
          </h1>

          {/* Subheading */}
          <p
            className="text-base md:text-xl max-w-xl mx-auto mb-12 text-muted-foreground leading-relaxed"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            }}
          >
            The only platform that scores your content against YouTube's monetization guidelines{" "}
            <span className="text-accent font-medium">before you post</span>.
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.45s",
            }}
          >
            <Link to="/new-project">
              <button className="btn-primary text-sm px-12 py-4 flex items-center gap-2 relative overflow-hidden group">
                <span className="relative z-10">Start Creating</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                {/* Sweep shine */}
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, hsl(42 78% 75% / 0.3) 45%, transparent 50%)",
                    animation: "btnSweep 1.5s ease infinite",
                  }}
                />
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="btn-ghost flex items-center gap-2 py-4 group">
                <div className="w-8 h-8 rounded-full border border-accent/30 flex items-center justify-center group-hover:border-accent/60 group-hover:bg-accent/10 transition-all">
                  <Play className="w-3 h-3 text-accent ml-0.5" fill="hsl(200, 80%, 62%)" />
                </div>
                Watch Demo
              </button>
            </Link>
          </div>

          {/* Trust signals */}
          <div
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground"
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 1s ease 0.7s",
            }}
          >
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

        {/* Hero card — compliance preview with cinematic frame */}
        <div
          className="max-w-2xl mx-auto relative"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) perspective(1200px) rotateX(0deg)" : "translateY(40px) perspective(1200px) rotateX(4deg)",
            transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
          }}
        >
          {/* Glow behind card */}
          <div
            className="absolute -inset-4 rounded-3xl blur-2xl opacity-40"
            style={{
              background: "radial-gradient(ellipse at center, hsl(200 80% 62% / 0.15), hsl(42 78% 58% / 0.08), transparent 70%)",
            }}
          />

          {/* Viewfinder marks */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-accent/30 rounded-tl-lg" />
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-accent/30 rounded-tr-lg" />
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-accent/30 rounded-bl-lg" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-accent/30 rounded-br-lg" />

          {/* Status bar */}
          <div
            className="relative z-10 flex items-center justify-between px-6 py-2 rounded-t-2xl border border-b-0 border-border/60"
            style={{ background: "linear-gradient(180deg, hsl(225 18% 11%), hsl(225 18% 10%))" }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
              <span className="text-[9px] font-mono text-muted-foreground tracking-widest">LIVE SCAN</span>
            </div>
            <span className="text-[9px] font-mono text-muted-foreground/50">COMPLIANCE ENGINE v2.1</span>
          </div>

          <div className="surface-overlay p-8 rounded-t-none relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <ComplianceGauge score={94} size={150} />
              </div>
              <div className="space-y-3">
                {[
                  { label: "Originality", score: 92, color: "from-accent to-accent/60" },
                  { label: "Monetization", score: 96, color: "from-emerald to-emerald/60" },
                  { label: "Value Score", score: 88, color: "from-primary to-primary/60" },
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
    </section>
  );
};

export default HeroSection;
