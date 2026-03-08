import { useEffect, useState } from "react";

interface ComplianceGaugeProps {
  score: number;
  size?: number;
  label?: string;
  delay?: number;
}

const ComplianceGauge = ({ score, size = 180, label, delay = 300 }: ComplianceGaugeProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  const strokeWidth = size > 120 ? 8 : 6;
  const center = size / 2;
  const radius = (size - strokeWidth * 2) / 2;

  const startAngle = 150;
  const totalDeg = 240;
  const circumference = (totalDeg / 360) * 2 * Math.PI * radius;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const startX = center + radius * Math.cos(toRad(startAngle));
  const startY = center + radius * Math.sin(toRad(startAngle));
  const endAngle = startAngle + totalDeg;
  const endX = center + radius * Math.cos(toRad(endAngle));
  const endY = center + radius * Math.sin(toRad(endAngle));

  const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY}`;
  const progress = (score / 100) * circumference;

  const scoreAngle = startAngle + (score / 100) * totalDeg;
  const dotX = center + radius * Math.cos(toRad(scoreAngle));
  const dotY = center + radius * Math.sin(toRad(scoreAngle));

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: "hsl(160, 55%, 45%)", glow: "hsl(160, 55%, 45%)", label: "SAFE TO MONETIZE" };
    if (s >= 60) return { stroke: "hsl(42, 78%, 58%)", glow: "hsl(42, 78%, 58%)", label: "REVIEW SUGGESTED" };
    return { stroke: "hsl(0, 62%, 55%)", glow: "hsl(0, 62%, 55%)", label: "HIGH RISK" };
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
        setAnimatedProgress(eased * progress);
        if (t < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [score, progress, delay]);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size * 0.82}`}>
        {/* Background track */}
        <path d={arcPath} fill="none" stroke="hsl(225, 12%, 16%)" strokeWidth={strokeWidth} strokeLinecap="round" />
        {/* Score arc */}
        <path
          d={arcPath}
          fill="none"
          stroke={color.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={circumference - animatedProgress}
          style={{ filter: `drop-shadow(0 0 6px ${color.glow})` }}
        />
        {/* Endpoint dot */}
        {mounted && (
          <>
            <circle cx={dotX} cy={dotY} r={5} fill={color.stroke} style={{ filter: `drop-shadow(0 0 4px ${color.glow})` }} />
            <circle cx={dotX} cy={dotY} r={2} fill="hsl(225, 20%, 7%)" />
          </>
        )}
        {/* Score number */}
        <text
          x={center} y={center - 2}
          textAnchor="middle" dominantBaseline="central"
          fill="hsl(220, 15%, 90%)"
          fontSize={size / 3.5}
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="700"
        >
          {mounted ? score : 0}
        </text>
        {/* Label */}
        <text
          x={center} y={center + size * 0.15}
          textAnchor="middle"
          fill="hsl(220, 10%, 50%)"
          fontSize={8}
          fontFamily="'Outfit', sans-serif"
          fontWeight="600"
          letterSpacing="1.5"
        >
          {label || color.label}
        </text>
      </svg>
    </div>
  );
};

export default ComplianceGauge;
