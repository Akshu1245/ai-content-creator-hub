import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { Search, Video, LayoutDashboard, BarChart3, Settings, Shield, HelpCircle, BookOpen, FileText, Map, X, ArrowRight } from "lucide-react";

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: string | (() => void);
  group: string;
  shortcut?: string;
}

const commands: Command[] = [
  { id: "new-video", label: "Create New Video", description: "Launch the AI video wizard", icon: Video, action: "/new-project", group: "Create", shortcut: "G N" },
  { id: "dashboard", label: "Dashboard", description: "View all your projects", icon: LayoutDashboard, action: "/dashboard", group: "Navigate", shortcut: "G D" },
  { id: "analytics", label: "Analytics", description: "Channel growth & performance", icon: BarChart3, action: "/analytics", group: "Navigate", shortcut: "G A" },
  { id: "settings", label: "Settings", description: "Subscription, billing, preferences", icon: Settings, action: "/settings", group: "Navigate", shortcut: "G S" },
  { id: "why-vorax", label: "Why VORAX", description: "Feature comparison & guarantees", icon: Shield, action: "/why-vorax", group: "Navigate" },
  { id: "help", label: "Help Center", description: "Guides and documentation", icon: HelpCircle, action: "/help-center", group: "Navigate" },
  { id: "changelog", label: "Changelog", description: "What's new in VORAX", icon: BookOpen, action: "/changelog", group: "Navigate" },
  { id: "docs", label: "Documentation", description: "API and integration docs", icon: FileText, action: "/documentation", group: "Navigate" },
  {
    id: "tour",
    label: "Replay Tour",
    description: "Walk through VORAX again",
    icon: Map,
    group: "Actions",
    shortcut: "T",
    action: () => window.dispatchEvent(new CustomEvent("vorax:replay-tour")),
  },
  {
    id: "shortcuts",
    label: "Keyboard Shortcuts",
    description: "See all shortcuts",
    icon: Search,
    group: "Actions",
    shortcut: "?",
    action: () => {
      const e = new KeyboardEvent("keydown", { key: "?" });
      window.dispatchEvent(e);
    },
  },
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  useEffect(() => {
    const onOpen = () => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); };
    window.addEventListener("vorax:command-palette", onOpen);
    return () => window.removeEventListener("vorax:command-palette", onOpen);
  }, []);

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          (c.description ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {});

  const flat = filtered;

  const execute = useCallback(
    (cmd: Command) => {
      close();
      if (typeof cmd.action === "string") {
        navigate(cmd.action);
      } else {
        setTimeout(cmd.action, 80);
      }
    },
    [close, navigate]
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, flat.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && flat[selected]) execute(flat[selected]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, flat, selected, execute, close]);

  useEffect(() => { setSelected(0); }, [query]);

  if (!open) return null;

  let idx = -1;

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm"
      onClick={close}
      style={{ animation: "fadeIn 0.15s ease both" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-border/60 overflow-hidden shadow-2xl"
        style={{
          background: "hsl(var(--card))",
          animation: "slideDown 0.2s cubic-bezier(0.16,1,0.3,1) both",
          boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px hsl(var(--primary)/0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands or pages…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden sm:block px-1.5 py-0.5 rounded bg-secondary border border-border/60 text-[9px] font-mono text-muted-foreground">Esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <div className="text-center py-8 text-xs text-muted-foreground">No commands found</div>
          )}

          {Object.entries(grouped).map(([group, cmds]) => (
            <div key={group}>
              <p className="px-4 py-1.5 text-[9px] font-label text-muted-foreground/50 tracking-widest">{group.toUpperCase()}</p>
              {cmds.map((cmd) => {
                idx++;
                const i = idx;
                const isSelected = flat.indexOf(cmd) === selected;
                return (
                  <button
                    key={cmd.id}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isSelected ? "bg-primary/8" : "hover:bg-secondary/40"}`}
                    onClick={() => execute(cmd)}
                    onMouseEnter={() => setSelected(flat.indexOf(cmd))}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-primary/15 border border-primary/30" : "bg-secondary border border-border/40"}`}>
                      <cmd.icon className={`w-4 h-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${isSelected ? "text-foreground" : "text-foreground/85"}`}>{cmd.label}</p>
                      {cmd.description && <p className="text-[10px] text-muted-foreground truncate">{cmd.description}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {cmd.shortcut && (
                        <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border/60 text-[9px] font-mono text-muted-foreground">{cmd.shortcut}</kbd>
                      )}
                      {isSelected && <ArrowRight className="w-3 h-3 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="px-4 py-2.5 border-t border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[9px] text-muted-foreground/50">
            <span><kbd className="px-1 py-0.5 rounded bg-secondary border border-border/50 font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-secondary border border-border/50 font-mono">↵</kbd> open</span>
          </div>
          <p className="text-[9px] text-muted-foreground/40">⌘K to open anywhere</p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CommandPalette;
