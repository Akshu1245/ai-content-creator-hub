import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Check, Sparkles, TrendingUp, FileText, Mic, Palette, Shield, Upload, Loader2 } from "lucide-react";
import StepNiche from "@/components/wizard/StepNiche";
import StepTrends from "@/components/wizard/StepTrends";
import StepScript from "@/components/wizard/StepScript";
import StepVoice from "@/components/wizard/StepVoice";
import StepCompliance from "@/components/wizard/StepCompliance";
import StepPublish from "@/components/wizard/StepPublish";

const steps = [
  { label: "Niche & Topic", icon: Sparkles },
  { label: "Trends", icon: TrendingUp },
  { label: "Script", icon: FileText },
  { label: "Voice & Style", icon: Mic },
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
    niche: "",
    topic: "",
    trendData: null,
    script: "",
    voice: "roger",
    style: "cinematic",
    complianceScore: null,
    platforms: ["youtube"],
    scheduledAt: "",
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
        <h1 className="text-2xl font-bold mb-2">Create New Video</h1>
        <p className="text-muted-foreground text-sm mb-8">Follow the steps to generate your faceless video</p>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-10 overflow-x-auto pb-2">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => i < currentStep && setCurrentStep(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  i === currentStep
                    ? "bg-primary/15 text-primary"
                    : i < currentStep
                    ? "text-primary cursor-pointer hover:bg-primary/10"
                    : "text-muted-foreground"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  i < currentStep
                    ? "bg-primary text-primary-foreground"
                    : i === currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {i < currentStep ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span className="hidden md:inline">{step.label}</span>
              </button>
              {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="animate-fade-in min-h-[400px]">
          {currentStep === 0 && <StepNiche data={data} updateData={updateData} />}
          {currentStep === 1 && <StepTrends data={data} updateData={updateData} />}
          {currentStep === 2 && <StepScript data={data} updateData={updateData} />}
          {currentStep === 3 && <StepVoice data={data} updateData={updateData} />}
          {currentStep === 4 && <StepCompliance data={data} updateData={updateData} />}
          {currentStep === 5 && <StepPublish data={data} updateData={updateData} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/30">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
            disabled={currentStep === 0}
            className="border-border text-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep((p) => Math.min(steps.length - 1, p + 1))}
              disabled={!canProceed()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Upload className="w-4 h-4 mr-2" /> Launch Video
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewProject;
