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
    // In production this would download the actual generated video file
    // For now, show a toast/alert indicating the download would start
    const link = document.createElement("a");
    link.href = "#";
    link.download = `${data.topic || "faceless-video"}.mp4`;
    // Simulating download — in production, this URL comes from your storage
    alert(`Download starting for: "${data.topic || "Untitled Video"}.mp4"\n\nIn production, this would download your generated video file from storage.`);
  };

  // Simulate generation completing after launch
  useState(() => {
    if (launched && !generationComplete) {
      const timer = setTimeout(() => setGenerationComplete(true), 8000);
      return () => clearTimeout(timer);
    }
  });

  if (launched) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <span className="font-label text-muted-foreground block mb-1">
              {generationComplete ? "COMPLETE" : "GENERATING"}
            </span>
            <h1 className="text-xl font-display text-foreground mb-1">
              {generationComplete ? "Your Video is Ready!" : "Your Video is Being Created"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {generationComplete
                ? "Your faceless video has been generated successfully."
                : "AI is assembling your faceless video — this usually takes a few minutes."}
            </p>
          </div>

          {!generationComplete && (
            <PipelineProgress activeStep={3} progress={40} />
          )}

          {generationComplete && (
            <div className="space-y-6">
              {/* Video preview area */}
              <div className="surface-raised rounded-lg overflow-hidden">
                <div className="aspect-video bg-secondary flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Check className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-sm font-display text-foreground">{data.topic || "Your Video"}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {data.niche} · {data.style} style · {data.voice} voice
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display text-foreground">{data.topic || "Untitled Video"}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {data.platforms.length} platform{data.platforms.length > 1 ? "s" : ""} · {data.scheduledAt ? `Scheduled for ${new Date(data.scheduledAt).toLocaleDateString()}` : "Immediate publish"}
                      </p>
                    </div>
                    {data.complianceScore && (
                      <span className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold ${
                        data.complianceScore >= 80
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-accent/10 text-accent border border-accent/20"
                      }`}>
                        Score: {data.complianceScore}
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleDownload}
                      className="btn-primary flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" /> Download Video
                    </button>
                    <button
                      onClick={handleDownload}
                      className="btn-ghost flex items-center gap-2 text-sm border border-border"
                    >
                      <Download className="w-4 h-4" /> Download Audio Only
                    </button>
                    <button
                      className="btn-ghost flex items-center gap-2 text-sm border border-border"
                      onClick={() => {
                        // Open a share/preview in new tab (simulated)
                        alert("Preview link copied to clipboard!");
                      }}
                    >
                      <ExternalLink className="w-4 h-4" /> Share Preview
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary details */}
              <div className="surface-raised p-5 rounded-lg">
                <h3 className="text-sm font-display text-foreground mb-4">Generation Summary</h3>
                <div className="space-y-2.5 text-sm">
                  {[
                    { label: "Niche", value: data.niche || "—" },
                    { label: "Topic", value: data.topic || "—" },
                    { label: "Voice", value: data.voice ? data.voice.charAt(0).toUpperCase() + data.voice.slice(1) : "—" },
                    { label: "Style", value: data.style ? data.style.charAt(0).toUpperCase() + data.style.slice(1) : "—" },
                    { label: "Platforms", value: data.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(", ") },
                    { label: "Compliance", value: data.complianceScore ?? "Not checked" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                      <span className="font-label text-muted-foreground">{row.label.toUpperCase()}</span>
                      <span className="font-medium text-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setLaunched(false);
                    setGenerationComplete(false);
                    setCurrentStep(0);
                    setData({
                      niche: "", topic: "", trendData: null, script: "",
                      voice: "roger", style: "cinematic", complianceScore: null,
                      platforms: ["youtube"], scheduledAt: "",
                    });
                  }}
                  className="btn-ghost flex items-center gap-2 text-sm border border-border"
                >
                  <RotateCcw className="w-4 h-4" /> Create Another Video
                </button>
                <Link to="/dashboard">
                  <button className="btn-ghost flex items-center gap-2 text-sm border border-border">
                    Back to Dashboard
                  </button>
                </Link>
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
        <div className="mb-6">
          <span className="font-label text-muted-foreground block mb-1">NEW VIDEO</span>
          <h1 className="text-xl font-display text-foreground">Create a Video</h1>
        </div>

        {/* Step progress bar */}
        <div className="mb-8">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => i < currentStep && setCurrentStep(i)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    i === currentStep ? "bg-primary text-primary-foreground font-semibold" :
                    i < currentStep ? "text-primary cursor-pointer hover:bg-primary/5" :
                    "text-muted-foreground"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                    i < currentStep ? "bg-primary text-primary-foreground" :
                    i === currentStep ? "bg-primary-foreground text-primary" :
                    "bg-secondary text-muted-foreground"
                  }`}>
                    {i < currentStep ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className="hidden md:inline">{step.label}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`w-6 h-px ${i < currentStep ? "bg-primary" : "bg-border"}`} />
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
              className="btn-primary flex items-center gap-2 px-8 py-3"
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
