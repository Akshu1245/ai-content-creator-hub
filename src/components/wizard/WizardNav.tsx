import { Check } from "lucide-react";

interface WizardNavProps {
  steps: { label: string }[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

const WizardNav = ({ steps, currentStep, onStepClick }: WizardNavProps) => {
  const nodeSize = 40;
  const activeSize = 48;
  const spacing = 90;
  const totalWidth = (steps.length - 1) * spacing + activeSize;
  const svgHeight = activeSize + 40;

  const getCurvePath = (x1: number, x2: number, y: number) => {
    const cp1x = x1 + (x2 - x1) * 0.35;
    const cp2x = x1 + (x2 - x1) * 0.65;
    const curveAmount = 6;
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
        {/* Curved paths */}
        {steps.map((_, i) => {
          if (i === steps.length - 1) return null;
          const x1 = getNodeCx(i);
          const x2 = getNodeCx(i + 1);
          const path = getCurvePath(x1, x2, cy);
          return (
            <g key={`path-${i}`}>
              <path d={path} fill="none" stroke="hsl(22, 8%, 16%)" strokeWidth="2" />
              {i < currentStep && (
                <path d={path} fill="none" stroke="url(#wizard-grad)" strokeWidth="2" strokeLinecap="round" />
              )}
            </g>
          );
        })}

        <defs>
          <linearGradient id="wizard-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(12, 76%, 56%)" />
            <stop offset="100%" stopColor="hsl(158, 32%, 45%)" />
          </linearGradient>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

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
              {isCurrent && (
                <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="hsl(12, 76%, 56%)" strokeWidth="1.5" opacity="0.3">
                  <animate attributeName="r" values={`${r + 2};${r + 8};${r + 2}`} dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
                </circle>
              )}

              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={
                  isComplete ? "url(#wizard-grad)" : isCurrent ? "hsl(12, 76%, 56%, 0.1)" : "hsl(24, 12%, 6%)"
                }
                stroke={
                  isComplete ? "none" : isCurrent ? "hsl(12, 76%, 56%)" : "hsl(22, 8%, 18%)"
                }
                strokeWidth={isCurrent ? 2 : 1}
                filter={isCurrent ? "url(#node-glow)" : undefined}
              />

              {isComplete ? (
                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="hsl(24, 12%, 5%)" fontSize="13" fontWeight="bold">
                  ✓
                </text>
              ) : (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isCurrent ? "hsl(12, 76%, 56%)" : "hsl(28, 10%, 42%)"}
                  fontSize={isCurrent ? "14" : "12"}
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="600"
                >
                  {i + 1}
                </text>
              )}

              <text
                x={cx}
                y={cy + r + 14}
                textAnchor="middle"
                fill={isComplete ? "hsl(158, 32%, 45%)" : isCurrent ? "hsl(12, 76%, 56%)" : "hsl(28, 10%, 42%)"}
                fontSize="9"
                fontFamily="'Inter', sans-serif"
                fontWeight="600"
                letterSpacing="1.5"
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
