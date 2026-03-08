interface ComplianceGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

const ComplianceGauge = ({ score, size = 140, label }: ComplianceGaugeProps) => {
  const radius = (size - 16) / 2;
  const circumference = Math.PI * radius; // half circle
  const progress = (score / 100) * circumference;
  const center = size / 2;

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: "#06D6A0", glow: "rgba(6,214,160,0.3)", label: "Safe", emoji: "🟢" };
    if (s >= 60) return { stroke: "#FFB703", glow: "rgba(255,183,3,0.3)", label: "Caution", emoji: "🟡" };
    return { stroke: "#FF4365", glow: "rgba(255,67,101,0.3)", label: "High Risk", emoji: "🔴" };
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Background arc */}
        <path
          d={`M 8 ${center} A ${radius} ${radius} 0 0 1 ${size - 8} ${center}`}
          fill="none"
          stroke="rgba(42,72,112,0.3)"
          strokeWidth={8}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M 8 ${center} A ${radius} ${radius} 0 0 1 ${size - 8} ${center}`}
          fill="none"
          stroke={color.stroke}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={circumference - progress}
          style={{
            filter: `drop-shadow(0 0 8px ${color.glow})`,
            transition: "stroke-dashoffset 1s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        />
        {/* Score text */}
        <text
          x={center}
          y={center - 8}
          textAnchor="middle"
          fill={color.stroke}
          fontSize={size / 4}
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="700"
        >
          {score}
        </text>
        <text
          x={center}
          y={center + 14}
          textAnchor="middle"
          fill="hsl(205 40% 62%)"
          fontSize={11}
          fontFamily="'Syne Mono', monospace"
        >
          {label || `${color.emoji} ${color.label}`}
        </text>
      </svg>
    </div>
  );
};

export default ComplianceGauge;
