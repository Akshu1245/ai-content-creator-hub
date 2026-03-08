import DashboardLayout from "@/components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import { Plus, TrendingUp, Eye, Clock, Shield, Video, ChevronRight, Play } from "lucide-react";
import AnimatedNumber from "@/components/shared/AnimatedNumber";

const stats = [
  { label: "Total Videos", value: 24, icon: Video, suffix: "" },
  { label: "Total Views", value: 128400, icon: Eye, suffix: "" },
  { label: "Avg Retention", value: 67, icon: Clock, suffix: "%" },
  { label: "Avg Compliance", value: 91, icon: Shield, suffix: "" },
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Live": return "text-accent bg-accent/10 border-accent/20";
    case "Generating": return "text-primary bg-primary/10 border-primary/20";
    case "Scheduled": return "text-golden bg-golden/10 border-golden/20";
    default: return "text-muted-foreground bg-secondary border-border";
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "success": return "bg-accent";
    case "warning": return "bg-golden";
    default: return "bg-primary";
  }
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Your content overview</p>
          </div>
          <Link to="/new-project">
            <button className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> New Video
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="surface p-5 surface-hover">
              <div className="flex items-center gap-2 mb-3">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-label text-muted-foreground">{stat.label.toUpperCase()}</span>
              </div>
              <div className="text-2xl font-display font-bold text-foreground">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Projects */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-display font-semibold text-foreground">Active Projects</h2>
              <span className="text-xs font-label text-muted-foreground">{projects.length} PROJECTS</span>
            </div>

            {projects.map((project) => (
              <Link key={project.id} to={`/project/${project.id}`}>
                <div className="surface p-4 surface-hover cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
                      <p className="text-xs text-muted-foreground">{project.niche} · {project.videos} videos</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(project.status)}`}>{project.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate mr-4 text-xs">{project.lastVideo}</span>
                    <div className="flex items-center gap-4 shrink-0 text-xs">
                      <span className="flex items-center gap-1 font-mono text-muted-foreground">
                        <Eye className="w-3 h-3" /> {project.views}
                      </span>
                      <span className={`font-mono font-semibold ${project.compliance >= 80 ? "text-accent" : "text-golden"}`}>
                        {project.compliance}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-display font-semibold text-foreground mb-3">Recent Activity</h2>
              <div className="surface p-4 space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`status-dot mt-1.5 shrink-0 ${getActivityColor(item.type)}`} />
                    <div>
                      <p className="text-sm text-foreground">{item.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-base font-display font-semibold text-foreground mb-3">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { to: "/new-project", icon: Play, label: "Generate New Video" },
                  { to: "/analytics", icon: TrendingUp, label: "View Analytics" },
                ].map((action) => (
                  <Link key={action.to} to={action.to}>
                    <div className="surface p-3.5 surface-hover flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <action.icon className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">{action.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
