import DashboardLayout from "@/components/layout/DashboardLayout";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, TrendingUp, Eye, Clock, Shield, Video, ChevronRight, Play, ArrowUpRight, Trash2 } from "lucide-react";
import AnimatedNumber from "@/components/shared/AnimatedNumber";
import EmptyState from "@/components/shared/EmptyState";
import { SkeletonCard, SkeletonRow } from "@/components/shared/Skeletons";
import YPPTrackerCard from "@/components/differentiators/YPPTrackerCard";
import RevenueCommandCenter from "@/components/differentiators/RevenueCommandCenter";
import OnboardingTips from "@/components/dashboard/OnboardingTips";
import WhatsNewModal from "@/components/dashboard/WhatsNewModal";
import { useAuth } from "@/contexts/AuthContext";

import usePageTitle from "@/hooks/usePageTitle";
import { fetchProjects, deleteProject, type Project } from "@/lib/projects";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

const getStatusStyle = (status: string) => {
  switch (status) {
    case "complete": return "text-emerald bg-emerald/10 border-emerald/20";
    case "generating": return "text-primary bg-primary/10 border-primary/20";
    case "draft": return "text-accent bg-accent/10 border-accent/20";
    default: return "text-muted-foreground bg-secondary border-border";
  }
};

const Dashboard = () => {
  const { user, checkSubscription } = useAuth();
  usePageTitle("Dashboard");
  const queryClient = useQueryClient();
  const welcomeShown = useRef(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle checkout success redirect
  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast.success("Subscription activated! 🎉");
      checkSubscription();
      setSearchParams({});
    }
  }, [searchParams, checkSubscription, setSearchParams]);

  // Welcome toast on first visit
  useEffect(() => {
    if (user && !welcomeShown.current) {
      welcomeShown.current = true;
      const name = user.user_metadata?.full_name;
      const isNew = !localStorage.getItem("ff-returning-user");
      if (isNew) {
        localStorage.setItem("ff-returning-user", "1");
        toast.success(`Welcome to FacelessForge${name ? `, ${name}` : ""}! 🔥`, {
          description: "Create your first AI-powered video in minutes.",
        });
      } else {
        toast(`Welcome back${name ? `, ${name}` : ""}! 👋`);
      }
    }
  }, [user]);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
  });

  const completedCount = projects.filter((p) => p.status === "complete").length;
  const draftCount = projects.filter((p) => p.status === "draft").length;

  const stats = [
    { label: "Total Projects", value: projects.length, icon: Video, suffix: "", trend: `${draftCount} drafts` },
    { label: "Completed", value: completedCount, icon: Eye, suffix: "", trend: "Videos ready" },
    { label: "This Week", value: projects.filter((p) => new Date(p.created_at) > new Date(Date.now() - 7 * 86400000)).length, icon: Clock, suffix: "", trend: "New projects" },
    { label: "With Video", value: projects.filter((p) => p.video_url).length, icon: Shield, suffix: "", trend: "Generated" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* What's New Modal */}
        <WhatsNewModal />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-2xl font-display text-foreground font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}.
            </p>
          </div>
          <Link to="/new-project">
            <button className="btn-primary flex items-center gap-2 text-xs">
              <Plus className="w-3.5 h-3.5" /> Create Video
            </button>
          </Link>
        </div>

        {/* Onboarding Tips (first visit only) */}
        <OnboardingTips />

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

        {/* Revenue Center */}
        <div className="mb-10">
          <RevenueCommandCenter />
        </div>

        {/* YPP + Projects */}
        <div className="grid lg:grid-cols-12 gap-6 mb-10">
          <div className="lg:col-span-5">
            <YPPTrackerCard />
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display text-foreground font-bold">Your Projects</h2>
              <span className="text-[10px] font-label text-muted-foreground">{projects.length} PROJECTS</span>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <EmptyState />
            ) : (
              projects.slice(0, 10).map((project) => (
                <div key={project.id} className="surface-raised p-5 surface-hover group relative">
                  <Link to={`/project/${project.id}`} className="block">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                          <span className="text-xs font-display text-muted-foreground">{(project.niche || "??").slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                          <h3 className="font-display text-sm text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                          <p className="text-[10px] font-label text-muted-foreground mt-0.5">
                            {project.niche || "No niche"} · {project.style || "default"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-label font-semibold border ${getStatusStyle(project.status)}`}>
                          {project.status.toUpperCase()}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="pl-[52px]">
                      <span className="text-xs text-muted-foreground">{project.topic || "Untitled topic"}</span>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(project.id); }}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-6">
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

          {/* Recent Activity */}
          <div>
            <h2 className="text-sm font-display text-foreground font-bold mb-3">Recent Activity</h2>
            <div className="surface-raised p-5 space-y-4">
              {projects.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-start gap-3">
                  <div className={`status-dot mt-1.5 shrink-0 ${p.status === "complete" ? "bg-emerald" : p.status === "generating" ? "bg-primary" : "bg-accent"}`} />
                  <div className="min-w-0">
                    <p className="text-xs text-foreground leading-snug">{p.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(p.updated_at).toLocaleDateString()} · {p.status}
                    </p>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">No activity yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
