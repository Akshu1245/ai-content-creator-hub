import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
  icon?: string;
  accentColor?: string;
  cta?: string;
}

export const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to VORAX",
    description: "India's only AI video studio with built-in monetization protection. Let's take a 45-second tour so you know exactly where everything lives.",
    position: "center",
    icon: "🔥",
    cta: "Start Tour →",
  },
  {
    id: "new-video",
    target: "tour-new-video",
    title: "Create a new video",
    description: "Everything starts here. Click to launch the 8-step AI wizard — script, voiceover, visuals, compliance score, and export. Average time: 6 minutes.",
    position: "right",
    icon: "🎬",
    accentColor: "hsl(var(--primary))",
  },
  {
    id: "sidebar-nav",
    target: "tour-sidebar-nav",
    title: "Your navigation",
    description: "Dashboard shows all your projects. Analytics tracks your channel growth. Settings manages your subscription, billing, and Indian language preferences.",
    position: "right",
    icon: "🗺️",
  },
  {
    id: "stats",
    target: "tour-stats",
    title: "Your creator metrics",
    description: "Total videos created, completions, weekly output, and how many have been generated. These update in real time as you publish.",
    position: "bottom",
    icon: "📊",
  },
  {
    id: "revenue-center",
    target: "tour-revenue-center",
    title: "Paycheck Preview",
    description: "Before publishing, VORAX estimates your AdSense revenue based on your niche and view target. No other tool shows you this before you click upload.",
    position: "top",
    icon: "💰",
    accentColor: "hsl(var(--gold))",
  },
  {
    id: "ypp-tracker",
    target: "tour-ypp-tracker",
    title: "Monetization Countdown",
    description: "Track your progress toward YouTube Partner Program in real time — watch hours, subscriber count, and how many more videos you need to hit the threshold.",
    position: "right",
    icon: "🎯",
  },
  {
    id: "projects",
    target: "tour-projects",
    title: "Your video projects",
    description: "Every AI video you create appears here. Click to continue editing, replay the video, check its compliance score, or export to YouTube, TikTok, Instagram, or Shorts.",
    position: "top",
    icon: "🎥",
  },
  {
    id: "monetization-shield",
    target: "tour-compliance",
    title: "Monetization Shield — always on",
    description: "This is VORAX's core protection. Every video gets scored against YouTube's monetization policy before you can export. Competitors skip this. We never do.",
    position: "top",
    icon: "🛡️",
    accentColor: "hsl(142 71% 45%)",
  },
  {
    id: "done",
    title: "You're all set.",
    description: "You know where everything is. Create your first video now — the AI handles the script, voice, visuals, and compliance. You just pick your topic.",
    position: "center",
    icon: "✅",
    cta: "Create My First Video →",
  },
];

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
}

const TourContext = createContext<TourContextType | null>(null);

export const TOUR_COMPLETED_KEY = "vorax-tour-v1-completed";

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, DASHBOARD_TOUR_STEPS.length - 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const skipTour = useCallback(() => {
    setIsActive(false);
    localStorage.setItem(TOUR_COMPLETED_KEY, "skipped");
  }, []);

  const completeTour = useCallback(() => {
    setIsActive(false);
    localStorage.setItem(TOUR_COMPLETED_KEY, "done");
  }, []);

  return (
    <TourContext.Provider value={{ isActive, currentStep, steps: DASHBOARD_TOUR_STEPS, startTour, nextStep, prevStep, skipTour, completeTour }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
};
