import { WizardData } from "@/pages/NewProject";
import { TrendingUp, Eye, ThumbsUp, Clock, BarChart3 } from "lucide-react";

interface Props { data: WizardData; updateData: (u: Partial<WizardData>) => void; }

const mockCompetitors = [
  { title: "Compound Interest Explained Simply", views: "2.1M", retention: "62%", likes: "89K" },
  { title: "How Interest Works — Full Guide", views: "840K", retention: "55%", likes: "32K" },
  { title: "The Math Behind Compound Growth", views: "450K", retention: "71%", likes: "28K" },
  { title: "Interest Rates: What You Need to Know", views: "320K", retention: "48%", likes: "15K" },
  { title: "Financial Freedom Through Compounding", views: "180K", retention: "67%", likes: "12K" },
];

const StepTrends = ({ data }: Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold mb-1">Trend Intelligence</h2>
        <p className="text-sm" style={{ color: "hsl(205 40% 55%)" }}>
          Analysis for: <span className="text-cyan font-display font-bold">{data.topic || data.niche}</span>
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Trend Score", value: "87/100", icon: TrendingUp, color: "#0EA5E9" },
          { label: "Search Vol", value: "12.4K/wk", icon: BarChart3, color: "#06D6A0" },
          { label: "Competition", value: "Medium", icon: Eye, color: "#FFB703" },
          { label: "Ideal Length", value: "8-12 min", icon: Clock, color: "#0EA5E9" },
          { label: "Best Time", value: "Tue 6PM", icon: Clock, color: "#06D6A0" },
        ].map((m) => (
          <div key={m.label} className="glass p-4 text-center">
            <m.icon className="w-4 h-4 mx-auto mb-2" style={{ color: m.color }} />
            <div className="text-sm font-mono font-bold text-foreground">{m.value}</div>
            <div className="text-xs font-label mt-1" style={{ color: "hsl(210 25% 40%)" }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-elevated p-6">
        <h3 className="text-sm font-display font-bold mb-5">Search Interest (Last 30 Days)</h3>
        <div className="h-36 flex items-end gap-[2px]">
          {Array.from({ length: 30 }, (_, i) => {
            const height = 20 + Math.sin(i / 3) * 25 + Math.random() * 25 + (i > 20 ? i * 2 : 0);
            const isRecent = i > 24;
            return (
              <div key={i} className="flex-1 rounded-t transition-all hover:opacity-80" style={{
                height: `${Math.min(height, 100)}%`,
                background: isRecent ? "linear-gradient(180deg, #0EA5E9, rgba(14,165,233,0.3))" : "rgba(42,72,112,0.3)",
                borderRadius: "2px 2px 0 0",
              }} />
            );
          })}
        </div>
        <div className="flex justify-between text-xs font-label mt-3" style={{ color: "hsl(210 25% 40%)" }}>
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Competitors */}
      <div>
        <h3 className="text-sm font-display font-bold mb-3">Top Competing Videos</h3>
        <div className="space-y-2">
          {mockCompetitors.map((c, i) => (
            <div key={i} className="glass p-4 flex items-center justify-between glass-hover">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono w-6" style={{ color: "hsl(210 25% 40%)" }}>#{i + 1}</span>
                <span className="text-sm font-medium text-foreground truncate max-w-xs">{c.title}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono shrink-0" style={{ color: "hsl(205 40% 55%)" }}>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {c.views}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.retention}</span>
                <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {c.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepTrends;
