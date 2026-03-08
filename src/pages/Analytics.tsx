import DashboardLayout from "@/components/layout/DashboardLayout";
import { Eye, Clock, TrendingUp, DollarSign, Sparkles } from "lucide-react";
import AnimatedNumber from "@/components/shared/AnimatedNumber";

const overallStats = [
  { label: "Total Views", value: 128400, suffix: "", change: "+12.3%", icon: Eye },
  { label: "Watch Time (hrs)", value: 4280, suffix: "", change: "+8.7%", icon: Clock },
  { label: "Avg CTR", value: 9, suffix: ".4%", change: "+1.2%", icon: TrendingUp },
  { label: "Est. Revenue", value: 18420, suffix: "", change: "+15.1%", icon: DollarSign, prefix: "₹" },
];

const videoPerformance = [
  { title: "The Backrooms — Level 9999", views: "28.1K", retention: "72%", ctr: "11.4%", revenue: "₹4,200" },
  { title: "Compound Interest Explained", views: "12.4K", retention: "68%", ctr: "8.2%", revenue: "₹2,100" },
  { title: "Dark Psychology Tricks", views: "45.2K", retention: "65%", ctr: "9.8%", revenue: "₹5,800" },
  { title: "What's at the Bottom of the Ocean", views: "18.7K", retention: "71%", ctr: "10.1%", revenue: "₹2,900" },
  { title: "Why Discipline Beats Motivation", views: "8.9K", retention: "58%", ctr: "7.1%", revenue: "₹1,200" },
];

const aiInsights = [
  "Your Horror niche videos average 72% retention vs 58% for Motivation — consider doubling down on Horror.",
  "Videos published on Tuesday 6PM get 23% more views in the first 48 hours.",
  "Adding a pattern interrupt at 30 seconds improved retention by 8% on average.",
  "Your CTR improved 2.1% after switching to question-based titles.",
];

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Performance insights across all content</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {overallStats.map((stat) => (
            <div key={stat.label} className="surface p-5 surface-hover">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-mono font-semibold text-accent">{stat.change}</span>
              </div>
              <div className="text-2xl font-display font-bold text-foreground">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="text-xs font-label text-muted-foreground mt-0.5">{stat.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <div className="surface-raised p-5 mb-6">
          <h2 className="text-sm font-display font-semibold text-foreground mb-4">Views Over Time</h2>
          <div className="h-40 flex items-end gap-px">
            {Array.from({ length: 30 }, (_, i) => {
              const base = 30 + Math.sin(i / 4) * 20 + (i > 15 ? (i - 15) * 3 : 0);
              const height = Math.min(base + Math.random() * 15, 100);
              return (
                <div key={i} className="flex-1 rounded-t transition-all hover:opacity-80" style={{
                  height: `${height}%`,
                  background: i > 24 ? "hsl(28 72% 55%)" : "hsl(40 5% 20%)",
                }} />
              );
            })}
          </div>
          <div className="flex justify-between text-xs font-label text-muted-foreground mt-2">
            <span>30 DAYS AGO</span>
            <span>TODAY</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <h2 className="text-sm font-display font-semibold text-foreground mb-3">Video Performance</h2>
            <div className="surface-raised overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Video", "Views", "Retention", "CTR", "Revenue"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-label text-muted-foreground">{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {videoPerformance.map((v, i) => (
                    <tr key={i} className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-foreground font-medium truncate max-w-[200px]">{v.title}</td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{v.views}</td>
                      <td className="px-4 py-3">
                        <span className={`font-mono font-semibold ${parseInt(v.retention) >= 65 ? "text-accent" : "text-golden"}`}>{v.retention}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{v.ctr}</td>
                      <td className="px-4 py-3 font-mono text-accent">{v.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> AI Insights
            </h2>
            <div className="space-y-2">
              {aiInsights.map((insight, i) => (
                <div key={i} className="surface p-3.5 surface-hover border-l-2 border-l-primary">
                  <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
