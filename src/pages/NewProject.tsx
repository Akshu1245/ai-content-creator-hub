import { useState, useEffect, useRef, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ChevronRight, ChevronLeft, Check, Upload, Download, ExternalLink, RotateCcw, Loader2 } from "lucide-react";
import StepNiche from "@/components/wizard/StepNiche";
import StepTrends from "@/components/wizard/StepTrends";
import StepScript from "@/components/wizard/StepScript";
import StepVoice from "@/components/wizard/StepVoice";
import StepCompliance from "@/components/wizard/StepCompliance";
import StepPublish from "@/components/wizard/StepPublish";
import PipelineProgress from "@/components/dashboard/PipelineProgress";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [generationPhase, setGenerationPhase] = useState<'voiceover' | 'video' | 'complete'>('voiceover');
  const [pipelineStep, setPipelineStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
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

  // Cleanup polling on unmount
  useEffect(() => {
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  const handleLaunch = async () => {
    setLaunched(true);
    setGenerationPhase('voiceover');
    setPipelineStep(0);
    setProgress(10);
    setError(null);

    try {
      // Phase 1: Generate voiceover with Sarvam AI
      toast.info('Generating voiceover with Sarvam AI...');
      setPipelineStep(1);
      setProgress(20);

      const scriptText = data.script.length > 500 ? data.script.substring(0, 500) : data.script;
      
      const { data: voiceData, error: voiceError } = await supabase.functions.invoke('generate-voice', {
        body: { text: scriptText, speaker: data.voice, speed: 1.0 },
      });

      if (voiceError) throw new Error(`Voice generation failed: ${voiceError.message}`);
      if (!voiceData?.audio_base64) throw new Error('No audio was generated');
      
      setAudioBase64(voiceData.audio_base64);
      setProgress(40);
      toast.success('Voiceover generated!');

      // Phase 2: Generate video with Kling AI
      setGenerationPhase('video');
      setPipelineStep(2);
      setProgress(50);
      toast.info('Generating video with Kling AI...');

      const videoPrompt = `${data.style} style video about: ${data.topic}. ${data.niche} niche. High quality, professional faceless content.`;

      const { data: createData, error: createError } = await supabase.functions.invoke('generate-video', {
        body: { action: 'create', prompt: videoPrompt, duration: '5', aspect_ratio: '16:9' },
      });

      if (createError) throw new Error(`Video creation failed: ${createError.message}`);
      if (!createData?.task_id) throw new Error('No task ID returned from video API');

      const taskId = createData.task_id;
      setPipelineStep(3);
      setProgress(60);

      // Poll for video completion
      await new Promise<void>((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 60; // 5 minutes max

        pollingRef.current = setInterval(async () => {
          attempts++;
          if (attempts > maxAttempts) {
            if (pollingRef.current) clearInterval(pollingRef.current);
            reject(new Error('Video generation timed out after 5 minutes'));
            return;
          }

          try {
            const { data: queryData, error: queryError } = await supabase.functions.invoke('generate-video', {
              body: { action: 'query', task_id: taskId },
            });

            if (queryError) throw queryError;

            const status = queryData?.status;
            setProgress(60 + Math.min(attempts * 0.5, 30));

            if (status === 'succeed' && queryData?.video_url) {
              if (pollingRef.current) clearInterval(pollingRef.current);
              setVideoUrl(queryData.video_url);
              resolve();
            } else if (status === 'failed') {
              if (pollingRef.current) clearInterval(pollingRef.current);
              reject(new Error('Video generation failed on Kling AI side'));
            }
          } catch (e) {
            console.error('Polling error:', e);
          }
        }, 5000);
      });

      setGenerationPhase('complete');
      setProgress(100);
      setPipelineStep(5);
      toast.success('Video is ready!');

    } catch (err) {
      console.error('Generation error:', err);
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleDownloadVideo = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  const handleDownloadAudio = () => {
    if (audioBase64) {
      const link = document.createElement('a');
      link.href = `data:audio/wav;base64,${audioBase64}`;
      link.download = `${data.topic || 'voiceover'}.wav`;
      link.click();
    }
  };

  const resetWizard = () => {
    setLaunched(false);
    setGenerationPhase('voiceover');
    setPipelineStep(0);
    setProgress(0);
    setVideoUrl(null);
    setAudioBase64(null);
    setError(null);
    setCurrentStep(0);
    setData({ niche: "", topic: "", trendData: null, script: "", voice: "roger", style: "cinematic", complianceScore: null, platforms: ["youtube"], scheduledAt: "" });
  };

  if (launched) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          {generationPhase !== 'complete' && !error ? (
            <>
              <div className="mb-8">
                <span className="text-[10px] font-label text-primary block mb-2">GENERATING</span>
                <h1 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Creating Your Video</h1>
                <p className="text-xs text-muted-foreground">
                  {generationPhase === 'voiceover' 
                    ? 'Sarvam AI is synthesizing your voiceover...' 
                    : 'Kling AI is rendering your video — this may take a few minutes.'}
                </p>
              </div>
              <PipelineProgress activeStep={pipelineStep} progress={progress} />
              <div className="mt-6 surface-raised p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <div>
                    <p className="text-xs text-foreground font-medium">
                      {generationPhase === 'voiceover' ? 'Generating voiceover...' : 'Rendering video...'}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {generationPhase === 'voiceover' ? `Voice: ${data.voice}` : `Style: ${data.style} · ${data.topic}`}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : error ? (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-label text-destructive block mb-2">ERROR</span>
                <h1 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Generation Failed</h1>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleLaunch} className="btn-primary text-xs flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5" /> Try Again
                </button>
                <button onClick={resetWizard} className="btn-ghost text-xs">Start Over</button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-label text-emerald block mb-2">COMPLETE</span>
                <h1 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Your Video is Ready</h1>
                <p className="text-xs text-muted-foreground">Successfully generated with Sarvam AI voice + Kling AI video.</p>
              </div>

              <div className="surface-raised overflow-hidden rounded-xl">
                {videoUrl ? (
                  <video controls className="w-full aspect-video bg-secondary" src={videoUrl} />
                ) : (
                  <div className="aspect-video bg-secondary flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-2xl bg-emerald/10 flex items-center justify-center mx-auto mb-3">
                        <Check className="w-7 h-7 text-emerald" />
                      </div>
                      <p className="text-xs font-display text-foreground font-bold">{data.topic || "Your Video"}</p>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex flex-wrap gap-3 mb-6">
                    {videoUrl && (
                      <button onClick={handleDownloadVideo} className="btn-primary flex items-center gap-2 text-xs">
                        <Download className="w-3.5 h-3.5" /> Download Video
                      </button>
                    )}
                    {audioBase64 && (
                      <button onClick={handleDownloadAudio} className="btn-ghost flex items-center gap-2 text-xs">
                        <Download className="w-3.5 h-3.5" /> Audio Only
                      </button>
                    )}
                    <button className="btn-ghost flex items-center gap-2 text-xs" onClick={() => { navigator.clipboard.writeText(videoUrl || ''); toast.success('Link copied!'); }}>
                      <ExternalLink className="w-3.5 h-3.5" /> Share
                    </button>
                  </div>
                  <div className="gradient-strip mb-6" />
                  <div className="flex flex-wrap gap-3">
                    <button onClick={resetWizard} className="btn-ghost flex items-center gap-2 text-xs">
                      <RotateCcw className="w-3.5 h-3.5" /> Create Another
                    </button>
                    <Link to="/dashboard">
                      <button className="btn-ghost text-xs">Back to Dashboard</button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="surface-raised p-4 rounded-xl">
                <p className="text-[10px] font-label text-muted-foreground mb-2">GENERATION DETAILS</p>
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div><span className="text-muted-foreground">Topic:</span> <span className="text-foreground">{data.topic}</span></div>
                  <div><span className="text-muted-foreground">Niche:</span> <span className="text-foreground">{data.niche}</span></div>
                  <div><span className="text-muted-foreground">Voice:</span> <span className="text-foreground">{data.voice}</span></div>
                  <div><span className="text-muted-foreground">Style:</span> <span className="text-foreground">{data.style}</span></div>
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

        {/* Step progress */}
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
            <button className="btn-primary flex items-center gap-2 px-10 py-3.5" onClick={handleLaunch}>
              <Upload className="w-3.5 h-3.5" /> Launch Video
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewProject;
