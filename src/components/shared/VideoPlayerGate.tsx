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

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("opening");
      setTimeout(() => setPhase("open"), 1400);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = useCallback(() => {
    setPhase("opening");
    setTimeout(() => setPhase("open"), 1400);
  }, []);

  const handleExit = useCallback(() => {
    setPhase("opening");
    setTimeout(() => setPhase("idle"), 800);
  }, []);

  const ringCount = 6;
  const time = tick * 0.06;
  const sparks = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: 2 + (i % 3),
    left: 8 + ((i * 11) % 84),
    top: 12 + ((i * 17) % 74),
    delay: i * -0.65,
    duration: 6 + (i % 4),
  }));

  return (
    <div className="relative w-full min-h-screen bg-background overflow-hidden">
      <div
        ref={gateRef}
        className="fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700"
        style={{
          opacity: phase === "open" ? 0 : 1,
          pointerEvents: phase === "open" ? "none" : "auto",
          background: "hsl(240 6% 3%)",
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Vignette and atmosphere layers */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.48) 72%, rgba(0,0,0,0.76) 100%)",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(180deg, rgba(212,180,117,0.02) 0px, rgba(212,180,117,0.02) 1px, transparent 1px, transparent 4px)",
            mixBlendMode: "screen",
            opacity: 0.35,
          }}
        />

        <div
          className="absolute left-0 right-0 h-[28%] pointer-events-none"
          style={{
            top: "-24%",
            background: "linear-gradient(180deg, rgba(212,180,117,0.22), rgba(212,180,117,0.02), transparent)",
            filter: "blur(22px)",
            animation: "scanDown 7.5s linear infinite",
          }}
        />

        {/* Reactive warm gradient following mouse */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(900px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, hsl(var(--primary) / ${hovered ? 0.16 : 0.06}), hsl(var(--accent) / ${hovered ? 0.09 : 0.03}), transparent 56%)`,
          }}
        />

        {/* Floating atmosphere orbs */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${80 + i * 36}px`,
              height: `${80 + i * 36}px`,
              left: `${6 + i * 14}%`,
              top: `${10 + ((i * 19) % 68)}%`,
              background: [
                `radial-gradient(circle, hsl(var(--primary) / 0.12), transparent 70%)`,
                `radial-gradient(circle, hsl(var(--accent) / 0.1), transparent 70%)`,
                `radial-gradient(circle, hsl(248 44% 55% / 0.055), transparent 72%)`,
                `radial-gradient(circle, hsl(210 55% 52% / 0.05), transparent 70%)`,
                `radial-gradient(circle, hsl(198 55% 50% / 0.06), transparent 70%)`,
                `radial-gradient(circle, hsl(236 40% 50% / 0.055), transparent 70%)`,
              ][i],
              animation: `orbFloat ${7 + i * 1.8}s ease-in-out infinite`,
              animationDelay: `${i * -1.2}s`,
              filter: "blur(34px)",
            }}
          />
        ))}

        {/* Micro spark particles */}
        {sparks.map((spark) => (
          <div
            key={spark.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              left: `${spark.left}%`,
              top: `${spark.top}%`,
              background: "rgba(212, 180, 117, 0.82)",
              boxShadow: "0 0 10px rgba(212, 180, 117, 0.56)",
              animation: `orbFloat ${spark.duration}s ease-in-out infinite`,
              animationDelay: `${spark.delay}s`,
            }}
          />
        ))}

        {/* Central portal */}
        <div className="relative flex items-center justify-center">
          {/* Concentric rings */}
          {Array.from({ length: ringCount }).map((_, i) => {
            const size = 180 + i * 48;
            const rotation = time * (12 - i * 2) * (i % 2 === 0 ? 1 : -1);
            const opacity = hovered ? 0.52 - i * 0.06 : 0.2 - i * 0.024;
            const ringColor = i % 2 === 0 ? "var(--primary)" : "var(--accent)";
            const segmented = i % 3 === 0;
            return (
              <div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  border: `1px ${segmented ? "dashed" : "solid"} hsl(${ringColor} / ${Math.max(opacity, 0.045)})`,
                  transform: `rotate(${rotation}deg) ${phase === "opening" ? `scale(${1.5 + i * 0.3})` : "scale(1)"}`,
                  opacity: phase === "opening" ? 0 : 1,
                  transition: `all ${0.8 + i * 0.15}s cubic-bezier(0.77, 0, 0.175, 1)`,
                  boxShadow: i < 2 ? "0 0 20px rgba(212,180,117,0.16)" : "none",
                }}
              />
            );
          })}

          {/* Hexagonal portal */}
          <button
            onClick={handleEnter}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative w-52 h-52 cursor-pointer group focus:outline-none"
          >
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full transition-transform duration-700"
              style={{
                transform: hovered ? "scale(1.1)" : "scale(1)",
                filter: hovered
                  ? "drop-shadow(0 0 44px rgba(212,180,117,0.48))"
                  : "drop-shadow(0 0 18px rgba(212,180,117,0.24))",
              }}
            >
              <defs>
                <linearGradient id="portal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.92" />
                  <stop offset="55%" stopColor="hsl(var(--accent))" stopOpacity="0.78" />
                  <stop offset="100%" stopColor="hsl(248, 44%, 55%)" stopOpacity="0.88" />
                </linearGradient>
                <radialGradient id="portal-center" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
                  <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <circle cx="100" cy="100" r="85" fill="url(#portal-center)" />
              <circle cx="100" cy="100" r="76" fill="none" stroke="hsl(var(--accent) / 0.2)" strokeWidth="1" />

              <polygon
                points="100,15 175,57.5 175,142.5 100,185 25,142.5 25,57.5"
                fill="none"
                stroke="url(#portal-grad)"
                strokeWidth={hovered ? 2.8 : 1.9}
                filter="url(#glow)"
                style={{ transition: "stroke-width 0.4s ease" }}
              />

              <polygon
                points="100,40 155,70 155,130 100,160 45,130 45,70"
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="0.9"
                opacity={hovered ? 0.66 : 0.28}
                style={{ transition: "opacity 0.4s ease" }}
              />

              <g style={{ transformOrigin: "100px 100px", transform: `rotate(${time * 20}deg)` }}>
                <polygon
                  points="100,60 135,120 65,120"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  opacity={hovered ? 0.7 : 0.28}
                />
              </g>

              <polygon
                points="90,80 90,120 120,100"
                fill={hovered ? "hsl(190, 94%, 95%)" : "hsl(192, 72%, 76%)"}
                style={{
                  transition: "fill 0.3s ease",
                  filter: hovered
                    ? "drop-shadow(0 0 12px rgba(212,180,117,0.82))"
                    : "drop-shadow(0 0 6px rgba(212,180,117,0.4))",
                }}
              />

              {[
                [100, 15], [175, 57.5], [175, 142.5],
                [100, 185], [25, 142.5], [25, 57.5],
              ].map(([cx, cy], i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={hovered ? 3 : 2}
                  fill={i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))"}
                  opacity={hovered ? 0.8 : 0.3}
                  style={{ transition: "all 0.4s ease" }}
                />
              ))}
            </svg>

            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: "1px solid hsl(var(--primary) / 0.25)",
                animation: "pulseRing 3s ease-out infinite",
              }}
            />
          </button>

          <div className="absolute -bottom-20 text-center space-y-2">
            <p className="text-sm font-display tracking-[0.28em] text-primary text-glow uppercase">
              ENTER THE FORGE
            </p>
            <p className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase">
              click the portal to begin
            </p>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.22em] text-primary/60">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            SYSTEM READY · V3.0 · NEURAL ENGINE
          </div>
          <button
            onClick={handleEnter}
            className="text-[10px] font-mono tracking-widest text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors underline underline-offset-2 cursor-pointer"
            style={{ opacity: phase === "idle" ? 1 : 0, transition: "opacity 0.3s" }}
          >
            skip intro
          </button>
        </div>

        {/* Open transition flash */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: phase === "opening" ? 1 : 0,
            transition: "opacity 0.24s ease",
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.14) 18%, rgba(255,255,255,0) 58%)",
          }}
        />
      </div>

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

      <div
        className="transition-all duration-1000"
        style={{
          opacity: phase === "open" ? 1 : 0,
          transform: phase === "open" ? "scale(1)" : "scale(0.94)",
          filter: phase === "open" ? "blur(0px)" : "blur(16px)",
          transitionTimingFunction: "cubic-bezier(0.77, 0, 0.175, 1)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default VideoPlayerGate;

