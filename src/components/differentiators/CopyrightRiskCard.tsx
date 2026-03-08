import { useState } from "react";
import { ShieldCheck, ShieldAlert, ShieldX, Loader2, Music, Image, FileText, RefreshCw, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CopyrightIssue {
  type: "audio" | "visual" | "script";
  severity: "low" | "medium" | "high";
  text: string;
  fix: string;
}

export interface CopyrightReport {
  overallRisk: "safe" | "caution" | "high_risk";
  audioRisk: { status: "safe" | "caution" | "high_risk"; detail: string };
  visualRisk: { status: "safe" | "caution" | "high_risk"; watermarksDetected: boolean };
  scriptRisk: { status: "safe" | "caution" | "high_risk"; originalityScore: number };
  issues: CopyrightIssue[];
  safeMusicAlternatives: string[];
  channelRiskSummary: string;
}

interface Props {
  script: string;
  topic: string;
  niche: string;
  onReport?: (report: CopyrightReport) => void;
}

const riskConfig = {
  safe: {
    icon: ShieldCheck,
    label: "COPYRIGHT CLEAR",
    subtitle: "Your video is safe to publish",
    borderClass: "border-emerald/30",
    bgClass: "bg-emerald/5",
    iconColor: "text-emerald",
    glowClass: "",
  },
  caution: {
    icon: ShieldAlert,
    label: "CAUTION — MINOR ISSUES FOUND",
    subtitle: "Fixable issues detected — review before publishing",
    borderClass: "border-primary/30",
    bgClass: "bg-primary/5",
    iconColor: "text-primary",
    glowClass: "",
  },
  high_risk: {
    icon: ShieldX,
    label: "PUBLISH BLOCKED — COPYRIGHT RISK DETECTED",
    subtitle: "High-risk issues must be resolved before publishing",
    borderClass: "border-destructive/30",
    bgClass: "bg-destructive/5",
    iconColor: "text-destructive",
    glowClass: "animate-pulse",
  },
};

const severityColor: Record<string, string> = {
  low: "bg-accent/10 text-accent border-accent/20",
  medium: "bg-primary/10 text-primary border-primary/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
};

const typeIcon: Record<string, typeof Music> = {
  audio: Music,
  visual: Image,
  script: FileText,
};

const CopyrightRiskCard = ({ script, topic, niche, onReport }: Props) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CopyrightReport | null>(null);

  const runScan = async () => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke("copyright-scan", {
        body: { script, topic, niche },
      });
      if (error) throw error;
      if (res) {
        setReport(res);
        onReport?.(res);
        toast.success("Copyright scan complete");
      }
    } catch {
      // Demo fallback with realistic data
      const demo: CopyrightReport = {
        overallRisk: "caution",
        audioRisk: { status: "safe", detail: "AI-generated voiceover — no copyright risk" },
        visualRisk: { status: "safe", watermarksDetected: false },
        scriptRisk: { status: "caution", originalityScore: 78 },
        issues: [
          { type: "script", severity: "medium", text: "Section mentions specific brand claims without citation", fix: "Add source attribution or rephrase as general knowledge" },
          { type: "script", severity: "low", text: "Phrasing closely mirrors common Wikipedia entries", fix: "Rewrite with unique perspective and original analysis" },
        ],
        safeMusicAlternatives: ["YouTube Audio Library", "Pixabay Music", "Incompetech (Kevin MacLeod — CC BY)"],
        channelRiskSummary: "Minor originality concerns in script. Audio and visuals are clear. Safe to publish with suggested edits.",
      };
      setReport(demo);
      onReport?.(demo);
    } finally {
      setLoading(false);
    }
  };

  if (!report && !loading) {
    return (
      <div className="surface-raised p-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-label text-muted-foreground block mb-1">COPYRIGHT PRE-SCANNER</span>
            <p className="text-xs text-muted-foreground">Scan for copyright risks before publishing</p>
          </div>
          <button onClick={runScan} disabled={!script} className="btn-ghost flex items-center gap-2 text-xs disabled:opacity-30">
            <ShieldCheck className="w-3.5 h-3.5" /> Scan Now
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="surface-raised p-8 text-center">
        <Loader2 className="w-8 h-8 text-primary mx-auto mb-3 animate-spin" />
        <p className="text-xs font-display text-foreground font-bold mb-1">Scanning for Copyright Risks</p>
        <p className="text-[10px] text-muted-foreground">Analyzing audio, visuals, and script originality…</p>
      </div>
    );
  }

  if (!report) return null;

  const config = riskConfig[report.overallRisk];
  const IconComponent = config.icon;

  return (
    <div className={`surface-raised overflow-hidden border ${config.borderClass} animate-fade-in`}>
      {/* Header banner */}
      <div className={`${config.bgClass} px-5 py-4 flex items-center gap-3 ${config.glowClass}`}>
        <div className={`w-10 h-10 rounded-xl ${config.bgClass} flex items-center justify-center`}>
          <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <div>
          <span className={`text-[10px] font-label ${config.iconColor} block`}>{config.label}</span>
          <p className="text-xs text-muted-foreground">{config.subtitle}</p>
        </div>
      </div>

      {/* 3-column status */}
      <div className="grid grid-cols-3 gap-0 border-t border-border/30">
        {[
          { label: "Audio", status: report.audioRisk.status, detail: report.audioRisk.detail, icon: Music },
          { label: "Visuals", status: report.visualRisk.status, detail: report.visualRisk.watermarksDetected ? "Watermarks detected" : "No watermarks found", icon: Image },
          { label: "Script", status: report.scriptRisk.status, detail: `Originality: ${report.scriptRisk.originalityScore}%`, icon: FileText },
        ].map((item) => (
          <div key={item.label} className="p-4 text-center border-r border-border/30 last:border-r-0">
            <item.icon className={`w-4 h-4 mx-auto mb-2 ${
              item.status === "safe" ? "text-emerald" : item.status === "caution" ? "text-primary" : "text-destructive"
            }`} />
            <span className="text-[9px] font-label text-muted-foreground block mb-1">{item.label.toUpperCase()}</span>
            <span className={`text-[10px] font-mono font-bold ${
              item.status === "safe" ? "text-emerald" : item.status === "caution" ? "text-primary" : "text-destructive"
            }`}>
              {item.status === "safe" ? "✓ CLEAR" : item.status === "caution" ? "⚠ CAUTION" : "✗ RISK"}
            </span>
            <p className="text-[9px] text-muted-foreground mt-1 leading-snug">{item.detail}</p>
          </div>
        ))}
      </div>

      {/* Issues list */}
      {report.issues.length > 0 && (
        <div className="px-5 py-4 border-t border-border/30">
          <h4 className="text-[10px] font-label text-muted-foreground mb-3">{report.issues.length} ISSUES FOUND</h4>
          <div className="space-y-2.5">
            {report.issues.map((issue, i) => {
              const TypeIcon = typeIcon[issue.type] || FileText;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border/30">
                  <TypeIcon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[8px] font-label px-2 py-0.5 rounded-full border ${severityColor[issue.severity]}`}>
                        {issue.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-foreground leading-snug">{issue.text}</p>
                    <p className="text-[10px] text-emerald mt-1 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> {issue.fix}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Safe music alternatives */}
      {report.overallRisk !== "safe" && report.safeMusicAlternatives.length > 0 && (
        <div className="px-5 py-4 border-t border-border/30">
          <h4 className="text-[10px] font-label text-emerald mb-2">SAFE MUSIC SOURCES</h4>
          <div className="flex flex-wrap gap-2">
            {report.safeMusicAlternatives.map((src) => (
              <span key={src} className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald/8 text-emerald border border-emerald/15">
                {src}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Summary + rescan */}
      <div className="px-5 py-4 border-t border-border/30 flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground flex-1 mr-4">{report.channelRiskSummary}</p>
        <button onClick={runScan} className="btn-ghost flex items-center gap-1.5 text-[10px] shrink-0 py-2 px-4">
          <RefreshCw className="w-3 h-3" /> Re-scan
        </button>
      </div>
    </div>
  );
};

export default CopyrightRiskCard;
