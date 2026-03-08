import { WizardData } from "@/pages/NewProject";
import { Volume2 } from "lucide-react";

interface Props { data: WizardData; updateData: (u: Partial<WizardData>) => void; }

const voices = [
  { id: "roger", name: "Marcus", desc: "Deep, authoritative narrator", gender: "Male" },
  { id: "sarah", name: "Sophia", desc: "Warm, engaging voice", gender: "Female" },
  { id: "george", name: "Atlas", desc: "Classic documentary style", gender: "Male" },
  { id: "lily", name: "Nova", desc: "Young, energetic presenter", gender: "Female" },
  { id: "brian", name: "Leo", desc: "Calm, educational tone", gender: "Male" },
  { id: "jessica", name: "Zara", desc: "Professional, clear delivery", gender: "Female" },
];

const styles = [
  { id: "cinematic", name: "Cinematic", desc: "Dramatic visuals, film-like grading" },
  { id: "minimal", name: "Minimal", desc: "Clean layouts, subtle motion" },
  { id: "dynamic", name: "Dynamic", desc: "Fast cuts, bold text, energy" },
  { id: "retro", name: "Retro", desc: "Vintage aesthetics, nostalgic feel" },
];

const StepVoice = ({ data, updateData }: Props) => {
  return (
    <div className="space-y-8">
      <div>
        <span className="font-label text-primary block mb-1">STEP 4</span>
        <h2 className="text-xl font-display text-foreground mb-1">Voice & Style</h2>
        <p className="text-sm text-muted-foreground">Choose narrator voice and visual style for your video</p>
      </div>

      <div>
        <h3 className="text-sm font-display text-foreground mb-3">Narrator Voice</h3>
        <div className="grid md:grid-cols-3 gap-2">
          {voices.map((voice) => (
            <button
              key={voice.id}
              onClick={() => updateData({ voice: voice.id })}
              className={`text-left px-4 py-4 rounded-lg transition-all border ${
                data.voice === voice.id
                  ? "bg-primary/8 border-primary"
                  : "bg-card border-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-display text-sm text-foreground">{voice.name}</span>
                <span className="text-xs text-muted-foreground">{voice.gender}</span>
              </div>
              <p className="text-xs text-muted-foreground">{voice.desc}</p>
            </button>
          ))}
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
