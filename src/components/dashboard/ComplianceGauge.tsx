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

  const strokeWidth = size > 120 ? 10 : 7;
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
    if (s >= 80) return { stroke: "hsl(174, 72%, 22%)", label: "SAFE TO MONETIZE" };
    if (s >= 60) return { stroke: "hsl(40, 70%, 52%)", label: "REVIEW SUGGESTED" };
    return { stroke: "hsl(0, 65%, 48%)", label: "HIGH RISK" };
  };

  const color = getColor(score);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      let start: number | null = null;
      const duration = 1000;
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
        <path d={arcPath} fill="none" stroke="hsl(30, 12%, 85%)" strokeWidth={strokeWidth} strokeLinecap="round" />
        <path
          d={arcPath}
          fill="none"
          stroke={color.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={circumference - animatedProgress}
        />
        {mounted && <circle cx={dotX} cy={dotY} r={4} fill={color.stroke} />}
        <text
          x={center} y={center - 2}
          textAnchor="middle" dominantBaseline="central"
          fill="hsl(20, 14%, 12%)"
          fontSize={size / 3.5}
          fontFamily="'IBM Plex Mono', monospace"
          fontWeight="600"
        >
          {mounted ? score : 0}
        </text>
        <text
          x={center} y={center + size * 0.15}
          textAnchor="middle"
          fill="hsl(20, 8%, 52%)"
          fontSize={9}
          fontFamily="'Plus Jakarta Sans', sans-serif"
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
