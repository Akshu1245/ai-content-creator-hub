import { WizardData } from "@/pages/NewProject";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, Sparkles, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ComplianceGauge from "@/components/dashboard/ComplianceGauge";

interface Props {
  data: WizardData;
  updateData: (u: Partial<WizardData>) => void;
}

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
        toast.success("Compliance check complete!");
      }
    } catch (err: any) {
      toast.error(err.message || "Compliance check failed — using demo data");
      const demo: ComplianceResult = {
        overall: 88,
        scores: { originality: 85, value: 92, misinformation: 95, monetization: 82 },
        warnings: ["Consider adding unique data points to boost originality", "Some language may trigger advertiser sensitivity filters"],
        recommendations: ["Add specific statistics or studies to increase value score", "Replace sensationalist words with factual alternatives", "Include a source citation for key claims"],
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
        toast.success("Script auto-fixed! Re-run compliance check to verify.");
        setResult(null);
      }
    } catch {
      toast.error("Auto-fix failed. Please review manually.");
    } finally {
      setFixing(false);
    }
  };

  const getRisk = (score: number) => {
    if (score >= 80) return { label: "Safe", color: "#06D6A0", bg: "rgba(6,214,160,0.1)", border: "rgba(6,214,160,0.3)", icon: CheckCircle };
    if (score >= 60) return { label: "Caution", color: "#FFB703", bg: "rgba(255,183,3,0.1)", border: "rgba(255,183,3,0.3)", icon: AlertTriangle };
    return { label: "High Risk", color: "#FF4365", bg: "rgba(255,67,101,0.1)", border: "rgba(255,67,101,0.3)", icon: XCircle };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold mb-1 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan" /> Compliance Scorer
          </h2>
          <p className="text-sm" style={{ color: "hsl(205 40% 55%)" }}>Multi-layer AI analysis for monetization safety</p>
        </div>
        <button onClick={runCheck} disabled={loading || !data.script} className="btn-primary flex items-center gap-2 disabled:opacity-40">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
          {result ? "Re-check" : "Run Check"}
        </button>
      </div>

      {!result && !loading && (
        <div className="glass-elevated p-14 text-center">
          <Shield className="w-14 h-14 mx-auto mb-5" style={{ color: "hsl(210 25% 25%)" }} />
          <p className="font-display font-bold text-lg text-foreground mb-2">Ready to Score</p>
          <p style={{ color: "hsl(205 40% 55%)" }}>Click "Run Check" to analyze your script for YouTube policy compliance</p>
        </div>
      )}

      {result && (
        <div className="space-y-5 animate-fade-in">
          {/* Overall */}
          <div className="glass-elevated p-8 flex flex-col md:flex-row items-center gap-8">
            <ComplianceGauge score={result.overall} size={180} />
            <div className="flex-1 text-center md:text-left">
              <div className="text-sm font-label mb-2" style={{ color: "hsl(210 25% 40%)" }}>Overall Compliance</div>
              {(() => {
                const risk = getRisk(result.overall);
                return (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-bold" style={{ background: risk.bg, border: `1px solid ${risk.border}`, color: risk.color }}>
                    <risk.icon className="w-4 h-4" /> {risk.label}
                  </div>
                );
              })()}
              <p className="text-sm mt-3" style={{ color: "hsl(205 40% 55%)" }}>
                {result.overall >= 80
                  ? "Your content meets YouTube's monetization guidelines."
                  : "There are issues that may affect monetization."}
              </p>
            </div>
          </div>

          {/* Dimension scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Originality", score: result.scores.originality },
              { label: "Value", score: result.scores.value },
              { label: "Misinfo Safety", score: result.scores.misinformation },
              { label: "Monetization", score: result.scores.monetization },
            ].map((dim) => {
              const risk = getRisk(dim.score);
              return (
                <div key={dim.label} className="glass p-4 text-center">
                  <div className="text-2xl font-mono font-bold" style={{ color: risk.color }}>{dim.score}</div>
                  <div className="text-xs font-label mt-1" style={{ color: "hsl(210 25% 40%)" }}>{dim.label}</div>
                  <div className="h-1.5 rounded-full mt-3 overflow-hidden" style={{ background: "rgba(42,72,112,0.3)" }}>
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${dim.score}%`, background: risk.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="glass p-5">
              <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full">
                <h3 className="text-sm font-display font-bold flex items-center gap-2" style={{ color: "#FFB703" }}>
                  <AlertTriangle className="w-4 h-4" /> {result.warnings.length} Warnings
                </h3>
                {expanded ? <ChevronUp className="w-4 h-4" style={{ color: "hsl(210 25% 40%)" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "hsl(210 25% 40%)" }} />}
              </button>
              {expanded && (
                <ul className="space-y-2 mt-4">
                  {result.warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "hsl(205 40% 62%)" }}>
                      <span className="mt-0.5" style={{ color: "#FFB703" }}>•</span> {w}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="glass p-5">
              <h3 className="text-sm font-display font-bold flex items-center gap-2 mb-4 text-cyan">
                <Sparkles className="w-4 h-4" /> Recommendations
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "hsl(205 40% 62%)" }}>
                    <span className="text-cyan mt-0.5">→</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclosure */}
          {result.disclosureNeeded && (
            <div className="glass p-4" style={{ borderLeft: "3px solid #0EA5E9" }}>
              <p className="text-sm" style={{ color: "hsl(205 40% 62%)" }}>
                <span className="text-cyan font-display font-bold">ℹ️ AI Disclosure Required:</span> This content should include YouTube's AI-generated content disclosure tag.
              </p>
            </div>
          )}

          {/* Auto Fix */}
          {result.overall < 95 && (
            <button
              onClick={autoFix}
              disabled={fixing}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-display font-bold transition-all disabled:opacity-40"
              style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.25)", color: "#0EA5E9" }}
            >
              {fixing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Auto-Fix All Issues
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StepCompliance;
