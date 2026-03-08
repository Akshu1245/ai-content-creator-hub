import DashboardLayout from "@/components/layout/DashboardLayout";
import { Eye, Clock, TrendingUp, DollarSign, ThumbsUp, Sparkles } from "lucide-react";
import AnimatedNumber from "@/components/shared/AnimatedNumber";
import TiltCard from "@/components/shared/TiltCard";

const overallStats = [
  { label: "Total Views", value: 128400, suffix: "", change: "+12.3%", icon: Eye, color: "14,165,233" },
  { label: "Watch Time (hrs)", value: 4280, suffix: "", change: "+8.7%", icon: Clock, color: "6,214,160" },
  { label: "Avg CTR", value: 9, suffix: ".4%", change: "+1.2%", icon: ThumbsUp, color: "14,165,233" },
  { label: "Est. Revenue", value: 18420, suffix: "", change: "+15.1%", icon: DollarSign, color: "6,214,160", prefix: "₹" },
];

const videoPerformance = [
  { title: "The Backrooms — Level 9999", views: "28.1K", retention: "72%", ctr: "11.4%", revenue: "₹4,200" },
  { title: "Compound Interest Explained", views: "12.4K", retention: "68%", ctr: "8.2%", revenue: "₹2,100" },
  { title: "Dark Psychology Tricks", views: "45.2K", retention: "65%", ctr: "9.8%", revenue: "₹5,800" },
  { title: "What's at the Bottom of the Ocean", views: "18.7K", retention: "71%", ctr: "10.1%", revenue: "₹2,900" },
  { title: "Why Discipline Beats Motivation", views: "8.9K", retention: "58%", ctr: "7.1%", revenue: "₹1,200" },
];

const aiInsights = [
  { text: "Your Horror niche videos average 72% retention vs 58% for Motivation — consider doubling down on Horror content.", color: "#0EA5E9" },
  { text: "Videos published on Tuesday 6PM get 23% more views in the first 48 hours.", color: "#06D6A0" },
  { text: "Adding a pattern interrupt at the 30-second mark improved retention by 8% on average.", color: "#0EA5E9" },
  { text: "Your CTR improved 2.1% after switching to question-based titles.", color: "#06D6A0" },
];

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-display font-bold">Analytics</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(205 40% 55%)" }}>Performance insights across all your content</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {overallStats.map((stat) => (
            <TiltCard key={stat.label} glowColor={stat.color}>
              <div className="glass p-5 glass-hover h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `rgba(${stat.color},0.1)`, border: `1px solid rgba(${stat.color},0.2)` }}>
                    <stat.icon className="w-4 h-4" style={{ color: `rgb(${stat.color})` }} />
                  </div>
                  <span className="text-xs font-display font-bold" style={{ color: `rgb(${stat.color})` }}>{stat.change}</span>
                </div>
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                </div>
                <div className="text-xs font-label mt-1" style={{ color: "hsl(210 25% 40%)" }}>{stat.label}</div>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Chart */}
        <div className="glass-elevated p-6 mb-8">
          <h2 className="text-lg font-display font-bold mb-5">Views Over Time</h2>
          <div className="h-48 flex items-end gap-[2px]">
            {Array.from({ length: 30 }, (_, i) => {
              const base = 30 + Math.sin(i / 4) * 20 + (i > 15 ? (i - 15) * 3 : 0);
              const height = Math.min(base + Math.random() * 15, 100);
              const isRecent = i > 24;
              return (
                <div key={i} className="flex-1 group relative">
                  <div className="w-full rounded-t transition-all group-hover:opacity-80" style={{
                    height: `${height}%`,
                    background: isRecent ? "linear-gradient(180deg, #0EA5E9, rgba(14,165,233,0.3))" : "rgba(42,72,112,0.3)",
                    borderRadius: "2px 2px 0 0",
                  }} />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs font-label mt-3" style={{ color: "hsl(210 25% 40%)" }}>
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Table */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-display font-bold mb-4">Video Performance</h2>
            <div className="glass-elevated overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(42,72,112,0.3)" }}>
                      {["Video", "Views", "Retention", "CTR", "Revenue"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 font-label text-xs" style={{ color: "hsl(210 25% 40%)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {videoPerformance.map((v, i) => (
                      <tr key={i} className="transition-colors hover:bg-muted/20" style={{ borderBottom: "1px solid rgba(42,72,112,0.15)" }}>
                        <td className="px-5 py-3.5 font-medium text-foreground truncate max-w-xs">{v.title}</td>
                        <td className="px-5 py-3.5 font-mono" style={{ color: "hsl(205 40% 55%)" }}>{v.views}</td>
                        <td className="px-5 py-3.5">
                          <span className={`font-mono font-bold ${parseInt(v.retention) >= 65 ? "text-mint" : "text-amber"}`}>{v.retention}</span>
                        </td>
                        <td className="px-5 py-3.5 font-mono" style={{ color: "hsl(205 40% 55%)" }}>{v.ctr}</td>
                        <td className="px-5 py-3.5 font-mono text-mint">{v.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div>
            <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan" /> AI Insights
            </h2>
            <div className="space-y-3">
              {aiInsights.map((insight, i) => (
                <div key={i} className="glass p-4 glass-hover" style={{ borderLeft: `3px solid ${insight.color}` }}>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(205 40% 62%)" }}>{insight.text}</p>
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
