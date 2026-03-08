import { useState, useRef, useCallback } from "react";
import { WizardData } from "@/pages/NewProject";
import { Play, Square, Volume2, Loader2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props { data: WizardData; updateData: (u: Partial<WizardData>) => void; }

const voices = [
  { id: "roger", name: "Marcus", desc: "Deep, authoritative narrator", gender: "Male", sarvamVoice: "shubh", sample: "Welcome to the world of faceless content creation. Today, we'll explore how compound interest can transform your financial future." },
  { id: "sarah", name: "Sophia", desc: "Warm, engaging voice", gender: "Female", sarvamVoice: "priya", sample: "Have you ever wondered what makes a video truly captivating? Let me walk you through something fascinating." },
  { id: "george", name: "Atlas", desc: "Classic documentary style", gender: "Male", sarvamVoice: "ratan", sample: "In the depths of the ocean, a world exists that few have ever seen. This is the story of discovery." },
  { id: "lily", name: "Nova", desc: "Young, energetic presenter", gender: "Female", sarvamVoice: "simran", sample: "Okay so here's the thing, nobody talks about this, and honestly it's kind of wild." },
  { id: "brian", name: "Leo", desc: "Calm, educational tone", gender: "Male", sarvamVoice: "amit", sample: "Let's take a step back and understand the fundamentals. When we look at the data, a clear pattern emerges." },
  { id: "jessica", name: "Zara", desc: "Professional, clear delivery", gender: "Female", sarvamVoice: "shreya", sample: "The numbers don't lie. In today's analysis, we're examining three key trends that will shape the industry." },
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingVoice(null);
    setLoadingVoice(null);
  }, []);

  const playVoicePreview = useCallback(async (voiceId: string, sampleText: string) => {
    if (playingVoice === voiceId) { stopPlayback(); return; }
    stopPlayback();
    setLoadingVoice(voiceId);

    try {
      const { data: responseData, error } = await supabase.functions.invoke('generate-voice', {
        body: { text: sampleText, speaker: voiceId, speed: 1.0 },
      });

      if (error) throw error;
      if (!responseData?.audio_base64) throw new Error('No audio returned');

      // Play the base64 audio
      const audioSrc = `data:audio/wav;base64,${responseData.audio_base64}`;
      const audio = new Audio(audioSrc);
      audioRef.current = audio;

      audio.onplay = () => { setLoadingVoice(null); setPlayingVoice(voiceId); };
      audio.onended = () => { setPlayingVoice(null); audioRef.current = null; };
      audio.onerror = () => { setPlayingVoice(null); setLoadingVoice(null); audioRef.current = null; };

      await audio.play();
    } catch (err) {
      console.error('Voice preview error:', err);
      setLoadingVoice(null);
      toast.error('Voice preview failed. Falling back to browser voice.');
      
      // Fallback to Web Speech API
      const utterance = new SpeechSynthesisUtterance(sampleText);
      const voiceSettings: Record<string, { pitch: number; rate: number }> = {
        roger: { pitch: 0.8, rate: 0.9 }, sarah: { pitch: 1.1, rate: 1.0 },
        george: { pitch: 0.7, rate: 0.85 }, lily: { pitch: 1.3, rate: 1.1 },
        brian: { pitch: 0.9, rate: 0.95 }, jessica: { pitch: 1.0, rate: 1.0 },
      };
      const settings = voiceSettings[voiceId] || { pitch: 1, rate: 1 };
      utterance.pitch = settings.pitch;
      utterance.rate = settings.rate;
      utterance.onstart = () => { setPlayingVoice(voiceId); };
      utterance.onend = () => setPlayingVoice(null);
      utterance.onerror = () => { setPlayingVoice(null); };
      window.speechSynthesis.speak(utterance);
    }
  }, [playingVoice, stopPlayback]);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-label text-primary block mb-2">STEP 4 OF 8</span>
        <h2 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Voice & Style</h2>
        <p className="text-xs text-muted-foreground">Select your narrator and visual aesthetic — each voice is a unique AI speaker</p>
      </div>

      {/* Voice grid */}
      <div>
        <h3 className="text-xs font-display text-foreground font-bold mb-3">Narrator Voice</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {voices.map((voice) => {
            const isPlaying = playingVoice === voice.id;
            const isLoading = loadingVoice === voice.id;
            const isSelected = data.voice === voice.id;
            return (
              <div key={voice.id} className={`rounded-xl transition-all border relative ${
                isSelected ? "bg-primary/8 border-primary/30 shadow-lg shadow-primary/5" : "bg-secondary/20 border-border/50 hover:border-primary/20"
              }`}>
                <button onClick={() => updateData({ voice: voice.id })} className="text-left w-full px-4 pt-4 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display text-xs text-foreground font-bold">{voice.name}</span>
                    <span className="text-[10px] font-label text-muted-foreground">{voice.gender.toUpperCase()}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{voice.desc}</p>
                  <p className="text-[9px] text-muted-foreground/60 mt-0.5 italic">Sarvam: {voice.sarvamVoice}</p>
                </button>
                <div className="px-4 pb-4 pt-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); playVoicePreview(voice.id, voice.sample); }}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-medium transition-all ${
                      isPlaying ? "bg-primary text-primary-foreground" :
                      isLoading ? "bg-secondary/50 text-muted-foreground cursor-wait" :
                      "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {isLoading ? <><Loader2 className="w-3 h-3 animate-spin" /> Generating...</> :
                     isPlaying ? <><Square className="w-3 h-3" /> Stop</> :
                     <><Play className="w-3 h-3" /> Preview</>}
                  </button>
                </div>
                {isPlaying && (
                  <div className="absolute top-3 right-3 flex items-center gap-0.5">
                    {[1, 2, 3].map((bar) => (
                      <div key={bar} className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: `${6 + Math.random() * 6}px`, animationDelay: `${bar * 0.15}s` }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Speed */}
      <div>
        <h3 className="text-xs font-display text-foreground font-bold mb-3">Narration Speed</h3>
        <div className="surface-raised p-5 flex items-center gap-4">
          <span className="text-[10px] font-mono text-muted-foreground">0.8×</span>
          <input type="range" min="0.8" max="1.2" step="0.1" defaultValue="1.0" className="flex-1 accent-primary" />
          <span className="text-[10px] font-mono text-muted-foreground">1.2×</span>
        </div>
      </div>

      {/* Visual Style */}
      <div>
        <h3 className="text-xs font-display text-foreground font-bold mb-3">Visual Style</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => updateData({ style: style.id })}
              className={`text-center px-4 py-5 rounded-xl transition-all border ${
                data.style === style.id
                  ? "bg-primary/8 border-primary/30 shadow-lg shadow-primary/5"
                  : "bg-secondary/20 border-border/50 hover:border-primary/20"
              }`}
            >
              <div className="font-display text-xs text-foreground font-bold">{style.name}</div>
              <p className="text-[10px] text-muted-foreground mt-1">{style.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepVoice;
