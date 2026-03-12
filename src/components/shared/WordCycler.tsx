import { useState, useEffect } from "react";

interface WordCyclerProps {
  words: string[];
  className?: string;
  interval?: number;
}

/* Luxury cinematic keyword gradients */
const WORD_COLORS = [
  "from-[hsl(42,52%,64%)] to-[hsl(32,44%,56%)]",
  "from-[hsl(356,66%,56%)] to-[hsl(8,62%,52%)]",
  "from-[hsl(38,24%,94%)] to-[hsl(42,52%,64%)]",
  "from-[hsl(271,32%,66%)] to-[hsl(42,52%,64%)]",
];

const WORD_GLOWS = [
  "0 0 20px hsla(42,52%,64%,0.44)",
  "0 0 20px hsla(356,66%,56%,0.34)",
  "0 0 20px hsla(38,24%,94%,0.22)",
  "0 0 20px hsla(271,32%,66%,0.3)",
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
