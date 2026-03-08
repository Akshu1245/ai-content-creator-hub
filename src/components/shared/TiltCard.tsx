import { ReactNode, useRef, useState } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

const TiltCard = ({ children, className = "", glowColor = "14,165,233" }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -8;
    const rotateY = (x - 0.5) * 8;
    setStyle({
      transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`,
      boxShadow: `${(x - 0.5) * -20}px ${(y - 0.5) * -20}px 40px rgba(${glowColor},0.08)`,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)",
      boxShadow: "none",
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default TiltCard;
