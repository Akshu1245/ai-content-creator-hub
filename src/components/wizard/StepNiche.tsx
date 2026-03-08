import { WizardData } from "@/pages/NewProject";
import { Sparkles } from "lucide-react";
import RevenueEstimatorCard from "@/components/differentiators/RevenueEstimatorCard";

const niches = [
  { name: "Finance", emoji: "💰" },
  { name: "Technology", emoji: "⚡" },
  { name: "Horror", emoji: "👻" },
  { name: "Motivation", emoji: "🔥" },
  { name: "History", emoji: "📜" },
  { name: "Health", emoji: "🧬" },
  { name: "Gaming", emoji: "🎮" },
  { name: "Science", emoji: "🔬" },
  { name: "True Crime", emoji: "🔍" },
  { name: "Psychology", emoji: "🧠" },
];

const suggestedTopics: Record<string, string[]> = {
  Finance: ["Why 99% of People Retire Broke", "Hidden Fees Banks Don't Tell You", "Compound Interest: The 8th Wonder"],
  Technology: ["Why GPUs Cost So Much in 2026", "The AI Chip War Explained", "What Happens When Quantum Computing Arrives"],
  Horror: ["The Backrooms Level 9999", "SCP-3008: Infinite IKEA", "Most Haunted Places Science Can't Explain"],
  Motivation: ["Why Discipline Beats Motivation", "The 5AM Club: What They Don't Tell You", "How to Rewire Your Brain in 21 Days"],
  History: ["Ancient Civilizations That Vanished Overnight", "The Real Reason Rome Fell", "History's Most Bizarre Coincidences"],
  Health: ["What Happens When You Stop Eating Sugar", "The Science of Cold Showers", "Why Sleep Is More Important Than Exercise"],
  Gaming: ["Games That Predicted the Future", "Why AAA Games Keep Failing", "The Psychology of Loot Boxes"],
  Science: ["What's at the Bottom of the Ocean", "Why Time Moves Slower in Space", "The Simulation Theory Explained"],
  "True Crime": ["Unsolved Cases That Haunt Detectives", "The Most Sophisticated Heist Ever", "Criminal Masterminds Who Almost Got Away"],
  Psychology: ["Dark Psychology Tricks Used on You Daily", "Why We Procrastinate (It's Not Laziness)", "The Dunning-Kruger Effect Explained"],
};

interface Props { data: WizardData; updateData: (u: Partial<WizardData>) => void; }

const StepNiche = ({ data, updateData }: Props) => {
  const topics = data.niche ? suggestedTopics[data.niche] || [] : [];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[10px] font-label text-primary block mb-2">STEP 1 OF 8</span>
        <h2 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Choose Your Niche</h2>
        <p className="text-xs text-muted-foreground">Select a content category to get started</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {niches.map((niche) => (
          <button
            key={niche.name}
            onClick={() => updateData({ niche: niche.name, topic: "" })}
            className={`px-4 py-4 rounded-xl text-xs font-medium transition-all text-center border ${
              data.niche === niche.name
                ? "bg-primary/10 border-primary/30 text-primary shadow-lg shadow-primary/5"
                : "bg-secondary/30 border-border text-muted-foreground hover:text-foreground hover:border-primary/20 hover:bg-secondary/50"
            }`}
          >
            <span className="text-lg block mb-1">{niche.emoji}</span>
            {niche.name}
          </button>
        ))}
      </div>

      {/* Revenue Estimator — appears immediately after niche selection */}
      {data.niche && (
        <div className="animate-fade-in">
          <RevenueEstimatorCard niche={data.niche} />
        </div>
      )}

      {topics.length > 0 && (
        <div className="animate-fade-in space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-xs font-display text-foreground font-bold">Trending in {data.niche}</h3>
          </div>
          <div className="space-y-2">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => updateData({ topic })}
                className={`w-full text-left px-5 py-4 rounded-xl text-xs transition-all border ${
                  data.topic === topic
                    ? "bg-primary/10 border-primary/30 text-foreground"
                    : "bg-secondary/20 border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/20"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
          <div className="gradient-strip" />
          <input
            type="text"
            placeholder="Or type your own topic..."
            value={!suggestedTopics[data.niche]?.includes(data.topic) ? data.topic : ""}
            onChange={(e) => updateData({ topic: e.target.value })}
            className="w-full px-5 py-4 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 bg-secondary/30 border border-border transition-all"
          />
        </div>
      )}
    </div>
  );
};

export default StepNiche;
