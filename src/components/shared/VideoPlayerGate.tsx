import { useState, useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface VideoPlayerGateProps {
  children: React.ReactNode;
}

const VideoPlayerGate = ({ children }: VideoPlayerGateProps) => {
  const [phase, setPhase] = useState<"idle" | "opening" | "open">("idle");
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [tick, setTick] = useState(0);
  const gateRef = useRef<HTMLDivElement>(null);

  // Slow tick for ambient animations
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!gateRef.current) return;
    const rect = gateRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const handleEnter = useCallback(() => {
    setPhase("opening");
    setTimeout(() => setPhase("open"), 1400);
  }, []);

  const handleExit = useCallback(() => {
    setPhase("opening");
    setTimeout(() => setPhase("idle"), 800);
  }, []);

  const ringCount = 5;
  const time = tick * 0.06;

  return (
    <div className="relative w-full min-h-screen bg-background overflow-hidden">
      {/* === PORTAL GATE === */}
      <div
        ref={gateRef}
        className="fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700"
        style={{
          opacity: phase === "open" ? 0 : 1,
          pointerEvents: phase === "open" ? "none" : "auto",
          background: "hsl(230 25% 3%)",
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Reactive gradient following mouse */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(800px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, hsl(265 85% 65% / ${hovered ? 0.08 : 0.03}), transparent 50%)`,
          }}
        />

        {/* Floating orbs */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${60 + i * 40}px`,
              height: `${60 + i * 40}px`,
              left: `${20 + i * 15}%`,
              top: `${15 + ((i * 17) % 60)}%`,
              background: i % 2 === 0
                ? `radial-gradient(circle, hsl(265 85% 65% / 0.06), transparent 70%)`
                : `radial-gradient(circle, hsl(38 95% 60% / 0.04), transparent 70%)`,
              animation: `orbFloat ${6 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * -1.5}s`,
              filter: "blur(30px)",
            }}
          />
        ))}

        {/* Central portal */}
        <div className="relative flex items-center justify-center">
          {/* Concentric rings */}
          {Array.from({ length: ringCount }).map((_, i) => {
            const size = 180 + i * 55;
            const rotation = time * (12 - i * 2) * (i % 2 === 0 ? 1 : -1);
            const opacity = hovered ? 0.4 - i * 0.05 : 0.15 - i * 0.02;
            return (
              <div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  border: `1px solid hsl(265 85% 65% / ${Math.max(opacity, 0.03)})`,
                  transform: `rotate(${rotation}deg) ${phase === "opening" ? `scale(${1.5 + i * 0.3})` : "scale(1)"}`,
                  opacity: phase === "opening" ? 0 : 1,
                  transition: `all ${0.8 + i * 0.15}s cubic-bezier(0.77, 0, 0.175, 1)`,
                }}
              />
            );
          })}

          {/* Hexagonal portal shape */}
          <button
            onClick={handleEnter}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative w-48 h-48 cursor-pointer group focus:outline-none"
          >
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full transition-transform duration-700"
              style={{
                transform: hovered ? "scale(1.08)" : "scale(1)",
                filter: hovered
                  ? "drop-shadow(0 0 40px hsl(265 85% 65% / 0.5))"
                  : "drop-shadow(0 0 15px hsl(265 85% 65% / 0.15))",
              }}
            >
              <defs>
                <linearGradient id="portal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(265, 85%, 65%)" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="hsl(285, 80%, 55%)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="hsl(38, 95%, 60%)" stopOpacity="0.7" />
                </linearGradient>
                <radialGradient id="portal-center" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(265, 85%, 75%)" stopOpacity="0.2" />
                  <stop offset="60%" stopColor="hsl(265, 85%, 45%)" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Inner glow */}
              <circle cx="100" cy="100" r="85" fill="url(#portal-center)" />

              {/* Hexagon outline */}
              <polygon
                points="100,15 175,57.5 175,142.5 100,185 25,142.5 25,57.5"
                fill="none"
                stroke="url(#portal-grad)"
                strokeWidth={hovered ? 2.5 : 1.5}
                filter="url(#glow)"
                style={{ transition: "stroke-width 0.4s ease" }}
              />

              {/* Inner hexagon */}
              <polygon
                points="100,40 155,70 155,130 100,160 45,130 45,70"
                fill="none"
                stroke="hsl(265, 85%, 65%)"
                strokeWidth="0.5"
                opacity={hovered ? 0.5 : 0.15}
                style={{ transition: "opacity 0.4s ease" }}
              />

              {/* Rotating inner triangle */}
              <g
                style={{
                  transformOrigin: "100px 100px",
                  transform: `rotate(${time * 20}deg)`,
                }}
              >
                <polygon
                  points="100,60 135,120 65,120"
                  fill="none"
                  stroke="hsl(38, 95%, 60%)"
                  strokeWidth="0.8"
                  opacity={hovered ? 0.6 : 0.2}
                />
              </g>

              {/* Center play arrow */}
              <polygon
                points="90,80 90,120 120,100"
                fill={hovered ? "hsl(265, 85%, 75%)" : "hsl(220, 20%, 70%)"}
                style={{
                  transition: "fill 0.3s ease",
                  filter: hovered
                    ? "drop-shadow(0 0 12px hsl(265 85% 65% / 0.8))"
                    : "none",
                }}
              />

              {/* Corner dots */}
              {[
                [100, 15], [175, 57.5], [175, 142.5],
                [100, 185], [25, 142.5], [25, 57.5],
              ].map(([cx, cy], i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={hovered ? 3 : 2}
                  fill="hsl(265, 85%, 65%)"
                  opacity={hovered ? 0.8 : 0.3}
                  style={{ transition: "all 0.4s ease" }}
                />
              ))}
            </svg>

            {/* Pulse ring */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: "1px solid hsl(265 85% 65% / 0.2)",
                animation: "pulseRing 3s ease-out infinite",
              }}
            />
          </button>

          {/* Label */}
          <div className="absolute -bottom-20 text-center space-y-2">
            <p className="text-sm font-display tracking-widest text-foreground/70">
              ENTER THE FORGE
            </p>
            <p className="text-[10px] text-muted-foreground tracking-wider">
              click the portal to begin
            </p>
          </div>
        </div>

        {/* Bottom data strip */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 text-[9px] text-muted-foreground/30 font-mono"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
            SYSTEM READY
          </span>
          <span>v3.0</span>
          <span>NEURAL ENGINE</span>
        </div>
      </div>

      {/* Exit button */}
      <button
        onClick={handleExit}
        className="fixed top-6 right-6 z-[99] w-12 h-12 rounded-2xl flex items-center justify-center border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:scale-110 hover:border-primary/40 hover:neon-glow active:scale-95 group"
        style={{
          opacity: phase === "open" ? 1 : 0,
          pointerEvents: phase === "open" ? "auto" : "none",
          transform: phase === "open" ? "translateY(0)" : "translateY(-20px)",
        }}
      >
        <X className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </button>

      {/* Site content */}
      <div
        className="transition-all duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)]"
        style={{
          opacity: phase === "open" ? 1 : 0,
          transform: phase === "open" ? "scale(1)" : "scale(0.94)",
          filter: phase === "open" ? "blur(0px)" : "blur(16px)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default VideoPlayerGate;
