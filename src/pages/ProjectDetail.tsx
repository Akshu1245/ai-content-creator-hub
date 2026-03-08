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
          <span className="text-foreground font-medium">AI Finance Tips</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="font-label text-muted-foreground block mb-1">PROJECT</span>
            <h1 className="text-2xl font-display text-foreground">AI Finance Tips</h1>
            <p className="text-sm text-muted-foreground mt-1">Finance · 8 videos · Channel since Jan 2026</p>
          </div>
          <Link to="/new-project">
            <button className="btn-primary flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4" /> New Video
            </button>
          </Link>
        </div>

        {/* Channel DNA */}
        <div className="surface-raised p-6 mb-6">
          <h2 className="text-lg font-display text-foreground mb-5 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> Channel DNA
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <span className="font-label text-muted-foreground block mb-1.5">PERSONA</span>
              <span className="text-sm text-foreground">{channelDna.persona}</span>
            </div>
            <div>
              <span className="font-label text-muted-foreground block mb-1.5">VOCABULARY</span>
              <span className="text-sm text-foreground">{channelDna.vocabulary}</span>
            </div>
            <div>
              <span className="font-label text-muted-foreground block mb-1.5">RECURRING PHRASES</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {channelDna.recurringPhrases.map((p) => (
                  <span key={p} className="px-2.5 py-1 rounded-full text-xs font-mono bg-primary/8 text-primary border border-primary/15">"{p}"</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <ComplianceGauge score={channelDna.avgCompliance} size={90} label="AVG SCORE" />
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-border">
            <span className="font-label text-muted-foreground block mb-2">BANNED WORDS</span>
            <div className="flex flex-wrap gap-1.5">
              {channelDna.bannedWords.map((w) => (
                <span key={w} className="px-2.5 py-1 rounded-full text-xs font-mono bg-destructive/8 text-destructive border border-destructive/15">{w}</span>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-lg font-display text-foreground mb-3">Videos</h2>
        <div className="surface-raised overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Title", "Status", "Compliance", "Views", "Retention", "CTR", "Date"].map((h) => (
                  <th key={h} className={`px-5 py-3.5 text-[11px] font-label text-muted-foreground ${h === "Title" ? "text-left" : "text-center"}`}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v.id} className="border-b border-border last:border-b-0 hover:bg-secondary/40 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-foreground">{v.title}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      v.status === "Published" ? "bg-primary/8 text-primary border border-primary/15" : "bg-golden/8 text-golden border border-golden/15"
                    }`}>{v.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`font-mono font-semibold ${v.compliance >= 80 ? "text-primary" : "text-accent"}`}>{v.compliance}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center font-mono text-muted-foreground">{v.views}</td>
                  <td className="px-5 py-3.5 text-center font-mono text-muted-foreground">{v.retention}</td>
                  <td className="px-5 py-3.5 text-center font-mono text-muted-foreground">{v.ctr}</td>
                  <td className="px-5 py-3.5 text-center text-[11px] font-label text-muted-foreground">{v.date.toUpperCase()}</td>
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
