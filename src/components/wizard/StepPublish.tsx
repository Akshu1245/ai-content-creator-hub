import { WizardData } from "@/pages/NewProject";
import { Clock } from "lucide-react";

interface Props { data: WizardData; updateData: (u: Partial<WizardData>) => void; }

const platforms = [
  { id: "youtube", name: "YouTube", desc: "Full-length video" },
  { id: "shorts", name: "YT Shorts", desc: "60s vertical clip" },
  { id: "tiktok", name: "TikTok", desc: "9:16 optimized" },
  { id: "reels", name: "IG Reels", desc: "9:16 format" },
];

const StepPublish = ({ data, updateData }: Props) => {
  const togglePlatform = (id: string) => {
    const current = data.platforms;
    updateData({
      platforms: current.includes(id) ? current.filter((p) => p !== id) : [...current, id],
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="font-label text-primary block mb-1">STEP 6</span>
        <h2 className="text-xl font-display text-foreground mb-1">Schedule & Publish</h2>
        <p className="text-sm text-muted-foreground">Choose platforms and schedule your upload</p>
      </div>

      <div>
        <h3 className="text-sm font-display text-foreground mb-3">Target Platforms</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {platforms.map((p) => {
            const selected = data.platforms.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                className={`text-center px-3 py-4 rounded-lg transition-all border ${
                  selected
                    ? "bg-primary/8 border-primary"
                    : "bg-card border-border hover:border-primary/30"
                }`}
              >
                <div className="font-display text-sm text-foreground">{p.name}</div>
                <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-display text-foreground mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" /> Schedule Upload
        </h3>
        <input
          type="datetime-local"
          value={data.scheduledAt}
          onChange={(e) => updateData({ scheduledAt: e.target.value })}
          className="px-4 py-3 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background border border-border transition-colors"
        />
        <p className="text-xs text-muted-foreground mt-1.5">Leave empty to publish immediately after generation</p>
      </div>

      <div className="surface-raised p-5">
        <h3 className="text-sm font-display text-foreground mb-4">Video Summary</h3>
        <div className="space-y-2.5 text-sm">
          {[
            { label: "Niche", value: data.niche || "—" },
            { label: "Topic", value: data.topic || "—" },
            { label: "Voice", value: data.voice ? data.voice.charAt(0).toUpperCase() + data.voice.slice(1) : "—" },
            { label: "Style", value: data.style ? data.style.charAt(0).toUpperCase() + data.style.slice(1) : "—" },
            { label: "Compliance", value: data.complianceScore ?? "Not checked", isScore: true },
            { label: "Platforms", value: `${data.platforms.length} selected` },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
              <span className="font-label text-muted-foreground">{row.label.toUpperCase()}</span>
              <span className={`font-medium ${row.isScore && typeof row.value === "number" ? (row.value >= 80 ? "text-primary" : "text-golden") : "text-foreground"} ${row.isScore ? "font-mono" : ""}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepPublish;
