import { useState, useEffect, useRef } from "react";

interface WordCyclerProps {
  words: string[];
  className?: string;
  interval?: number;
}

const WordCycler = ({ words, className = "", interval = 2800 }: WordCyclerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setNextIndex((currentIndex + 1) % words.length);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 700);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval, currentIndex]);

  return (
    <span
      ref={containerRef}
      className={`inline-block relative overflow-hidden ${className}`}
      style={{
        perspective: "800px",
        perspectiveOrigin: "center center",
        minWidth: "3ch",
        height: "1.15em",
        verticalAlign: "bottom",
      }}
    >
      {/* Current word — slides out upward with 3D rotation */}
      <span
        className="absolute inset-0 flex items-center justify-start will-change-transform"
        style={{
          transition: isAnimating
            ? "transform 0.7s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.5s cubic-bezier(0.77, 0, 0.175, 1), filter 0.5s ease"
            : "none",
          transform: isAnimating
            ? "translateY(-110%) rotateX(45deg) scale(0.85)"
            : "translateY(0%) rotateX(0deg) scale(1)",
          opacity: isAnimating ? 0 : 1,
          filter: isAnimating ? "blur(4px)" : "blur(0px)",
          transformOrigin: "center bottom",
          backfaceVisibility: "hidden",
        }}
      >
        {words[currentIndex]}
      </span>

      {/* Next word — slides in from below with 3D rotation */}
      <span
        className="absolute inset-0 flex items-center justify-start will-change-transform"
        style={{
          transition: isAnimating
            ? "transform 0.7s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.5s cubic-bezier(0.77, 0, 0.175, 1) 0.15s, filter 0.5s ease 0.15s"
            : "none",
          transform: isAnimating
            ? "translateY(0%) rotateX(0deg) scale(1)"
            : "translateY(110%) rotateX(-45deg) scale(0.85)",
          opacity: isAnimating ? 1 : 0,
          filter: isAnimating ? "blur(0px)" : "blur(4px)",
          transformOrigin: "center top",
          backfaceVisibility: "hidden",
        }}
      >
        {words[nextIndex]}
      </span>

      {/* Gold cinematic light sweep on transition */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(42 78% 58% / 0.15) 50%, transparent 100%)",
          transition: isAnimating
            ? "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease"
            : "opacity 0.3s ease",
          transform: isAnimating ? "translateX(100%)" : "translateX(-100%)",
          opacity: isAnimating ? 1 : 0,
        }}
      />

      {/* Invisible sizer — ensures container width fits longest word */}
      <span className="invisible whitespace-nowrap">
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
    </span>
  );
};

export default WordCycler;
