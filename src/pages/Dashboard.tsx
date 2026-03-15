import DashboardLayout from "@/components/layout/DashboardLayout";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, TrendingUp, Eye, Clock, Shield, Video, ChevronRight, Play, ArrowUpRight, Trash2, BarChart3, X } from "lucide-react";
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
import { getComplianceModelInfo } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

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
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(!localStorage.getItem("vorax-banner-dismissed"));
  const [modelStatus, setModelStatus] = useState<{ model_loaded: boolean; model: string } | null>(null);

  // Fetch model status on mount
  useEffect(() => {
    getComplianceModelInfo()
      .then(setModelStatus)
      .catch(() => setModelStatus(null));
  }, []);

  useEffect(() => { setMounted(true); }, []);
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
        toast.success(`Welcome to VORAX${name ? `, ${name}` : ""}! 🔥`, {
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

        {/* What's New Banner */}
        {showBanner && (
          <div className="flex items-center justify-between bg-primary/8 border border-primary/20 rounded-xl px-4 py-3 mb-6 text-sm">
            <span className="text-foreground">🔥 New: Voice cloning now supports 8 Indian languages</span>
            <button onClick={() => { localStorage.setItem("vorax-banner-dismissed", "1"); setShowBanner(false); }} className="text-muted-foreground hover:text-foreground ml-4">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* AI Model Status */}
        {modelStatus && (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-xs mb-6 ${modelStatus.model_loaded ? "bg-emerald-500/8 border-emerald-500/20" : "bg-amber-500/8 border-amber-500/20"}`}>
            <div className={`w-2 h-2 rounded-full ${modelStatus.model_loaded ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            <span className={modelStatus.model_loaded ? "text-emerald-400" : "text-amber-400"}>
              {modelStatus.model_loaded ? "VORAX AI Model Active — 99.98% accuracy" : "AI Model not loaded — using fallback"}
            </span>
            {!modelStatus.model_loaded && (
              <span className="text-muted-foreground ml-auto">Check backend is running</span>
            )}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <span className="font-label text-primary tracking-widest text-[10px]">CONTROL CENTER</span>
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
            <div key={stat.label} className="surface-raised p-5 surface-hover border border-border/45 group cursor-pointer hover:border-primary/40 transition-all duration-300" style={{
              animation: mounted ? `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)` : "none",
              animationDelay: `${0.3 + (i * 0.08)}s`,
              animationFillMode: "both",
            }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                  <stat.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[10px] font-label text-emerald">{stat.trend}</span>
              </div>
              <div className="text-2xl font-display text-foreground font-bold">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] font-label text-muted-foreground mt-1 group-hover:text-muted-foreground/80 transition-colors">{stat.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link to="/new-project">
            <button className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2">
              <Plus className="w-3.5 h-3.5" /> New Video
            </button>
          </Link>
          <Link to="/analytics">
            <button className="btn-ghost text-xs px-5 py-2.5 flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" /> Analytics
            </button>
          </Link>
          <Link to="/new-project">
            <button className="btn-ghost text-xs px-5 py-2.5 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" /> Check Compliance
            </button>
          </Link>
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
              projects.slice(0, 10).map((project, index) => (
                <div key={project.id} className="surface-raised p-5 surface-hover group relative border border-border/45 overflow-hidden hover:border-primary/40 hover:shadow-[0_0_20px_hsl(199_89%_48%_/_0.08)] transition-all duration-300" style={{
                  animation: mounted ? `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)` : "none",
                  animationDelay: `${0.5 + (index * 0.08)}s`,
                  animationFillMode: "both",
                }}>
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Link to={`/project/${project.id}`} className="block">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors duration-300">
                          <Play className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
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
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </div>
                    <div className="pl-[52px]">
                      <span className="text-xs text-muted-foreground">{project.topic || "Untitled topic"}</span>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(project.id); }}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all hover:scale-110"
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
          <div style={{
            animation: mounted ? "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
            animationDelay: "1s",
            animationFillMode: "both",
          }}>
            <h2 className="text-sm font-display text-foreground font-bold mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { to: "/new-project", icon: Play, label: "Generate New Video", desc: "Create from scratch" },
                { to: "/analytics", icon: TrendingUp, label: "View Analytics", desc: "Performance data" },
              ].map((action, i) => (
                  <Link key={action.to} to={action.to}>
                  <div className="surface-raised p-4 surface-hover flex items-center gap-3 cursor-pointer border border-border/45 hover:border-primary/40 hover:shadow-[0_0_16px_hsl(199_89%_48%_/_0.08)] transition-all duration-300" style={{
                    animation: mounted ? "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                    animationDelay: `${1.1 + (i * 0.08)}s`,
                    animationFillMode: "both",
                  }}>
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 hover:bg-primary/20 transition-colors duration-300">
                      <action.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-foreground block">{action.label}</span>
                      <span className="text-[10px] text-muted-foreground">{action.desc}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            animation: mounted ? "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
            animationDelay: "1.1s",
            animationFillMode: "both",
          }}>
            <h2 className="text-sm font-display text-foreground font-bold mb-3">Recent Activity</h2>
            <div className="surface-raised p-5 space-y-4 border border-border/45 hover:border-primary/40 transition-colors duration-300" style={{
              animation: "glowPulse 4s ease-in-out infinite",
            }}>
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
