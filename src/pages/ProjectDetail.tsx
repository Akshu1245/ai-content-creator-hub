import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ChevronRight, Sparkles, Download, Play, Loader2, Pencil, Calendar, Trash2, Merge } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchProject, deleteProject, fetchScheduledPosts, type Project } from "@/lib/projects";
import { toast } from "sonner";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetchProject(id),
      fetchScheduledPosts(id),
    ]).then(([p, posts]) => {
      setProject(p);
      setScheduledPosts(posts || []);
    }).catch((e) => {
      toast.error("Failed to load project");
      console.error(e);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Delete this project?")) return;
    await deleteProject(id);
    toast.success("Project deleted");
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-20">
          <h1 className="text-xl font-display text-foreground font-bold mb-2">Project not found</h1>
          <p className="text-sm text-muted-foreground mb-4">This project may have been deleted.</p>
          <Link to="/dashboard"><button className="btn-primary text-xs">Back to Dashboard</button></Link>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "complete": return "text-emerald bg-emerald/10 border-emerald/20";
      case "generating": return "text-primary bg-primary/10 border-primary/20";
      case "failed": return "text-destructive bg-destructive/10 border-destructive/20";
      default: return "text-accent bg-accent/10 border-accent/20";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-6 text-muted-foreground">
          <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{project.title}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <span className="font-label text-primary tracking-widest text-[10px]">PROJECT INSPECTOR</span>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-display text-foreground font-bold tracking-tight">{project.title}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-label font-semibold border ${getStatusStyle(project.status)}`}>
                {project.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {project.niche} · {project.style} · Created {new Date(project.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/new-project">
              <button className="btn-primary flex items-center gap-2 text-xs">
                <Sparkles className="w-3.5 h-3.5" /> New Video
              </button>
            </Link>
            <button onClick={handleDelete} className="btn-ghost text-xs text-destructive flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Video preview */}
          <div className="surface-raised overflow-hidden rounded-xl border border-border/45">
            {project.video_url ? (
              <video controls className="w-full aspect-video bg-secondary" src={project.video_url} />
            ) : (
              <div className="aspect-video bg-secondary flex items-center justify-center">
                <p className="text-xs text-muted-foreground">No video generated yet</p>
              </div>
            )}
            {project.video_url && (
              <div className="p-4 flex flex-wrap gap-2">
                <button onClick={() => window.open(project.video_url!, '_blank')} className="btn-primary text-[10px] flex items-center gap-1.5">
                  <Download className="w-3 h-3" /> Download
                </button>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="surface-raised p-5 rounded-xl border border-border/45">
              <h3 className="text-[10px] font-label text-muted-foreground mb-3">PROJECT DETAILS</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Niche</span><span className="text-foreground">{project.niche || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Topic</span><span className="text-foreground">{project.topic || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Voice</span><span className="text-foreground">{project.voice || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Style</span><span className="text-foreground">{project.style || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Compliance</span><span className="text-foreground">{project.compliance_score ?? "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Platforms</span><span className="text-foreground">{project.platforms?.join(", ") || "—"}</span></div>
              </div>
            </div>

            {/* Scheduled posts */}
            {scheduledPosts.length > 0 && (
              <div className="surface-raised p-5 rounded-xl border border-border/45">
                <h3 className="text-[10px] font-label text-muted-foreground mb-3">SCHEDULED POSTS</h3>
                <div className="space-y-2">
                  {scheduledPosts.map((sp: any) => (
                    <div key={sp.id} className="flex items-center justify-between text-xs py-2 border-b border-border/30 last:border-0">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-accent" />
                        <span className="text-foreground capitalize">{sp.platform}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{new Date(sp.scheduled_at).toLocaleString()}</span>
                        <span className={`text-[9px] font-label px-2 py-0.5 rounded-full ${
                          sp.status === "posted" ? "bg-emerald/10 text-emerald" : "bg-accent/10 text-accent"
                        }`}>{sp.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Script */}
        {project.script && (
          <div className="surface-raised p-5 rounded-xl mb-6 border border-border/45">
            <h3 className="text-[10px] font-label text-muted-foreground mb-3">SCRIPT</h3>
            <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">{project.script}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetail;
