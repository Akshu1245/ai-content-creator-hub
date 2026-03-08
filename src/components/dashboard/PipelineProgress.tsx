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
    <div className={`surface-raised p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-foreground text-sm font-bold">Pipeline Status</h3>
          <p className="text-[10px] font-label text-muted-foreground mt-1">
            {activeStep < 10 ? `STEP ${activeStep + 1} OF 10` : "COMPLETE"}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono font-bold text-primary text-glow">{progress}%</div>
          <div className="text-[10px] font-label text-muted-foreground">
            {activeStep < 10 ? `~${Math.ceil((100 - progress) * 0.18)} MIN LEFT` : "DONE"}
          </div>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-secondary mb-6 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-700" style={{ width: `${progress}%` }} />
      </div>

      <div className="space-y-1.5">
        {PIPELINE_STEPS.map((step, i) => {
          const state = getState(i);
          return (
            <div key={step.key} className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
              state === "active" ? "bg-primary/5" : ""
            }`}>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-all ${
                state === "complete" ? "bg-emerald/15 text-emerald" :
                state === "active" ? "bg-primary/15 text-primary ring-1 ring-primary/30" :
                "bg-secondary text-muted-foreground"
              }`}>
                {state === "complete" ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span className={`text-xs ${
                state === "active" ? "text-primary font-medium" :
                state === "complete" ? "text-foreground" :
                "text-muted-foreground"
              }`}>
                {step.name}
              </span>
              {state === "active" && (
                <div className="ml-auto w-3 h-3 border-2 border-primary border-t-transparent rounded-full" style={{ animation: "spin 1s linear infinite" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineProgress;
