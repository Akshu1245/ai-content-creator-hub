import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles, ShieldCheck, TrendingUp, IndianRupee } from "lucide-react";
import ComplianceGauge from "@/components/dashboard/ComplianceGauge";
import { useEffect, useState } from "react";

const cyclingLines = [
  "before you hit publish.",
  "before YouTube decides.",
  "while rivals publish blind.",
  "before you regret it.",
];

const toastEvents = [
  { avatar: "AM", name: "Arjun M.", text: "Demonetization prevented — score 94", city: "Mumbai", color: "text-emerald-400" },
  { avatar: "KN", name: "Kavya N.", text: "Tamil video published — 0 issues", city: "Chennai", color: "text-primary" },
  { avatar: "RP", name: "Rohit P.", text: "Paycheck Preview: ₹7,400/mo projected", city: "Ahmedabad", color: "text-gold" },
  { avatar: "VR", name: "Vikram R.", text: "YPP milestone hit — 4,000 watch hours", city: "Hyderabad", color: "text-accent" },
  { avatar: "SI", name: "Sneha I.", text: "4-Platform Blitz completed in 6 min", city: "Bengaluru", color: "text-emerald-400" },
];

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [toastIndex, setToastIndex] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const lineInterval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setLineIndex((i) => (i + 1) % cyclingLines.length);
        setFade(true);
      }, 350);
    }, 3000);

    const showToast = () => {
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
        setTimeout(() => {
          setToastIndex((i) => (i + 1) % toastEvents.length);
        }, 800);
      }, 3500);
    };

    const toastTimeout = setTimeout(() => {
      showToast();
      const toastInterval = setInterval(showToast, 5500);
      return () => clearInterval(toastInterval);
    }, 2200);

    return () => {
      clearInterval(lineInterval);
      clearTimeout(toastTimeout);
    };
  }, []);

  return (
    <section className="relative pt-40 pb-28 px-6 z-10 overflow-hidden">
      {/* Floating live toast */}
      {mounted && (
        <div
          className="fixed bottom-8 left-6 z-50 max-w-[280px] pointer-events-none"
          style={{
            animation: toastVisible
              ? "toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both"
              : "toastSlideOut 0.35s ease-in both",
            opacity: toastVisible ? 1 : 0,
          }}
        >
          <div className="bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl p-3.5 shadow-2xl">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 border border-border flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[9px] font-bold text-foreground">{toastEvents[toastIndex].avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="live-dot" />
                  <span className="text-[9px] font-label text-emerald-400 tracking-widest">JUST NOW</span>
                </div>
                <p className="text-[11px] font-semibold text-foreground truncate">{toastEvents[toastIndex].name}</p>
                <p className={`text-[10px] leading-relaxed mt-0.5 ${toastEvents[toastIndex].color}`}>
                  {toastEvents[toastIndex].text}
                </p>
                <p className="text-[9px] text-muted-foreground/50 mt-0.5">{toastEvents[toastIndex].city}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary) / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.15) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[760px] h-[760px] rounded-full blur-[170px] opacity-45 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.2), transparent 70%)" }}
      />

      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0)" : "translateX(-40px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}>
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-label mb-8 border border-primary/35 bg-primary/12" style={{
              animation: mounted ? "glowPulse 3s ease-in-out 0.5s infinite" : "none",
            }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-primary font-bold tracking-widest">2,100+ DEMONETIZATIONS PREVENTED · INDIA'S COMPLIANCE ENGINE</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl leading-[1.05] font-display font-bold mb-8" style={{
              animation: mounted ? "slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both" : "none",
            }}>
              <span className="text-foreground">Know your</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-gold to-accent bg-clip-text text-transparent" style={{
                backgroundSize: "200% 100%",
                animation: mounted ? "gradientShift 4s ease-in-out infinite" : "none",
              }}>paycheck</span>
              <br />
              <span
                className="text-foreground text-4xl md:text-5xl lg:text-6xl"
                style={{
                  opacity: fade ? 1 : 0,
                  transition: "opacity 0.35s ease-in-out",
                }}
              >
                {cyclingLines[lineIndex]}
              </span>
            </h1>

            <p className="text-base md:text-lg max-w-xl mb-10 text-muted-foreground leading-relaxed" style={{
              animation: mounted ? "slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both" : "none",
            }}>
              The only AI video studio that scores every video against YouTube's monetization policy{" "}
              <span className="text-foreground font-semibold">before you can upload.</span>{" "}
              Most platforms skip this step entirely.{" "}
              <span className="text-primary font-semibold">We never do.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-10" style={{
              animation: mounted ? "slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both" : "none",
            }}>
              <Link to="/auth">
                <button className="btn-primary text-sm px-10 py-4 flex items-center gap-2 group hover:shadow-[0_0_24px_rgba(212,180,117,0.4)]" style={{
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}>
                  <span>Start Creating Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/why-vorax">
                <button className="btn-ghost py-4 px-8 text-sm">Why VORAX wins →</button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground" style={{
              animation: mounted ? "slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both" : "none",
            }}>
              {[
                { text: "No credit card", icon: Check },
                { text: "2 free videos/mo", icon: Sparkles },
                { text: "₹999/mo flat · INR billing", icon: IndianRupee },
              ].map(({ text, icon: Icon }, i) => (
                <span key={text} className="flex items-center gap-2" style={{
                  animation: mounted ? `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.7 + (i * 0.1)}s both` : "none",
                }}>
                  <div className="w-4 h-4 rounded-full bg-accent/15 flex items-center justify-center">
                    <Icon className="w-2.5 h-2.5 text-accent" />
                  </div>
                  {text}
                </span>
              ))}
            </div>

            {/* Metrics bar */}
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
              {[
                { label: "Avg Output Time", value: "6 min", icon: Sparkles },
                { label: "Policy Match Rate", value: "94%", icon: ShieldCheck },
                { label: "Avg Growth Lift", value: "2.8×", icon: TrendingUp },
              ].map((metric, i) => (
                <div key={metric.label} className="surface p-4 rounded-2xl hover:surface-hover transition-all duration-300 cursor-pointer group" style={{
                  animation: mounted ? `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.8 + (i * 0.1)}s both` : "none",
                }}>
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <metric.icon className="w-3.5 h-3.5" />
                    <span className="font-label text-[9px]">{metric.label}</span>
                  </div>
                  <p className="font-display text-2xl text-foreground group-hover:text-primary transition-colors">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Compliance UI */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0) rotate(0deg)" : "translateX(40px) rotate(2deg)",
            transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
          }}>
            <div className="relative group">
              <div className="absolute -inset-8 rounded-3xl blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" style={{
                background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.16), hsl(var(--accent) / 0.08), transparent 72%)",
                animation: mounted ? "blobFloat 6s ease-in-out infinite" : "none",
              }} />

              {/* Competitor comparison callout */}
              <div className="relative z-10 mb-3 flex items-center justify-between px-4 py-2.5 rounded-xl border border-destructive/20 bg-destructive/5" style={{
                animation: mounted ? "slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both" : "none",
              }}>
                <span className="text-[10px] text-muted-foreground/70">
                  Most platforms publish without this step →
                </span>
                <span className="text-[10px] font-label text-destructive/80 px-2 py-0.5 rounded-full bg-destructive/8 border border-destructive/15">MISSING</span>
              </div>

              <div className="relative z-10 flex items-center justify-between px-5 py-2 rounded-t-2xl border border-b-0 border-border/60 bg-card hover:border-primary/40 transition-colors duration-300" style={{
                animation: mounted ? "slideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both" : "none",
              }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[9px] font-mono text-muted-foreground tracking-widest">LIVE MONETIZATION SCAN</span>
                </div>
                <span className="text-[9px] font-mono text-muted-foreground/40">VORAX ENGINE v3.0</span>
              </div>

              <div className="surface-overlay rounded-t-none p-8 relative z-10 group-hover:border-primary/30 transition-colors duration-300" style={{
                animation: mounted ? "slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both" : "none",
              }}>
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
                        animation: mounted ? `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.8 + (i * 0.1)}s both` : "none",
                      }}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-label text-muted-foreground">{s.label.toUpperCase()}</span>
                          <span className="text-xs font-mono font-semibold text-foreground">{s.score}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                            style={{
                              width: mounted ? `${s.score}%` : "0%",
                              transition: `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${0.9 + i * 0.15}s`,
                              animation: mounted ? "gradientFlow 3s ease-in-out infinite" : "none",
                              backgroundSize: "200% 100%",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="pt-2" style={{
                      animation: mounted ? "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.1s both" : "none",
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

              {/* Revenue preview callout */}
              <div className="relative z-10 mt-3 flex items-center justify-between px-4 py-2.5 rounded-xl border border-primary/20 bg-primary/5" style={{
                animation: mounted ? "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.2s both" : "none",
              }}>
                <span className="text-[10px] text-muted-foreground">Estimated monthly revenue for this video</span>
                <span className="text-sm font-display font-bold text-primary">₹4,200 – ₹8,800</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
