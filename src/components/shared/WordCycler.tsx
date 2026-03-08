import { useState, useEffect } from "react";

interface WordCyclerProps {
  words: string[];
  className?: string;
  interval?: number;
}

const WORD_COLORS = [
  "from-[hsl(265,85%,65%)] to-[hsl(285,80%,55%)]",
  "from-[hsl(38,95%,60%)] to-[hsl(20,90%,55%)]",
  "from-[hsl(155,65%,48%)] to-[hsl(195,90%,55%)]",
  "from-[hsl(345,70%,58%)] to-[hsl(265,85%,65%)]",
];

const WORD_GLOWS = [
  "0 0 30px hsla(265,85%,65%,0.5)",
  "0 0 30px hsla(38,95%,60%,0.5)",
  "0 0 30px hsla(155,65%,48%,0.5)",
  "0 0 30px hsla(345,70%,58%,0.5)",
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
      style={{
        perspective: "800px",
        minWidth: "3ch",
        height: "1.15em",
        verticalAlign: "bottom",
      }}
    >
      {/* Current word */}
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

      {/* Next word */}
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

      {/* Invisible sizer */}
      <span className="invisible whitespace-nowrap">
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
    </span>
  );
};

export default WordCycler;
