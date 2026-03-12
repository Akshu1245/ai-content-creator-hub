import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Command } from "lucide-react";

const groups = [
  {
    label: "Navigation",
    items: [
      { keys: ["G", "H"], desc: "Go to Home" },
      { keys: ["G", "D"], desc: "Go to Dashboard" },
      { keys: ["G", "N"], desc: "New Video" },
      { keys: ["G", "A"], desc: "Analytics" },
      { keys: ["G", "S"], desc: "Settings" },
    ],
  },
  {
    label: "Actions",
    items: [
      { keys: ["⌘", "K"], desc: "Command palette" },
      { keys: ["T"], desc: "Replay tour" },
      { keys: ["?"], desc: "Show shortcuts" },
      { keys: ["Esc"], desc: "Close / cancel" },
    ],
  },
];

const KeyboardShortcuts = () => {
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();
  const [gPressed, setGPressed] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target as HTMLElement).isContentEditable) return;

      if (e.key === "Escape") { setShowHelp(false); setGPressed(false); return; }

      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowHelp((p) => !p);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("vorax:command-palette"));
        return;
      }

      if (gPressed) {
        setGPressed(false);
        switch (e.key.toLowerCase()) {
          case "h": e.preventDefault(); navigate("/"); break;
          case "d": e.preventDefault(); navigate("/dashboard"); break;
          case "n": e.preventDefault(); navigate("/new-project"); break;
          case "a": e.preventDefault(); navigate("/analytics"); break;
          case "s": e.preventDefault(); navigate("/settings"); break;
        }
        return;
      }

      if (e.key.toLowerCase() === "g" && !e.ctrlKey && !e.metaKey) {
        setGPressed(true);
        setTimeout(() => setGPressed(false), 1500);
        return;
      }

      if (e.key.toLowerCase() === "t" && !e.ctrlKey && !e.metaKey) {
        window.dispatchEvent(new CustomEvent("vorax:replay-tour"));
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, gPressed]);

  if (!showHelp) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setShowHelp(false)}
      style={{ animation: "fadeIn 0.15s ease both" }}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl border border-border/60 overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(135deg, hsl(var(--card)), hsl(var(--card)) 70%, hsl(var(--primary)/0.04))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 text-primary" />
            <h3 className="font-display text-sm font-bold text-foreground">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => setShowHelp(false)}
            className="w-7 h-7 rounded-lg bg-secondary/60 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="text-[9px] font-label text-muted-foreground/60 tracking-widest mb-2.5">{group.label.toUpperCase()}</p>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div key={item.desc} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <kbd className="px-2 py-1 rounded-lg text-[10px] font-mono bg-secondary border border-border/60 text-foreground shadow-sm min-w-[26px] text-center">
                            {k}
                          </kbd>
                          {i < item.keys.length - 1 && <span className="text-[9px] text-muted-foreground/40">then</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pb-4 text-center">
          <p className="text-[10px] text-muted-foreground/40">
            <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border/60 font-mono text-[9px]">Esc</kbd>{" "}
            to close · works on every page
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
