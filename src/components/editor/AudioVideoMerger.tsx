import { useState } from "react";
import { Loader2, Merge } from "lucide-react";
import { toast } from "sonner";

interface Props {
  videoUrl: string;
  audioBase64: string;
  onMerged?: (mergedUrl: string) => void;
}

const AudioVideoMerger = ({ videoUrl, audioBase64, onMerged }: Props) => {
  const [merging, setMerging] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleMerge = async () => {
    setMerging(true);
    setProgress(0);

    try {
      // Decode audio
      const audioCtx = new AudioContext();
      const audioData = Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0));
      const audioBuffer = await audioCtx.decodeAudioData(audioData.buffer.slice(0));
      setProgress(20);

      // Load video
      const video = document.createElement("video");
      video.src = videoUrl;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.playsInline = true;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("Failed to load video"));
      });
      setProgress(30);

      const width = video.videoWidth || 1920;
      const height = video.videoHeight || 1080;
      const duration = Math.min(video.duration, audioBuffer.duration);

      // Canvas for video frames
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      const videoStream = canvas.captureStream(30);

      // Audio source → stream
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      const dest = audioCtx.createMediaStreamDestination();
      source.connect(dest);

      // Combine
      const combined = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...dest.stream.getAudioTracks(),
      ]);

      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(combined, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
          ? "video/webm;codecs=vp9,opus"
          : "video/webm",
        videoBitsPerSecond: 5_000_000,
      });

      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

      const done = new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
      });

      // Start recording and playback
      recorder.start();
      source.start(0);
      video.currentTime = 0;
      await video.play();
      setProgress(50);

      // Render loop
      const startTime = performance.now();
      const renderLoop = () => {
        if (video.currentTime >= duration || video.ended) {
          recorder.stop();
          source.stop();
          video.pause();
          return;
        }
        ctx.drawImage(video, 0, 0, width, height);
        const elapsed = (performance.now() - startTime) / 1000;
        setProgress(50 + Math.round((elapsed / duration) * 50));
        requestAnimationFrame(renderLoop);
      };
      renderLoop();

      // Wait for timeout fallback
      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
          source.stop();
          video.pause();
        }
      }, (duration + 2) * 1000);

      const blob = await done;
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "merged-video.webm";
      a.click();

      onMerged?.(url);
      toast.success("Audio and video merged!");
      setProgress(100);
    } catch (err: any) {
      console.error("Merge error:", err);
      toast.error(err.message || "Merge failed");
    } finally {
      setMerging(false);
    }
  };

  return (
    <button
      onClick={handleMerge}
      disabled={merging}
      className="btn-ghost flex items-center gap-2 text-xs"
    >
      {merging ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Merging {progress}%
        </>
      ) : (
        <>
          <Merge className="w-3.5 h-3.5" /> Merge Audio + Video
        </>
      )}
    </button>
  );
};

export default AudioVideoMerger;
