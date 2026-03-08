import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";

const PIPELINE_STEPS = [
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

const PipelineProgress = ({ activeStep = 3, progress = 40, className = "" }: PipelineProgressProps) => {
  const getState = (i: number): StepState => {
    if (i < activeStep) return "complete";
    if (i === activeStep) return "active";
    return "pending";
  };

  return (
    <div className={`surface-raised p-5 md:p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-foreground">Pipeline Status</h3>
          <p className="text-xs font-label text-muted-foreground mt-0.5">
            {activeStep < 10 ? `STEP ${activeStep + 1} OF 10` : "COMPLETE"}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono font-bold text-primary">{progress}%</div>
          <div className="text-xs font-label text-muted-foreground">
            {activeStep < 10 ? `~${Math.ceil((100 - progress) * 0.18)}MIN LEFT` : "DONE"}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-secondary mb-6 overflow-hidden">
        <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }} />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {PIPELINE_STEPS.map((step, i) => {
          const state = getState(i);
          return (
            <div key={step.key} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-semibold shrink-0 transition-all ${
                state === "complete" ? "bg-accent text-primary-foreground" :
                state === "active" ? "bg-primary text-primary-foreground" :
                "bg-secondary text-muted-foreground"
              }`}>
                {state === "complete" ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-sm ${
                state === "active" ? "text-primary font-medium" :
                state === "complete" ? "text-accent" :
                "text-muted-foreground"
              }`}>
                {step.name}
              </span>
              {state === "active" && (
                <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full" style={{ animation: "spin 1s linear infinite" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineProgress;
