import { useState, useMemo } from "react";
import { DollarSign, TrendingUp, ChevronDown, ChevronUp, Copy, ExternalLink, Minus, Plus } from "lucide-react";
import { calculateRevenue, type RevenueEstimate, type AffiliateProgram } from "@/lib/revenue-data";

interface Props {
  niche: string;
  compact?: boolean;
}

const commissionTypeBadge: Record<string, string> = {
  CPA: "bg-primary/15 text-primary border-primary/20",
  CPS: "bg-accent/15 text-accent border-accent/20",
  CPL: "bg-emerald/15 text-emerald border-emerald/20",
  recurring: "bg-gold/15 text-gold border-gold/20",
};

const RevenueEstimatorCard = ({ niche, compact = false }: Props) => {
  const [videosPerWeek, setVideosPerWeek] = useState(3);
  const [showAllAffiliates, setShowAllAffiliates] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const estimate = useMemo(() => calculateRevenue(niche, videosPerWeek), [niche, videosPerWeek]);

  if (!estimate) return null;

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const scenarios = [
    { key: "conservative", label: "Conservative", data: estimate.conservative, highlight: false },
    { key: "realistic", label: "Realistic", data: estimate.realistic, highlight: true },
    { key: "optimistic", label: "Optimistic", data: estimate.optimistic, highlight: false },
  ];

  if (compact) {
    return (
      <div className="surface-raised p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-label text-muted-foreground">EST. RPM</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-mono font-bold text-primary">${estimate.avgRpm}</span>
            <span className="text-[10px] text-muted-foreground">per 1K views</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-label text-muted-foreground">90-DAY EST.</span>
          <div className="text-sm font-mono font-bold text-foreground">
            ${Math.round(estimate.realistic.month3Revenue)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-overlay gold-glow animate-fade-in">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-label text-primary">REVENUE INTELLIGENCE</span>
          <span className={`text-[9px] font-label px-2.5 py-1 rounded-full border ${
            estimate.competitionLevel === "Low" ? "text-emerald bg-emerald/10 border-emerald/20" :
            estimate.competitionLevel === "Medium" ? "text-accent bg-accent/10 border-accent/20" :
            "text-primary bg-primary/10 border-primary/20"
          }`}>{estimate.competitionLevel.toUpperCase()} COMPETITION</span>
        </div>
        <h3 className="text-base font-display text-foreground font-bold mb-5">Revenue Potential — {niche}</h3>
      </div>

      {/* 3-column layout */}
      <div className="grid md:grid-cols-3 gap-0 border-t border-border/50">
        {/* LEFT — RPM Meter */}
        <div className="p-6 border-r border-border/50">
          <span className="text-[9px] font-label text-muted-foreground block mb-4">AVERAGE NICHE RPM</span>
          <div className="text-center mb-4">
            <span className="text-4xl font-mono font-bold text-primary">${estimate.avgRpm}</span>
            <span className="block text-[10px] text-muted-foreground mt-1">per 1,000 views</span>
          </div>
          {/* RPM range bar */}
          <div className="relative mt-6">
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40"
                style={{ width: "100%" }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[9px] font-mono text-muted-foreground">
              <span>${estimate.conservative.rpm}</span>
              <span>${estimate.optimistic.rpm}</span>
            </div>
            {/* Avg marker */}
            <div
              className="absolute top-0 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-lg shadow-primary/30"
              style={{
                left: `${((estimate.avgRpm - estimate.conservative.rpm) / (estimate.optimistic.rpm - estimate.conservative.rpm)) * 100}%`,
                transform: "translate(-50%, -2px)",
              }}
            />
          </div>

          {/* YPP ETA */}
          <div className="mt-6 pt-4 border-t border-border/30">
            <span className="text-[9px] font-label text-muted-foreground block mb-2">EST. TIME TO YPP</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-bold text-accent">{estimate.yppEta.daysEstimated}</span>
              <span className="text-[10px] text-muted-foreground">days</span>
            </div>
            <span className="text-[9px] text-muted-foreground">{estimate.yppEta.videosNeeded} videos needed</span>
          </div>
        </div>

        {/* CENTER — 90-Day Projection */}
        <div className="p-6 border-r border-border/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] font-label text-muted-foreground">90-DAY INCOME ESTIMATE</span>
          </div>

          <div className="space-y-3 mb-6">
            {scenarios.map(({ key, label, data, highlight }) => (
              <div
                key={key}
                className={`p-3 rounded-xl transition-all ${
                  highlight
                    ? "bg-primary/8 border border-primary/20 shadow-lg shadow-primary/5"
                    : "bg-secondary/30 border border-border/30"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] font-label ${highlight ? "text-primary" : "text-muted-foreground"}`}>
                    {label.toUpperCase()}
                  </span>
                  {highlight && <span className="text-[8px] font-label text-primary bg-primary/10 px-1.5 py-0.5 rounded">MOST LIKELY</span>}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[8px] text-muted-foreground block">Month 1</span>
                    <span className={`text-xs font-mono font-bold ${highlight ? "text-foreground" : "text-muted-foreground"}`}>
                      ${Math.round(data.month1Revenue)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-muted-foreground block">Month 3</span>
                    <span className={`text-xs font-mono font-bold ${highlight ? "text-primary" : "text-muted-foreground"}`}>
                      ${Math.round(data.month3Revenue)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-muted-foreground block">Month 6</span>
                    <span className={`text-xs font-mono font-bold ${highlight ? "text-foreground" : "text-muted-foreground"}`}>
                      ${Math.round(data.month6Revenue)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Videos/week stepper */}
          <div>
            <span className="text-[9px] font-label text-muted-foreground block mb-2">VIDEOS PER WEEK</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setVideosPerWeek(Math.max(1, videosPerWeek - 1))}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-lg font-mono font-bold text-foreground w-8 text-center">{videosPerWeek}</span>
              <button
                onClick={() => setVideosPerWeek(Math.min(7, videosPerWeek + 1))}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-[8px] text-muted-foreground/60 mt-4 leading-relaxed">
            Estimates based on industry averages. Actual results depend on consistency and quality.
          </p>
        </div>

        {/* RIGHT — Affiliate Opportunities */}
        <div className="p-6">
          <span className="text-[9px] font-label text-primary block mb-4">TOP AFFILIATE PROGRAMS</span>

          <div className="space-y-2.5">
            {(showAllAffiliates ? estimate.affiliatePrograms : estimate.affiliatePrograms.slice(0, 3)).map((program) => (
              <AffiliateCard key={program.id} program={program} onCopy={copyUrl} copied={copiedUrl === program.signupUrl} />
            ))}
          </div>

          {estimate.affiliatePrograms.length > 3 && (
            <button
              onClick={() => setShowAllAffiliates(!showAllAffiliates)}
              className="flex items-center gap-1.5 text-[10px] text-primary mt-3 hover:underline"
            >
              {showAllAffiliates ? (
                <><ChevronUp className="w-3 h-3" /> Show Less</>
              ) : (
                <><ChevronDown className="w-3 h-3" /> View All Programs ({estimate.affiliatePrograms.length})</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function AffiliateCard({ program, onCopy, copied }: { program: AffiliateProgram; onCopy: (url: string) => void; copied: boolean }) {
  return (
    <div className="p-3 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/15 transition-all group">
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-[9px] font-display text-primary font-bold">{program.name.slice(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-foreground block leading-tight">{program.name}</span>
            <span className="text-primary font-mono text-[10px] font-bold">{program.commissionValue}</span>
          </div>
        </div>
        <span className={`text-[8px] font-label px-2 py-0.5 rounded-full border ${commissionTypeBadge[program.commissionType] || ""}`}>
          {program.commissionType.toUpperCase()}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={() => onCopy(program.signupUrl)}
          className="flex items-center gap-1 text-[9px] text-muted-foreground hover:text-primary transition-colors"
        >
          {copied ? "Copied!" : <><Copy className="w-2.5 h-2.5" /> Copy URL</>}
        </button>
        <a
          href={program.signupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[9px] text-muted-foreground hover:text-accent transition-colors"
        >
          <ExternalLink className="w-2.5 h-2.5" /> Join
        </a>
      </div>
    </div>
  );
}

export default RevenueEstimatorCard;
