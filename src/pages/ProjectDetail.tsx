import DashboardLayout from "@/components/layout/DashboardLayout";
import { ChevronRight, Brain, Sparkles, Download, Play } from "lucide-react";
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
  const handleDownload = (videoTitle: string) => {
    alert(`Download starting for: "${videoTitle}.mp4"\n\nIn production, this would download the video file from storage.`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-xs mb-6 text-muted-foreground">
          <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">AI Finance Tips</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-2xl font-display text-foreground font-bold tracking-tight">AI Finance Tips</h1>
            <p className="text-xs text-muted-foreground mt-1">Finance · 8 videos · Channel since Jan 2026</p>
          </div>
          <Link to="/new-project">
            <button className="btn-primary flex items-center gap-2 text-xs">
              <Sparkles className="w-3.5 h-3.5" /> New Video
            </button>
          </Link>
        </div>

        {/* Channel DNA */}
        <div className="surface-raised p-6 mb-8">
          <h2 className="text-sm font-display text-foreground font-bold mb-6 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> Channel DNA
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <span className="text-[10px] font-label text-muted-foreground block mb-2">PERSONA</span>
              <span className="text-xs text-foreground">{channelDna.persona}</span>
            </div>
            <div>
              <span className="text-[10px] font-label text-muted-foreground block mb-2">VOCABULARY</span>
              <span className="text-xs text-foreground">{channelDna.vocabulary}</span>
            </div>
            <div>
              <span className="text-[10px] font-label text-muted-foreground block mb-2">RECURRING PHRASES</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {channelDna.recurringPhrases.map((p) => (
                  <span key={p} className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-primary/8 text-primary border border-primary/15">"{p}"</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <ComplianceGauge score={channelDna.avgCompliance} size={90} label="AVG SCORE" />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border/50">
            <span className="text-[10px] font-label text-muted-foreground block mb-2">BANNED WORDS</span>
            <div className="flex flex-wrap gap-1.5">
              {channelDna.bannedWords.map((w) => (
                <span key={w} className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-destructive/10 text-destructive border border-destructive/15">{w}</span>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-sm font-display text-foreground font-bold mb-4">Videos</h2>
        <div className="surface-raised overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {["Title", "Status", "Score", "Views", "Retention", "CTR", "Date", ""].map((h) => (
                  <th key={h} className={`px-5 py-4 text-[10px] font-label text-muted-foreground ${h === "Title" ? "text-left" : "text-center"}`}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v.id} className="border-b border-border/50 last:border-b-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-4 font-medium text-foreground">{v.title}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-label font-semibold ${
                      v.status === "Published" ? "bg-emerald/10 text-emerald border border-emerald/20" : "bg-primary/10 text-primary border border-primary/20"
                    }`}>{v.status.toUpperCase()}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`font-mono font-bold ${v.compliance >= 80 ? "text-emerald" : "text-primary"}`}>{v.compliance}</span>
                  </td>
                  <td className="px-5 py-4 text-center font-mono text-muted-foreground">{v.views}</td>
                  <td className="px-5 py-4 text-center font-mono text-muted-foreground">{v.retention}</td>
                  <td className="px-5 py-4 text-center font-mono text-muted-foreground">{v.ctr}</td>
                  <td className="px-5 py-4 text-center text-[10px] font-label text-muted-foreground">{v.date.toUpperCase()}</td>
                  <td className="px-5 py-4 text-center">
                    {v.status === "Published" && (
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => handleDownload(v.title)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="Download">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => alert(`Playing: "${v.title}"`)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="Preview">
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetail;
