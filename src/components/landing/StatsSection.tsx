import AnimatedNumber from "@/components/shared/AnimatedNumber";

const stats = [
  { label: "Videos Created", value: 12400, suffix: "+", icon: "🎬" },
  { label: "Avg Retention", value: 72, suffix: "%", icon: "📈" },
  { label: "Compliance Checks", value: 48000, suffix: "+", icon: "🛡️" },
  { label: "Active Creators", value: 3200, suffix: "+", icon: "👥" },
];

const StatsSection = () => {
  return (
    <section className="py-20 px-6 z-10 relative">
      <div className="gradient-strip max-w-4xl mx-auto mb-16" />
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((m, i) => (
            <div
              key={m.label}
              className="surface-raised p-6 text-center group surface-hover relative overflow-hidden"
            >
              {/* Subtle corner accent */}
              <div
                className="absolute top-0 right-0 w-16 h-16 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity"
                style={{
                  background: "radial-gradient(circle at top right, hsl(200 80% 62%), transparent 70%)",
                }}
              />

              <div className="text-2xl mb-3">{m.icon}</div>
              <div className="text-3xl md:text-4xl font-display text-foreground font-bold">
                <AnimatedNumber value={m.value} suffix={m.suffix} />
              </div>
              <div className="text-[10px] mt-2 font-label text-muted-foreground tracking-wider">
                {m.label.toUpperCase()}
              </div>
              {/* Bottom glow line */}
              <div
                className="absolute bottom-0 left-1/4 right-1/4 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(200 80% 62% / 0.5), transparent)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
