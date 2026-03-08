import DashboardLayout from "@/components/layout/DashboardLayout";
import { Shield, Eye, Clock, ChevronRight, Brain, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import ComplianceGauge from "@/components/dashboard/ComplianceGauge";

const videos = [
  { id: "v1", title: "How Compound Interest Actually Works", status: "Published", compliance: 94, views: "12.4K", retention: "68%", ctr: "8.2%", date: "Mar 5" },
  { id: "v2", title: "The Backrooms — Level 9999", status: "Published", compliance: 87, views: "28.1K", retention: "72%", ctr: "11.4%", date: "Mar 3" },
  { id: "v3", title: "Why GPUs Cost So Much in 2026", status: "Scheduled", compliance: 92, views: "—", retention: "—", ctr: "—", date: "Mar 10" },
];

const channelDna = {
  persona: "Calm, educational narrator",
  vocabulary: "Intermediate",
  recurringPhrases: ["here's what most people miss", "let's break this down"],
  bannedWords: ["amazing", "incredible", "mind-blowing"],
  avgCompliance: 91,
};

const ProjectDetail = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm mb-6" style={{ color: "hsl(210 25% 40%)" }}>
          <Link to="/dashboard" className="hover:text-foreground transition-colors font-label">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-display font-bold">AI Finance Tips</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">AI Finance Tips</h1>
            <p className="text-sm mt-1 font-label" style={{ color: "hsl(210 25% 40%)" }}>Finance • 8 videos • Channel since Jan 2026</p>
          </div>
          <Link to="/new-project">
            <button className="btn-primary flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4" /> New Video
            </button>
          </Link>
        </div>

        {/* Channel DNA */}
        <div className="glass-elevated p-6 mb-8">
          <h2 className="text-lg font-display font-bold mb-5 flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan" /> Channel DNA
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <span className="font-label text-xs block mb-1" style={{ color: "hsl(210 25% 40%)" }}>Persona</span>
              <span className="text-sm font-medium text-foreground">{channelDna.persona}</span>
            </div>
            <div>
              <span className="font-label text-xs block mb-1" style={{ color: "hsl(210 25% 40%)" }}>Vocabulary</span>
              <span className="text-sm font-medium text-foreground">{channelDna.vocabulary}</span>
            </div>
            <div>
              <span className="font-label text-xs block mb-1" style={{ color: "hsl(210 25% 40%)" }}>Recurring Phrases</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {channelDna.recurringPhrases.map((p) => (
                  <span key={p} className="px-2 py-1 rounded text-xs font-mono" style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)", color: "#0EA5E9" }}>
                    "{p}"
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <ComplianceGauge score={channelDna.avgCompliance} size={100} label="Avg Score" />
            </div>
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(42,72,112,0.2)" }}>
            <span className="font-label text-xs block mb-2" style={{ color: "hsl(210 25% 40%)" }}>Banned Words</span>
            <div className="flex flex-wrap gap-1">
              {channelDna.bannedWords.map((w) => (
                <span key={w} className="px-2 py-1 rounded text-xs font-mono" style={{ background: "rgba(255,67,101,0.08)", border: "1px solid rgba(255,67,101,0.2)", color: "#FF4365" }}>
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Videos table */}
        <h2 className="text-lg font-display font-bold mb-4">Videos</h2>
        <div className="glass-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(42,72,112,0.3)" }}>
                  {["Title", "Status", "Compliance", "Views", "Retention", "CTR", "Date"].map((h) => (
                    <th key={h} className={`px-5 py-3 font-label text-xs ${h === "Title" ? "text-left" : "text-center"}`} style={{ color: "hsl(210 25% 40%)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {videos.map((v) => (
                  <tr key={v.id} className="transition-colors hover:bg-muted/20" style={{ borderBottom: "1px solid rgba(42,72,112,0.15)" }}>
                    <td className="px-5 py-3.5 font-medium text-foreground">{v.title}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-display font-bold" style={{
                        background: v.status === "Published" ? "rgba(6,214,160,0.1)" : "rgba(255,183,3,0.1)",
                        border: `1px solid ${v.status === "Published" ? "rgba(6,214,160,0.3)" : "rgba(255,183,3,0.3)"}`,
                        color: v.status === "Published" ? "#06D6A0" : "#FFB703",
                      }}>{v.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`font-mono font-bold ${v.compliance >= 80 ? "text-mint" : "text-amber"}`}>{v.compliance}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono" style={{ color: "hsl(205 40% 55%)" }}>{v.views}</td>
                    <td className="px-5 py-3.5 text-center font-mono" style={{ color: "hsl(205 40% 55%)" }}>{v.retention}</td>
                    <td className="px-5 py-3.5 text-center font-mono" style={{ color: "hsl(205 40% 55%)" }}>{v.ctr}</td>
                    <td className="px-5 py-3.5 text-center font-label text-xs" style={{ color: "hsl(210 25% 40%)" }}>{v.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetail;
