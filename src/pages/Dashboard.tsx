import DashboardLayout from "@/components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import { Plus, TrendingUp, Eye, Clock, Shield, Video, ChevronRight, Play, ArrowUpRight } from "lucide-react";
import AnimatedNumber from "@/components/shared/AnimatedNumber";
import YPPTrackerCard from "@/components/differentiators/YPPTrackerCard";
import RevenueCommandCenter from "@/components/differentiators/RevenueCommandCenter";

const stats = [
  { label: "Total Videos", value: 24, icon: Video, suffix: "", trend: "+3 this week" },
  { label: "Total Views", value: 128400, icon: Eye, suffix: "", trend: "+12.3%" },
  { label: "Avg Retention", value: 67, icon: Clock, suffix: "%", trend: "+4.2%" },
  { label: "Compliance Score", value: 91, icon: Shield, suffix: "", trend: "Excellent" },
];

const projects = [
  { id: "1", name: "AI Finance Tips", niche: "Finance", videos: 8, status: "Live", compliance: 94, views: "45K", lastVideo: "How Compound Interest Actually Works" },
  { id: "2", name: "Horror Stories", niche: "Horror", videos: 6, status: "Generating", compliance: 87, views: "62K", lastVideo: "The Backrooms — Level 9999" },
  { id: "3", name: "Tech Explained", niche: "Technology", videos: 10, status: "Scheduled", compliance: 92, views: "21K", lastVideo: "Why GPUs Cost So Much in 2026" },
];

const recentActivity = [
  { text: "Video published: 'Compound Interest Explained'", time: "2h ago", type: "success" },
  { text: "Compliance check flagged: mild clickbait risk", time: "4h ago", type: "warning" },
  { text: "New trending topic found in Finance niche", time: "6h ago", type: "info" },
  { text: "Horror Stories channel DNA updated", time: "12h ago", type: "info" },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Live": return "text-emerald bg-emerald/10 border-emerald/20";
    case "Generating": return "text-primary bg-primary/10 border-primary/20";
    case "Scheduled": return "text-accent bg-accent/10 border-accent/20";
    default: return "text-muted-foreground bg-secondary border-border";
  }
};

const getActivityDot = (type: string) => {
  switch (type) {
    case "success": return "bg-emerald";
    case "warning": return "bg-primary";
    default: return "bg-accent";
  }
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-2xl font-display text-foreground font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Welcome back. Here's your overview.</p>
          </div>
          <Link to="/new-project">
            <button className="btn-primary flex items-center gap-2 text-xs">
              <Plus className="w-3.5 h-3.5" /> Create Video
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <div key={stat.label} className="surface-raised p-5 surface-hover" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-[10px] font-label text-emerald">{stat.trend}</span>
              </div>
              <div className="text-2xl font-display text-foreground font-bold">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] font-label text-muted-foreground mt-1">{stat.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* ═══ REVENUE COMMAND CENTER — the emotional centerpiece ═══ */}
        <div className="mb-10">
          <RevenueCommandCenter />
        </div>

        {/* YPP Tracker + Projects */}
        <div className="grid lg:grid-cols-12 gap-6 mb-10">
          {/* YPP Tracker */}
          <div className="lg:col-span-5">
            <YPPTrackerCard />
          </div>

          {/* Projects */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display text-foreground font-bold">Active Projects</h2>
              <span className="text-[10px] font-label text-muted-foreground">{projects.length} PROJECTS</span>
            </div>

            {projects.map((project) => (
              <Link key={project.id} to={`/project/${project.id}`}>
                <div className="surface-raised p-5 surface-hover cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                        <span className="text-xs font-display text-muted-foreground">{project.niche.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 className="font-display text-sm text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
                        <p className="text-[10px] font-label text-muted-foreground mt-0.5">{project.niche} · {project.videos} VIDEOS</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-label font-semibold border ${getStatusStyle(project.status)}`}>{project.status.toUpperCase()}</span>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pl-[52px]">
                    <span className="text-muted-foreground truncate mr-4 text-xs">{project.lastVideo}</span>
                    <div className="flex items-center gap-5 shrink-0 text-xs">
                      <span className="flex items-center gap-1.5 font-mono text-muted-foreground">
                        <Eye className="w-3 h-3" /> {project.views}
                      </span>
                      <span className={`font-mono font-bold ${project.compliance >= 80 ? "text-emerald" : "text-primary"}`}>
                        {project.compliance}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom row — Quick Actions + Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick actions */}
          <div>
            <h2 className="text-sm font-display text-foreground font-bold mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { to: "/new-project", icon: Play, label: "Generate New Video", desc: "Create from scratch" },
                { to: "/analytics", icon: TrendingUp, label: "View Analytics", desc: "Performance data" },
              ].map((action) => (
                <Link key={action.to} to={action.to}>
                  <div className="surface-raised p-4 surface-hover flex items-center gap-3 cursor-pointer">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <action.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-foreground block">{action.label}</span>
                      <span className="text-[10px] text-muted-foreground">{action.desc}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div>
            <h2 className="text-sm font-display text-foreground font-bold mb-3">Recent Activity</h2>
            <div className="surface-raised p-5 space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`status-dot mt-1.5 shrink-0 ${getActivityDot(item.type)}`} />
                  <div className="min-w-0">
                    <p className="text-xs text-foreground leading-snug">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
