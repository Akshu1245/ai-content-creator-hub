import { WizardData } from "@/pages/NewProject";
import { Clock, Check } from "lucide-react";
import AffiliatePanel from "@/components/differentiators/AffiliatePanel";

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
    updateData({ platforms: current.includes(id) ? current.filter((p) => p !== id) : [...current, id] });
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-label text-primary block mb-2">STEP 6 OF 6</span>
        <h2 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Schedule & Publish</h2>
        <p className="text-xs text-muted-foreground">Choose platforms, set upload time, and maximize revenue</p>
      </div>

      {/* Platforms */}
      <div>
        <h3 className="text-xs font-display text-foreground font-bold mb-3">Target Platforms</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {platforms.map((p) => {
            const selected = data.platforms.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                className={`relative text-center px-4 py-5 rounded-xl transition-all border ${
                  selected
                    ? "bg-primary/8 border-primary/30 shadow-lg shadow-primary/5"
                    : "bg-secondary/20 border-border/50 hover:border-primary/20"
                }`}
              >
                {selected && (
                  <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                  </div>
                )}
                <div className="font-display text-xs text-foreground font-bold">{p.name}</div>
                <p className="text-[10px] text-muted-foreground mt-1">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule */}
      <div>
        <h3 className="text-xs font-display text-foreground font-bold mb-3 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-primary" /> Schedule
        </h3>
        <input
          type="datetime-local"
          value={data.scheduledAt}
          onChange={(e) => updateData({ scheduledAt: e.target.value })}
          className="px-5 py-4 rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 bg-secondary/30 border border-border transition-all"
        />
        <p className="text-[10px] text-muted-foreground mt-2">Leave empty to publish immediately after generation</p>
      </div>

      {/* Affiliate Link Auto-Suggester */}
      {data.niche && data.topic && (
        <AffiliatePanel
          niche={data.niche}
          topic={data.topic}
          script={data.script}
          onDescriptionGenerated={(desc) => {
            // Could store in wizard data
          }}
        />
      )}

      {/* Summary */}
      <div className="surface-raised p-6">
        <h3 className="text-xs font-display text-foreground font-bold mb-5">Video Summary</h3>
        <div className="space-y-0 text-xs">
          {[
            { label: "Niche", value: data.niche || "—" },
            { label: "Topic", value: data.topic || "—" },
            { label: "Voice", value: data.voice ? data.voice.charAt(0).toUpperCase() + data.voice.slice(1) : "—" },
            { label: "Style", value: data.style ? data.style.charAt(0).toUpperCase() + data.style.slice(1) : "—" },
            { label: "Compliance", value: data.complianceScore ?? "Not checked", isScore: true },
            { label: "Platforms", value: `${data.platforms.length} selected` },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center py-3 border-b border-border/50 last:border-b-0">
              <span className="text-[10px] font-label text-muted-foreground">{row.label.toUpperCase()}</span>
              <span className={`font-medium ${row.isScore && typeof row.value === "number" ? (row.value >= 80 ? "text-emerald" : "text-primary") : "text-foreground"} ${row.isScore ? "font-mono" : ""}`}>
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
