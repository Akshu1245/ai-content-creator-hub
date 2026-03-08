import { useState, useEffect } from "react";

interface WordCyclerProps {
  words: string[];
  className?: string;
  interval?: number;
}

const WordCycler = ({ words, className = "", interval = 2500 }: WordCyclerProps) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, 300);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  return (
    <span
      className={`inline-block transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${className}`}
    >
      {words[index]}
    </span>
  );
};

export default WordCycler;
