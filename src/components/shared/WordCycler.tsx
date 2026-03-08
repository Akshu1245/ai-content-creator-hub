import { useState, useEffect } from "react";

interface WordCyclerProps {
  words: string[];
  className?: string;
  interval?: number;
}

/* Warm earthy gradients — terracotta, ochre, sage, mauve */
const WORD_COLORS = [
  "from-[hsl(12,76%,56%)] to-[hsl(32,65%,48%)]",
  "from-[hsl(42,72%,52%)] to-[hsl(16,55%,42%)]",
  "from-[hsl(158,32%,45%)] to-[hsl(185,40%,48%)]",
  "from-[hsl(320,22%,48%)] to-[hsl(345,45%,52%)]",
];

const WORD_GLOWS = [
  "0 0 25px hsla(12,76%,56%,0.4)",
  "0 0 25px hsla(42,72%,52%,0.4)",
  "0 0 25px hsla(158,32%,45%,0.35)",
  "0 0 25px hsla(320,22%,48%,0.35)",
];

const WordCycler = ({ words, className = "", interval = 2800 }: WordCyclerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setNextIndex((currentIndex + 1) % words.length);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 600);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval, currentIndex]);

  return (
    <span
      className={`inline-block relative overflow-hidden ${className}`}
      style={{ perspective: "800px", minWidth: "3ch", height: "1.15em", verticalAlign: "bottom" }}
    >
      <span
        className="absolute inset-0 flex items-center justify-start will-change-transform"
        style={{
          transition: isAnimating ? "transform 0.6s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.35s ease" : "none",
          transform: isAnimating ? "translateY(-110%) scale(0.8)" : "translateY(0%) scale(1)",
          opacity: isAnimating ? 0 : 1,
          textShadow: WORD_GLOWS[currentIndex % WORD_GLOWS.length],
        }}
      >
        <span className={`bg-gradient-to-r bg-clip-text text-transparent ${WORD_COLORS[currentIndex % WORD_COLORS.length]}`}>
          {words[currentIndex]}
        </span>
      </span>
      <span
        className="absolute inset-0 flex items-center justify-start will-change-transform"
        style={{
          transition: isAnimating ? "transform 0.6s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.4s ease 0.1s" : "none",
          transform: isAnimating ? "translateY(0%) scale(1)" : "translateY(110%) scale(0.8)",
          opacity: isAnimating ? 1 : 0,
          textShadow: WORD_GLOWS[nextIndex % WORD_GLOWS.length],
        }}
      >
        <span className={`bg-gradient-to-r bg-clip-text text-transparent ${WORD_COLORS[nextIndex % WORD_COLORS.length]}`}>
          {words[nextIndex]}
        </span>
      </span>
      <span className="invisible whitespace-nowrap">
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
    </span>
  );
};

export default WordCycler;
