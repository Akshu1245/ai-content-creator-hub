import { useEffect, useState } from "react";

interface ComplianceGaugeProps {
  score: number;
  size?: number;
  label?: string;
  delay?: number;
}

const ComplianceGauge = ({ score, size = 180, label, delay = 300 }: ComplianceGaugeProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [mounted, setMounted] = useState(false);

  const getColor = (s: number) => {
    if (s >= 80) return { bg: "hsl(160, 55%, 45%)", label: "SAFE TO MONETIZE" };
    if (s >= 60) return { bg: "hsl(42, 78%, 58%)", label: "REVIEW SUGGESTED" };
    return { bg: "hsl(0, 62%, 55%)", label: "HIGH RISK" };
  };

  const color = getColor(score);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      let start: number | null = null;
      const duration = 1200;
      const animate = (ts: number) => {
        if (!start) start = ts;
        const t = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setAnimatedScore(Math.floor(eased * score));
        if (t < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [score, delay]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-4" style={{
        animation: mounted ? "slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0s both" : "none",
      }}>
        <div className="text-center">
          <div className="font-display text-7xl font-bold leading-none" style={{
            color: color.bg,
            textShadow: `0 0 20px ${color.bg}40`,
          }}>
            {mounted ? animatedScore : 0}
          </div>
          <div className="text-xl text-muted-foreground font-mono tracking-widest mt-1">%</div>
        </div>

        <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${mounted ? animatedScore : 0}%`,
              background: color.bg,
              boxShadow: `0 0 15px ${color.bg}60`,
            }}
          />
        </div>
      </div>

      <p
        className="text-[10px] font-label tracking-[0.15em] uppercase px-3 py-2 rounded-lg border"
        style={{
          color: color.bg,
          borderColor: `${color.bg}30`,
          backgroundColor: `${color.bg}08`,
        }}
      >
        {label || color.label}
      </p>
    </div>
  );
};

export default ComplianceGauge;
