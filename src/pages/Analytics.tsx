import { useState, useMemo } from "react";
import usePageTitle from "@/hooks/usePageTitle";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Eye, Clock, TrendingUp, DollarSign, Sparkles, ArrowUpRight, ArrowDownRight, BarChart3, Users, ThumbsUp, Share2, Info } from "lucide-react";
import AnimatedNumber from "@/components/shared/AnimatedNumber";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Tooltip } from "@/components/ui/tooltip";

type TimeRange = "7d" | "30d" | "90d" | "all";

const generateViewsData = (range: TimeRange) => {
  const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 180;
  return Array.from({ length: days }, (_, i) => {
    const base = 2800 + Math.sin(i / 5) * 1200 + (i > days * 0.6 ? (i - days * 0.6) * 80 : 0);
    return {
      day: `Day ${i + 1}`,
      views: Math.floor(base + Math.random() * 800),
      watchTime: Math.floor((base * 0.035) + Math.random() * 30),
    };
  });
};

const retentionData = [
  { time: "0s", retention: 100 },
  { time: "5s", retention: 94 },
  { time: "15s", retention: 86 },
  { time: "30s", retention: 78 },
  { time: "1m", retention: 72 },
  { time: "2m", retention: 65 },
  { time: "3m", retention: 58 },
  { time: "5m", retention: 48 },
  { time: "7m", retention: 38 },
  { time: "10m", retention: 28 },
];

const trafficSources = [
  { name: "Browse", value: 42, fill: "hsl(12, 76%, 56%)" },
  { name: "Search", value: 28, fill: "hsl(158, 32%, 45%)" },
  { name: "Suggested", value: 18, fill: "hsl(42, 72%, 52%)" },
  { name: "External", value: 8, fill: "hsl(185, 40%, 48%)" },
  { name: "Direct", value: 4, fill: "hsl(320, 22%, 48%)" },
];

const topVideos = [
  { title: "The Backrooms — Level 9999", views: 28100, retention: 72, ctr: 11.4, revenue: 4200, subs: 340, trend: "up" as const },
  { title: "Dark Psychology Tricks", views: 45200, retention: 65, ctr: 9.8, revenue: 5800, subs: 520, trend: "up" as const },
  { title: "What's at the Bottom of the Ocean", views: 18700, retention: 71, ctr: 10.1, revenue: 2900, subs: 180, trend: "up" as const },
  { title: "Compound Interest Explained", views: 12400, retention: 68, ctr: 8.2, revenue: 2100, subs: 95, trend: "down" as const },
  { title: "Why Discipline Beats Motivation", views: 8900, retention: 58, ctr: 7.1, revenue: 1200, subs: 42, trend: "down" as const },
  { title: "Ancient Roman Engineering", views: 15300, retention: 74, ctr: 10.8, revenue: 3100, subs: 210, trend: "up" as const },
];

const weeklyUploadData = [
  { day: "Mon", uploads: 2 },
  { day: "Tue", uploads: 3 },
  { day: "Wed", uploads: 1 },
  { day: "Thu", uploads: 4 },
  { day: "Fri", uploads: 2 },
  { day: "Sat", uploads: 5 },
  { day: "Sun", uploads: 1 },
];

const aiInsights = [
  { text: "Your Horror niche videos average 72% retention vs 58% for Motivation — consider doubling down on Horror.", priority: "high" as const },
  { text: "Videos published on Tuesday 6PM get 23% more views in the first 48 hours.", priority: "medium" as const },
  { text: "Adding a pattern interrupt at 30s improved retention by 8% on average.", priority: "high" as const },
  { text: "Your CTR improved 2.1% after switching to question-based titles.", priority: "medium" as const },
  { text: "Videos longer than 8 minutes earn 3.2x more revenue — consider extending content.", priority: "low" as const },
];

