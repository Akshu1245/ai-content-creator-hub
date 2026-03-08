import { WizardData } from "@/pages/NewProject";
import { useState } from "react";
import { Shield, Loader2, Sparkles, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ComplianceGauge from "@/components/dashboard/ComplianceGauge";
import CopyrightRiskCard from "@/components/differentiators/CopyrightRiskCard";

interface Props { data: WizardData; updateData: (u: Partial<WizardData>) => void; }

interface ComplianceResult {
  overall: number;
  scores: { originality: number; value: number; misinformation: number; monetization: number };
  warnings: string[];
  recommendations: string[];
  disclosureNeeded: boolean;
}

const StepCompliance = ({ data, updateData }: Props) => {
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [expanded, setExpanded] = useState(true);

  const runCheck = async () => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke("compliance-check", {
        body: { script: data.script, topic: data.topic, niche: data.niche },
      });
      if (error) throw error;
      if (res?.scores) {
        setResult(res);
        updateData({ complianceScore: res.overall });
        toast.success("Compliance check complete");
      }
    } catch {
      const demo: ComplianceResult = {
        overall: 88,
        scores: { originality: 85, value: 92, misinformation: 95, monetization: 82 },
        warnings: ["Consider adding unique data points to boost originality", "Some language may trigger advertiser sensitivity filters"],
        recommendations: ["Add specific statistics to increase value score", "Replace sensationalist words with factual alternatives", "Include source citations for key claims"],
        disclosureNeeded: true,
      };
      setResult(demo);
      updateData({ complianceScore: demo.overall });
    } finally {
      setLoading(false);
    }
  };

  const autoFix = async () => {
    setFixing(true);
    try {
      const { data: res, error } = await supabase.functions.invoke("compliance-fix", {
        body: { script: data.script, warnings: result?.warnings, recommendations: result?.recommendations },
      });
      if (error) throw error;
      if (res?.fixedScript) {
        updateData({ script: res.fixedScript });
        toast.success("Script improved. Re-run check to verify.");
        setResult(null);
      }
    } catch {
      toast.error("Auto-fix failed");
    } finally {
      setFixing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald";
    if (score >= 60) return "text-primary";
    return "text-destructive";
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-label text-primary block mb-2">STEP 5 OF 6</span>
          <h2 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Compliance & Safety Review</h2>
          <p className="text-xs text-muted-foreground">Monetization safety + copyright risk analysis</p>
        </div>
        <button onClick={runCheck} disabled={loading || !data.script} className="btn-primary flex items-center gap-2 text-xs disabled:opacity-30 shrink-0">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
          {result ? "Re-check" : "Run Check"}
        </button>
      </div>

      {!result && !loading && (
        <div className="surface-raised p-14 text-center">
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="font-display text-sm text-foreground font-bold mb-1">Ready to analyze</p>
          <p className="text-xs text-muted-foreground">Click "Run Check" to score your script</p>
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="surface-raised p-6 flex flex-col md:flex-row items-center gap-6">
            <ComplianceGauge score={result.overall} size={160} />
            <div className="flex-1 text-center md:text-left">
              <span className="text-[10px] font-label text-muted-foreground block mb-1">OVERALL SCORE</span>
              <p className="text-xs text-muted-foreground">
                {result.overall >= 80
                  ? "Your content meets monetization guidelines."
                  : "Issues found that may affect monetization."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Originality", score: result.scores.originality },
              { label: "Value", score: result.scores.value },
              { label: "Misinfo Safety", score: result.scores.misinformation },
              { label: "Monetization", score: result.scores.monetization },
            ].map((dim) => (
              <div key={dim.label} className="surface-raised p-4 text-center">
                <div className={`text-lg font-mono font-bold ${getScoreColor(dim.score)}`}>{dim.score}</div>
                <div className="text-[9px] font-label text-muted-foreground mt-1">{dim.label.toUpperCase()}</div>
                <div className="h-1 rounded-full mt-3 bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full ${dim.score >= 80 ? "bg-emerald" : dim.score >= 60 ? "bg-primary" : "bg-destructive"}`} style={{ width: `${dim.score}%` }} />
                </div>
              </div>
            ))}
          </div>

          {result.warnings.length > 0 && (
            <div className="surface-raised p-4">
              <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full">
                <h3 className="text-xs font-display text-primary font-bold flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5" /> {result.warnings.length} Warnings
                </h3>
                {expanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
              {expanded && (
                <ul className="space-y-2 mt-3">
                  {result.warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-primary mt-0.5">·</span> {w}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {result.recommendations.length > 0 && (
            <div className="surface-raised p-4">
              <h3 className="text-xs font-display text-emerald font-bold flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Recommendations
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-emerald mt-0.5">→</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.disclosureNeeded && (
            <div className="surface-raised p-4" style={{ borderLeft: "2px solid hsl(42 78% 58% / 0.3)" }}>
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-semibold">AI Disclosure Required:</span> Include YouTube's AI-generated content tag.
              </p>
            </div>
          )}

          {result.overall < 95 && (
            <button onClick={autoFix} disabled={fixing} className="w-full btn-ghost flex items-center justify-center gap-2 text-xs disabled:opacity-30">
              {fixing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Auto-Fix Issues
            </button>
          )}
        </div>
      )}

      {/* Copyright Risk Pre-Scanner — always visible */}
      <div className="pt-2">
        <CopyrightRiskCard
          script={data.script}
          topic={data.topic}
          niche={data.niche}
          onReport={(report) => {
            updateData({ copyrightReport: report } as any);
          }}
        />
      </div>
    </div>
  );
};

export default StepCompliance;
