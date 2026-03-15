import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles, ShieldCheck, TrendingUp, ChevronDown } from "lucide-react";
import WordCycler from "@/components/shared/WordCycler";
import ComplianceGauge from "@/components/dashboard/ComplianceGauge";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative pt-40 pb-28 px-6 z-10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary) / 0.12) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.12) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[760px] h-[760px] rounded-full blur-[170px] opacity-45 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.2), transparent 70%)" }}
      />
      <div className="absolute top-[8%] right-[6%] w-[300px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ background: "hsl(199 89% 48% / 0.04)" }} />
      <div className="absolute bottom-[8%] left-[6%] w-[250px] h-[250px] rounded-full blur-[110px] pointer-events-none" style={{ background: "hsl(220 60% 65% / 0.03)" }} />

      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0)" : "translateX(-40px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-label mb-8 border border-primary/35 bg-primary/12" style={{
              animation: mounted ? "glowPulse 3s ease-in-out infinite" : "none",
              animationDelay: "0.5s",
            }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-primary font-bold tracking-widest">CINEMATIC AI STUDIO · LIVE</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl leading-[1.02] font-display font-bold mb-8" style={{
              animation: mounted ? "slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
              animationDelay: "0.3s",
              animationFillMode: "both",
            }}>
              <span className="text-foreground">Build faceless</span>
              <br />
              <span className="text-foreground">video systems</span>
              <br />
              <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">that stay </span>
              <WordCycler words={["monetized", "compliant", "views", "results"]} interval={2500} />
            </h1>

            <p className="text-base md:text-lg max-w-xl mb-10 text-muted-foreground leading-relaxed" style={{
              animation: mounted ? "slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
              animationDelay: "0.5s",
              animationFillMode: "both",
            }}>
              Plan, script, voice, score, and export from one command center.
              <span className="text-foreground font-semibold"> VORAX checks monetization risk before you publish.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-10" style={{
              animation: mounted ? "slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
              animationDelay: "0.6s",
              animationFillMode: "both",
            }}>
              <Link to="/auth">
                <button className="btn-primary text-sm px-10 py-4 flex items-center gap-2 group hover:shadow-[0_0_24px_rgba(212,180,117,0.4)]" style={{
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}>
                  <span>Start Creating</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/auth">
                <button className="btn-ghost py-4 px-8 text-sm">Book Live Demo</button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground" style={{
              animation: mounted ? "slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
              animationDelay: "0.7s",
              animationFillMode: "both",
            }}>
              {["No credit card", "2 free videos/mo", "Policy safe"].map((text, i) => (
                <span key={text} className="flex items-center gap-2" style={{
                  animation: mounted ? "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                  animationDelay: `${0.7 + (i * 0.1)}s`,
                  animationFillMode: "both",
                }}>
                  <div className="w-4 h-4 rounded-full bg-accent/15 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-accent" />
                  </div>
                  {text}
                </span>
              ))}
            </div>

            <TooltipProvider>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
              {[
                { label: "Avg Output Time", value: "6m", icon: Sparkles, tip: "Average from prompt to rendered video" },
                { label: "Policy Match", value: "94%", icon: ShieldCheck, tip: "Alignment with monetization policies" },
                { label: "Growth Lift", value: "2.8x", icon: TrendingUp, tip: "Average reach gain with optimized scripts" },
              ].map((metric, i) => (
                <Tooltip key={metric.label}>
                  <TooltipTrigger asChild>
                    <div className="surface p-4 rounded-2xl hover:surface-hover transition-all duration-300 cursor-pointer" style={{
                      animation: mounted ? "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                      animationDelay: `${0.8 + (i * 0.1)}s`,
                      animationFillMode: "both",
                    }}>
                      <div className="flex items-center gap-2 mb-2 text-primary">
                        <metric.icon className="w-3.5 h-3.5" />
                        <span className="font-label text-[9px]">{metric.label}</span>
                      </div>
                      <p className="font-display text-2xl text-foreground">{metric.value}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">{metric.tip}</TooltipContent>
                </Tooltip>
              ))}
              </div>
            </TooltipProvider>
          </div>

          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0) rotate(0deg)" : "translateX(40px) rotate(2deg)",
            transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
          }}>
            <div className="relative group" style={{ animation: "float 4s ease-in-out infinite" }}>
              <div className="absolute -inset-8 rounded-3xl blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" style={{
                background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.16), hsl(var(--accent) / 0.08), transparent 72%)",
                animation: mounted ? "orbFloat 6s ease-in-out infinite" : "none",
              }} />

              <div className="relative z-10 flex items-center justify-between px-5 py-2 rounded-t-2xl border border-b-0 border-border/60 bg-card hover:border-primary/40 transition-colors duration-300" style={{
                animation: mounted ? "slideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both" : "none",
              }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[9px] font-mono text-muted-foreground tracking-widest">LIVE SCAN</span>
                </div>
                <span className="text-[9px] font-mono text-muted-foreground/40">COMPLIANCE v3.0</span>
              </div>

              <div className="surface-overlay rounded-t-none p-8 relative z-10 group-hover:border-primary/30 transition-colors duration-300" style={{
                animation: mounted ? "slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both" : "none",
              }}>
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                  <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" style={{ animation: "scanLine 3s ease-in-out infinite" }} />
                </div>
                <div className="grid grid-cols-2 gap-8 items-center">
                  <div className="flex justify-center">
                    <ComplianceGauge score={94} size={140} />
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Originality", score: 92, color: "from-primary to-clay" },
                      { label: "Monetization", score: 96, color: "from-accent to-olive" },
                      { label: "Value Score", score: 88, color: "from-gold to-ochre" },
                    ].map((s, i) => (
                      <div key={s.label} style={{
                        animation: mounted ? `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)` : "none",
                        animationDelay: `${0.8 + (i * 0.1)}s`,
                        animationFillMode: "both",
                      }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-label text-muted-foreground">{s.label.toUpperCase()}</span>
                          <span className="text-xs font-mono font-semibold text-foreground">{s.score}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden hover:shadow-[0_0_12px_rgba(212,180,117,0.22)] transition-shadow duration-300">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${s.color} transition-all duration-1000`}
                            style={{ 
                              width: mounted ? `${s.score}%` : "0%",
                              animation: mounted ? `gradientFlow 3s ease-in-out infinite` : "none",
                              backgroundSize: "200% 100%",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="pt-2" style={{
                      animation: mounted ? "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                      animationDelay: "1.1s",
                      animationFillMode: "both",
                    }}>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-label bg-accent/10 text-accent border border-accent/20 hover:border-accent/50 hover:bg-accent/15 transition-all duration-300" style={{
                        animation: "glowPulse 3s ease-in-out infinite",
                      }}>
                        <Check className="w-3 h-3" /> SAFE TO MONETIZE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 mt-14 opacity-0 animate-fade-in" style={{ animationDelay: "2s", animationFillMode: "forwards" }}>
          <span className="text-xs text-muted-foreground tracking-widest">SCROLL TO EXPLORE</span>
          <ChevronDown className="w-4 h-4 text-primary animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
