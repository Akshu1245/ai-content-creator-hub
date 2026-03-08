import { useState } from "react";
import { WizardData } from "@/pages/NewProject";
import { Loader2, Copy, Check, Hash, FileText, Instagram, Youtube, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props { data: WizardData; updateData: (u: Partial<WizardData>) => void; }

interface CaptionData {
  youtube?: { title: string; description: string; tags: string[]; hashtags: string[] };
  instagram?: { caption: string; hashtags: string[]; altText: string };
  tiktok?: { caption: string; hashtags: string[] };
  shorts?: { title: string; description: string; hashtags: string[] };
  raw?: string;
}

const StepCaptions = ({ data, updateData }: Props) => {
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState<CaptionData | null>(null);
  const [activePlatform, setActivePlatform] = useState("youtube");
  const [copied, setCopied] = useState<string | null>(null);

  const generateCaptions = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-captions', {
        body: { script: data.script, topic: data.topic, niche: data.niche, platforms: data.platforms },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);
      setCaptions(result.captions);
      toast.success('Captions generated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Caption generation failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyButton = ({ text, label }: { text: string; label: string }) => (
    <button onClick={() => copyToClipboard(text, label)} className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
      {copied === label ? <Check className="w-3 h-3 text-emerald" /> : <Copy className="w-3 h-3" />}
      {copied === label ? "Copied" : "Copy"}
    </button>
  );

  const platforms = [
    { id: "youtube", name: "YouTube", icon: Youtube },
    { id: "instagram", name: "Instagram", icon: Instagram },
    { id: "tiktok", name: "TikTok", icon: Hash },
    { id: "shorts", name: "Shorts", icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-label text-primary block mb-2">CAPTIONS & SEO</span>
        <h2 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Auto-Generated Captions</h2>
        <p className="text-xs text-muted-foreground">AI-optimized titles, descriptions, hashtags for each platform</p>
      </div>

      {!captions && (
        <div className="surface-raised p-10 text-center">
          <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-xs text-foreground font-medium mb-1">Generate platform-specific captions</p>
          <p className="text-[10px] text-muted-foreground mb-4">Uses Gemini AI with trending format analysis</p>
          <button onClick={generateCaptions} disabled={loading || !data.script} className="btn-primary text-xs flex items-center gap-2 mx-auto">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            Generate Captions
          </button>
        </div>
      )}

      {captions && (
        <>
          {/* Platform tabs */}
          <div className="flex gap-1">
            {platforms.map((p) => (
              <button key={p.id} onClick={() => setActivePlatform(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all ${
                  activePlatform === p.id ? "bg-primary/15 text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                }`}>
                <p.icon className="w-3.5 h-3.5" /> {p.name}
              </button>
            ))}
          </div>

          {/* YouTube */}
          {activePlatform === "youtube" && captions.youtube && (
            <div className="space-y-4">
              <div className="surface-raised p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-label text-muted-foreground">TITLE</span>
                  <CopyButton text={captions.youtube.title} label="YouTube Title" />
                </div>
                <p className="text-sm text-foreground font-display font-bold">{captions.youtube.title}</p>
              </div>
              <div className="surface-raised p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-label text-muted-foreground">DESCRIPTION</span>
                  <CopyButton text={captions.youtube.description} label="YouTube Description" />
                </div>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">{captions.youtube.description}</p>
              </div>
              <div className="surface-raised p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-label text-muted-foreground">TAGS</span>
                  <CopyButton text={captions.youtube.tags.join(", ")} label="YouTube Tags" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {captions.youtube.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] px-2.5 py-1 rounded-lg bg-secondary/50 text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Instagram */}
          {activePlatform === "instagram" && captions.instagram && (
            <div className="space-y-4">
              <div className="surface-raised p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-label text-muted-foreground">CAPTION</span>
                  <CopyButton text={`${captions.instagram.caption}\n\n${captions.instagram.hashtags.join(" ")}`} label="Instagram Caption" />
                </div>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">{captions.instagram.caption}</p>
              </div>
              <div className="surface-raised p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-label text-muted-foreground">HASHTAGS</span>
                  <CopyButton text={captions.instagram.hashtags.join(" ")} label="Instagram Hashtags" />
                </div>
                <p className="text-xs text-primary/80">{captions.instagram.hashtags.join(" ")}</p>
              </div>
            </div>
          )}

          {/* TikTok */}
          {activePlatform === "tiktok" && captions.tiktok && (
            <div className="space-y-4">
              <div className="surface-raised p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-label text-muted-foreground">CAPTION</span>
                  <CopyButton text={`${captions.tiktok.caption} ${captions.tiktok.hashtags.join(" ")}`} label="TikTok Caption" />
                </div>
                <p className="text-sm text-foreground font-medium">{captions.tiktok.caption}</p>
                <p className="text-xs text-primary/80 mt-2">{captions.tiktok.hashtags.join(" ")}</p>
              </div>
            </div>
          )}

          {/* Shorts */}
          {activePlatform === "shorts" && captions.shorts && (
            <div className="space-y-4">
              <div className="surface-raised p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-label text-muted-foreground">TITLE</span>
                  <CopyButton text={captions.shorts.title} label="Shorts Title" />
                </div>
                <p className="text-sm text-foreground font-display font-bold">{captions.shorts.title}</p>
              </div>
              <div className="surface-raised p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-label text-muted-foreground">DESCRIPTION</span>
                  <CopyButton text={captions.shorts.description} label="Shorts Description" />
                </div>
                <p className="text-xs text-muted-foreground">{captions.shorts.description}</p>
                <p className="text-xs text-primary/80 mt-2">{captions.shorts.hashtags.join(" ")}</p>
              </div>
            </div>
          )}

          {/* Raw fallback */}
          {captions.raw && !captions.youtube && (
            <div className="surface-raised p-4">
              <p className="text-xs text-muted-foreground whitespace-pre-wrap">{captions.raw}</p>
            </div>
          )}

          <button onClick={generateCaptions} disabled={loading} className="btn-ghost text-[10px] flex items-center gap-2">
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
            Regenerate Captions
          </button>
        </>
      )}
    </div>
  );
};

export default StepCaptions;
