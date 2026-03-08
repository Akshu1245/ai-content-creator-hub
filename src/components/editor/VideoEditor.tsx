import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play, Pause, SkipBack, SkipForward, Type, Scissors,
  Move, Trash2, Plus, Download, Check, RotateCcw,
  AlignLeft, AlignCenter, AlignRight, ChevronDown, Loader2,
  ZoomIn, ZoomOut, Volume2, VolumeX, Eye, EyeOff
} from "lucide-react";

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: "normal" | "bold";
  align: "left" | "center" | "right";
  startTime: number;
  endTime: number;
  visible: boolean;
}

interface TrimState {
  start: number;
  end: number;
}

interface Props {
  videoUrl: string;
  audioBase64?: string | null;
  onExport?: (edits: { trim: TrimState; overlays: TextOverlay[] }) => void;
  onBack?: () => void;
}

const COLORS = [
  "hsl(0, 0%, 100%)",
  "hsl(0, 0%, 0%)",
  "hsl(12, 76%, 56%)",
  "hsl(158, 32%, 45%)",
  "hsl(42, 72%, 52%)",
  "hsl(345, 45%, 52%)",
  "hsl(185, 40%, 48%)",
  "hsl(48, 100%, 50%)",
];

const VideoEditor = ({ videoUrl, audioBase64, onExport, onBack }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  // Trim
  const [trim, setTrim] = useState<TrimState>({ start: 0, end: 0 });
  const [trimming, setTrimming] = useState<"start" | "end" | null>(null);

  // Text overlays
  const [overlays, setOverlays] = useState<TextOverlay[]>([]);
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null);
  const [draggingOverlay, setDraggingOverlay] = useState(false);

  // Tool
  const [activeTool, setActiveTool] = useState<"select" | "text" | "trim">("select");
  const [zoom, setZoom] = useState(1);

  // Initialize trim end when duration loads
  const handleLoadedMetadata = () => {
    const vid = videoRef.current;
    if (vid) {
      setDuration(vid.duration);
      setTrim({ start: 0, end: vid.duration });
    }
  };

  // Render loop — draw video + overlays on canvas
  const renderFrame = useCallback(() => {
    const vid = videoRef.current;
    const canvas = canvasRef.current;
    if (!vid || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = vid.videoWidth || 1920;
    canvas.height = vid.videoHeight || 1080;

    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

    // Draw text overlays
    overlays.forEach((o) => {
      if (!o.visible) return;
      if (vid.currentTime < o.startTime || vid.currentTime > o.endTime) return;

      ctx.save();
      ctx.font = `${o.fontWeight} ${o.fontSize * (canvas.width / 1920)}px "Syne", sans-serif`;
      ctx.fillStyle = o.color;
      ctx.textAlign = o.align;

      const x = (o.x / 100) * canvas.width;
      const y = (o.y / 100) * canvas.height;
      ctx.fillText(o.text, x, y);
      ctx.restore();
    });

    setCurrentTime(vid.currentTime);

    // Loop within trim bounds
    if (vid.currentTime >= trim.end) {
      vid.currentTime = trim.start;
      vid.pause();
      setPlaying(false);
    }

    if (playing) {
      animFrameRef.current = requestAnimationFrame(renderFrame);
    }
  }, [playing, overlays, trim]);

  useEffect(() => {
    if (playing) {
      animFrameRef.current = requestAnimationFrame(renderFrame);
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [playing, renderFrame]);

  // Also render when not playing (for overlay edits)
  useEffect(() => {
    if (!playing) renderFrame();
  }, [overlays, selectedOverlay]);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (playing) {
      vid.pause();
    } else {
      if (vid.currentTime < trim.start || vid.currentTime >= trim.end) {
        vid.currentTime = trim.start;
      }
      vid.play();
    }
    setPlaying(!playing);
  };

  const seek = (time: number) => {
    const vid = videoRef.current;
    if (!vid) return;
    const clamped = Math.max(trim.start, Math.min(trim.end, time));
    vid.currentTime = clamped;
    setCurrentTime(clamped);
    if (!playing) renderFrame();
  };

  const skipFrames = (frames: number) => {
    const vid = videoRef.current;
    if (vid) seek(vid.currentTime + frames / 30);
  };

  // Add text overlay
  const addTextOverlay = () => {
    const newOverlay: TextOverlay = {
      id: `txt-${Date.now()}`,
      text: "Your Text Here",
      x: 50,
      y: 50,
      fontSize: 48,
      color: "hsl(0, 0%, 100%)",
      fontWeight: "bold",
      align: "center",
      startTime: currentTime,
      endTime: Math.min(currentTime + 3, trim.end),
      visible: true,
    };
    setOverlays((prev) => [...prev, newOverlay]);
    setSelectedOverlay(newOverlay.id);
    setActiveTool("text");
  };

  const updateOverlay = (id: string, updates: Partial<TextOverlay>) => {
    setOverlays((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const deleteOverlay = (id: string) => {
    setOverlays((prev) => prev.filter((o) => o.id !== id));
    if (selectedOverlay === id) setSelectedOverlay(null);
  };

  const selected = overlays.find((o) => o.id === selectedOverlay);

  // Timeline click handler
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    seek(pct * duration);
  };

  // Canvas click — place or select overlay
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (activeTool === "text" && !selectedOverlay) {
      const newOverlay: TextOverlay = {
        id: `txt-${Date.now()}`,
        text: "Text",
        x, y,
        fontSize: 48,
        color: "hsl(0, 0%, 100%)",
        fontWeight: "bold",
        align: "center",
        startTime: currentTime,
        endTime: Math.min(currentTime + 3, trim.end),
        visible: true,
      };
      setOverlays((prev) => [...prev, newOverlay]);
      setSelectedOverlay(newOverlay.id);
    } else if (activeTool === "select" && selectedOverlay) {
      updateOverlay(selectedOverlay, { x, y });
    }
  };

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    const ms = Math.floor((t % 1) * 100);
    return `${m}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  };

  const handleExport = () => {
    onExport?.({ trim, overlays });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {(
            [
              { id: "select", icon: Move, label: "Select" },
              { id: "text", icon: Type, label: "Text" },
              { id: "trim", icon: Scissors, label: "Trim" },
            ] as const
          ).map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] transition-all ${
                activeTool === tool.id
                  ? "bg-primary/15 text-primary font-bold border border-primary/20"
                  : "text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              <tool.icon className="w-3.5 h-3.5" />
              {tool.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="btn-ghost text-[10px] flex items-center gap-1.5">
              <RotateCcw className="w-3 h-3" /> Back
            </button>
          )}
          <button onClick={handleExport} className="btn-primary text-[10px] flex items-center gap-1.5">
            <Download className="w-3 h-3" /> Export Settings
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="relative bg-secondary rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          onLoadedMetadata={handleLoadedMetadata}
          className="hidden"
          muted={muted}
          playsInline
        />
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full aspect-video cursor-crosshair"
        />

        {/* Overlay position indicators */}
        {overlays
          .filter((o) => o.visible && currentTime >= o.startTime && currentTime <= o.endTime)
          .map((o) => (
            <button
              key={o.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOverlay(o.id);
                setActiveTool("select");
              }}
              className={`absolute w-3 h-3 rounded-full transition-all ${
                selectedOverlay === o.id ? "bg-primary ring-2 ring-primary/30" : "bg-muted-foreground/50"
              }`}
              style={{ left: `${o.x}%`, top: `${o.y}%`, transform: "translate(-50%, -50%)" }}
            />
          ))}
      </div>

      {/* Playback controls */}
      <div className="flex items-center gap-3">
        <button onClick={() => skipFrames(-10)} className="text-muted-foreground hover:text-foreground transition-colors">
          <SkipBack className="w-4 h-4" />
        </button>
        <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <button onClick={() => skipFrames(10)} className="text-muted-foreground hover:text-foreground transition-colors">
          <SkipForward className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-mono text-muted-foreground min-w-[100px]">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <div className="flex-1" />
        <button onClick={() => setMuted(!muted)} className="text-muted-foreground hover:text-foreground transition-colors">
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <div
          ref={timelineRef}
          onClick={handleTimelineClick}
          className="relative h-12 bg-secondary/50 rounded-lg border border-border cursor-pointer overflow-hidden"
        >
          {/* Trim region */}
          <div
            className="absolute top-0 bottom-0 bg-primary/10 border-x-2 border-primary/30"
            style={{
              left: `${(trim.start / duration) * 100}%`,
              width: `${((trim.end - trim.start) / duration) * 100}%`,
            }}
          />

          {/* Trim handles */}
          {activeTool === "trim" && (
            <>
              <div
                className="absolute top-0 bottom-0 w-2 bg-primary/60 cursor-col-resize hover:bg-primary z-10 rounded-l"
                style={{ left: `${(trim.start / duration) * 100}%` }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  const startX = e.clientX;
                  const startTrim = trim.start;
                  const timelineWidth = timelineRef.current?.getBoundingClientRect().width || 1;
                  const handleMove = (ev: MouseEvent) => {
                    const dx = ev.clientX - startX;
                    const dt = (dx / timelineWidth) * duration;
                    setTrim((prev) => ({ ...prev, start: Math.max(0, Math.min(prev.end - 0.5, startTrim + dt)) }));
                  };
                  const handleUp = () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
                  window.addEventListener("mousemove", handleMove);
                  window.addEventListener("mouseup", handleUp);
                }}
              />
              <div
                className="absolute top-0 bottom-0 w-2 bg-primary/60 cursor-col-resize hover:bg-primary z-10 rounded-r"
                style={{ left: `${(trim.end / duration) * 100}%`, transform: "translateX(-100%)" }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  const startX = e.clientX;
                  const startTrim = trim.end;
                  const timelineWidth = timelineRef.current?.getBoundingClientRect().width || 1;
                  const handleMove = (ev: MouseEvent) => {
                    const dx = ev.clientX - startX;
                    const dt = (dx / timelineWidth) * duration;
                    setTrim((prev) => ({ ...prev, end: Math.max(prev.start + 0.5, Math.min(duration, startTrim + dt)) }));
                  };
                  const handleUp = () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
                  window.addEventListener("mousemove", handleMove);
                  window.addEventListener("mouseup", handleUp);
                }}
              />
            </>
          )}

          {/* Overlay bars */}
          {overlays.map((o) => (
            <div
              key={o.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOverlay(o.id);
              }}
              className={`absolute h-4 top-1/2 -translate-y-1/2 rounded-sm cursor-pointer transition-all ${
                selectedOverlay === o.id ? "bg-accent ring-1 ring-accent/50" : "bg-accent/40"
              }`}
              style={{
                left: `${(o.startTime / duration) * 100}%`,
                width: `${((o.endTime - o.startTime) / duration) * 100}%`,
              }}
            >
              <span className="text-[7px] text-accent-foreground px-1 truncate block leading-4">{o.text}</span>
            </div>
          ))}

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-foreground z-20"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          >
            <div className="w-2.5 h-2.5 bg-foreground rounded-full -translate-x-1/2 -top-1 absolute" />
          </div>
        </div>

        {/* Timeline labels */}
        <div className="flex justify-between text-[9px] font-mono text-muted-foreground px-1">
          <span>{formatTime(trim.start)}</span>
          <span>Duration: {formatTime(trim.end - trim.start)}</span>
          <span>{formatTime(trim.end)}</span>
        </div>
      </div>

      {/* Text overlay controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Overlay list */}
        <div className="surface-raised p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-label text-muted-foreground">TEXT OVERLAYS</h3>
            <button onClick={addTextOverlay} className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Text
            </button>
          </div>
          {overlays.length === 0 ? (
            <p className="text-[10px] text-muted-foreground text-center py-4">No text overlays yet</p>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {overlays.map((o) => (
                <div
                  key={o.id}
                  onClick={() => setSelectedOverlay(o.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all text-xs ${
                    selectedOverlay === o.id ? "bg-primary/10 border border-primary/20" : "hover:bg-secondary/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button onClick={(e) => { e.stopPropagation(); updateOverlay(o.id, { visible: !o.visible }); }}>
                      {o.visible ? <Eye className="w-3 h-3 text-foreground" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
                    </button>
                    <span className="truncate text-foreground">{o.text}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-muted-foreground">{formatTime(o.startTime)}</span>
                    <button onClick={(e) => { e.stopPropagation(); deleteOverlay(o.id); }} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected overlay properties */}
        <div className="surface-raised p-4 rounded-xl">
          <h3 className="text-[10px] font-label text-muted-foreground mb-3">PROPERTIES</h3>
          {selected ? (
            <div className="space-y-3">
              <input
                value={selected.text}
                onChange={(e) => updateOverlay(selected.id, { text: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-xs text-foreground bg-secondary/30 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter text..."
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-muted-foreground block mb-1">Font Size</label>
                  <input
                    type="range" min="16" max="120" value={selected.fontSize}
                    onChange={(e) => updateOverlay(selected.id, { fontSize: +e.target.value })}
                    className="w-full accent-primary"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground block mb-1">Weight</label>
                  <div className="flex gap-1">
                    {(["normal", "bold"] as const).map((w) => (
                      <button
                        key={w}
                        onClick={() => updateOverlay(selected.id, { fontWeight: w })}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] transition-all ${
                          selected.fontWeight === w ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {w === "bold" ? "B" : "N"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[9px] text-muted-foreground block mb-1">Color</label>
                <div className="flex gap-1.5">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateOverlay(selected.id, { color: c })}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        selected.color === c ? "border-primary scale-110" : "border-border"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[9px] text-muted-foreground block mb-1">Alignment</label>
                <div className="flex gap-1">
                  {([
                    { val: "left", icon: AlignLeft },
                    { val: "center", icon: AlignCenter },
                    { val: "right", icon: AlignRight },
                  ] as const).map((a) => (
                    <button
                      key={a.val}
                      onClick={() => updateOverlay(selected.id, { align: a.val })}
                      className={`flex-1 flex justify-center py-1.5 rounded-lg transition-all ${
                        selected.align === a.val ? "bg-primary/15 text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <a.icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-muted-foreground block mb-1">Start Time</label>
                  <input
                    type="range" min={0} max={duration} step={0.1} value={selected.startTime}
                    onChange={(e) => updateOverlay(selected.id, { startTime: +e.target.value })}
                    className="w-full accent-primary"
                  />
                  <span className="text-[9px] font-mono text-muted-foreground">{formatTime(selected.startTime)}</span>
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground block mb-1">End Time</label>
                  <input
                    type="range" min={0} max={duration} step={0.1} value={selected.endTime}
                    onChange={(e) => updateOverlay(selected.id, { endTime: +e.target.value })}
                    className="w-full accent-primary"
                  />
                  <span className="text-[9px] font-mono text-muted-foreground">{formatTime(selected.endTime)}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-muted-foreground block mb-1">X Position (%)</label>
                  <input
                    type="range" min={0} max={100} value={selected.x}
                    onChange={(e) => updateOverlay(selected.id, { x: +e.target.value })}
                    className="w-full accent-primary"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground block mb-1">Y Position (%)</label>
                  <input
                    type="range" min={0} max={100} value={selected.y}
                    onChange={(e) => updateOverlay(selected.id, { y: +e.target.value })}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[10px] text-muted-foreground text-center py-4">Select an overlay to edit properties</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;
