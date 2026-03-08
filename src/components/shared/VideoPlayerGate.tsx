import { useState, useRef, useCallback } from "react";
import { Play, Pause } from "lucide-react";

interface VideoPlayerGateProps {
  children: React.ReactNode;
}

const VideoPlayerGate = ({ children }: VideoPlayerGateProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePlay = useCallback(() => {
    setIsAnimating(true);
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsAnimating(true);
    setIsPlaying(false);
    setTimeout(() => setIsAnimating(false), 800);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden" ref={containerRef}>
      {/* Cinematic black gate overlay */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)]"
        style={{
          opacity: isPlaying ? 0 : 1,
          pointerEvents: isPlaying ? "none" : "auto",
          background: "radial-gradient(ellipse at center, hsl(225 20% 5%) 0%, hsl(225 20% 2%) 100%)",
        }}
      >
        {/* Subtle film grain */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }}
        />

        {/* Cinematic bars top & bottom */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-black" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-black" />

        {/* Center content */}
        <div className="relative flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-4 animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-primary-foreground font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>F</span>
            </div>
            <span className="text-foreground text-xl tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>FacelessForge</span>
          </div>

          {/* Play button */}
          <button
            onClick={handlePlay}
            className="group relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95"
            style={{
              background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
            }}
          >
            {/* Outer ring pulse */}
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="absolute inset-0 rounded-full border border-primary/30" />

            {/* Inner circle */}
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/60 transition-all duration-300 backdrop-blur-sm">
              <Play className="w-6 h-6 text-primary ml-0.5" fill="hsl(var(--primary))" />
            </div>
          </button>

          <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Press play to begin
          </p>
        </div>

        {/* Bottom progress bar decoration */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-64 h-[2px] bg-border/30 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-primary/40 rounded-full animate-[shimmer_3s_ease-in-out_infinite]"
            style={{
              animation: "shimmer 3s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Pause/stop FAB — visible when playing */}
      <button
        onClick={handlePause}
        className="fixed bottom-6 right-6 z-[99] w-12 h-12 rounded-full flex items-center justify-center border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:scale-110 hover:border-primary/40 active:scale-95"
        style={{
          opacity: isPlaying ? 1 : 0,
          pointerEvents: isPlaying ? "auto" : "none",
          transform: isPlaying ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <Pause className="w-4 h-4 text-primary" fill="hsl(var(--primary))" />
      </button>

      {/* The actual site content */}
      <div
        className="transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)]"
        style={{
          opacity: isPlaying ? 1 : 0,
          transform: isPlaying ? "scale(1)" : "scale(0.95)",
          filter: isPlaying ? "blur(0px)" : "blur(8px)",
        }}
      >
        {children}
      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default VideoPlayerGate;
