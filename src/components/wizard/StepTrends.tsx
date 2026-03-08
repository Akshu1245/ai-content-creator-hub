import { useState, useEffect } from "react";
import { WizardData } from "@/pages/NewProject";
import { Eye, Clock, TrendingUp, BarChart3, Loader2, Search, ExternalLink, Lightbulb, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props { data: WizardData; updateData: (u: Partial<WizardData>) => void; }

interface ResearchData {
  trendScore: number;
  searchVolume: string;
  competition: string;
  idealLength: string;
  bestPostTime: string;
  competitors: { title: string; views: string; retention: string; likes: string }[];
  trendingAngles: string[];
  audienceInsight: string;
  contentGaps: string[];
  suggestedTitle: string;
  keySearchTerms: string[];
}

interface Source {
  title: string;
  url: string;
}

const StepTrends = ({ data, updateData }: Props) => {
  const [loading, setLoading] = useState(false);
  const [research, setResearch] = useState<ResearchData | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchResearch = async () => {
    if (!data.niche || !data.topic) return;
    setLoading(true);
    setError(null);

    try {
      const { data: resData, error: resError } = await supabase.functions.invoke('market-research', {
        body: { niche: data.niche, topic: data.topic },
      });

      if (resError) throw resError;
      if (resData?.error) throw new Error(resData.error);

      setResearch(resData.research);
      setSources(resData.sources || []);
      updateData({ trendData: resData.research });
      toast.success('Market research complete!');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Research failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data.niche && data.topic && !research && !loading) {
      fetchResearch();
    }
  }, [data.niche, data.topic]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-label text-primary block mb-2">STEP 2 OF 8</span>
          <h2 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Researching Market</h2>
          <p className="text-xs text-muted-foreground">
            Searching the internet for: <span className="text-primary font-semibold">{data.topic}</span>
          </p>
        </div>
        <div className="surface-raised p-10 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <div className="text-center">
            <p className="text-xs text-foreground font-medium">Analyzing trends & competitors</p>
            <p className="text-[10px] text-muted-foreground mt-1">Gemini is searching the web with Google Search grounding...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-label text-destructive block mb-2">RESEARCH ERROR</span>
          <h2 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Research Failed</h2>
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
        <button onClick={fetchResearch} className="btn-primary text-xs flex items-center gap-2">
          <Search className="w-3.5 h-3.5" /> Retry Research
        </button>
      </div>
    );
  }

  if (!research) {
    return (
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-label text-primary block mb-2">STEP 2 OF 8</span>
          <h2 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Trend Intelligence</h2>
          <p className="text-xs text-muted-foreground">Select a niche and topic first</p>
        </div>
      </div>
    );
  }

  const scoreColor = research.trendScore >= 70 ? "text-emerald" : research.trendScore >= 40 ? "text-ochre" : "text-destructive";

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-label text-primary block mb-2">STEP 2 OF 6</span>
        <h2 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Trend Intelligence</h2>
        <p className="text-xs text-muted-foreground">
          Live research for: <span className="text-primary font-semibold">{data.topic}</span>
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Trend Score", value: `${research.trendScore}/100`, icon: TrendingUp },
          { label: "Search Vol", value: research.searchVolume, icon: BarChart3 },
          { label: "Competition", value: research.competition, icon: Eye },
          { label: "Ideal Length", value: research.idealLength, icon: Clock },
          { label: "Best Time", value: research.bestPostTime, icon: Clock },
        ].map((m) => (
          <div key={m.label} className="surface-raised p-4 text-center">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-2">
              <m.icon className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className={`text-xs font-mono font-bold ${m.label === "Trend Score" ? scoreColor : "text-foreground"}`}>{m.value}</div>
            <div className="text-[9px] font-label text-muted-foreground mt-1">{m.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Suggested Title */}
      {research.suggestedTitle && (
        <div className="surface-raised p-4 border-l-2 border-primary">
          <p className="text-[10px] font-label text-primary mb-1">SUGGESTED TITLE (OPTIMIZED CTR)</p>
          <p className="text-sm text-foreground font-display font-bold">{research.suggestedTitle}</p>
        </div>
      )}

      {/* Audience Insight */}
      {research.audienceInsight && (
        <div className="surface-raised p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-xs font-display text-foreground font-bold">Audience Insight</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{research.audienceInsight}</p>
        </div>
      )}

      {/* Trending Angles & Content Gaps */}
      <div className="grid md:grid-cols-2 gap-3">
        {research.trendingAngles?.length > 0 && (
          <div className="surface-raised p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-3.5 h-3.5 text-ochre" />
              <h3 className="text-xs font-display text-foreground font-bold">Trending Angles</h3>
            </div>
            <ul className="space-y-2">
              {research.trendingAngles.map((angle, i) => (
                <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-2">
                  <span className="text-primary font-mono text-[10px] mt-0.5">{i + 1}.</span>
                  {angle}
                </li>
              ))}
            </ul>
          </div>
        )}
        {research.contentGaps?.length > 0 && (
          <div className="surface-raised p-5">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-3.5 h-3.5 text-emerald" />
              <h3 className="text-xs font-display text-foreground font-bold">Content Gaps</h3>
            </div>
            <ul className="space-y-2">
              {research.contentGaps.map((gap, i) => (
                <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-2">
                  <span className="text-emerald font-mono text-[10px] mt-0.5">•</span>
                  {gap}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Competitors */}
      {research.competitors?.length > 0 && (
        <div>
          <h3 className="text-xs font-display text-foreground font-bold mb-3">Top Competing Videos</h3>
          <div className="space-y-2">
            {research.competitors.map((c, i) => (
              <div key={i} className="surface-raised p-4 flex items-center justify-between surface-hover">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[10px] font-mono text-muted-foreground w-5 shrink-0">#{i + 1}</span>
                  <span className="text-xs text-foreground truncate">{c.title}</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground shrink-0">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {c.views}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.retention}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Search Terms */}
      {research.keySearchTerms?.length > 0 && (
        <div className="surface-raised p-5">
          <h3 className="text-xs font-display text-foreground font-bold mb-3">Key Search Terms</h3>
          <div className="flex flex-wrap gap-2">
            {research.keySearchTerms.map((term, i) => (
              <span key={i} className="text-[10px] px-3 py-1.5 rounded-lg bg-secondary/50 text-muted-foreground border border-border/50">
                {term}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sources */}
      {sources.length > 0 && (
        <div className="surface-raised p-5">
          <h3 className="text-xs font-display text-foreground font-bold mb-3">Research Sources</h3>
          <div className="space-y-1.5">
            {sources.slice(0, 5).map((src, i) => (
              <a key={i} href={src.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="truncate">{src.title || src.url}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Refresh */}
      <button onClick={fetchResearch} className="btn-ghost text-[10px] flex items-center gap-2">
        <Search className="w-3 h-3" /> Re-run Research
      </button>
    </div>
  );
};

export default StepTrends;
