import { WizardData } from "@/pages/NewProject";
import { Youtube, Clock, Globe, MonitorPlay } from "lucide-react";

interface Props { data: WizardData; updateData: (u: Partial<WizardData>) => void; }

const platforms = [
  { id: "youtube", name: "YouTube", desc: "Full-length video", icon: "📺" },
  { id: "shorts", name: "YT Shorts", desc: "60s vertical clip", icon: "⚡" },
  { id: "tiktok", name: "TikTok", desc: "9:16 optimized", icon: "🎵" },
  { id: "reels", name: "IG Reels", desc: "9:16 format", icon: "📱" },
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
        <h2 className="text-xl font-display font-bold mb-1">Schedule & Publish</h2>
        <p className="text-sm" style={{ color: "hsl(205 40% 55%)" }}>Choose platforms and schedule your upload</p>
      </div>

      <div>
        <h3 className="text-base font-display font-bold mb-3">Target Platforms</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {platforms.map((p) => {
            const selected = data.platforms.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                className="text-center px-4 py-5 rounded-xl transition-all"
                style={{
                  background: selected ? "rgba(14,165,233,0.12)" : "rgba(8,13,20,0.65)",
                  border: `1px solid ${selected ? "rgba(14,165,233,0.4)" : "rgba(42,72,112,0.35)"}`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <span className="text-2xl block mb-2">{p.icon}</span>
                <div className="font-display font-bold text-sm text-foreground">{p.name}</div>
                <p className="text-xs mt-1" style={{ color: "hsl(205 40% 55%)" }}>{p.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-base font-display font-bold mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan" /> Schedule Upload
        </h3>
        <input
          type="datetime-local"
          value={data.scheduledAt}
          onChange={(e) => updateData({ scheduledAt: e.target.value })}
          className="px-5 py-3 rounded-xl text-sm text-foreground focus:outline-none"
          style={{
            background: "rgba(8,13,20,0.65)",
            border: "1px solid rgba(42,72,112,0.35)",
            backdropFilter: "blur(12px)",
            colorScheme: "dark",
          }}
        />
        <p className="text-xs mt-2" style={{ color: "hsl(210 25% 40%)" }}>Leave empty to publish immediately after generation</p>
      </div>

      {/* Summary */}
      <div className="glass-elevated p-6">
        <h3 className="text-base font-display font-bold mb-5">Video Summary</h3>
        <div className="space-y-3 text-sm">
          {[
            { label: "Niche", value: data.niche || "—" },
            { label: "Topic", value: data.topic || "—" },
            { label: "Voice", value: data.voice ? data.voice.charAt(0).toUpperCase() + data.voice.slice(1) : "—" },
            { label: "Style", value: data.style ? data.style.charAt(0).toUpperCase() + data.style.slice(1) : "—" },
            { label: "Compliance", value: data.complianceScore ?? "Not checked", isScore: true },
            { label: "Platforms", value: `${data.platforms.length} selected` },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center" style={{ borderBottom: "1px solid rgba(42,72,112,0.15)", paddingBottom: "10px" }}>
              <span className="font-label text-xs" style={{ color: "hsl(210 25% 40%)" }}>{row.label}</span>
              <span className={`font-medium ${row.isScore && typeof row.value === "number" ? (row.value >= 80 ? "text-mint" : "text-amber") : "text-foreground"} ${row.isScore ? "font-mono font-bold" : ""}`}>
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
