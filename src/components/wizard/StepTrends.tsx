import { WizardData } from "@/pages/NewProject";
import { TrendingUp, Eye, ThumbsUp, Clock, BarChart3 } from "lucide-react";

interface Props {
  data: WizardData;
  updateData: (u: Partial<WizardData>) => void;
}

const mockTrendData = {
  trendScore: 87,
  searchVolume: "12.4K/week",
  competition: "Medium",
  recommendedLength: "8-12 min",
  bestUploadTime: "Tuesday 6PM EST",
  competitors: [
    { title: "Compound Interest Explained Simply", views: "2.1M", retention: "62%", likes: "89K" },
    { title: "How Interest Works — Full Guide", views: "840K", retention: "55%", likes: "32K" },
    { title: "The Math Behind Compound Growth", views: "450K", retention: "71%", likes: "28K" },
    { title: "Interest Rates: What You Need to Know", views: "320K", retention: "48%", likes: "15K" },
    { title: "Financial Freedom Through Compounding", views: "180K", retention: "67%", likes: "12K" },
  ],
};

const StepTrends = ({ data }: Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Trend Intelligence</h2>
        <p className="text-sm text-muted-foreground">Analysis for: <span className="text-primary font-medium">{data.topic || data.niche}</span></p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Trend Score", value: `${mockTrendData.trendScore}/100`, icon: TrendingUp, color: "text-primary" },
          { label: "Search Volume", value: mockTrendData.searchVolume, icon: BarChart3, color: "text-info" },
          { label: "Competition", value: mockTrendData.competition, icon: Eye, color: "text-warning" },
          { label: "Ideal Length", value: mockTrendData.recommendedLength, icon: Clock, color: "text-accent" },
          { label: "Best Time", value: mockTrendData.bestUploadTime, icon: Clock, color: "text-primary" },
        ].map((m) => (
          <div key={m.label} className="glass rounded-xl p-4 text-center">
            <m.icon className={`w-4 h-4 mx-auto mb-2 ${m.color}`} />
            <div className="text-sm font-bold font-mono">{m.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Trend chart placeholder */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-semibold mb-4">Search Interest (Last 30 Days)</h3>
        <div className="h-32 flex items-end gap-1">
          {Array.from({ length: 30 }, (_, i) => {
            const height = 20 + Math.sin(i / 3) * 30 + Math.random() * 30 + (i > 20 ? i * 2 : 0);
            return (
              <div key={i} className="flex-1 rounded-t transition-all hover:opacity-80" style={{
                height: `${Math.min(height, 100)}%`,
                background: i > 24 ? "hsl(var(--primary))" : "hsl(var(--secondary))"
              }} />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Competitors */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Top Competing Videos</h3>
        <div className="space-y-2">
          {mockTrendData.competitors.map((c, i) => (
            <div key={i} className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-5">#{i + 1}</span>
                <span className="text-sm font-medium truncate max-w-xs">{c.title}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
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
