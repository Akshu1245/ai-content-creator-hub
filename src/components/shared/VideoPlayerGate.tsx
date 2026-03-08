import { useState, useCallback, useEffect } from "react";
import { Pause } from "lucide-react";

interface VideoPlayerGateProps {
  children: React.ReactNode;
}

const VideoPlayerGate = ({ children }: VideoPlayerGateProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [irisOpen, setIrisOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pulseRing, setPulseRing] = useState(0);

  // Cycle through pulse rings
  useEffect(() => {
    const interval = setInterval(() => setPulseRing((p) => (p + 1) % 3), 2000);
    return () => clearInterval(interval);
  }, []);

  const handlePlay = useCallback(() => {
    setIrisOpen(true);
    setTimeout(() => {
      setIsPlaying(true);
      setShowContent(true);
    }, 1200);
  }, []);

  const handlePause = useCallback(() => {
    setShowContent(false);
    setIrisOpen(false);
    setTimeout(() => setIsPlaying(false), 800);
  }, []);

  // 6 iris blades for camera aperture
  const bladeCount = 6;
  const blades = Array.from({ length: bladeCount });

  return (
    <div className="relative w-full min-h-screen bg-background overflow-hidden">
      {/* Camera Aperture / Iris Gate */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700"
        style={{
          opacity: isPlaying ? 0 : 1,
          pointerEvents: isPlaying ? "none" : "auto",
          background: "hsl(225 20% 4%)",
        }}
      >
        {/* Subtle animated grain */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Radial ambient light */}
        <div
          className="absolute inset-0"
          style={{
            background: hovered
              ? "radial-gradient(circle at center, hsl(200 80% 62% / 0.08) 0%, transparent 60%)"
              : "radial-gradient(circle at center, hsl(42 78% 58% / 0.04) 0%, transparent 60%)",
            transition: "background 0.8s ease",
          }}
        />

        {/* Camera aperture SVG */}
        <div className="relative">
          {/* Outer pulsing rings */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: `${280 + i * 60}px`,
                height: `${280 + i * 60}px`,
                top: `${-(140 + i * 30 - 120)}px`,
                left: `${-(140 + i * 30 - 120)}px`,
                borderColor:
                  pulseRing === i
                    ? "hsl(200 80% 62% / 0.3)"
                    : "hsl(220 15% 20% / 0.15)",
                transform: pulseRing === i ? "scale(1.05)" : "scale(1)",
                opacity: pulseRing === i ? 1 : 0.3,
                transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          ))}

          {/* The iris itself */}
          <button
            onClick={handlePlay}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative w-60 h-60 rounded-full cursor-pointer group focus:outline-none"
            style={{ perspective: "600px" }}
          >
            {/* Iris SVG aperture */}
            <svg
              viewBox="0 0 240 240"
              className="w-full h-full absolute inset-0 transition-transform duration-700"
              style={{
                transform: hovered ? "scale(1.05)" : "scale(1)",
                filter: hovered
                  ? "drop-shadow(0 0 30px hsl(200 80% 62% / 0.4))"
                  : "drop-shadow(0 0 15px hsl(42 78% 58% / 0.2))",
              }}
            >
              <defs>
                <radialGradient id="iris-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(200, 80%, 62%)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="blade-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(225, 14%, 18%)" />
                  <stop offset="100%" stopColor="hsl(225, 14%, 12%)" />
                </linearGradient>
              </defs>

              {/* Background glow circle */}
              <circle cx="120" cy="120" r="115" fill="url(#iris-glow)" />

              {/* Outer ring */}
              <circle
                cx="120"
                cy="120"
                r="110"
                fill="none"
                stroke="hsl(220, 12%, 20%)"
                strokeWidth="1.5"
              />

              {/* Iris blades */}
              {blades.map((_, i) => {
                const angle = (360 / bladeCount) * i;
                const openAngle = irisOpen ? angle + 90 : angle;
                const openTranslate = irisOpen ? 80 : 0;
                return (
                  <g
                    key={i}
                    style={{
                      transformOrigin: "120px 120px",
                      transform: `rotate(${openAngle}deg) translateY(${openTranslate}px)`,
                      transition: `all 1.2s cubic-bezier(0.77, 0, 0.175, 1) ${i * 0.05}s`,
                      opacity: irisOpen ? 0 : 1,
                    }}
                  >
                    <path
                      d={`M120,120 L${120 + 95 * Math.cos(((angle - 30) * Math.PI) / 180)},${120 + 95 * Math.sin(((angle - 30) * Math.PI) / 180)} A95,95 0 0,1 ${120 + 95 * Math.cos(((angle + 30) * Math.PI) / 180)},${120 + 95 * Math.sin(((angle + 30) * Math.PI) / 180)} Z`}
                      fill="url(#blade-grad)"
                      stroke="hsl(220, 12%, 25%)"
                      strokeWidth="0.5"
                    />
                  </g>
                );
              })}

              {/* Inner circle — the "lens" */}
              <circle
                cx="120"
                cy="120"
                r={hovered ? 32 : 28}
                fill="hsl(225, 20%, 7%)"
                stroke="hsl(200, 80%, 62%)"
                strokeWidth={hovered ? 2 : 1}
                style={{
                  transition: "all 0.5s ease",
                  filter: hovered
                    ? "drop-shadow(0 0 12px hsl(200 80% 62% / 0.6))"
                    : "none",
                }}
              />

              {/* Play triangle inside lens */}
              <polygon
                points="113,107 113,133 137,120"
                fill={hovered ? "hsl(200, 80%, 62%)" : "hsl(42, 78%, 58%)"}
                style={{
                  transition: "fill 0.4s ease",
                  filter: hovered
                    ? "drop-shadow(0 0 8px hsl(200 80% 62% / 0.8))"
                    : "drop-shadow(0 0 4px hsl(42 78% 58% / 0.5))",
                }}
              />

              {/* Lens markings — like a real camera */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <line
                  key={deg}
                  x1={120 + 38 * Math.cos((deg * Math.PI) / 180)}
                  y1={120 + 38 * Math.sin((deg * Math.PI) / 180)}
                  x2={120 + 42 * Math.cos((deg * Math.PI) / 180)}
                  y2={120 + 42 * Math.sin((deg * Math.PI) / 180)}
                  stroke="hsl(220, 12%, 35%)"
                  strokeWidth="1"
                />
              ))}

              {/* Focal length text */}
              <text
                x="120"
                y="158"
                textAnchor="middle"
                fill="hsl(220, 10%, 35%)"
                fontSize="6"
                fontFamily="JetBrains Mono, monospace"
                letterSpacing="2"
              >
                f/1.4
              </text>
            </svg>

            {/* Hover breathing glow */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: hovered
                  ? "radial-gradient(circle, hsl(200 80% 62% / 0.08) 30%, transparent 70%)"
                  : "none",
                transition: "background 0.5s ease",
              }}
            />
          </button>

          {/* Label below */}
          <div className="text-center mt-8 space-y-2">
            <p
              className="text-xs tracking-[0.4em] uppercase text-muted-foreground"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              Open the lens
            </p>
            <p
              className="text-[10px] tracking-[0.2em] text-muted-foreground/50"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              click the aperture to begin
            </p>
          </div>
        </div>

        {/* Corner frame marks — cinematic framing */}
        {["top-8 left-8", "top-8 right-8", "bottom-8 left-8", "bottom-8 right-8"].map(
          (pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-8 h-8`}
              style={{
                borderTop: i < 2 ? "1px solid hsl(220 12% 20%)" : "none",
                borderBottom: i >= 2 ? "1px solid hsl(220 12% 20%)" : "none",
                borderLeft: i % 2 === 0 ? "1px solid hsl(220 12% 20%)" : "none",
                borderRight: i % 2 === 1 ? "1px solid hsl(220 12% 20%)" : "none",
              }}
            />
          )
        )}

        {/* Bottom info bar */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 text-[9px] text-muted-foreground/40"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          <span>REC ●</span>
          <span>4K UHD</span>
          <span>24fps</span>
          <span>ISO 800</span>
        </div>
      </div>

      {/* Pause FAB */}
      <button
        onClick={handlePause}
        className="fixed bottom-6 right-6 z-[99] w-14 h-14 rounded-full flex items-center justify-center border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:scale-110 hover:border-accent/50 active:scale-95 group"
        style={{
          opacity: showContent ? 1 : 0,
          pointerEvents: showContent ? "auto" : "none",
          transform: showContent ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <Pause className="w-4 h-4 text-accent group-hover:text-primary transition-colors" />
        <span className="absolute -top-8 text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{ fontFamily: "JetBrains Mono, monospace" }}>
          Close lens
        </span>
      </button>

      {/* Site content */}
      <div
        className="transition-all duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)]"
        style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? "scale(1)" : "scale(0.92)",
          filter: showContent ? "blur(0px)" : "blur(12px)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default VideoPlayerGate;
