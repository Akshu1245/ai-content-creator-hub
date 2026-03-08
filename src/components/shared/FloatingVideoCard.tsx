import { Shield, Play } from "lucide-react";

const FloatingVideoCard = () => {
  return (
    <div className="relative w-full max-w-md mx-auto" style={{ perspective: "1000px" }}>
      <div
        className="surface-raised p-4 animate-float"
        style={{
          transform: "rotateY(-12deg) rotateX(5deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Mock video thumbnail */}
        <div
          className="w-full aspect-video rounded-xl flex items-center justify-center relative overflow-hidden mb-4"
          style={{
            background: "linear-gradient(135deg, hsl(12 76% 56% / 0.12), hsl(158 32% 45% / 0.06), hsl(24 12% 6% / 0.9))",
            border: "1px solid hsl(22 8% 20%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "linear-gradient(hsl(12 76% 56% / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(12 76% 56% / 0.08) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center relative z-10"
            style={{
              background: "hsl(12 76% 56% / 0.15)",
              border: "2px solid hsl(12 76% 56% / 0.4)",
              boxShadow: "0 0 30px hsl(12 76% 56% / 0.15)",
            }}
          >
            <Play className="w-6 h-6 text-primary ml-0.5" />
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs font-mono font-bold bg-background/80 text-foreground">
            8:42
          </div>
        </div>

        {/* Video info */}
        <div className="mb-3">
          <h4 className="font-display font-bold text-sm text-foreground mb-1">
            How Compound Interest Actually Works
          </h4>
          <p className="text-xs font-label text-muted-foreground">
            AI FINANCE TIPS • 12K VIEWS
          </p>
        </div>

        {/* Compliance badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-display font-bold bg-accent/10 border border-accent/20 text-accent">
            <Shield className="w-3.5 h-3.5" />
            94 — SAFE TO MONETIZE
          </div>
          <div className="flex items-center gap-1.5">
            {["YT", "SH", "TK", "RL"].map((p) => (
              <div
                key={p}
                className="w-6 h-6 rounded flex items-center justify-center text-[8px] font-mono font-bold bg-secondary border border-border text-muted-foreground"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-8 rounded-full opacity-30"
        style={{
          background: "radial-gradient(ellipse, hsl(12 76% 56% / 0.12), transparent)",
          filter: "blur(8px)",
        }}
      />
    </div>
  );
};

export default FloatingVideoCard;
