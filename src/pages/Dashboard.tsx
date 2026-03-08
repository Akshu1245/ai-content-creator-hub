import DashboardLayout from "@/components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import { Plus, TrendingUp, Eye, Clock, Shield, Video, ChevronRight, Play, MoreHorizontal } from "lucide-react";
import TiltCard from "@/components/shared/TiltCard";
import AnimatedNumber from "@/components/shared/AnimatedNumber";
import ComplianceGauge from "@/components/dashboard/ComplianceGauge";

const stats = [
  { label: "Total Videos", value: 24, icon: Video, suffix: "", color: "14,165,233" },
  { label: "Total Views", value: 128400, icon: Eye, suffix: "", color: "6,214,160" },
  { label: "Avg Retention", value: 67, icon: Clock, suffix: "%", color: "14,165,233" },
  { label: "Avg Compliance", value: 91, icon: Shield, suffix: "", color: "6,214,160" },
];

const projects = [
  { id: "1", name: "AI Finance Tips", niche: "Finance", videos: 8, status: "Live", compliance: 94, views: "45K", lastVideo: "How Compound Interest Actually Works" },
  { id: "2", name: "Horror Stories", niche: "Horror", videos: 6, status: "Generating", compliance: 87, views: "62K", lastVideo: "The Backrooms — Level 9999" },
  { id: "3", name: "Tech Explained", niche: "Technology", videos: 10, status: "Scheduled", compliance: 92, views: "21K", lastVideo: "Why GPUs Cost So Much in 2026" },
];

const recentActivity = [
  { text: "Video published: 'Compound Interest Explained'", time: "2h ago", color: "#06D6A0" },
  { text: "Compliance check flagged: mild clickbait risk", time: "4h ago", color: "#FFB703" },
  { text: "New trending topic found in Finance niche", time: "6h ago", color: "#0EA5E9" },
  { text: "Horror Stories channel DNA updated", time: "12h ago", color: "#0EA5E9" },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Live": return { bg: "rgba(6,214,160,0.1)", border: "rgba(6,214,160,0.3)", color: "#06D6A0" };
    case "Generating": return { bg: "rgba(14,165,233,0.1)", border: "rgba(14,165,233,0.3)", color: "#0EA5E9" };
    case "Scheduled": return { bg: "rgba(255,183,3,0.1)", border: "rgba(255,183,3,0.3)", color: "#FFB703" };
    default: return { bg: "rgba(42,72,112,0.2)", border: "rgba(42,72,112,0.3)", color: "hsl(210 25% 40%)" };
  }
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Dashboard</h1>
            <p className="text-sm mt-1" style={{ color: "hsl(205 40% 55%)" }}>Your faceless content empire at a glance</p>
          </div>
          <Link to="/new-project">
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Video Project
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <TiltCard key={stat.label} glowColor={stat.color}>
              <div className="glass p-5 glass-hover h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `rgba(${stat.color},0.1)`, border: `1px solid rgba(${stat.color},0.2)` }}>
                    <stat.icon className="w-4 h-4" style={{ color: `rgb(${stat.color})` }} />
                  </div>
                  <TrendingUp className="w-3.5 h-3.5 text-mint" />
                </div>
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-label mt-1" style={{ color: "hsl(210 25% 40%)" }}>{stat.label}</div>
              </div>
            </TiltCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Projects */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-display font-bold">Active Projects</h2>
              <span className="text-xs font-label" style={{ color: "hsl(210 25% 40%)" }}>{projects.length} projects</span>
            </div>

            {projects.map((project) => {
              const statusStyle = getStatusStyle(project.status);
              return (
                <Link key={project.id} to={`/project/${project.id}`}>
                  <TiltCard>
                    <div className="glass p-5 glass-hover cursor-pointer group">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-display font-bold text-base text-foreground group-hover:text-cyan transition-colors">{project.name}</h3>
                          <p className="text-xs font-label" style={{ color: "hsl(210 25% 40%)" }}>{project.niche} • {project.videos} videos</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-display font-bold" style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}`, color: statusStyle.color }}>{project.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate mr-4" style={{ color: "hsl(205 40% 55%)" }}>{project.lastVideo}</span>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="flex items-center gap-1 text-xs font-mono" style={{ color: "hsl(205 40% 55%)" }}>
                            <Eye className="w-3 h-3" /> {project.views}
                          </span>
                          <span className={`font-mono font-bold text-xs ${project.compliance >= 80 ? "text-mint" : "text-amber"}`}>
                            {project.compliance >= 80 ? "🟢" : "🟡"} {project.compliance}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              );
            })}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Activity */}
            <div>
              <h2 className="text-lg font-display font-bold mb-4">Recent Activity</h2>
              <div className="glass p-5 space-y-4">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: item.color }} />
                    <div>
                      <p className="text-sm text-foreground">{item.text}</p>
                      <p className="text-xs font-label mt-0.5" style={{ color: "hsl(210 25% 40%)" }}>{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div>
              <h2 className="text-lg font-display font-bold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { to: "/new-project", icon: Play, label: "Generate New Video", color: "#0EA5E9" },
                  { to: "/analytics", icon: TrendingUp, label: "View Analytics", color: "#06D6A0" },
                ].map((action) => (
                  <Link key={action.to} to={action.to}>
                    <div className="glass p-4 glass-hover flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <action.icon className="w-4 h-4" style={{ color: action.color }} />
                        <span className="text-sm font-medium text-foreground">{action.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4" style={{ color: "hsl(210 25% 40%)" }} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
