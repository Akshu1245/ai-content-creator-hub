import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";

interface PipelineStep {
  name: string;
  key: string;
}

const PIPELINE_STEPS: PipelineStep[] = [
  { name: "Initialize", key: "initializing" },
  { name: "Trends", key: "analyzing_trends" },
  { name: "Script", key: "script_generated" },
  { name: "Voiceover", key: "voiceover_complete" },
  { name: "Visuals", key: "visuals_assembled" },
  { name: "Captions", key: "captions_added" },
  { name: "Compliance", key: "compliance_scored" },
  { name: "Thumbnails", key: "thumbnails_ready" },
  { name: "Formatting", key: "formatting_complete" },
  { name: "Complete", key: "complete" },
];

type StepState = "pending" | "active" | "complete";

interface PipelineProgressProps {
  activeStep?: number;
  progress?: number;
  className?: string;
}

const TypewriterText = ({ text, active }: { text: string; active: boolean }) => {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    if (!active) { setDisplayed(text); return; }
    setDisplayed("");
    idx.current = 0;
    const interval = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [text, active]);

  return <span>{displayed}</span>;
};

const PipelineProgress = ({ activeStep = 3, progress = 40, className = "" }: PipelineProgressProps) => {
  const getState = (i: number): StepState => {
    if (i < activeStep) return "complete";
    if (i === activeStep) return "active";
    return "pending";
  };

  return (
    <div className={`glass-elevated p-6 md:p-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-display font-bold text-foreground text-lg">Pipeline Status</h3>
          <p className="text-xs font-label mt-1" style={{ color: "hsl(210 25% 40%)" }}>
            {activeStep < 10 ? `Step ${activeStep + 1} of 10` : "Complete"}
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-mono font-bold text-cyan">{progress}%</div>
          <div className="text-xs font-label" style={{ color: "hsl(210 25% 40%)" }}>
            {activeStep < 10 ? `~${Math.ceil((100 - progress) * 0.18)}min remaining` : "Done"}
          </div>
        </div>
      </div>

      {/* Desktop horizontal */}
      <div className="hidden md:block">
        <div className="flex items-start justify-between relative">
          {/* Connecting line background */}
          <div className="absolute top-5 left-5 right-5 h-0.5" style={{ background: "rgba(42,72,112,0.3)" }} />
          {/* Filled line */}
          <div
            className="absolute top-5 left-5 h-0.5 transition-all duration-700"
            style={{
              width: `${(activeStep / (PIPELINE_STEPS.length - 1)) * (100 - 5)}%`,
              background: "linear-gradient(90deg, #0EA5E9, #06D6A0)",
            }}
          />

          {PIPELINE_STEPS.map((step, i) => {
            const state = getState(i);
            return (
              <div key={step.key} className="flex flex-col items-center relative z-10" style={{ width: `${100 / PIPELINE_STEPS.length}%` }}>
                {/* Node */}
                <div className="relative">
                  {state === "active" && (
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        animation: "pulseRing 2s ease-out infinite",
                        background: "rgba(14,165,233,0.2)",
                        transform: "scale(1.8)",
                      }}
                    />
                  )}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-mono font-bold relative z-10 transition-all duration-300"
                    style={{
                      background: state === "complete"
                        ? "linear-gradient(135deg, #06D6A0, #0EA5E9)"
                        : state === "active"
                        ? "rgba(14,165,233,0.15)"
                        : "rgba(8,13,20,0.8)",
                      border: state === "complete"
                        ? "none"
                        : state === "active"
                        ? "2px solid #0EA5E9"
                        : "1px solid rgba(42,72,112,0.4)",
                      color: state === "complete"
                        ? "#020409"
                        : state === "active"
                        ? "#0EA5E9"
                        : "hsl(210 25% 35%)",
                      boxShadow: state === "active" ? "0 0 20px rgba(14,165,233,0.3)" : "none",
                    }}
                  >
                    {state === "complete" ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  {state === "active" && (
                    <svg className="absolute inset-0 w-10 h-10" viewBox="0 0 40 40" style={{ animation: "spin 2s linear infinite" }}>
                      <circle cx="20" cy="20" r="18" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeDasharray="20 94" strokeLinecap="round" opacity="0.6" />
                    </svg>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center" style={{ minHeight: 20 }}>
                  <span
                    className="text-[10px] font-label uppercase tracking-[1px]"
                    style={{ color: state === "active" ? "#0EA5E9" : state === "complete" ? "#06D6A0" : "hsl(210 25% 35%)" }}
                  >
                    <TypewriterText text={step.name} active={state === "active"} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile vertical */}
      <div className="md:hidden space-y-3">
        {PIPELINE_STEPS.map((step, i) => {
          const state = getState(i);
          return (
            <div key={step.key} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0"
                style={{
                  background: state === "complete"
                    ? "linear-gradient(135deg, #06D6A0, #0EA5E9)"
                    : state === "active"
                    ? "rgba(14,165,233,0.15)"
                    : "rgba(8,13,20,0.8)",
                  border: state === "active" ? "2px solid #0EA5E9" : state === "pending" ? "1px solid rgba(42,72,112,0.4)" : "none",
                  color: state === "complete" ? "#020409" : state === "active" ? "#0EA5E9" : "hsl(210 25% 35%)",
                }}
              >
                {state === "complete" ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className="text-xs font-label uppercase tracking-[1px]"
                style={{ color: state === "active" ? "#0EA5E9" : state === "complete" ? "#06D6A0" : "hsl(210 25% 35%)" }}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineProgress;
