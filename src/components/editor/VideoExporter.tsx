import { useRef, useState, useCallback } from "react";
import { Loader2, Download, Film } from "lucide-react";
import { toast } from "sonner";

interface TrimState { start: number; end: number; }
interface TextOverlay {
  id: string; text: string; x: number; y: number; fontSize: number;
  color: string; fontWeight: "normal" | "bold"; align: "left" | "center" | "right";
  startTime: number; endTime: number; visible: boolean;
}

interface Props {
  videoUrl: string;
  audioBase64?: string | null;
  trim: TrimState;
  overlays: TextOverlay[];
  onComplete?: (blobUrl: string) => void;
}

const VideoExporter = ({ videoUrl, audioBase64, trim, overlays, onComplete }: Props) => {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = useCallback(async () => {
    setExporting(true);
    setProgress(0);

    try {
      // Create offscreen video + canvas
      const video = document.createElement("video");
      video.src = videoUrl;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.playsInline = true;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("Failed to load video"));
      });

      const width = video.videoWidth || 1920;
      const height = video.videoHeight || 1080;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      // Set up MediaRecorder
      const stream = canvas.captureStream(30);

      // Add audio track if available
      if (audioBase64) {
        try {
          const audioCtx = new AudioContext();
          const audioData = Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0));
          const audioBuffer = await audioCtx.decodeAudioData(audioData.buffer);
          const source = audioCtx.createBufferSource();
          source.buffer = audioBuffer;
          const dest = audioCtx.createMediaStreamDestination();
          source.connect(dest);
          source.start(0, trim.start);
          dest.stream.getAudioTracks().forEach((t) => stream.addTrack(t));
        } catch (e) {
          console.warn("Could not add audio track:", e);
        }
      }

      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm",
        videoBitsPerSecond: 5_000_000,
      });

      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

      const exportDone = new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
      });

      // Render frames
      video.currentTime = trim.start;
      await new Promise<void>((r) => { video.onseeked = () => r(); });

      recorder.start();

      const totalDuration = trim.end - trim.start;
      const fps = 30;
      const totalFrames = Math.ceil(totalDuration * fps);

      for (let frame = 0; frame < totalFrames; frame++) {
        const time = trim.start + frame / fps;
        video.currentTime = time;
        await new Promise<void>((r) => { video.onseeked = () => r(); });

        // Draw video frame
        ctx.drawImage(video, 0, 0, width, height);

        // Draw overlays
        overlays.forEach((o) => {
          if (!o.visible || time < o.startTime || time > o.endTime) return;
          ctx.save();
          ctx.font = `${o.fontWeight} ${o.fontSize * (width / 1920)}px "Syne", sans-serif`;
          ctx.fillStyle = o.color;
          ctx.textAlign = o.align;
          ctx.fillText(o.text, (o.x / 100) * width, (o.y / 100) * height);
          ctx.restore();
        });

        setProgress(Math.round(((frame + 1) / totalFrames) * 100));

        // Yield to keep UI responsive
        if (frame % 5 === 0) await new Promise((r) => setTimeout(r, 0));
      }

      recorder.stop();
      const blob = await exportDone;
      const url = URL.createObjectURL(blob);

      // Auto-download
      const a = document.createElement("a");
      a.href = url;
      a.download = "exported-video.webm";
      a.click();

      onComplete?.(url);
      toast.success("Video exported successfully!");
    } catch (err: any) {
      console.error("Export error:", err);
      toast.error(err.message || "Export failed");
    } finally {
      setExporting(false);
    }
  }, [videoUrl, audioBase64, trim, overlays, onComplete]);

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="btn-primary flex items-center gap-2 text-xs"
    >
      {exporting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Rendering {progress}%
        </>
      ) : (
        <>
          <Film className="w-3.5 h-3.5" /> Export Video
        </>
      )}
    </button>
  );
};

export default VideoExporter;
