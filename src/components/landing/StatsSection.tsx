import AnimatedNumber from "@/components/shared/AnimatedNumber";

const stats = [
  { label: "Videos Created", value: 12400, suffix: "+", gradient: "from-primary to-primary/50" },
  { label: "Avg Retention", value: 72, suffix: "%", gradient: "from-accent to-accent/50" },
  { label: "Compliance Checks", value: 48000, suffix: "+", gradient: "from-emerald to-emerald/50" },
  { label: "Active Creators", value: 3200, suffix: "+", gradient: "from-arctic to-arctic/50" },
];

const StatsSection = () => {
  return (
    <section className="py-24 px-6 z-10 relative">
      <div className="gradient-strip max-w-3xl mx-auto mb-20" />
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((m) => (
            <div key={m.label} className="text-center group">
              <div className={`text-4xl md:text-5xl font-display font-bold bg-gradient-to-b ${m.gradient} bg-clip-text text-transparent`}>
                <AnimatedNumber value={m.value} suffix={m.suffix} />
              </div>
              <div className="text-[10px] mt-3 font-label text-muted-foreground tracking-wider">
                {m.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
