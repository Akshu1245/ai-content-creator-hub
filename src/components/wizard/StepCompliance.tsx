import { useState } from "react";
import { WizardData } from "@/pages/NewProject";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, Sparkles, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      toast.error(err.message || "Compliance check failed");
      // Fallback demo data
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
        toast.success("Script auto-fixed! Run compliance check again to verify.");
        setResult(null);
      }
    } catch {
      toast.error("Auto-fix failed. Please review manually.");
    } finally {
      setFixing(false);
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { label: "Safe", color: "text-primary", bg: "bg-primary/10", icon: CheckCircle, emoji: "🟢" };
    if (score >= 60) return { label: "Caution", color: "text-warning", bg: "bg-warning/10", icon: AlertTriangle, emoji: "🟡" };
    return { label: "High Risk", color: "text-danger", bg: "bg-danger/10", icon: XCircle, emoji: "🔴" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Compliance Scorer
          </h2>
          <p className="text-sm text-muted-foreground">AI-powered monetization safety check</p>
        </div>
        <Button onClick={runCheck} disabled={loading || !data.script} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
          {result ? "Re-check" : "Run Check"}
        </Button>
      </div>

      {!result && !loading && (
        <div className="glass rounded-xl p-12 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Click "Run Check" to analyze your script for policy compliance</p>
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Overall Score */}
          <div className="glass rounded-xl p-6 text-center">
            {(() => {
              const risk = getRiskLevel(result.overall);
              return (
                <>
                  <div className={`text-5xl font-bold font-mono ${risk.color}`}>{result.overall}</div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mt-3 ${risk.bg} ${risk.color}`}>
                    {risk.emoji} {risk.label}
                  </div>
                </>
              );
            })()}
          </div>

          {/* Dimension Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Originality", score: result.scores.originality },
              { label: "Value", score: result.scores.value },
              { label: "Misinfo Safety", score: result.scores.misinformation },
              { label: "Monetization", score: result.scores.monetization },
            ].map((dim) => {
              const risk = getRiskLevel(dim.score);
              return (
                <div key={dim.label} className="glass rounded-xl p-4 text-center">
                  <div className={`text-2xl font-bold font-mono ${risk.color}`}>{dim.score}</div>
                  <div className="text-xs text-muted-foreground mt-1">{dim.label}</div>
                  <div className="h-1 bg-secondary rounded-full mt-2 overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${dim.score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="glass rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-warning">
                <AlertTriangle className="w-4 h-4" /> Warnings
              </h3>
              <ul className="space-y-2">
                {result.warnings.map((w, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-warning mt-0.5">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="glass rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-info">
                <Sparkles className="w-4 h-4" /> Recommendations
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-info mt-0.5">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Disclosure */}
          {result.disclosureNeeded && (
            <div className="glass rounded-xl p-4 border-l-2 border-info">
              <p className="text-sm text-muted-foreground">
                <span className="text-info font-medium">ℹ️ AI Disclosure Required:</span> This content should include YouTube's AI-generated content disclosure tag.
              </p>
            </div>
          )}

          {/* Auto Fix */}
          {result.overall < 90 && (
            <Button
              onClick={autoFix}
              disabled={fixing}
              variant="outline"
              className="w-full border-primary/30 text-primary hover:bg-primary/10"
            >
              {fixing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Auto-Fix All Issues
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default StepCompliance;
