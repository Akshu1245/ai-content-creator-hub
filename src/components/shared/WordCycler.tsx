import { useState, useEffect, useRef } from "react";

interface WordCyclerProps {
  words: string[];
  className?: string;
  interval?: number;
}

const WORD_COLORS = [
  "from-[#00d4ff] to-[#7b2ff7]",   // monetized — cyan→violet
  "from-[#ff6b6b] to-[#ffa500]",   // compliant — coral→orange  
  "from-[#00ff87] to-[#60efff]",   // views — mint→sky
  "from-[#f857a6] to-[#ff5858]",   // results — pink→red
];

const WORD_GLOWS = [
  "0 0 40px rgba(0,212,255,0.5), 0 0 80px rgba(123,47,247,0.3)",
  "0 0 40px rgba(255,107,107,0.5), 0 0 80px rgba(255,165,0,0.3)",
  "0 0 40px rgba(0,255,135,0.5), 0 0 80px rgba(96,239,255,0.3)",
  "0 0 40px rgba(248,87,166,0.5), 0 0 80px rgba(255,88,88,0.3)",
];

const WordCycler = ({ words, className = "", interval = 2800 }: WordCyclerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setShowFlash(true);
      setNextIndex((currentIndex + 1) % words.length);

      setTimeout(() => setShowFlash(false), 300);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 700);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval, currentIndex]);

  return (
    <span
      className={`inline-block relative overflow-hidden ${className}`}
      style={{
        perspective: "1000px",
        perspectiveOrigin: "center center",
        minWidth: "3ch",
        height: "1.2em",
        verticalAlign: "bottom",
      }}
    >
      {/* Cinematic film-frame border lines */}
      <span
        className="absolute left-0 right-0 top-0 h-[2px] z-10 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 80%, transparent)",
          opacity: isAnimating ? 1 : 0.3,
          transition: "opacity 0.3s ease",
        }}
      />
      <span
        className="absolute left-0 right-0 bottom-0 h-[2px] z-10 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 80%, transparent)",
          opacity: isAnimating ? 1 : 0.3,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Scanline overlay — CRT/video feel */}
      <span
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
          mixBlendMode: "overlay",
        }}
      />

      {/* Current word — cinematic exit */}
      <span
        className="absolute inset-0 flex items-center justify-center will-change-transform"
        style={{
          transition: isAnimating
            ? "transform 0.7s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.4s ease, filter 0.5s ease"
            : "none",
          transform: isAnimating
            ? "translateY(-120%) rotateX(60deg) scale(0.7)"
            : "translateY(0%) rotateX(0deg) scale(1)",
          opacity: isAnimating ? 0 : 1,
          filter: isAnimating ? "blur(6px) brightness(2)" : "blur(0px) brightness(1)",
          transformOrigin: "center bottom",
          backfaceVisibility: "hidden",
          textShadow: isAnimating ? "none" : WORD_GLOWS[currentIndex % WORD_GLOWS.length],
        }}
      >
        <span
          className={`bg-gradient-to-r bg-clip-text text-transparent ${WORD_COLORS[currentIndex % WORD_COLORS.length]}`}
        >
          {words[currentIndex]}
        </span>
      </span>

      {/* Next word — cinematic entrance */}
      <span
        className="absolute inset-0 flex items-center justify-center will-change-transform"
        style={{
          transition: isAnimating
            ? "transform 0.7s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.45s ease 0.15s, filter 0.5s ease 0.1s"
            : "none",
          transform: isAnimating
            ? "translateY(0%) rotateX(0deg) scale(1)"
            : "translateY(120%) rotateX(-60deg) scale(0.7)",
          opacity: isAnimating ? 1 : 0,
          filter: isAnimating ? "blur(0px) brightness(1)" : "blur(6px) brightness(2)",
          transformOrigin: "center top",
          backfaceVisibility: "hidden",
          textShadow: isAnimating ? WORD_GLOWS[nextIndex % WORD_GLOWS.length] : "none",
        }}
      >
        <span
          className={`bg-gradient-to-r bg-clip-text text-transparent ${WORD_COLORS[nextIndex % WORD_COLORS.length]}`}
        >
          {words[nextIndex]}
        </span>
      </span>

      {/* Bright flash on transition — like a film cut */}
      <span
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
          opacity: showFlash ? 1 : 0,
          transition: showFlash ? "opacity 0.05s ease" : "opacity 0.3s ease",
        }}
      />

      {/* Color sweep light — cinematic pass */}
      <span
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${
            isAnimating ? "rgba(123,47,247,0.2)" : "transparent"
          } 40%, ${
            isAnimating ? "rgba(0,212,255,0.2)" : "transparent"
          } 60%, transparent 100%)`,
          transition: isAnimating
            ? "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease"
            : "opacity 0.3s ease",
          transform: isAnimating ? "translateX(120%)" : "translateX(-120%)",
          opacity: isAnimating ? 1 : 0,
        }}
      />

      {/* Invisible sizer */}
      <span className="invisible whitespace-nowrap">
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
    </span>
  );
};

export default WordCycler;
