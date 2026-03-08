import { Shield, Play } from "lucide-react";

const FloatingVideoCard = () => {
  return (
    <div className="relative w-full max-w-md mx-auto" style={{ perspective: "1000px" }}>
      <div
        className="glass-elevated p-4 animate-float"
        style={{
          transform: "rotateY(-12deg) rotateX(5deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Mock video thumbnail */}
        <div
          className="w-full aspect-video rounded-xl flex items-center justify-center relative overflow-hidden mb-4"
          style={{
            background: "linear-gradient(135deg, rgba(14,165,233,0.15), rgba(6,214,160,0.08), rgba(8,13,20,0.9))",
            border: "1px solid rgba(42,72,112,0.3)",
          }}
        >
          {/* Grid overlay inside */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(14,165,233,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.1) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center relative z-10"
            style={{
              background: "rgba(14,165,233,0.2)",
              border: "2px solid rgba(14,165,233,0.5)",
              boxShadow: "0 0 30px rgba(14,165,233,0.2)",
            }}
          >
            <Play className="w-6 h-6 text-cyan ml-0.5" />
          </div>
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs font-mono font-bold" style={{ background: "rgba(0,0,0,0.7)", color: "hsl(200 60% 94%)" }}>
            8:42
          </div>
        </div>

        {/* Video info */}
        <div className="mb-3">
          <h4 className="font-display font-bold text-sm text-foreground mb-1">
            How Compound Interest Actually Works
          </h4>
          <p className="text-xs font-label" style={{ color: "hsl(210 25% 40%)" }}>
            AI FINANCE TIPS • 12K VIEWS
          </p>
        </div>

        {/* Compliance badge */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-display font-bold"
            style={{
              background: "rgba(6,214,160,0.1)",
              border: "1px solid rgba(6,214,160,0.3)",
              color: "#06D6A0",
            }}
          >
            <Shield className="w-3.5 h-3.5" />
            94 — SAFE TO MONETIZE
          </div>
          {/* Platform icons */}
          <div className="flex items-center gap-1.5">
            {["YT", "SH", "TK", "RL"].map((p) => (
              <div
                key={p}
                className="w-6 h-6 rounded flex items-center justify-center text-[8px] font-mono font-bold"
                style={{
                  background: "rgba(42,72,112,0.2)",
                  border: "1px solid rgba(42,72,112,0.3)",
                  color: "hsl(205 40% 55%)",
                }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shadow/reflection */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-8 rounded-full opacity-30"
        style={{
          background: "radial-gradient(ellipse, rgba(14,165,233,0.15), transparent)",
          filter: "blur(8px)",
        }}
      />
    </div>
  );
};

export default FloatingVideoCard;
