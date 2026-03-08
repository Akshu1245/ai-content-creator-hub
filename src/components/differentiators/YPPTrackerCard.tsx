import { useState } from "react";
import { Target, ChevronDown, ChevronUp, Zap, Award, TrendingUp } from "lucide-react";

interface YPPData {
  currentSubs: number;
  subsTarget: number;
  currentWatchHours: number;
  watchHoursTarget: number;
  subsVelocity: number;
  watchVelocity: number;
  daysToYpp: number;
  estimatedDate: string;
  bottleneck: "subscribers" | "watch_hours" | "both";
  tips: { text: string; impact: string }[];
  nextMilestone: { type: string; target: number; daysAway: number };
}

interface Props {
  data?: Partial<YPPData>;
  videosPerWeek?: number;
}

const defaultData: YPPData = {
  currentSubs: 847,
  subsTarget: 1000,
  currentWatchHours: 2341,
  watchHoursTarget: 4000,
  subsVelocity: 12.3,
  watchVelocity: 48.2,
  daysToYpp: 47,
  estimatedDate: "May 2026",
  bottleneck: "watch_hours",
  tips: [
    { text: "Posting 1 additional video/week would cut your timeline from 47 to 31 days", impact: "-34% time" },
    { text: "Videos over 8 minutes generate 3x more watch hours — aim for longer content", impact: "+3x hours" },
    { text: "Adding end screens could boost subscriber rate by 15%", impact: "+15% subs" },
  ],
  nextMilestone: { type: "subscribers", target: 1000, daysAway: 8 },
};

const YPPTrackerCard = ({ data: partialData, videosPerWeek = 3 }: Props) => {
  const [showTips, setShowTips] = useState(false);
  const data = { ...defaultData, ...partialData };

  const subsPercent = Math.min(100, (data.currentSubs / data.subsTarget) * 100);
  const watchPercent = Math.min(100, (data.currentWatchHours / data.watchHoursTarget) * 100);
  const subsRemaining = Math.max(0, data.subsTarget - data.currentSubs);
  const watchRemaining = Math.max(0, data.watchHoursTarget - data.currentWatchHours);

  const dateColor = data.daysToYpp > 60 ? "text-primary" : data.daysToYpp > 14 ? "text-emerald" : "text-primary animate-pulse";
  const dateBg = data.daysToYpp > 60 ? "bg-primary/10 border-primary/20" : data.daysToYpp > 14 ? "bg-emerald/10 border-emerald/20" : "bg-primary/10 border-primary/20";

  return (
    <div className="surface-overlay gold-glow">
      {/* Top section */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
            <Award className="w-4.5 h-4.5 text-accent" />
          </div>
          <span className="text-[10px] font-label text-muted-foreground">YOUTUBE PARTNER PROGRAM</span>
        </div>
        <span className={`text-[9px] font-label px-3 py-1.5 rounded-full border ${dateBg} ${dateColor}`}>
          EST. ELIGIBLE: {data.estimatedDate.toUpperCase()}
        </span>
      </div>

      {/* Dual Progress Bars */}
      <div className="px-5 pb-2 space-y-4">
        {/* Subscribers */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-label text-muted-foreground">SUBSCRIBERS</span>
            <span className="text-xs font-mono font-bold text-foreground">
              {data.currentSubs.toLocaleString()} / {data.subsTarget.toLocaleString()}
            </span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent/60 to-accent transition-all duration-700"
              style={{ width: `${subsPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[9px] text-muted-foreground">+{data.subsVelocity}/day at current pace</span>
            <span className="text-[9px] font-mono text-accent">{subsRemaining} remaining</span>
          </div>
        </div>

        {/* Watch Hours */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-label text-muted-foreground">WATCH HOURS</span>
            <span className="text-xs font-mono font-bold text-foreground">
              {data.currentWatchHours.toLocaleString()} / {data.watchHoursTarget.toLocaleString()}
            </span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald/60 to-emerald transition-all duration-700"
              style={{ width: `${watchPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[9px] text-muted-foreground">+{data.watchVelocity} hrs/day at current pace</span>
            <span className="text-[9px] font-mono text-emerald">{watchRemaining.toLocaleString()} remaining</span>
          </div>
        </div>
      </div>

      {/* Countdown */}
      <div className="px-5 py-5 text-center border-t border-border/30">
        <span className="text-5xl font-mono font-bold text-accent">{data.daysToYpp}</span>
        <p className="text-[10px] text-muted-foreground mt-1">days to eligibility at your current upload pace</p>
      </div>

      {/* Bottleneck Alert */}
      {data.bottleneck !== "both" && (
        <div className="mx-5 mb-4 px-4 py-3 rounded-xl bg-primary/8 border border-primary/15 flex items-center gap-2.5">
          <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
          <p className="text-[10px] text-primary">
            <span className="font-bold">
              {data.bottleneck === "subscribers" ? "SUBSCRIBERS" : "WATCH HOURS"} IS YOUR BOTTLENECK
            </span>
            {" — "}
            {data.bottleneck === "subscribers"
              ? "Focus on end-screen CTAs and community posts to accelerate subscriber growth."
              : "Create longer videos (8+ min) to maximize watch time per view."}
          </p>
        </div>
      )}

      {/* Acceleration Tips */}
      <div className="border-t border-border/30">
        <button
          onClick={() => setShowTips(!showTips)}
          className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-secondary/20 transition-colors"
        >
          <span className="text-[10px] font-label text-muted-foreground flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-primary" /> ACCELERATION TIPS
          </span>
          {showTips ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
        {showTips && (
          <div className="px-5 pb-5 space-y-2.5 animate-fade-in">
            {data.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border/30">
                <div className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[9px] font-mono font-bold text-accent">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-foreground leading-snug">{tip.text}</p>
                  <span className="text-[9px] font-mono text-emerald mt-1 block">{tip.impact}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Milestone */}
      <div className="mx-5 mb-5 p-4 rounded-xl bg-accent/5 border border-accent/15 flex items-center gap-3">
        <Target className="w-4 h-4 text-accent shrink-0" />
        <div className="flex-1">
          <p className="text-xs text-foreground">
            Next milestone: <span className="font-bold text-accent">{data.nextMilestone.target.toLocaleString()} {data.nextMilestone.type}</span> in ~{data.nextMilestone.daysAway} days 🎯
          </p>
        </div>
        <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${Math.min(100, 100 - (data.nextMilestone.daysAway / 30 * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default YPPTrackerCard;
