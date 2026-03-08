import { Check } from "lucide-react";

interface WizardNavProps {
  steps: { label: string }[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

const WizardNav = ({ steps, currentStep, onStepClick }: WizardNavProps) => {
  const nodeSize = 44;
  const activeSize = 52;
  const spacing = 100; // px between centers
  const totalWidth = (steps.length - 1) * spacing + activeSize;
  const svgHeight = activeSize + 40; // room for labels

  // Generate S-curve path between two points
  const getCurvePath = (x1: number, x2: number, y: number) => {
    const midX = (x1 + x2) / 2;
    const cp1x = x1 + (x2 - x1) * 0.35;
    const cp2x = x1 + (x2 - x1) * 0.65;
    const curveAmount = 8;
    return `M ${x1} ${y} C ${cp1x} ${y - curveAmount}, ${cp2x} ${y + curveAmount}, ${x2} ${y}`;
  };

  const getNodeCx = (i: number) => activeSize / 2 + i * spacing;
  const cy = activeSize / 2;

  return (
    <div className="w-full overflow-x-auto pb-2">
      <svg
        width={totalWidth}
        height={svgHeight}
        viewBox={`0 0 ${totalWidth} ${svgHeight}`}
        className="mx-auto block"
        style={{ maxWidth: "100%" }}
      >
        {/* Curved paths between nodes */}
        {steps.map((_, i) => {
          if (i === steps.length - 1) return null;
          const x1 = getNodeCx(i);
          const x2 = getNodeCx(i + 1);
          const path = getCurvePath(x1, x2, cy);

          return (
            <g key={`path-${i}`}>
              {/* Background path */}
              <path d={path} fill="none" stroke="rgba(42,72,112,0.3)" strokeWidth="2" />
              {/* Filled path (for completed steps) */}
              {i < currentStep && (
                <path
                  d={path}
                  fill="none"
                  stroke="url(#wizard-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: spacing,
                    strokeDashoffset: 0,
                    transition: "stroke-dashoffset 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                />
              )}
            </g>
          );
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="wizard-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#06D6A0" />
          </linearGradient>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Step nodes */}
        {steps.map((step, i) => {
          const cx = getNodeCx(i);
          const isComplete = i < currentStep;
          const isCurrent = i === currentStep;
          const r = isCurrent ? activeSize / 2 : nodeSize / 2;

          return (
            <g
              key={step.label}
              onClick={() => isComplete && onStepClick(i)}
              style={{ cursor: isComplete ? "pointer" : "default" }}
            >
              {/* Active glow ring */}
              {isCurrent && (
                <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#0EA5E9" strokeWidth="1.5" opacity="0.3">
                  <animate attributeName="r" values={`${r + 2};${r + 10};${r + 2}`} dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Node circle */}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={
                  isComplete ? "url(#wizard-gradient)" : isCurrent ? "rgba(14,165,233,0.12)" : "rgba(8,13,20,0.9)"
                }
                stroke={
                  isComplete ? "none" : isCurrent ? "#0EA5E9" : "rgba(42,72,112,0.4)"
                }
                strokeWidth={isCurrent ? 2 : 1}
                filter={isCurrent ? "url(#node-glow)" : undefined}
              />

              {/* Icon/number */}
              {isComplete ? (
                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#020409" fontSize="14" fontWeight="bold">
                  ✓
                </text>
              ) : (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isCurrent ? "#0EA5E9" : "hsl(210,25%,35%)"}
                  fontSize={isCurrent ? "16" : "13"}
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="600"
                >
                  {i + 1}
                </text>
              )}

              {/* Label */}
              <text
                x={cx}
                y={cy + r + 16}
                textAnchor="middle"
                fill={isComplete ? "#06D6A0" : isCurrent ? "#0EA5E9" : "hsl(210,25%,35%)"}
                fontSize="10"
                fontFamily="'Syne Mono', monospace"
                letterSpacing="1"
                textTransform="uppercase"
              >
                {step.label.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default WizardNav;
