import { useState } from "react";
import { Upload, ExternalLink, Check, AlertCircle, Youtube, Copy, Download } from "lucide-react";
import { toast } from "sonner";

interface Props {
  videoUrl: string;
  title?: string;
  description?: string;
  tags?: string[];
}

const YouTubeUploader = ({ videoUrl, title = "", description = "", tags = [] }: Props) => {
  const [uploadMethod, setUploadMethod] = useState<"manual" | "link">("manual");
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyBtn = ({ text, label }: { text: string; label: string }) => (
    <button
      onClick={() => copyToClipboard(text, label)}
      className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
    >
      {copied === label ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
      {copied === label ? "Copied" : "Copy"}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
          <Youtube className="w-4 h-4 text-destructive" />
        </div>
        <div>
          <h3 className="text-xs font-display text-foreground font-bold">Publish to YouTube</h3>
          <p className="text-[10px] text-muted-foreground">Upload your video to YouTube</p>
        </div>
      </div>

      {/* Method tabs */}
      <div className="flex gap-1 p-1 bg-secondary/30 rounded-lg">
        {(["manual", "link"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setUploadMethod(m)}
            className={`flex-1 py-2 rounded-md text-[10px] transition-all ${
              uploadMethod === m ? "bg-card text-foreground font-bold shadow-sm" : "text-muted-foreground"
            }`}
          >
            {m === "manual" ? "Copy & Upload" : "Direct Link"}
          </button>
        ))}
      </div>

      {uploadMethod === "manual" ? (
        <div className="space-y-3">
          <div className="surface-raised p-3 rounded-xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-label text-muted-foreground">TITLE</span>
              <CopyBtn text={title} label="Title" />
            </div>
            <p className="text-xs text-foreground">{title || "—"}</p>
          </div>

          <div className="surface-raised p-3 rounded-xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-label text-muted-foreground">DESCRIPTION</span>
              <CopyBtn text={description} label="Description" />
            </div>
            <p className="text-[10px] text-muted-foreground whitespace-pre-wrap max-h-24 overflow-y-auto">{description || "—"}</p>
          </div>

          {tags.length > 0 && (
            <div className="surface-raised p-3 rounded-xl">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-label text-muted-foreground">TAGS</span>
                <CopyBtn text={tags.join(", ")} label="Tags" />
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.map((t, i) => (
                  <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-secondary/50 text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <a
              href={videoUrl}
              download
              className="btn-primary text-[10px] flex items-center gap-1.5 flex-1 justify-center"
            >
              <Download className="w-3 h-3" /> Download Video
            </a>
            <a
              href="https://studio.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-[10px] flex items-center gap-1.5 flex-1 justify-center"
            >
              <ExternalLink className="w-3 h-3" /> Open YouTube Studio
            </a>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/5 border border-accent/10">
            <AlertCircle className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Download the video, then upload at <strong>studio.youtube.com</strong>. 
              Copy the title, description, and tags above to paste into YouTube Studio.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="surface-raised p-3 rounded-xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-label text-muted-foreground">VIDEO LINK</span>
              <CopyBtn text={videoUrl} label="Video URL" />
            </div>
            <p className="text-[10px] text-muted-foreground break-all">{videoUrl}</p>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <AlertCircle className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              <strong>Direct YouTube API upload</strong> requires OAuth setup. 
              For now, download the video and upload manually via YouTube Studio for full control over monetization settings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeUploader;
