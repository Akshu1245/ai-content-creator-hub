import { useState, useRef } from "react";
import { Plus, Trash2, GripVertical, Play, Pause, Film, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Clip {
  id: string;
  type: "generated" | "stock";
  url: string;
  thumbnail?: string;
  duration: number;
  label: string;
}

interface Props {
  generatedVideoUrl?: string | null;
  stockMedia?: Array<{ url: string; thumbnail?: string; label?: string }>;
  onExportSequence?: (blobUrl: string) => void;
}

const MultiClipTimeline = ({ generatedVideoUrl, stockMedia = [], onExportSequence }: Props) => {
  const [clips, setClips] = useState<Clip[]>(() => {
    const initial: Clip[] = [];
    if (generatedVideoUrl) {
      initial.push({ id: "gen-0", type: "generated", url: generatedVideoUrl, duration: 5, label: "Generated Video" });
    }
    stockMedia.forEach((m, i) => {
      if (m.url) initial.push({ id: `stock-${i}`, type: "stock", url: m.url, thumbnail: m.thumbnail, duration: 5, label: m.label || `Clip ${i + 1}` });
    });
    return initial;
  });

  const [previewClip, setPreviewClip] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const removeClip = (id: string) => setClips((prev) => prev.filter((c) => c.id !== id));

  const moveClip = (from: number, to: number) => {
    setClips((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const totalDuration = clips.reduce((sum, c) => sum + c.duration, 0);

  const exportSequence = async () => {
    if (clips.length === 0) { toast.error("No clips to export"); return; }
    setExporting(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d")!;
      const stream = canvas.captureStream(30);

      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm",
        videoBitsPerSecond: 5_000_000,
      });
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      const done = new Promise<Blob>((r) => { recorder.onstop = () => r(new Blob(chunks, { type: "video/webm" })); });

      recorder.start();

      for (const clip of clips) {
        const vid = document.createElement("video");
        vid.src = clip.url;
        vid.crossOrigin = "anonymous";
        vid.muted = true;
        vid.playsInline = true;

        await new Promise<void>((r, j) => { vid.onloadedmetadata = () => r(); vid.onerror = () => j(new Error("Load failed")); });
        const clipDur = Math.min(clip.duration, vid.duration);
        vid.currentTime = 0;
        await new Promise<void>((r) => { vid.onseeked = () => r(); });

        const fps = 30;
        const frames = Math.ceil(clipDur * fps);
        for (let f = 0; f < frames; f++) {
          vid.currentTime = f / fps;
          await new Promise<void>((r) => { vid.onseeked = () => r(); });
          ctx.drawImage(vid, 0, 0, 1920, 1080);
          if (f % 5 === 0) await new Promise((r) => setTimeout(r, 0));
        }
      }

      recorder.stop();
      const blob = await done;
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "sequence.webm";
      a.click();

      onExportSequence?.(url);
      toast.success("Sequence exported!");
    } catch (err: any) {
      toast.error(err.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-label text-muted-foreground">MULTI-CLIP TIMELINE</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground">{clips.length} clips · {totalDuration.toFixed(1)}s</span>
          <button
            onClick={exportSequence}
            disabled={exporting || clips.length === 0}
            className="btn-primary text-[10px] flex items-center gap-1.5"
          >
            {exporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Film className="w-3 h-3" />}
            {exporting ? "Rendering…" : "Export Sequence"}
          </button>
        </div>
      </div>

      {/* Timeline bar */}
      <div className="flex gap-1 min-h-[60px] bg-secondary/30 rounded-lg p-2 overflow-x-auto">
        {clips.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-[10px] text-muted-foreground">
            No clips added. Add stock media in the wizard or use the generated video.
          </div>
        ) : (
          clips.map((clip, i) => (
            <div
              key={clip.id}
              className={`relative flex-shrink-0 rounded-lg border cursor-pointer transition-all overflow-hidden ${
                previewClip === clip.id ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-primary/30"
              }`}
              style={{ width: `${Math.max(80, (clip.duration / Math.max(totalDuration, 1)) * 600)}px` }}
              onClick={() => setPreviewClip(clip.id === previewClip ? null : clip.id)}
            >
              <div className={`h-full min-h-[44px] flex items-center gap-1.5 px-2 ${clip.type === "generated" ? "bg-primary/10" : "bg-accent/10"}`}>
                <GripVertical className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="text-[9px] text-foreground truncate flex-1">{clip.label}</span>
                <button onClick={(e) => { e.stopPropagation(); removeClip(clip.id); }} className="text-muted-foreground hover:text-destructive shrink-0">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              {/* Reorder buttons */}
              <div className="absolute bottom-0.5 right-0.5 flex gap-0.5">
                {i > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); moveClip(i, i - 1); }} className="w-4 h-4 rounded bg-secondary/80 flex items-center justify-center text-[8px] text-muted-foreground hover:text-foreground">←</button>
                )}
                {i < clips.length - 1 && (
                  <button onClick={(e) => { e.stopPropagation(); moveClip(i, i + 1); }} className="w-4 h-4 rounded bg-secondary/80 flex items-center justify-center text-[8px] text-muted-foreground hover:text-foreground">→</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preview */}
      {previewClip && (
        <div className="surface-raised rounded-xl overflow-hidden">
          <video
            ref={videoRef}
            src={clips.find((c) => c.id === previewClip)?.url}
            controls
            className="w-full aspect-video bg-secondary"
          />
        </div>
      )}
    </div>
  );
};

export default MultiClipTimeline;
