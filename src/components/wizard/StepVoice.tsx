import { useState, useRef, useCallback } from "react";
import { WizardData } from "@/pages/NewProject";
import { Volume2, Play, Square, Pause } from "lucide-react";

interface Props { data: WizardData; updateData: (u: Partial<WizardData>) => void; }

const voices = [
  { id: "roger", name: "Marcus", desc: "Deep, authoritative narrator", gender: "Male", sample: "Welcome to the world of faceless content creation. Today, we'll explore how compound interest can transform your financial future — and why most people completely overlook its power." },
  { id: "sarah", name: "Sophia", desc: "Warm, engaging voice", gender: "Female", sample: "Have you ever wondered what makes a video truly captivating? It's not just the visuals — it's the story behind them. Let me walk you through something fascinating." },
  { id: "george", name: "Atlas", desc: "Classic documentary style", gender: "Male", sample: "In the depths of the ocean, a world exists that few have ever seen. This is the story of discovery, persistence, and the relentless pursuit of knowledge." },
  { id: "lily", name: "Nova", desc: "Young, energetic presenter", gender: "Female", sample: "Okay so here's the thing — nobody talks about this, and honestly it's kind of wild. Let me break it down for you in the simplest way possible." },
  { id: "brian", name: "Leo", desc: "Calm, educational tone", gender: "Male", sample: "Let's take a step back and understand the fundamentals. When we look at the data, a clear pattern emerges — one that challenges conventional wisdom." },
  { id: "jessica", name: "Zara", desc: "Professional, clear delivery", gender: "Female", sample: "The numbers don't lie. In today's analysis, we're examining three key trends that will shape the industry for the next decade. Here's what you need to know." },
];

const styles = [
  { id: "cinematic", name: "Cinematic", desc: "Dramatic visuals, film-like grading" },
  { id: "minimal", name: "Minimal", desc: "Clean layouts, subtle motion" },
  { id: "dynamic", name: "Dynamic", desc: "Fast cuts, bold text, energy" },
  { id: "retro", name: "Retro", desc: "Vintage aesthetics, nostalgic feel" },
];

const StepVoice = ({ data, updateData }: Props) => {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [loadingVoice, setLoadingVoice] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopPlayback = useCallback(() => {
    window.speechSynthesis.cancel();
    setPlayingVoice(null);
    setLoadingVoice(null);
  }, []);

  const playVoicePreview = useCallback((voiceId: string, sampleText: string) => {
    // If already playing this voice, stop it
    if (playingVoice === voiceId) {
      stopPlayback();
      return;
    }

    // Stop any current playback
    stopPlayback();
    setLoadingVoice(voiceId);

    const utterance = new SpeechSynthesisUtterance(sampleText);
    utteranceRef.current = utterance;

    // Map voice IDs to speech synthesis voice characteristics
    const voiceSettings: Record<string, { pitch: number; rate: number }> = {
      roger: { pitch: 0.8, rate: 0.9 },
      sarah: { pitch: 1.1, rate: 1.0 },
      george: { pitch: 0.7, rate: 0.85 },
      lily: { pitch: 1.3, rate: 1.1 },
      brian: { pitch: 0.9, rate: 0.95 },
      jessica: { pitch: 1.0, rate: 1.0 },
    };

    const settings = voiceSettings[voiceId] || { pitch: 1, rate: 1 };
    utterance.pitch = settings.pitch;
    utterance.rate = settings.rate;
    utterance.volume = 1;

    utterance.onstart = () => {
      setLoadingVoice(null);
      setPlayingVoice(voiceId);
    };

    utterance.onend = () => {
      setPlayingVoice(null);
    };

    utterance.onerror = () => {
      setPlayingVoice(null);
      setLoadingVoice(null);
    };

    window.speechSynthesis.speak(utterance);
  }, [playingVoice, stopPlayback]);

  return (
    <div className="space-y-8">
      <div>
        <span className="font-label text-primary block mb-1">STEP 4</span>
        <h2 className="text-xl font-display text-foreground mb-1">Voice & Style</h2>
        <p className="text-sm text-muted-foreground">Choose narrator voice and visual style for your video</p>
      </div>

      <div>
        <h3 className="text-sm font-display text-foreground mb-3">Narrator Voice</h3>
        <p className="text-xs text-muted-foreground mb-3">Click the play button to preview each voice before selecting</p>
        <div className="grid md:grid-cols-3 gap-3">
          {voices.map((voice) => {
            const isPlaying = playingVoice === voice.id;
            const isLoading = loadingVoice === voice.id;
            const isSelected = data.voice === voice.id;

            return (
              <div
                key={voice.id}
                className={`relative rounded-lg transition-all border ${
                  isSelected
                    ? "bg-primary/8 border-primary"
                    : "bg-card border-border hover:border-primary/30"
                }`}
              >
                {/* Select area */}
                <button
                  onClick={() => updateData({ voice: voice.id })}
                  className="text-left w-full px-4 pt-4 pb-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display text-sm text-foreground">{voice.name}</span>
                    <span className="text-xs text-muted-foreground">{voice.gender}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{voice.desc}</p>
                </button>

                {/* Preview button */}
                <div className="px-4 pb-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playVoicePreview(voice.id, voice.sample);
                    }}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-md text-xs font-medium transition-all ${
                      isPlaying
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </>
                    ) : isPlaying ? (
                      <>
                        <Square className="w-3 h-3" />
                        Stop Preview
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        Preview Voice
                      </>
                    )}
                  </button>
                </div>

                {/* Playing indicator */}
                {isPlaying && (
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          className="w-0.5 bg-primary rounded-full animate-pulse"
                          style={{
                            height: `${8 + Math.random() * 8}px`,
                            animationDelay: `${bar * 0.15}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-display text-foreground mb-3">Narration Speed</h3>
        <div className="surface-raised p-4 flex items-center gap-4">
          <span className="text-xs font-mono text-muted-foreground">0.8×</span>
          <input type="range" min="0.8" max="1.2" step="0.1" defaultValue="1.0" className="flex-1 accent-primary" />
          <span className="text-xs font-mono text-muted-foreground">1.2×</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-display text-foreground mb-3">Visual Style</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => updateData({ style: style.id })}
              className={`text-center px-3 py-4 rounded-lg transition-all border ${
                data.style === style.id
                  ? "bg-primary/8 border-primary"
                  : "bg-card border-border hover:border-primary/30"
              }`}
            >
              <div className="font-display text-sm text-foreground">{style.name}</div>
              <p className="text-xs text-muted-foreground mt-1">{style.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepVoice;
