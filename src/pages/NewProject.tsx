import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ChevronRight, ChevronLeft, Check, Sparkles, TrendingUp, FileText, Mic, Shield, Upload } from "lucide-react";
import StepNiche from "@/components/wizard/StepNiche";
import StepTrends from "@/components/wizard/StepTrends";
import StepScript from "@/components/wizard/StepScript";
import StepVoice from "@/components/wizard/StepVoice";
import StepCompliance from "@/components/wizard/StepCompliance";
import StepPublish from "@/components/wizard/StepPublish";

const steps = [
  { label: "Niche", icon: Sparkles },
  { label: "Trends", icon: TrendingUp },
  { label: "Script", icon: FileText },
  { label: "Voice", icon: Mic },
  { label: "Compliance", icon: Shield },
  { label: "Publish", icon: Upload },
];

export interface WizardData {
  niche: string;
  topic: string;
  trendData: any;
  script: string;
  voice: string;
  style: string;
  complianceScore: number | null;
  platforms: string[];
  scheduledAt: string;
}

const NewProject = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    niche: "", topic: "", trendData: null, script: "",
    voice: "roger", style: "cinematic", complianceScore: null,
    platforms: ["youtube"], scheduledAt: "",
  });

  const updateData = (updates: Partial<WizardData>) => setData((prev) => ({ ...prev, ...updates }));

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.niche && data.topic;
      case 1: return true;
      case 2: return data.script.length > 50;
      case 3: return data.voice && data.style;
      case 4: return true;
      case 5: return data.platforms.length > 0;
      default: return true;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-display font-bold mb-1">Create New Video</h1>
          <p className="text-sm" style={{ color: "hsl(205 40% 55%)" }}>Follow the pipeline to generate your faceless video</p>
        </div>

        {/* Progress - orbital style */}
        <div className="flex items-center gap-1 mb-10 overflow-x-auto pb-2">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => i < currentStep && setCurrentStep(i)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-display font-bold transition-all"
                style={{
                  background: i === currentStep ? "rgba(14,165,233,0.12)" : i < currentStep ? "transparent" : "transparent",
                  border: i === currentStep ? "1px solid rgba(14,165,233,0.25)" : "1px solid transparent",
                  color: i < currentStep ? "#06D6A0" : i === currentStep ? "#0EA5E9" : "hsl(210 25% 35%)",
                  cursor: i < currentStep ? "pointer" : "default",
                }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{
                  background: i < currentStep
                    ? "linear-gradient(135deg, #0EA5E9, #06D6A0)"
                    : i === currentStep
                    ? "rgba(14,165,233,0.2)"
                    : "rgba(42,72,112,0.2)",
                  color: i < currentStep ? "#020409" : undefined,
                  border: i >= currentStep ? `1px solid ${i === currentStep ? "rgba(14,165,233,0.3)" : "rgba(42,72,112,0.3)"}` : "none",
                }}>
                  {i < currentStep ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className="hidden md:inline">{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className="w-6 h-px mx-1" style={{ background: i < currentStep ? "rgba(6,214,160,0.4)" : "rgba(42,72,112,0.3)" }} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="animate-fade-in min-h-[420px]" key={currentStep}>
          {currentStep === 0 && <StepNiche data={data} updateData={updateData} />}
          {currentStep === 1 && <StepTrends data={data} updateData={updateData} />}
          {currentStep === 2 && <StepScript data={data} updateData={updateData} />}
          {currentStep === 3 && <StepVoice data={data} updateData={updateData} />}
          {currentStep === 4 && <StepCompliance data={data} updateData={updateData} />}
          {currentStep === 5 && <StepPublish data={data} updateData={updateData} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: "1px solid rgba(42,72,112,0.2)" }}>
          <button
            onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-display font-bold transition-all disabled:opacity-30"
            style={{ border: "1px solid rgba(42,72,112,0.3)", color: "hsl(205 40% 62%)" }}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((p) => Math.min(steps.length - 1, p + 1))}
              disabled={!canProceed()}
              className="btn-primary flex items-center gap-1 disabled:opacity-30"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button className="btn-primary flex items-center gap-2">
              <Upload className="w-4 h-4" /> Launch Video
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewProject;
