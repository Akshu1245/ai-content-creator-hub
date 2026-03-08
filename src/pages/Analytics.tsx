import DashboardLayout from "@/components/layout/DashboardLayout";
import { Eye, Clock, TrendingUp, DollarSign, Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";
import AnimatedNumber from "@/components/shared/AnimatedNumber";

const overallStats = [
  { label: "Total Views", value: 128400, suffix: "", change: "+12.3%", up: true, icon: Eye },
  { label: "Watch Time (hrs)", value: 4280, suffix: "", change: "+8.7%", up: true, icon: Clock },
  { label: "Avg CTR", value: 9, suffix: ".4%", change: "+1.2%", up: true, icon: TrendingUp },
  { label: "Est. Revenue", value: 18420, suffix: "", change: "+15.1%", up: true, icon: DollarSign, prefix: "₹" },
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
  "Adding a pattern interrupt at 30s improved retention by 8% on average.",
  "Your CTR improved 2.1% after switching to question-based titles.",
];

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-2xl font-display text-foreground font-bold tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">Performance across all channels.</p>
          </div>
          <div className="flex items-center gap-2">
            {["7d", "30d", "90d", "All"].map((range) => (
              <button key={range} className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                range === "30d" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}>{range}</button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {overallStats.map((stat) => (
            <div key={stat.label} className="surface-raised p-5 surface-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className={`flex items-center gap-1 text-[10px] font-label ${stat.up ? "text-emerald" : "text-destructive"}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-display text-foreground font-bold">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="text-[10px] font-label text-muted-foreground mt-1">{stat.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="surface-raised p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-display text-foreground font-bold">Views Over Time</h2>
            <span className="text-[10px] font-label text-muted-foreground">LAST 30 DAYS</span>
          </div>
          <div className="h-48 flex items-end gap-[3px]">
            {Array.from({ length: 30 }, (_, i) => {
              const base = 30 + Math.sin(i / 4) * 20 + (i > 15 ? (i - 15) * 3 : 0);
              const height = Math.min(base + Math.random() * 15, 100);
              const isRecent = i > 24;
              return (
                <div key={i} className="flex-1 rounded-t transition-all hover:opacity-80 cursor-pointer" style={{
                  height: `${height}%`,
                  background: isRecent
                    ? "linear-gradient(180deg, hsl(42 78% 58%), hsl(42 78% 42%))"
                    : "hsl(225 14% 16%)",
                }} />
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] font-label text-muted-foreground mt-4">
            <span>30 DAYS AGO</span>
            <span>TODAY</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Table */}
          <div className="lg:col-span-8">
            <h2 className="text-sm font-display text-foreground font-bold mb-4">Video Performance</h2>
            <div className="surface-raised overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    {["Video", "Views", "Retention", "CTR", "Revenue"].map((h) => (
                      <th key={h} className="text-left px-5 py-4 text-[10px] font-label text-muted-foreground">{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {videoPerformance.map((v, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-b-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-4 text-foreground font-medium truncate max-w-[200px]">{v.title}</td>
                      <td className="px-5 py-4 font-mono text-muted-foreground">{v.views}</td>
                      <td className="px-5 py-4">
                        <span className={`font-mono font-semibold ${parseInt(v.retention) >= 65 ? "text-emerald" : "text-primary"}`}>{v.retention}</span>
                      </td>
                      <td className="px-5 py-4 font-mono text-muted-foreground">{v.ctr}</td>
                      <td className="px-5 py-4 font-mono text-primary font-semibold">{v.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insights */}
          <div className="lg:col-span-4">
            <h2 className="text-sm font-display text-foreground font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> AI Insights
            </h2>
            <div className="space-y-3">
              {aiInsights.map((insight, i) => (
                <div key={i} className="surface-raised p-4" style={{ borderLeft: "2px solid hsl(42 78% 58% / 0.3)" }}>
                  <p className="text-xs text-muted-foreground leading-relaxed">{insight}</p>
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
