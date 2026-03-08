import { WizardData } from "@/pages/NewProject";
import { Eye, Clock, TrendingUp, BarChart3 } from "lucide-react";

interface Props { data: WizardData; updateData: (u: Partial<WizardData>) => void; }

const mockCompetitors = [
  { title: "Compound Interest Explained Simply", views: "2.1M", retention: "62%", likes: "89K" },
  { title: "How Interest Works — Full Guide", views: "840K", retention: "55%", likes: "32K" },
  { title: "The Math Behind Compound Growth", views: "450K", retention: "71%", likes: "28K" },
  { title: "Interest Rates: What You Need to Know", views: "320K", retention: "48%", likes: "15K" },
];

const StepTrends = ({ data }: Props) => {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-label text-primary block mb-2">STEP 2 OF 6</span>
        <h2 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Trend Intelligence</h2>
        <p className="text-xs text-muted-foreground">
          Analysis for: <span className="text-primary font-semibold">{data.topic || data.niche}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Trend Score", value: "87/100", icon: TrendingUp },
          { label: "Search Vol", value: "12.4K/wk", icon: BarChart3 },
          { label: "Competition", value: "Medium", icon: Eye },
          { label: "Ideal Length", value: "8-12 min", icon: Clock },
          { label: "Best Time", value: "Tue 6PM", icon: Clock },
        ].map((m) => (
          <div key={m.label} className="surface-raised p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-2">
              <m.icon className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="text-xs font-mono font-bold text-foreground">{m.value}</div>
            <div className="text-[9px] font-label text-muted-foreground mt-1">{m.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div className="surface-raised p-5">
        <h3 className="text-xs font-display text-foreground font-bold mb-4">Search Interest (30 days)</h3>
        <div className="h-32 flex items-end gap-[2px]">
          {Array.from({ length: 30 }, (_, i) => {
            const height = 20 + Math.sin(i / 3) * 25 + Math.random() * 20 + (i > 20 ? i * 2 : 0);
            return (
              <div key={i} className="flex-1 rounded-t transition-all hover:opacity-80 cursor-pointer" style={{
                height: `${Math.min(height, 100)}%`,
                background: i > 24
                  ? "linear-gradient(180deg, hsl(42 78% 58%), hsl(42 78% 42%))"
                  : "hsl(225 14% 16%)",
              }} />
            );
          })}
        </div>
        <div className="flex justify-between text-[9px] font-label text-muted-foreground mt-3">
          <span>30 DAYS AGO</span>
          <span>TODAY</span>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-display text-foreground font-bold mb-3">Top Competing Videos</h3>
        <div className="space-y-2">
          {mockCompetitors.map((c, i) => (
            <div key={i} className="surface-raised p-4 flex items-center justify-between surface-hover">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-muted-foreground w-5">#{i + 1}</span>
                <span className="text-xs text-foreground truncate">{c.title}</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground shrink-0">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {c.views}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.retention}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepTrends;
