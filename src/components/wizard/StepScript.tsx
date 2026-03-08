import { useState } from "react";
import { WizardData } from "@/pages/NewProject";
import { Sparkles, Loader2, Clock, FileText, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props { data: WizardData; updateData: (u: Partial<WizardData>) => void; }

const StepScript = ({ data, updateData }: Props) => {
  const [loading, setLoading] = useState(false);
  const wordCount = data.script.trim().split(/\s+/).filter(Boolean).length;
  const estimatedDuration = Math.round(wordCount / 150);

  const generateScript = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("generate-script", {
        body: { niche: data.niche, topic: data.topic },
      });
      if (error) throw error;
      if (result?.script) {
        updateData({ script: result.script });
        toast.success("Script generated!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed — using demo script");
      updateData({
        script: `[HOOK - First 3 seconds]\nDid you know that ${data.topic || "this simple concept"} could change everything you think you know?\n\n[SECTION 1 - The Setup]\nMost people never think about ${data.topic?.toLowerCase() || "this"}. But here's what makes it fascinating...\n\nThe truth is, understanding this concept gives you an unfair advantage that 99% of people will never have.\n\n[SECTION 2 - The Deep Dive]\nLet's break this down step by step. First, you need to understand the fundamentals.\n\nWhen we look at the data, the patterns become crystal clear. This isn't just theory — this is backed by real-world evidence.\n\n[SECTION 3 - The Revelation]\nHere's what most people miss — and this is the part that changes everything.\n\nOnce you understand this principle, you'll see it everywhere. It's like a cheat code for understanding how the world actually works.\n\n[CTA - 80% Mark]\nIf you're finding this valuable, hit that subscribe button. I break down complex topics like this every week.\n\n[OUTRO]\nNow you know something that gives you a real edge. The question is — what are you going to do with it?`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold mb-1">Video Script</h2>
          <p className="text-sm" style={{ color: "hsl(205 40% 55%)" }}>AI-generated script optimized for retention</p>
        </div>
        <button onClick={generateScript} disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-40">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {data.script ? "Regenerate" : "Generate Script"}
        </button>
      </div>

      <textarea
        value={data.script}
        onChange={(e) => updateData({ script: e.target.value })}
        placeholder="Click 'Generate Script' to create an AI-powered video script, or write your own..."
        className="w-full h-80 px-5 py-4 rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none font-mono leading-relaxed"
        style={{
          background: "rgba(8,13,20,0.65)",
          border: "1px solid rgba(42,72,112,0.35)",
          backdropFilter: "blur(20px)",
        }}
      />

      <div className="flex items-center gap-6 text-sm">
        <span className="flex items-center gap-2 font-mono" style={{ color: "hsl(205 40% 55%)" }}>
          <FileText className="w-4 h-4" /> {wordCount} words
        </span>
        <span className="flex items-center gap-2 font-mono" style={{ color: "hsl(205 40% 55%)" }}>
          <Clock className="w-4 h-4" /> ~{estimatedDuration} min
        </span>
        {wordCount > 0 && wordCount < 150 && (
          <span className="flex items-center gap-2 text-xs" style={{ color: "#FFB703" }}>
            <AlertTriangle className="w-3 h-3" /> Script may be too short
          </span>
        )}
      </div>
    </div>
  );
};

export default StepScript;
