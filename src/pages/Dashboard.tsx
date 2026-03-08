import DashboardLayout from "@/components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import { Plus, TrendingUp, Eye, Clock, Shield, Video, ChevronRight, Play, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Total Videos", value: "24", icon: Video, change: "+3 this week" },
  { label: "Total Views", value: "128K", icon: Eye, change: "+12% vs last week" },
  { label: "Avg Retention", value: "67%", icon: Clock, change: "+5% improvement" },
  { label: "Avg Compliance", value: "91", icon: Shield, change: "All safe" },
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
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Live": return "bg-primary/15 text-primary";
    case "Generating": return "bg-accent/15 text-accent";
    case "Scheduled": return "bg-info/15 text-info";
    default: return "bg-secondary text-muted-foreground";
  }
};

const getComplianceBadge = (score: number) => {
  if (score >= 80) return { color: "text-primary", bg: "bg-primary/10", emoji: "🟢" };
  if (score >= 60) return { color: "text-warning", bg: "bg-warning/10", emoji: "🟡" };
  return { color: "text-danger", bg: "bg-danger/10", emoji: "🔴" };
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Your faceless content empire at a glance</p>
          </div>
          <Link to="/new-project">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> New Video Project
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 glass-hover">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-5 h-5 text-muted-foreground" />
                <TrendingUp className="w-3 h-3 text-primary" />
              </div>
              <div className="text-2xl font-bold font-mono">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              <div className="text-xs text-primary mt-1">{stat.change}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Projects */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active Projects</h2>
              <span className="text-sm text-muted-foreground">{projects.length} projects</span>
            </div>
            
            {projects.map((project) => {
              const badge = getComplianceBadge(project.compliance);
              return (
                <Link key={project.id} to={`/project/${project.id}`}>
                  <div className="glass rounded-xl p-5 glass-hover cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{project.name}</h3>
                        <p className="text-xs text-muted-foreground">{project.niche} • {project.videos} videos</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>{project.status}</span>
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground truncate mr-4">{project.lastVideo}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="w-3 h-3" /> {project.views}
                        </span>
                        <span className={`flex items-center gap-1 text-xs font-mono font-bold ${badge.color}`}>
                          {badge.emoji} {project.compliance}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Activity */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="glass rounded-xl p-4 space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    item.type === "success" ? "bg-primary" : 
                    item.type === "warning" ? "bg-warning" : "bg-info"
                  }`} />
                  <div>
                    <p className="text-sm">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <h2 className="text-lg font-semibold mt-6 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/new-project">
                <div className="glass rounded-xl p-4 glass-hover flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Play className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Generate New Video</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
              <Link to="/analytics">
                <div className="glass rounded-xl p-4 glass-hover flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-info" />
                    <span className="text-sm font-medium">View Analytics</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
