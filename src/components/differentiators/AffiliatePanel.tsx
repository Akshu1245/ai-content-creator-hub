import { useState, useMemo } from "react";
import { DollarSign, Copy, Check, ExternalLink, ChevronDown, ChevronUp, Sparkles, Link2 } from "lucide-react";
import { getAffiliatesForNiche, type AffiliateProgram } from "@/lib/revenue-data";

interface Props {
  niche: string;
  topic: string;
  script: string;
  onDescriptionGenerated?: (desc: string) => void;
}

const commissionBadge: Record<string, string> = {
  CPA: "bg-primary/15 text-primary border-primary/20",
  CPS: "bg-accent/15 text-accent border-accent/20",
  CPL: "bg-emerald/15 text-emerald border-emerald/20",
  recurring: "bg-gold/15 text-gold border-gold/20",
};

const AffiliatePanel = ({ niche, topic, script, onDescriptionGenerated }: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refCodes, setRefCodes] = useState<Record<string, string>>({});
  const [descCopied, setDescCopied] = useState(false);

  const programs = useMemo(() => getAffiliatesForNiche(niche).slice(0, 5), [niche]);

  // Calculate purchase intent score from script
  const intentScore = useMemo(() => {
    const intentKeywords = ["buy", "invest", "subscribe", "sign up", "try", "get", "start", "purchase", "order", "download", "join", "save", "earn", "money", "free"];
    const words = script.toLowerCase().split(/\s+/);
    const matches = words.filter(w => intentKeywords.some(k => w.includes(k)));
    return Math.min(100, Math.round((matches.length / Math.max(1, words.length)) * 1000) + 35);
  }, [script]);

  // Estimate monthly earning from this video
  const totalEstLow = useMemo(() => {
    return programs.reduce((sum, p) => {
      const views = 2500; // realistic monthly views for single video
      const clicks = (views / 1000) * p.clicksPer1kViews;
      return sum + clicks * p.conversionRate * p.commissionNumeric;
    }, 0);
  }, [programs]);
  const totalEstHigh = Math.round(totalEstLow * 2.5);

  // Generate description
  const generatedDescription = useMemo(() => {
    const activePrograms = programs.filter(p => refCodes[p.id] || true).slice(0, 3);
    const programLinks = activePrograms.map(p => {
      const link = refCodes[p.id] ? p.affiliateUrl.replace("{ref}", refCodes[p.id]) : `[${p.name.toUpperCase()}_LINK]`;
      return `🔗 ${p.name}: ${p.descriptionTemplate.replace("{link}", link)}`;
    }).join("\n");

    return `${topic}\n\nIn this video, we explore everything you need to know about ${topic.toLowerCase()} in the ${niche} space.\n\n📌 RESOURCES MENTIONED:\n${programLinks}\n\n⏱ TIMESTAMPS:\n00:00 Introduction\n00:30 Key Concepts\n02:00 Deep Dive\n04:30 Expert Analysis\n06:00 Key Takeaways\n\n🔔 Subscribe and hit the notification bell for more ${niche.toLowerCase()} content!\n\n#${niche.replace(/\s/g, "")} #${topic.split(" ").slice(0, 2).join("")} #Faceless #AI #ContentCreator #YouTube`;
  }, [programs, refCodes, topic, niche]);

  const copyDescription = () => {
    navigator.clipboard.writeText(generatedDescription);
    setDescCopied(true);
    setTimeout(() => setDescCopied(false), 2000);
    onDescriptionGenerated?.(generatedDescription);
  };

  if (programs.length === 0) return null;

  return (
    <div className="surface-overlay animate-fade-in">
      {/* Header */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Link2 className="w-4 h-4 text-primary" />
          </div>
          <span className="text-[10px] font-label text-primary">AFFILIATE OPPORTUNITIES</span>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-label text-muted-foreground block">EST. MONTHLY FROM THIS VIDEO</span>
          <span className="text-sm font-mono font-bold text-primary">${Math.round(totalEstLow)}–${totalEstHigh}</span>
        </div>
      </div>

      {/* Purchase Intent Score */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-label text-muted-foreground">VIEWER PURCHASE INTENT</span>
          <span className="text-xs font-mono font-bold text-primary">{intentScore}</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary/50 via-primary to-primary/70 transition-all duration-500"
            style={{ width: `${intentScore}%` }}
          />
        </div>
        <p className="text-[8px] text-muted-foreground mt-1.5">Higher intent = more likely viewers click affiliate links</p>
      </div>

      {/* Programs List */}
      <div className="border-t border-border/30">
        <div className="px-5 py-3">
          <span className="text-[9px] font-label text-muted-foreground">MATCHED PROGRAMS ({programs.length})</span>
        </div>
        <div className="px-5 pb-4 space-y-2">
          {programs.map((program) => {
            const isExpanded = expandedId === program.id;
            const estMonthly = Math.round((2500 / 1000) * program.clicksPer1kViews * program.conversionRate * program.commissionNumeric);

            return (
              <div key={program.id} className="rounded-xl bg-secondary/30 border border-border/30 overflow-hidden hover:border-primary/15 transition-all">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : program.id)}
                  className="w-full p-3.5 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-display text-primary font-bold">{program.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">{program.name}</span>
                      <span className={`text-[8px] font-label px-2 py-0.5 rounded-full border ${commissionBadge[program.commissionType] || ""}`}>
                        {program.commissionType.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-primary font-bold">{program.commissionValue}</span>
                  </div>
                  <div className="text-right shrink-0 mr-2">
                    <span className="text-[9px] text-muted-foreground block">Est.</span>
                    <span className="text-xs font-mono font-bold text-foreground">${estMonthly}/mo</span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-0 space-y-3 animate-fade-in border-t border-border/20 mt-0 pt-3">
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {program.descriptionTemplate.replace("{link}", "[YOUR_LINK]")}
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-[9px]">
                      <div className="p-2 rounded-lg bg-secondary/50 text-center">
                        <span className="text-muted-foreground block">Cookie</span>
                        <span className="font-mono font-bold text-foreground">{program.cookieDurationDays}d</span>
                      </div>
                      <div className="p-2 rounded-lg bg-secondary/50 text-center">
                        <span className="text-muted-foreground block">Payout</span>
                        <span className="font-mono font-bold text-foreground">{program.payoutThreshold}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-secondary/50 text-center">
                        <span className="text-muted-foreground block">Approval</span>
                        <span className="font-mono font-bold text-foreground">{program.requiresApproval ? "Required" : "Auto"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a href={program.signupUrl} target="_blank" rel="noopener noreferrer"
                        className="btn-ghost flex items-center gap-1.5 text-[10px] py-2 px-3 flex-1 justify-center">
                        <ExternalLink className="w-3 h-3" /> Join Program
                      </a>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Your ref code…"
                          value={refCodes[program.id] || ""}
                          onChange={(e) => setRefCodes(prev => ({ ...prev, [program.id]: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg text-[10px] text-foreground placeholder:text-muted-foreground bg-secondary/50 border border-border/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Generated Description */}
      <div className="border-t border-border/30 px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-label text-primary flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> AI-GENERATED DESCRIPTION WITH LINKS
          </span>
          <button onClick={copyDescription} className="btn-ghost flex items-center gap-1.5 text-[10px] py-1.5 px-3">
            {descCopied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
          </button>
        </div>
        <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 max-h-48 overflow-y-auto">
          <pre className="text-[10px] text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">{generatedDescription}</pre>
        </div>
        <button
          onClick={() => onDescriptionGenerated?.(generatedDescription)}
          className="btn-primary w-full mt-3 text-xs flex items-center justify-center gap-2"
        >
          <DollarSign className="w-3.5 h-3.5" /> Use This Description
        </button>
      </div>

      {/* Setup prompt */}
      {Object.keys(refCodes).length === 0 && (
        <div className="mx-5 mb-5 p-3.5 rounded-xl bg-primary/5 border border-primary/15">
          <p className="text-[10px] text-primary leading-relaxed">
            <span className="font-bold">💡 Tip:</span> Add your affiliate ref codes above to activate tracked links. Don't have accounts yet? Apply to programs above — most approve within 24 hours.
          </p>
        </div>
      )}
    </div>
  );
};

export default AffiliatePanel;
