import { WizardData } from "@/pages/NewProject";
import { Youtube, Instagram, Clock } from "lucide-react";

interface Props {
  data: WizardData;
  updateData: (u: Partial<WizardData>) => void;
}

const platforms = [
  { id: "youtube", name: "YouTube", icon: Youtube, desc: "Full-length video" },
  { id: "shorts", name: "YouTube Shorts", icon: Youtube, desc: "60s vertical clip" },
  { id: "tiktok", name: "TikTok", icon: Clock, desc: "9:16 format" },
  { id: "reels", name: "Instagram Reels", icon: Instagram, desc: "9:16 format" },
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
        <h2 className="text-xl font-semibold mb-1">Schedule & Publish</h2>
        <p className="text-sm text-muted-foreground">Choose platforms and schedule your upload</p>
      </div>

      {/* Platforms */}
      <div>
        <h3 className="text-base font-semibold mb-3">Target Platforms</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => togglePlatform(p.id)}
              className={`text-left px-4 py-4 rounded-xl transition-all ${
                data.platforms.includes(p.id)
                  ? "bg-primary/15 border border-primary/30"
                  : "glass glass-hover"
              }`}
            >
              <p.icon className={`w-5 h-5 mb-2 ${data.platforms.includes(p.id) ? "text-primary" : "text-muted-foreground"}`} />
              <div className="font-semibold text-sm">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div>
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Schedule Upload
        </h3>
        <input
          type="datetime-local"
          value={data.scheduledAt}
          onChange={(e) => updateData({ scheduledAt: e.target.value })}
          className="px-4 py-3 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        <p className="text-xs text-muted-foreground mt-2">Leave empty to publish immediately after generation</p>
      </div>

      {/* Summary */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-base font-semibold mb-4">Video Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Niche</span>
            <span className="font-medium">{data.niche || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Topic</span>
            <span className="font-medium truncate ml-4 max-w-xs">{data.topic || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Voice</span>
            <span className="font-medium capitalize">{data.voice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Style</span>
            <span className="font-medium capitalize">{data.style}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Compliance</span>
            <span className={`font-mono font-bold ${(data.complianceScore ?? 0) >= 80 ? "text-primary" : "text-warning"}`}>
              {data.complianceScore ?? "Not checked"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platforms</span>
            <span className="font-medium">{data.platforms.length} selected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepPublish;
