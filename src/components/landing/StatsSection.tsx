import AnimatedNumber from "@/components/shared/AnimatedNumber";

const stats = [
  { label: "Videos Created", value: 12400, suffix: "+", gradient: "from-primary to-clay", note: "This month" },
  { label: "Avg Retention", value: 72, suffix: "%", gradient: "from-gold to-ochre", note: "Across channels" },
  { label: "Compliance Checks", value: 48000, suffix: "+", gradient: "from-accent to-olive", note: "Policy scans" },
  { label: "Active Creators", value: 3200, suffix: "+", gradient: "from-arctic to-sage", note: "Growing daily" },
];

const StatsSection = () => {
  return (
    <section className="py-24 px-6 z-10 relative">
      <div className="gradient-strip max-w-3xl mx-auto mb-14" />
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((m, i) => (
            <div
              key={m.label}
              className="surface-raised group relative overflow-hidden p-5 md:p-6"
              style={{ animation: `fadeIn 0.45s ease-out ${i * 0.08}s both` }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <div className="text-center">
                <div className={`text-4xl md:text-5xl font-display font-bold bg-gradient-to-b ${m.gradient} bg-clip-text text-transparent`}>
                  <AnimatedNumber value={m.value} suffix={m.suffix} />
                </div>
                <div className="text-[10px] mt-3 font-label text-muted-foreground tracking-wider">
                  {m.label.toUpperCase()}
                </div>
                <div className="text-[10px] mt-2 text-muted-foreground/70">
                  {m.note}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