const chartConfig = {
  views: { label: "Views", color: "hsl(12, 76%, 56%)" },
  watchTime: { label: "Watch Time (hrs)", color: "hsl(158, 32%, 45%)" },
  retention: { label: "Retention %", color: "hsl(42, 72%, 52%)" },
  uploads: { label: "Uploads", color: "hsl(12, 76%, 56%)" },
};

const Analytics = () => {
  usePageTitle("Analytics");
  const [range, setRange] = useState<TimeRange>("30d");
  const viewsData = useMemo(() => generateViewsData(range), [range]);

  const statsForRange = useMemo(() => {
    const multiplier = range === "7d" ? 0.25 : range === "30d" ? 1 : range === "90d" ? 2.8 : 6;
    return [
      { label: "Total Views", value: Math.floor(128400 * multiplier), change: "+12.3%", up: true, icon: Eye },
      { label: "Watch Time", value: Math.floor(4280 * multiplier), suffix: " hrs", change: "+8.7%", up: true, icon: Clock },
      { label: "Subscribers", value: Math.floor(1420 * multiplier), change: "+15.4%", up: true, icon: Users },
      { label: "Est. Revenue", value: Math.floor(18420 * multiplier), change: "+15.1%", up: true, icon: DollarSign, prefix: "₹" },
    ];
  }, [range]);

  const rangeLabel = range === "7d" ? "LAST 7 DAYS" : range === "30d" ? "LAST 30 DAYS" : range === "90d" ? "LAST 90 DAYS" : "ALL TIME";

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-2xl font-display text-foreground font-bold tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">Performance across all channels.</p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-secondary/50 border border-border/50">
            {(["7d", "30d", "90d", "all"] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-5 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                  range === r
                    ? "bg-primary/15 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "all" ? "All" : r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsForRange.map((stat, i) => (
            <div
              key={stat.label}
              className="surface-raised p-5 surface-hover"
              style={{ animation: `fade-in 0.5s ease-out ${i * 0.08}s both` }}
            >
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
                <AnimatedNumber value={stat.value} suffix={stat.suffix || ""} prefix={stat.prefix} />
              </div>
              <div className="text-[10px] font-label text-muted-foreground mt-1">{stat.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Main Charts Row */}
        <div className="grid lg:grid-cols-12 gap-6 mb-6">
          {/* Views Over Time - Area Chart */}
          <div className="lg:col-span-8 surface-raised p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-display text-foreground font-bold">Views & Watch Time</h2>
              <span className="text-[10px] font-label text-muted-foreground">{rangeLabel}</span>
            </div>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <AreaChart data={viewsData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(12, 76%, 56%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(12, 76%, 56%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="watchGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(158, 32%, 45%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(158, 32%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(22, 8%, 14%)" />
                <XAxis dataKey="day" tick={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(28, 10%, 42%)" }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="views" stroke="hsl(12, 76%, 56%)" strokeWidth={2} fill="url(#viewsGrad)" />
                <Area type="monotone" dataKey="watchTime" stroke="hsl(158, 32%, 45%)" strokeWidth={2} fill="url(#watchGrad)" />
              </AreaChart>
            </ChartContainer>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-[2px] rounded-full bg-primary" />
                <span className="text-[10px] font-label text-muted-foreground">VIEWS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-[2px] rounded-full bg-accent" />
                <span className="text-[10px] font-label text-muted-foreground">WATCH TIME</span>
              </div>
            </div>
          </div>

          {/* Traffic Sources - Pie */}
          <div className="lg:col-span-4 surface-raised p-6">
            <h2 className="text-sm font-display text-foreground font-bold mb-6">Traffic Sources</h2>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {trafficSources.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2.5 mt-4">
              {trafficSources.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: s.fill }} />
                    <span className="text-[11px] text-muted-foreground">{s.name}</span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-foreground">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Retention + Upload Frequency */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Audience Retention Curve */}
          <div className="surface-raised p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-display text-foreground font-bold">Avg. Audience Retention</h2>
              <span className="text-[10px] font-label text-muted-foreground">ACROSS ALL VIDEOS</span>
            </div>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <AreaChart data={retentionData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <defs>
                  <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(42, 72%, 52%)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(42, 72%, 52%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(22, 8%, 14%)" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(28, 10%, 42%)" }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(28, 10%, 42%)" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="retention" stroke="hsl(42, 72%, 52%)" strokeWidth={2.5} fill="url(#retentionGrad)" />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* Upload Frequency */}
          <div className="surface-raised p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-display text-foreground font-bold">Upload Frequency</h2>
              <span className="text-[10px] font-label text-muted-foreground">THIS WEEK</span>
            </div>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={weeklyUploadData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(22, 8%, 14%)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(28, 10%, 42%)" }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(28, 10%, 42%)" }} axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="uploads" fill="hsl(12, 76%, 56%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        {/* Video Performance Table + AI Insights */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Table */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-display text-foreground font-bold">Top Performing Videos</h2>
              <span className="text-[10px] font-label text-muted-foreground">{topVideos.length} VIDEOS</span>
            </div>
            <div className="surface-raised overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      {["Video", "Views", "Retention", "CTR", "Revenue", "Subs"].map((h) => (
                        <th key={h} className="text-left px-5 py-4 text-[10px] font-label text-muted-foreground whitespace-nowrap">{h.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topVideos.map((v, i) => (
                      <tr
                        key={i}
                        className="border-b border-border/30 last:border-b-0 hover:bg-secondary/20 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-4 text-foreground font-medium max-w-[220px]">
                          <div className="flex items-center gap-2">
                            <span className="truncate">{v.title}</span>
                            {v.trend === "up" && <ArrowUpRight className="w-3 h-3 text-emerald shrink-0" />}
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono text-muted-foreground">{(v.views / 1000).toFixed(1)}K</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 rounded-full bg-secondary overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${v.retention}%`,
                                  background: v.retention >= 65 ? "hsl(158, 32%, 45%)" : "hsl(42, 72%, 52%)",
                                }}
                              />
                            </div>
                            <span className={`font-mono font-semibold ${v.retention >= 65 ? "text-emerald" : "text-gold"}`}>
                              {v.retention}%
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono text-muted-foreground">{v.ctr}%</td>
                        <td className="px-5 py-4 font-mono text-primary font-semibold">₹{v.revenue.toLocaleString()}</td>
                        <td className="px-5 py-4 font-mono text-muted-foreground">+{v.subs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="lg:col-span-4">
            <h2 className="text-sm font-display text-foreground font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> AI Insights
            </h2>
            <div className="space-y-3">
              {aiInsights.map((insight, i) => {
                const borderColor = insight.priority === "high"
                  ? "hsl(12, 76%, 56%, 0.4)"
                  : insight.priority === "medium"
                  ? "hsl(42, 72%, 52%, 0.3)"
                  : "hsl(158, 32%, 45%, 0.2)";
                const dotColor = insight.priority === "high"
                  ? "bg-primary"
                  : insight.priority === "medium"
                  ? "bg-gold"
                  : "bg-accent";
                return (
                  <div
                    key={i}
                    className="surface-raised p-4 surface-hover"
                    style={{ borderLeft: `3px solid ${borderColor}` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${dotColor} mt-1.5 shrink-0`} />
                      <p className="text-xs text-muted-foreground leading-relaxed">{insight.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Engagement Summary */}
            <div className="surface-raised p-5 mt-4">
              <h3 className="text-[10px] font-label text-muted-foreground mb-4">ENGAGEMENT SUMMARY</h3>
              <div className="space-y-3">
                {[
                  { icon: ThumbsUp, label: "Like Rate", value: "8.2%", color: "text-primary" },
                  { icon: Share2, label: "Share Rate", value: "2.4%", color: "text-accent" },
                  { icon: BarChart3, label: "Comment Rate", value: "1.8%", color: "text-gold" },
                ].map((e) => (
                  <div key={e.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <e.icon className={`w-3.5 h-3.5 ${e.color}`} />
                      <span className="text-xs text-muted-foreground">{e.label}</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-foreground">{e.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
