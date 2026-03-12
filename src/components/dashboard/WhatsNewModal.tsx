import { useState, useEffect } from "react";
import { X, Sparkles, Star, Zap, Shield } from "lucide-react";

const CURRENT_VERSION = "1.2.0";

const updates = [
  {
    version: "1.2.0",
    date: "March 2026",
    items: [
      { icon: Shield, text: "Compliance scoring now checks against latest YouTube Community Guidelines", tag: "New" },
      { icon: Sparkles, text: "AI script generation powered by Gemini 2.5 Flash with 5x faster output", tag: "Improved" },
      { icon: Zap, text: "Keyboard shortcuts — press ? anywhere for a quick reference", tag: "New" },
      { icon: Star, text: "FAQ section and cookie consent for GDPR compliance", tag: "New" },
    ],
  },
  {
    version: "1.1.0",
    date: "February 2026",
    items: [
      { icon: Sparkles, text: "Multi-clip timeline editor with drag-and-drop reordering", tag: "New" },
      { icon: Zap, text: "9 premium AI voices with natural inflection via Sarvam AI", tag: "New" },
      { icon: Shield, text: "Revenue estimator with CPM-based projections per niche", tag: "New" },
    ],
  },
];

const WhatsNewModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const lastSeen = localStorage.getItem("ff-changelog-version");
    if (lastSeen !== CURRENT_VERSION) {
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    setOpen(false);
    localStorage.setItem("ff-changelog-version", CURRENT_VERSION);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative w-full max-w-lg surface-raised p-8 overflow-y-auto max-h-[85vh] animate-in fade-in zoom-in-95 duration-300">
        <button onClick={dismiss} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg text-foreground font-bold">What's New</h2>
            <p className="text-[10px] font-label text-muted-foreground">LATEST UPDATES & FEATURES</p>
          </div>
        </div>

        <div className="space-y-8">
          {updates.map((release) => (
            <div key={release.version}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                  v{release.version}
                </span>
                <span className="text-[10px] font-label text-muted-foreground">{release.date.toUpperCase()}</span>
              </div>
              <div className="space-y-3">
                {release.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
                    <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-relaxed">{item.text}</p>
                    </div>
                    <span className={`text-[9px] font-label px-2 py-0.5 rounded-full shrink-0 ${
                      item.tag === "New"
                        ? "text-primary bg-primary/10 border border-primary/20"
                        : "text-accent bg-accent/10 border border-accent/20"
                    }`}>
                      {item.tag.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button onClick={dismiss} className="btn-primary w-full text-xs mt-6">
          Got it, let's go!
        </button>
      </div>
    </div>
  );
};

export default WhatsNewModal;
