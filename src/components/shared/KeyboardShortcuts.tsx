import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X } from "lucide-react";

const shortcuts = [
  { keys: ["Ctrl", "N"], desc: "New Project", action: "/new-project" },
  { keys: ["Ctrl", "D"], desc: "Dashboard", action: "/dashboard" },
  { keys: ["Ctrl", "A"], desc: "Analytics", action: "/analytics" },
  { keys: ["?"], desc: "Show shortcuts", action: "help" },
];

const KeyboardShortcuts = () => {
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only enable on dashboard pages
    if (location.pathname === "/" || location.pathname === "/auth") return;

    const handler = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "?" && !e.ctrlKey) {
        e.preventDefault();
        setShowHelp((p) => !p);
      }
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        navigate("/new-project");
      }
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        navigate("/dashboard");
      }
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        navigate("/analytics");
      }
      if (e.key === "Escape") setShowHelp(false);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, location.pathname]);

  if (!showHelp) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowHelp(false)}>
      <div className="surface-overlay p-8 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-foreground text-base font-bold">Keyboard Shortcuts</h3>
          <button onClick={() => setShowHelp(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {shortcuts.map((s) => (
            <div key={s.desc} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.desc}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k) => (
                  <kbd key={k} className="px-2 py-1 rounded-lg text-[10px] font-mono bg-secondary border border-border text-foreground">
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-6 text-center">Press <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border font-mono">Esc</kbd> to close</p>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
