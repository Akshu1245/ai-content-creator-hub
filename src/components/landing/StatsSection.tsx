import AnimatedNumber from "@/components/shared/AnimatedNumber";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const stats = [
  { label: "Videos Created", value: 12400, suffix: "+", color: "hsl(199 89% 60%)", note: "This month" },
  { label: "Avg Retention", value: 72, suffix: "%", color: "hsl(199 89% 70%)", note: "Across channels" },
  { label: "Compliance Checks", value: 48000, suffix: "+", color: "hsl(157 63% 50%)", note: "Policy scans" },
  { label: "Active Creators", value: 3200, suffix: "+", color: "hsl(220 60% 70%)", note: "Growing daily" },
];

const StatCard = ({
  label,
  value,
  suffix,
  color,
  note,
  index,
}: {
  label: string;
  value: number;
  suffix: string;
  color: string;
  note: string;
  index: number;
}) => {
  const revealRef = useScrollReveal(0.1);
  return (
    <div
      ref={revealRef}
      className={`surface-raised group relative overflow-hidden p-5 md:p-6 scroll-reveal ${index < 4 ? `scroll-reveal-delay-${index + 1}` : ""} border-b border-border/50 last:border-b-0 sm:border-b-0`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      <div className="text-center">
        <div
          className="text-4xl md:text-5xl font-display font-bold transition-all duration-300 group-hover:scale-[1.02]"
          style={{ color, textShadow: "0 0 0 hsl(199 89% 48% / 0)" }}
        >
          <span className="group-hover:[text-shadow:0_0_20px_hsl(199_89%_48%_/_0.6)] transition-all duration-300 inline-block">
            <AnimatedNumber value={value} suffix={suffix} />
          </span>
        </div>
        <div className="text-[10px] mt-3 font-label text-muted-foreground tracking-wider">{label.toUpperCase()}</div>
        <div className="text-[10px] mt-2 text-muted-foreground/70">{note}</div>
      </div>
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-24 px-6 z-10 relative">
      <div className="gradient-strip max-w-3xl mx-auto mb-14" />
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 sm:gap-4">
          {stats.map((m, i) => (
            <StatCard key={m.label} label={m.label} value={m.value} suffix={m.suffix} color={m.color} note={m.note} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
