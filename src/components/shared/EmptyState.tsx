import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaTo?: string;
}

const EmptyState = ({
  title = "Your first video is one click away",
  description = "Start your faceless content journey — pick a niche and let AI handle the rest.",
  ctaLabel = "Create Your First Video",
  ctaTo = "/new-project",
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Geometric art — warm palette */}
      <div className="relative w-40 h-40 mb-8">
        {[80, 60, 40, 24].map((size, i) => (
          <div
            key={size}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              border: `1.5px solid hsl(12, 76%, 56%, ${0.08 + i * 0.06})`,
              animation: `spin ${12 - i * 2}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
            }}
          />
        ))}
        <div
          className="absolute w-3 h-3 rounded-full"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "linear-gradient(135deg, hsl(12, 76%, 56%), hsl(158, 32%, 45%))",
            boxShadow: "0 0 20px hsl(12, 76%, 56%, 0.3)",
          }}
        />
      </div>

      <h3 className="font-display font-bold text-xl text-foreground mb-2">{title}</h3>
      <p className="text-sm max-w-sm mb-6 text-muted-foreground">{description}</p>
      <Link to={ctaTo}>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> {ctaLabel}
        </button>
      </Link>
    </div>
  );
};

export default EmptyState;
