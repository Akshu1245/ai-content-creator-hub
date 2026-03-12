import { X, Check, ShieldCheck, IndianRupee, AlertTriangle, TrendingUp, Eye } from "lucide-react";

const withoutItems = [
  { icon: X, text: "No compliance check before publishing", color: "text-red-400" },
  { icon: X, text: "No revenue estimate — publish blind", color: "text-red-400" },
  { icon: X, text: "Dollar billing with hidden GST & forex markup", color: "text-red-400" },
  { icon: X, text: "Demonetization discovered after the fact", color: "text-red-400" },
  { icon: X, text: "Limited or no Indian language voices", color: "text-red-400" },
  { icon: X, text: "No YPP progress tracking", color: "text-red-400" },
];

const withItems = [
  { icon: ShieldCheck, text: "Monetization Shield scores every video before export", color: "text-emerald-400" },
  { icon: IndianRupee, text: "Paycheck Preview: ₹4,200–₹8,800 estimated before publish", color: "text-emerald-400" },
  { icon: Check, text: "₹999/mo flat INR — no forex, no surprises", color: "text-emerald-400" },
  { icon: TrendingUp, text: "Compliance gate = 0 surprise demonetizations", color: "text-emerald-400" },
  { icon: Eye, text: "9 Indian voices: Tamil, Hindi, Telugu, Marathi, Kannada", color: "text-emerald-400" },
  { icon: TrendingUp, text: "Monetization Countdown: know exactly when you hit YPP", color: "text-emerald-400" },
];

const BeforeAfterSection = () => {
  return (
    <section className="py-24 px-6 relative z-10">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <span className="font-label text-accent tracking-widest">THE DIFFERENCE</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight mt-4 mb-3">
            Publishing blind vs. publishing protected
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Most tools get you to upload faster. VORAX tells you what happens after YouTube reviews your video.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* WITHOUT */}
          <div className="surface-raised p-7 border border-red-500/20 relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Without VORAX</p>
                <p className="text-[10px] text-muted-foreground">Most platforms' approach</p>
              </div>
            </div>

            <div className="space-y-3">
              {withoutItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5" style={{ animation: `fadeIn 0.4s ease-out ${i * 0.06}s both` }}>
                  <div className="w-5 h-5 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className={`w-2.5 h-2.5 ${item.color}`} />
                  </div>
                  <p className="text-xs text-foreground/75 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 rounded-xl bg-red-500/5 border border-red-500/15">
              <p className="text-[10px] text-red-400/90 leading-relaxed">
                Result: YouTube demonetizes your video 48–72 hours after publishing. No warning. Revenue lost.
              </p>
            </div>
          </div>

          {/* WITH VORAX */}
          <div
            className="surface-raised p-7 border border-emerald-500/25 relative overflow-hidden group"
            style={{ background: "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(142 71% 45% / 0.03) 100%)" }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full">
              <span className="live-dot" style={{ background: "hsl(142 71% 45%)" }} />
              <span className="text-[9px] font-label text-emerald-400 tracking-widest">SCORE: 94</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">With VORAX</p>
                <p className="text-[10px] text-muted-foreground">Protected, paid, and pre-cleared</p>
              </div>
            </div>

            <div className="space-y-3">
              {withItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5" style={{ animation: `fadeIn 0.4s ease-out ${i * 0.06}s both` }}>
                  <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className={`w-2.5 h-2.5 ${item.color}`} />
                  </div>
                  <p className="text-xs text-foreground/85 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <p className="text-[10px] text-emerald-400/90 leading-relaxed">
                Result: Compliance cleared before export. Revenue estimated. You publish knowing you'll get paid.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[11px] text-muted-foreground">
            Every VORAX video passes through the Monetization Shield before you can export.{" "}
            <span className="text-primary font-medium">This is not optional. It's the entire point.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
