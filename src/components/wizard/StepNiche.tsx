import { WizardData } from "@/pages/NewProject";

const niches = [
  "Finance", "Technology", "Horror", "Motivation", "History",
  "Health", "Gaming", "Science", "True Crime", "Psychology"
];

const nicheIcons: Record<string, string> = {
  Finance: "💰", Technology: "⚡", Horror: "👻", Motivation: "🔥", History: "📜",
  Health: "🧬", Gaming: "🎮", Science: "🔬", "True Crime": "🔍", Psychology: "🧠"
};

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
        <h2 className="text-xl font-display font-bold mb-1">Choose Your Niche</h2>
        <p className="text-sm" style={{ color: "hsl(205 40% 55%)" }}>Select a content category to discover trending topics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {niches.map((niche) => (
          <button
            key={niche}
            onClick={() => updateData({ niche, topic: "" })}
            className="px-4 py-4 rounded-xl text-sm font-display font-bold transition-all text-center"
            style={{
              background: data.niche === niche ? "rgba(14,165,233,0.12)" : "rgba(8,13,20,0.65)",
              border: `1px solid ${data.niche === niche ? "rgba(14,165,233,0.4)" : "rgba(42,72,112,0.35)"}`,
              color: data.niche === niche ? "#0EA5E9" : "hsl(205 40% 62%)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="text-xl block mb-1">{nicheIcons[niche]}</span>
            {niche}
          </button>
        ))}
      </div>

      {topics.length > 0 && (
        <div className="animate-fade-in">
          <h3 className="text-base font-display font-bold mb-3 flex items-center gap-2">
            🔥 Trending in {data.niche}
          </h3>
          <div className="space-y-2">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => updateData({ topic })}
                className="w-full text-left px-5 py-4 rounded-xl text-sm transition-all"
                style={{
                  background: data.topic === topic ? "rgba(14,165,233,0.12)" : "rgba(8,13,20,0.65)",
                  border: `1px solid ${data.topic === topic ? "rgba(14,165,233,0.4)" : "rgba(42,72,112,0.35)"}`,
                  color: data.topic === topic ? "#0EA5E9" : "hsl(200 60% 94%)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {topic}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Or type your own topic..."
              value={!suggestedTopics[data.niche]?.includes(data.topic) ? data.topic : ""}
              onChange={(e) => updateData({ topic: e.target.value })}
              className="w-full px-5 py-4 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              style={{
                background: "rgba(8,13,20,0.65)",
                border: "1px solid rgba(42,72,112,0.35)",
                backdropFilter: "blur(12px)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StepNiche;
