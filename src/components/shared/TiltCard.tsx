import { ReactNode, useRef, useState } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
}

const TiltCard = ({ children, className = "", glowColor = "14,165,233", intensity = 12 }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setStyle({
      transform: `perspective(900px) rotateY(${x * intensity}deg) rotateX(${y * -intensity}deg) translateZ(8px)`,
      transition: "none",
    });

    if (glowRef.current) {
      glowRef.current.style.opacity = "1";
      glowRef.current.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(${glowColor},0.12) 0%, transparent 65%)`;
    }
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)",
      transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
    });
    if (glowRef.current) {
      glowRef.current.style.opacity = "0";
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{ ...style, willChange: "transform" }}
    >
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-10 transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
      {children}
    </div>
  );
};

export default TiltCard;
