import DashboardLayout from "@/components/layout/DashboardLayout";
import { Eye, Clock, TrendingUp, DollarSign, BarChart3, ThumbsUp } from "lucide-react";

const overallStats = [
  { label: "Total Views", value: "128,400", change: "+12.3%", icon: Eye },
  { label: "Watch Time (hrs)", value: "4,280", change: "+8.7%", icon: Clock },
  { label: "Avg CTR", value: "9.4%", change: "+1.2%", icon: ThumbsUp },
  { label: "Est. Revenue", value: "₹18,420", change: "+15.1%", icon: DollarSign },
];

const videoPerformance = [
  { title: "The Backrooms — Level 9999", views: "28.1K", retention: "72%", ctr: "11.4%", revenue: "₹4,200" },
  { title: "Compound Interest Explained", views: "12.4K", retention: "68%", ctr: "8.2%", revenue: "₹2,100" },
  { title: "Dark Psychology Tricks", views: "45.2K", retention: "65%", ctr: "9.8%", revenue: "₹5,800" },
  { title: "What's at the Bottom of the Ocean", views: "18.7K", retention: "71%", ctr: "10.1%", revenue: "₹2,900" },
  { title: "Why Discipline Beats Motivation", views: "8.9K", retention: "58%", ctr: "7.1%", revenue: "₹1,200" },
];

const aiInsights = [
  "Your Horror niche videos average 72% retention vs 58% for Motivation — consider doubling down on Horror content.",
  "Videos published on Tuesday 6PM get 23% more views in the first 48 hours.",
  "Adding a pattern interrupt at the 30-second mark improved retention by 8% on average.",
  "Your CTR improved 2.1% after switching to question-based titles.",
];

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground text-sm mb-8">Performance insights across all your content</p>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {overallStats.map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 glass-hover">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-primary font-medium">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold font-mono">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="glass rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Views Over Time</h2>
          <div className="h-48 flex items-end gap-1">
            {Array.from({ length: 30 }, (_, i) => {
              const base = 30 + Math.sin(i / 4) * 20 + (i > 15 ? (i - 15) * 3 : 0);
              const height = Math.min(base + Math.random() * 15, 100);
              return (
                <div key={i} className="flex-1 group relative">
                  <div
                    className="w-full rounded-t transition-all group-hover:opacity-80"
                    style={{ height: `${height}%`, background: i > 24 ? "hsl(var(--primary))" : "hsl(var(--secondary))" }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Performance */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Video Performance</h2>
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Video</th>
                    <th className="text-center px-4 py-3 text-muted-foreground font-medium">Views</th>
                    <th className="text-center px-4 py-3 text-muted-foreground font-medium">Retention</th>
                    <th className="text-center px-4 py-3 text-muted-foreground font-medium">CTR</th>
                    <th className="text-center px-4 py-3 text-muted-foreground font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {videoPerformance.map((v, i) => (
                    <tr key={i} className="border-b border-border/20">
                      <td className="px-4 py-3 font-medium truncate max-w-xs">{v.title}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground font-mono">{v.views}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={parseInt(v.retention) >= 65 ? "text-primary" : "text-warning"}>{v.retention}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground font-mono">{v.ctr}</td>
                      <td className="px-4 py-3 text-center text-primary font-mono">{v.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insights */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> AI Insights
            </h2>
            <div className="space-y-3">
              {aiInsights.map((insight, i) => (
                <div key={i} className="glass rounded-xl p-4 glass-hover">
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
