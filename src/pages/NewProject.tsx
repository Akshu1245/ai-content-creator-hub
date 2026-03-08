import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ChevronRight, ChevronLeft, Check, Upload, Download, ExternalLink, RotateCcw } from "lucide-react";
import StepNiche from "@/components/wizard/StepNiche";
import StepTrends from "@/components/wizard/StepTrends";
import StepScript from "@/components/wizard/StepScript";
import StepVoice from "@/components/wizard/StepVoice";
import StepCompliance from "@/components/wizard/StepCompliance";
import StepPublish from "@/components/wizard/StepPublish";
import PipelineProgress from "@/components/dashboard/PipelineProgress";
import { Link } from "react-router-dom";

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
  const [generationComplete, setGenerationComplete] = useState(false);
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

  const handleDownload = () => {
    alert(`Download starting for: "${data.topic || "Untitled Video"}.mp4"\n\nIn production, this downloads from storage.`);
  };

  if (launched) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          {!generationComplete ? (
            <>
              <div className="mb-8">
                <span className="text-[10px] font-label text-primary block mb-2">GENERATING</span>
                <h1 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Creating Your Video</h1>
                <p className="text-xs text-muted-foreground">AI is assembling your faceless video — this usually takes a few minutes.</p>
              </div>
              <PipelineProgress activeStep={3} progress={40} />
            </>
          ) : (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-label text-emerald block mb-2">COMPLETE</span>
                <h1 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Your Video is Ready</h1>
                <p className="text-xs text-muted-foreground">Successfully generated.</p>
              </div>

              <div className="surface-raised overflow-hidden">
                <div className="aspect-video bg-secondary flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-emerald/10 flex items-center justify-center mx-auto mb-3">
                      <Check className="w-7 h-7 text-emerald" />
                    </div>
                    <p className="text-xs font-display text-foreground font-bold">{data.topic || "Your Video"}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{data.niche} · {data.style} · {data.voice}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-3 mb-6">
                    <button onClick={handleDownload} className="btn-primary flex items-center gap-2 text-xs">
                      <Download className="w-3.5 h-3.5" /> Download Video
                    </button>
                    <button onClick={handleDownload} className="btn-ghost flex items-center gap-2 text-xs">
                      <Download className="w-3.5 h-3.5" /> Audio Only
                    </button>
                    <button className="btn-ghost flex items-center gap-2 text-xs" onClick={() => alert("Preview link copied!")}>
                      <ExternalLink className="w-3.5 h-3.5" /> Share
                    </button>
                  </div>
                  <div className="gradient-strip mb-6" />
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => { setLaunched(false); setGenerationComplete(false); setCurrentStep(0); setData({ niche: "", topic: "", trendData: null, script: "", voice: "roger", style: "cinematic", complianceScore: null, platforms: ["youtube"], scheduledAt: "" }); }} className="btn-ghost flex items-center gap-2 text-xs">
                      <RotateCcw className="w-3.5 h-3.5" /> Create Another
                    </button>
                    <Link to="/dashboard">
                      <button className="btn-ghost text-xs">Back to Dashboard</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl font-display text-foreground font-bold tracking-tight">Create a Video</h1>
          <p className="text-xs text-muted-foreground mt-1">Follow the steps to generate your faceless video.</p>
        </div>

        {/* Step progress — horizontal pills */}
        <div className="mb-10">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => i < currentStep && setCurrentStep(i)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs transition-all ${
                    i === currentStep
                      ? "bg-primary/15 text-primary font-bold border border-primary/20"
                      : i < currentStep
                      ? "text-emerald cursor-pointer hover:bg-secondary/50 border border-transparent"
                      : "text-muted-foreground border border-transparent"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold ${
                    i < currentStep ? "bg-emerald/15 text-emerald" :
                    i === currentStep ? "bg-primary/20 text-primary" :
                    "bg-secondary text-muted-foreground"
                  }`}>
                    {i < currentStep ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className="hidden md:inline">{step.label}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`w-4 h-px ${i < currentStep ? "bg-emerald/30" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-in min-h-[400px]" key={currentStep}>
          {currentStep === 0 && <StepNiche data={data} updateData={updateData} />}
          {currentStep === 1 && <StepTrends data={data} updateData={updateData} />}
          {currentStep === 2 && <StepScript data={data} updateData={updateData} />}
          {currentStep === 3 && <StepVoice data={data} updateData={updateData} />}
          {currentStep === 4 && <StepCompliance data={data} updateData={updateData} />}
          {currentStep === 5 && <StepPublish data={data} updateData={updateData} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/50">
          <button
            onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
            disabled={currentStep === 0}
            className="btn-ghost flex items-center gap-1.5 text-xs disabled:opacity-20"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((p) => Math.min(steps.length - 1, p + 1))}
              disabled={!canProceed()}
              className="btn-primary flex items-center gap-1.5 text-xs disabled:opacity-20"
            >
              Continue <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button className="btn-primary flex items-center gap-2 px-10 py-3.5" onClick={() => setLaunched(true)}>
              <Upload className="w-3.5 h-3.5" /> Launch Video
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewProject;
