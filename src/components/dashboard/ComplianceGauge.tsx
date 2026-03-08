import { useEffect, useState } from "react";
import AnimatedNumber from "@/components/shared/AnimatedNumber";

interface ComplianceGaugeProps {
  score: number;
  size?: number;
  label?: string;
  delay?: number;
}

const ComplianceGauge = ({ score, size = 200, label, delay = 400 }: ComplianceGaugeProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  const strokeWidth = 10;
  const center = size / 2;
  const radius = (size - strokeWidth * 2) / 2;

  // 240-degree arc: from 150° to 30° (clockwise)
  const startAngle = 150;
  const endAngle = 390; // 150 + 240
  const totalDeg = 240;
  const circumference = (totalDeg / 360) * 2 * Math.PI * radius;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const startX = center + radius * Math.cos(toRad(startAngle));
  const startY = center + radius * Math.sin(toRad(startAngle));
  const endX = center + radius * Math.cos(toRad(endAngle));
  const endY = center + radius * Math.sin(toRad(endAngle));

  const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY}`;

  const progress = (score / 100) * circumference;

  // Score endpoint position
  const scoreAngle = startAngle + (score / 100) * totalDeg;
  const dotX = center + radius * Math.cos(toRad(scoreAngle));
  const dotY = center + radius * Math.sin(toRad(scoreAngle));

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: "#06D6A0", glow: "rgba(6,214,160,0.4)", label: "SAFE TO MONETIZE", risk: "safe" };
    if (s >= 60) return { stroke: "#FFB703", glow: "rgba(255,183,3,0.4)", label: "REVIEW SUGGESTED", risk: "caution" };
    return { stroke: "#FF4365", glow: "rgba(255,67,101,0.4)", label: "HIGH RISK", risk: "high_risk" };
  };

  const color = getColor(score);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      // Animate progress
      let start: number | null = null;
      const duration = 1200;
      const animate = (ts: number) => {
        if (!start) start = ts;
        const elapsed = ts - start;
        const t = Math.min(elapsed / duration, 1);
        // ease-out cubic
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
      <svg width={size} height={size * 0.75} viewBox={`0 0 ${size} ${size * 0.85}`}>
        {/* Glow filter */}
        <defs>
          <filter id={`glow-${score}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`dot-pulse-${score}`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <path
          d={arcPath}
          fill="none"
          stroke="rgba(42,72,112,0.25)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Score arc */}
        <path
          d={arcPath}
          fill="none"
          stroke={color.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={circumference - animatedProgress}
          filter={`url(#glow-${score})`}
        />

        {/* Pulsing endpoint dot */}
        {mounted && (
          <>
            <circle
              cx={dotX}
              cy={dotY}
              r={6}
              fill={color.stroke}
              filter={`url(#dot-pulse-${score})`}
            >
              <animate
                attributeName="r"
                values="5;9;5"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0.4;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx={dotX} cy={dotY} r={3.5} fill={color.stroke} />
          </>
        )}

        {/* Center score */}
        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          dominantBaseline="central"
          fill={color.stroke}
          fontSize={size / 3.5}
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="700"
        >
          {mounted ? score : 0}
        </text>

        {/* Risk label */}
        <text
          x={center}
          y={center + size * 0.16}
          textAnchor="middle"
          fill="hsl(205 40% 55%)"
          fontSize={10}
          fontFamily="'Syne Mono', monospace"
          letterSpacing="2"
        >
          {label || color.label}
        </text>
      </svg>
    </div>
  );
};

export default ComplianceGauge;
