import DashboardLayout from "@/components/layout/DashboardLayout";
import { Shield, Eye, Clock, TrendingUp, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const videos = [
  { id: "v1", title: "How Compound Interest Actually Works", status: "Published", compliance: 94, views: "12.4K", retention: "68%", ctr: "8.2%", date: "Mar 5" },
  { id: "v2", title: "The Backrooms — Level 9999", status: "Published", compliance: 87, views: "28.1K", retention: "72%", ctr: "11.4%", date: "Mar 3" },
  { id: "v3", title: "Why GPUs Cost So Much in 2026", status: "Scheduled", compliance: 92, views: "—", retention: "—", ctr: "—", date: "Mar 10" },
];

const ProjectDetail = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">AI Finance Tips</span>
        </div>

        <h1 className="text-2xl font-bold mb-2">AI Finance Tips</h1>
        <p className="text-muted-foreground text-sm mb-8">Finance • 8 videos • Channel since Jan 2026</p>

        {/* Channel DNA */}
        <div className="glass rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Channel DNA</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block mb-1">Persona</span>
              <span className="font-medium">Calm, educational narrator</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Vocabulary Level</span>
              <span className="font-medium">Intermediate</span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Recurring Phrases</span>
              <span className="font-mono text-xs text-primary">"here's what most people miss"</span>
            </div>
          </div>
        </div>

        {/* Videos table */}
        <h2 className="text-lg font-semibold mb-4">Videos</h2>
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Title</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">Compliance</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">Views</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">Retention</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">CTR</th>
                  <th className="text-center px-4 py-3 text-muted-foreground font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((v) => (
                  <tr key={v.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{v.title}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${v.status === "Published" ? "bg-primary/15 text-primary" : "bg-info/15 text-info"}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-mono font-bold ${v.compliance >= 80 ? "text-primary" : "text-warning"}`}>
                        {v.compliance}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{v.views}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{v.retention}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{v.ctr}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{v.date}</td>
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
