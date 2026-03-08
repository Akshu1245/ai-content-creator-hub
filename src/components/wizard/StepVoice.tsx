import { WizardData } from "@/pages/NewProject";
import { Volume2, Play } from "lucide-react";

interface Props {
  data: WizardData;
  updateData: (u: Partial<WizardData>) => void;
}

const voices = [
  { id: "roger", name: "Roger", desc: "Deep, authoritative narrator", gender: "Male" },
  { id: "sarah", name: "Sarah", desc: "Warm, engaging female voice", gender: "Female" },
  { id: "george", name: "George", desc: "Classic documentary style", gender: "Male" },
  { id: "lily", name: "Lily", desc: "Young, energetic presenter", gender: "Female" },
  { id: "brian", name: "Brian", desc: "Calm, educational tone", gender: "Male" },
  { id: "jessica", name: "Jessica", desc: "Professional, clear delivery", gender: "Female" },
];

const styles = [
  { id: "cinematic", name: "Cinematic", desc: "Dramatic visuals with film-like color grading" },
  { id: "minimal", name: "Minimal", desc: "Clean, focused layouts with subtle motion" },
  { id: "dynamic", name: "Dynamic", desc: "Fast cuts, bold text, high energy" },
  { id: "retro", name: "Retro", desc: "Vintage aesthetics with nostalgic feel" },
];

const StepVoice = ({ data, updateData }: Props) => {
  return (
    <div className="space-y-8">
      {/* Voice Selection */}
      <div>
        <h2 className="text-xl font-semibold mb-1">Voice Selection</h2>
        <p className="text-sm text-muted-foreground mb-4">Choose the narrator voice for your video</p>
        <div className="grid md:grid-cols-3 gap-3">
          {voices.map((voice) => (
            <button
              key={voice.id}
              onClick={() => updateData({ voice: voice.id })}
              className={`text-left px-4 py-4 rounded-xl transition-all ${
                data.voice === voice.id
                  ? "bg-primary/15 border border-primary/30"
                  : "glass glass-hover"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{voice.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">{voice.gender}</span>
                  <button className="p-1 rounded hover:bg-secondary" onClick={(e) => e.stopPropagation()}>
                    <Play className="w-3 h-3 text-primary" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{voice.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Speed */}
      <div>
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Volume2 className="w-4 h-4" /> Narration Speed
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">0.8x</span>
          <input
            type="range"
            min="0.8"
            max="1.2"
            step="0.1"
            defaultValue="1.0"
            className="flex-1 accent-primary"
          />
          <span className="text-xs text-muted-foreground">1.2x</span>
        </div>
      </div>

      {/* Visual Style */}
      <div>
        <h2 className="text-xl font-semibold mb-1">Visual Style</h2>
        <p className="text-sm text-muted-foreground mb-4">Choose the look and feel of your video</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => updateData({ style: style.id })}
              className={`text-left px-4 py-4 rounded-xl transition-all ${
                data.style === style.id
                  ? "bg-primary/15 border border-primary/30"
                  : "glass glass-hover"
              }`}
            >
              <div className="font-semibold text-sm mb-1">{style.name}</div>
              <p className="text-xs text-muted-foreground">{style.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepVoice;
