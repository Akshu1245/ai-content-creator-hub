import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, ArrowRight } from "lucide-react";
import { useTour } from "@/contexts/TourContext";
import { Link } from "react-router-dom";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 10;

const getTooltipPosition = (rect: Rect | null, position: string, tooltipH: number, tooltipW: number) => {
  if (!rect || position === "center") {
    return {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (position === "bottom") {
    const top = rect.top + rect.height + PAD + 12;
    const left = Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipW / 2, vw - tooltipW - 16));
    return { top: `${top}px`, left: `${left}px` };
  }
  if (position === "top") {
    const top = Math.max(16, rect.top - tooltipH - PAD - 12);
    const left = Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipW / 2, vw - tooltipW - 16));
    return { top: `${top}px`, left: `${left}px` };
  }
  if (position === "right") {
    const top = Math.max(16, Math.min(rect.top + rect.height / 2 - tooltipH / 2, vh - tooltipH - 16));
    const left = Math.min(rect.left + rect.width + PAD + 12, vw - tooltipW - 16);
    return { top: `${top}px`, left: `${left}px` };
  }
  if (position === "left") {
    const top = Math.max(16, Math.min(rect.top + rect.height / 2 - tooltipH / 2, vh - tooltipH - 16));
    const left = Math.max(16, rect.left - tooltipW - PAD - 12);
    return { top: `${top}px`, left: `${left}px` };
  }
  return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
};

const ProductTour = () => {
  const { isActive, currentStep, steps, nextStep, prevStep, skipTour, completeTour } = useTour();
  const [rect, setRect] = useState<Rect | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const isCentered = step.position === "center" || !step.target;

  const measureTarget = useCallback(() => {
    if (!step.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${step.target}"]`) as HTMLElement | null;
    if (!el) { setRect(null); return; }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [step.target]);

  useEffect(() => {
    if (!isActive) { setTooltipVisible(false); return; }
    setTooltipVisible(false);
    const t1 = setTimeout(() => {
      measureTarget();
    }, 80);
    const t2 = setTimeout(() => {
      setTooltipVisible(true);
    }, 220);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isActive, currentStep, measureTarget]);

  useEffect(() => {
    if (!isActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipTour();
      if (e.key === "ArrowRight" && !isLast) nextStep();
      if (e.key === "ArrowLeft" && !isFirst) prevStep();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isActive, isFirst, isLast, nextStep, prevStep, skipTour]);

  if (!isActive) return null;

  const spotlightStyle: React.CSSProperties = rect && !isCentered
    ? {
        position: "fixed",
        top: rect.top - PAD,
        left: rect.left - PAD,
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
        borderRadius: "14px",
        boxShadow: `0 0 0 9999px rgba(0,0,0,0.72), 0 0 0 2px ${step.accentColor || "hsl(var(--primary))"}`,
        zIndex: 10001,
        pointerEvents: "none",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }
    : {};

  const tooltipStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 10002,
    width: isCentered ? "min(480px, 90vw)" : "min(320px, 88vw)",
    opacity: tooltipVisible ? 1 : 0,
    transform: tooltipVisible ? "scale(1) translateY(0)" : "scale(0.94) translateY(8px)",
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    ...(isCentered
      ? { top: "50%", left: "50%", transform: tooltipVisible ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0.94)" }
      : getTooltipPosition(rect, step.position || "bottom", 280, 320)
    ),
  };

  return createPortal(
    <>
      {/* Backdrop for centered steps (no spotlight element) */}
      {isCentered && (
        <div
          className="fixed inset-0 bg-black/72 backdrop-blur-sm z-[10000]"
          style={{ animation: "fadeIn 0.25s ease both" }}
          onClick={skipTour}
        />
      )}

      {/* Spotlight box (non-centered steps) */}
      {!isCentered && rect && (
        <div style={spotlightStyle} />
      )}

      {/* Invisible backdrop to intercept clicks outside tooltip (non-centered) */}
      {!isCentered && (
        <div
          className="fixed inset-0 z-[10000]"
          style={{ background: "transparent" }}
          onClick={skipTour}
        />
      )}

      {/* Tooltip card */}
      <div
        ref={tooltipRef}
        style={tooltipStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative rounded-2xl border border-border/60 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--card)) 60%, hsl(var(--primary) / 0.04) 100%)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px hsl(var(--primary) / 0.12)",
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute inset-x-0 top-0 h-0.5"
            style={{
              background: step.accentColor
                ? `linear-gradient(90deg, transparent, ${step.accentColor}, transparent)`
                : "linear-gradient(90deg, transparent, hsl(var(--primary)), hsl(var(--accent)), transparent)",
            }}
          />

          {/* Particles */}
          {isCentered && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary/30"
                  style={{
                    left: `${15 + i * 14}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    animation: `particleDrift ${2.5 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
                  }}
                />
              ))}
            </div>
          )}

          <div className="p-6 md:p-7">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                {step.icon && (
                  <div className="w-10 h-10 rounded-xl bg-primary/8 border border-primary/20 flex items-center justify-center text-xl shrink-0">
                    {step.icon}
                  </div>
                )}
                <div>
                  <p className="text-[9px] font-label text-muted-foreground tracking-widest mb-0.5">
                    STEP {currentStep + 1} OF {steps.length}
                  </p>
                  <h3 className="text-base font-display font-bold text-foreground leading-tight">{step.title}</h3>
                </div>
              </div>
              <button
                onClick={skipTour}
                className="w-7 h-7 rounded-lg bg-secondary/60 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-5 h-0.5 bg-border/40 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                  background: step.accentColor || "hsl(var(--primary))",
                }}
              />
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{step.description}</p>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={skipTour}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip tour
              </button>

              <div className="flex items-center gap-2">
                {!isFirst && (
                  <button
                    onClick={prevStep}
                    className="w-8 h-8 rounded-lg border border-border/60 bg-secondary/50 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-150"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}

                {isLast ? (
                  <Link to="/new-project">
                    <button
                      onClick={completeTour}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                    >
                      {step.cta || "Create First Video"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                ) : isFirst ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {step.cta || "Show me around"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Step dots */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === currentStep ? "18px" : "5px",
                    height: "5px",
                    background: i === currentStep
                      ? (step.accentColor || "hsl(var(--primary))")
                      : i < currentStep
                        ? "hsl(var(--primary) / 0.4)"
                        : "hsl(var(--border))",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ProductTour;
