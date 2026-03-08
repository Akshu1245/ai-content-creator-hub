import { DollarSign, Shield, TrendingUp, ShieldCheck, ShieldAlert, CheckCircle, AlertTriangle } from "lucide-react";
import AnimatedNumber from "@/components/shared/AnimatedNumber";

interface VideoSafety {
  name: string;
  status: "safe" | "caution" | "risk";
}

const RevenueCommandCenter = () => {
  // Simulated aggregated data
  const yppData = {
    subsPercent: 84.7,
    watchPercent: 58.5,
    currentSubs: 847,
    currentWatchHours: 2341,
  };

  const revenueData = {
    totalAdsenseMonthly: 142,
    totalAffiliateMonthly: 89,
    combinedLow: 180,
    combinedHigh: 320,
    projectedDate: "August 2026",
    activeAffiliateLinks: 8,
  };

  const videoSafety: VideoSafety[] = [
    { name: "Compound Interest Explained", status: "safe" },
    { name: "Hidden Bank Fees", status: "safe" },
    { name: "Crypto Mistakes to Avoid", status: "caution" },
    { name: "The Backrooms Level 9999", status: "safe" },
    { name: "Why GPUs Cost So Much", status: "safe" },
    { name: "AI Chip War Explained", status: "safe" },
  ];

  const safeCount = videoSafety.filter(v => v.status === "safe").length;
  const cautionCount = videoSafety.filter(v => v.status === "caution").length;

  return (
    <div className="surface-overlay gold-glow">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-[10px] font-label text-primary block">REVENUE COMMAND CENTER</span>
            <p className="text-[10px] text-muted-foreground">Your monetization intelligence at a glance</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-label text-muted-foreground block">COMBINED MONTHLY EST.</span>
          <span className="text-lg font-mono font-bold text-primary">
            $<AnimatedNumber value={revenueData.combinedLow} />–$<AnimatedNumber value={revenueData.combinedHigh} />
          </span>
        </div>
      </div>

      {/* 4-column stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-border/30">
        {[
          { label: "ADSENSE EST.", value: `$${revenueData.totalAdsenseMonthly}`, sub: "/month", icon: TrendingUp, color: "text-emerald" },
          { label: "AFFILIATE EST.", value: `$${revenueData.totalAffiliateMonthly}`, sub: "/month", icon: DollarSign, color: "text-primary" },
          { label: "ACTIVE LINKS", value: `${revenueData.activeAffiliateLinks}`, sub: "programs", icon: TrendingUp, color: "text-accent" },
          { label: "TARGET DATE", value: revenueData.projectedDate, sub: "profitability", icon: TrendingUp, color: "text-primary" },
        ].map((stat, i) => (
          <div key={stat.label} className={`p-4 text-center ${i < 3 ? "border-r border-border/30" : ""}`}>
            <span className="text-[8px] font-label text-muted-foreground block mb-2">{stat.label}</span>
            <span className={`text-base font-mono font-bold ${stat.color} block`}>{stat.value}</span>
            <span className="text-[8px] text-muted-foreground">{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* YPP mini bars + Copyright status */}
      <div className="grid md:grid-cols-2 gap-0 border-b border-border/30">
        {/* YPP mini */}
        <div className="p-5 border-r border-border/30">
          <span className="text-[9px] font-label text-muted-foreground block mb-3">YPP PROGRESS</span>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] text-muted-foreground">Subscribers</span>
                <span className="text-[10px] font-mono text-foreground">{yppData.currentSubs}/1,000</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-accent" style={{ width: `${yppData.subsPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] text-muted-foreground">Watch Hours</span>
                <span className="text-[10px] font-mono text-foreground">{yppData.currentWatchHours.toLocaleString()}/4,000</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-emerald" style={{ width: `${yppData.watchPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright status */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] font-label text-muted-foreground">COPYRIGHT STATUS</span>
            <span className="text-[9px] font-mono text-emerald">{safeCount}/{videoSafety.length} CLEAR</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {videoSafety.map((video) => (
              <div key={video.name} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-secondary/30">
                {video.status === "safe" ? (
                  <CheckCircle className="w-3 h-3 text-emerald shrink-0" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-primary shrink-0" />
                )}
                <span className="text-[8px] text-muted-foreground truncate">{video.name}</span>
              </div>
            ))}
          </div>
          {cautionCount > 0 && (
            <p className="text-[8px] text-primary mt-2">{cautionCount} video(s) need attention</p>
          )}
        </div>
      </div>

      {/* Bottom motivational bar */}
      <div className="p-4 text-center">
        <p className="text-xs text-foreground">
          You're on track for <span className="font-mono font-bold text-primary">${revenueData.combinedLow}–${revenueData.combinedHigh}/month</span> by{" "}
          <span className="font-bold text-accent">{revenueData.projectedDate}</span>
        </p>
        <p className="text-[9px] text-muted-foreground mt-1">Keep posting consistently — your revenue compounds with every video.</p>
      </div>
    </div>
  );
};

export default RevenueCommandCenter;
