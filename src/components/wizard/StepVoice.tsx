import { WizardData } from "@/pages/NewProject";
import { Volume2, Play } from "lucide-react";

interface Props { data: WizardData; updateData: (u: Partial<WizardData>) => void; }

const voices = [
  { id: "roger", name: "Marcus", desc: "Deep, authoritative narrator", gender: "Male", icon: "🎙️" },
  { id: "sarah", name: "Sophia", desc: "Warm, engaging female voice", gender: "Female", icon: "🎤" },
  { id: "george", name: "Atlas", desc: "Classic documentary style", gender: "Male", icon: "📡" },
  { id: "lily", name: "Nova", desc: "Young, energetic presenter", gender: "Female", icon: "⚡" },
  { id: "brian", name: "Leo", desc: "Calm, educational tone", gender: "Male", icon: "📚" },
  { id: "jessica", name: "Zara", desc: "Professional, clear delivery", gender: "Female", icon: "🌟" },
];

const styles = [
  { id: "cinematic", name: "Cinematic", desc: "Dramatic visuals, film-like grading", icon: "🎬" },
  { id: "minimal", name: "Minimal", desc: "Clean layouts, subtle motion", icon: "✨" },
  { id: "dynamic", name: "Dynamic", desc: "Fast cuts, bold text, energy", icon: "💥" },
  { id: "retro", name: "Retro", desc: "Vintage aesthetics, nostalgic feel", icon: "📼" },
];

const StepVoice = ({ data, updateData }: Props) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-display font-bold mb-1">Voice Selection</h2>
        <p className="text-sm" style={{ color: "hsl(205 40% 55%)" }}>Choose the narrator voice for your video</p>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {voices.map((voice) => (
          <button
            key={voice.id}
            onClick={() => updateData({ voice: voice.id })}
            className="text-left px-5 py-5 rounded-xl transition-all"
            style={{
              background: data.voice === voice.id ? "rgba(14,165,233,0.12)" : "rgba(8,13,20,0.65)",
              border: `1px solid ${data.voice === voice.id ? "rgba(14,165,233,0.4)" : "rgba(42,72,112,0.35)"}`,
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-bold text-sm text-foreground">{voice.icon} {voice.name}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-label" style={{ color: "hsl(210 25% 40%)" }}>{voice.gender}</span>
                <button className="p-1.5 rounded-lg transition-colors" style={{ background: "rgba(14,165,233,0.1)" }} onClick={(e) => e.stopPropagation()}>
                  <Play className="w-3 h-3 text-cyan" />
                </button>
              </div>
            </div>
            <p className="text-xs" style={{ color: "hsl(205 40% 55%)" }}>{voice.desc}</p>
          </button>
        ))}
      </div>

      {/* Speed */}
      <div>
        <h3 className="text-base font-display font-bold mb-3 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-cyan" /> Narration Speed
        </h3>
        <div className="glass p-5 flex items-center gap-4">
          <span className="text-xs font-mono" style={{ color: "hsl(210 25% 40%)" }}>0.8×</span>
          <input type="range" min="0.8" max="1.2" step="0.1" defaultValue="1.0" className="flex-1 accent-cyan" style={{ accentColor: "#0EA5E9" }} />
          <span className="text-xs font-mono" style={{ color: "hsl(210 25% 40%)" }}>1.2×</span>
        </div>
      </div>

      {/* Style */}
      <div>
        <h2 className="text-xl font-display font-bold mb-1">Visual Style</h2>
        <p className="text-sm mb-4" style={{ color: "hsl(205 40% 55%)" }}>Choose the look and feel of your video</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => updateData({ style: style.id })}
              className="text-left px-4 py-5 rounded-xl transition-all text-center"
              style={{
                background: data.style === style.id ? "rgba(14,165,233,0.12)" : "rgba(8,13,20,0.65)",
                border: `1px solid ${data.style === style.id ? "rgba(14,165,233,0.4)" : "rgba(42,72,112,0.35)"}`,
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="text-2xl block mb-2">{style.icon}</span>
              <div className="font-display font-bold text-sm text-foreground">{style.name}</div>
              <p className="text-xs mt-1" style={{ color: "hsl(205 40% 55%)" }}>{style.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepVoice;
