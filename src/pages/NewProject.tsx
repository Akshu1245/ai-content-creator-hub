import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ChevronRight, ChevronLeft, Check, Upload } from "lucide-react";
import StepNiche from "@/components/wizard/StepNiche";
import StepTrends from "@/components/wizard/StepTrends";
import StepScript from "@/components/wizard/StepScript";
import StepVoice from "@/components/wizard/StepVoice";
import StepCompliance from "@/components/wizard/StepCompliance";
import StepPublish from "@/components/wizard/StepPublish";
import PipelineProgress from "@/components/dashboard/PipelineProgress";

const steps = [
  { label: "Niche" },
  { label: "Trends" },
  { label: "Script" },
  { label: "Voice" },
  { label: "Review" },
  { label: "Publish" },
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
  const [launched, setLaunched] = useState(false);
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

  if (launched) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl font-display font-bold text-foreground mb-1">Generating Your Video</h1>
            <p className="text-sm text-muted-foreground">AI is assembling your faceless video</p>
          </div>
          <PipelineProgress activeStep={3} progress={40} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-display font-bold text-foreground mb-1">Create New Video</h1>
          <p className="text-sm text-muted-foreground">Follow the pipeline to generate your video</p>
        </div>

        {/* Step nav */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => i < currentStep && setCurrentStep(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  i === currentStep ? "bg-primary/10 text-primary border border-primary/20" :
                  i < currentStep ? "text-accent cursor-pointer" :
                  "text-muted-foreground"
                }`}
                style={{ cursor: i < currentStep ? "pointer" : i === currentStep ? "default" : "default" }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                  i < currentStep ? "bg-accent text-primary-foreground" :
                  i === currentStep ? "bg-primary text-primary-foreground" :
                  "bg-secondary text-muted-foreground"
                }`}>
                  {i < currentStep ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span className="hidden md:inline">{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`w-4 h-px ${i < currentStep ? "bg-accent" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="animate-fade-in min-h-[400px]" key={currentStep}>
          {currentStep === 0 && <StepNiche data={data} updateData={updateData} />}
          {currentStep === 1 && <StepTrends data={data} updateData={updateData} />}
          {currentStep === 2 && <StepScript data={data} updateData={updateData} />}
          {currentStep === 3 && <StepVoice data={data} updateData={updateData} />}
          {currentStep === 4 && <StepCompliance data={data} updateData={updateData} />}
          {currentStep === 5 && <StepPublish data={data} updateData={updateData} />}
        </div>

        <div className="flex items-center justify-between mt-8 pt-5 border-t border-border">
          <button
            onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
            disabled={currentStep === 0}
            className="btn-ghost flex items-center gap-1 text-sm disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((p) => Math.min(steps.length - 1, p + 1))}
              disabled={!canProceed()}
              className="btn-primary flex items-center gap-1 text-sm disabled:opacity-30"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              className="btn-primary flex items-center gap-2 px-6 py-3"
              onClick={() => setLaunched(true)}
            >
              <Upload className="w-4 h-4" /> Launch Video
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewProject;
