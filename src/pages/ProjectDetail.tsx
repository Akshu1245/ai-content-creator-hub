import DashboardLayout from "@/components/layout/DashboardLayout";
import { ChevronRight, Brain, Sparkles } from "lucide-react";
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
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-sm mb-5 text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-semibold">AI Finance Tips</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">AI Finance Tips</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Finance · 8 videos · Channel since Jan 2026</p>
          </div>
          <Link to="/new-project">
            <button className="btn-primary flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4" /> New Video
            </button>
          </Link>
        </div>

        {/* Channel DNA */}
        <div className="surface-raised p-5 mb-6">
          <h2 className="text-sm font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> Channel DNA
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <span className="font-label text-muted-foreground block mb-1">PERSONA</span>
              <span className="text-sm text-foreground">{channelDna.persona}</span>
            </div>
            <div>
              <span className="font-label text-muted-foreground block mb-1">VOCABULARY</span>
              <span className="text-sm text-foreground">{channelDna.vocabulary}</span>
            </div>
            <div>
              <span className="font-label text-muted-foreground block mb-1">RECURRING PHRASES</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {channelDna.recurringPhrases.map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded text-xs font-mono bg-primary/10 text-primary border border-primary/20">"{p}"</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <ComplianceGauge score={channelDna.avgCompliance} size={90} label="AVG SCORE" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <span className="font-label text-muted-foreground block mb-1.5">BANNED WORDS</span>
            <div className="flex flex-wrap gap-1">
              {channelDna.bannedWords.map((w) => (
                <span key={w} className="px-2 py-0.5 rounded text-xs font-mono bg-destructive/10 text-destructive border border-destructive/20">{w}</span>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-sm font-display font-semibold text-foreground mb-3">Videos</h2>
        <div className="surface-raised overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Title", "Status", "Compliance", "Views", "Retention", "CTR", "Date"].map((h) => (
                  <th key={h} className={`px-4 py-3 font-label text-muted-foreground ${h === "Title" ? "text-left" : "text-center"}`}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v.id} className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{v.title}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      v.status === "Published" ? "bg-accent/10 text-accent border border-accent/20" : "bg-golden/10 text-golden border border-golden/20"
                    }`}>{v.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-mono font-semibold ${v.compliance >= 80 ? "text-accent" : "text-golden"}`}>{v.compliance}</span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-muted-foreground">{v.views}</td>
                  <td className="px-4 py-3 text-center font-mono text-muted-foreground">{v.retention}</td>
                  <td className="px-4 py-3 text-center font-mono text-muted-foreground">{v.ctr}</td>
                  <td className="px-4 py-3 text-center font-label text-muted-foreground">{v.date.toUpperCase()}</td>
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
