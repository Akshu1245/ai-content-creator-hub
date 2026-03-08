import { useState } from "react";
import { WizardData } from "@/pages/NewProject";
import { Search, Image, Film, Loader2, Download, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props { data: WizardData; updateData: (u: Partial<WizardData>) => void; }

interface MediaItem {
  id: number;
  url: string;
  photographer: string;
  alt?: string;
  src?: { landscape?: string; medium?: string; small?: string };
  image?: string;
  duration?: number;
  videoFiles?: { link: string; quality: string; width: number }[];
}

const StepMedia = ({ data, updateData }: Props) => {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(data.topic || "");
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");

  const searchMedia = async (type: "photos" | "videos") => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('stock-media', {
        body: { query: searchQuery, type, per_page: 12, orientation: "landscape" },
      });
      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      if (type === "photos") setPhotos(result.results || []);
      else setVideos(result.results || []);
      setActiveTab(type);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedMedia(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const searchBoth = async () => {
    setLoading(true);
    try {
      const [photosRes, videosRes] = await Promise.all([
        supabase.functions.invoke('stock-media', { body: { query: searchQuery, type: "photos", per_page: 8 } }),
        supabase.functions.invoke('stock-media', { body: { query: searchQuery, type: "videos", per_page: 6 } }),
      ]);
      if (photosRes.data?.results) setPhotos(photosRes.data.results);
      if (videosRes.data?.results) setVideos(videosRes.data.results);
      toast.success(`Found ${(photosRes.data?.results?.length || 0)} photos and ${(videosRes.data?.results?.length || 0)} videos`);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-label text-primary block mb-2">B-ROLL MEDIA</span>
        <h2 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Stock Media</h2>
        <p className="text-xs text-muted-foreground">Search Pexels for free B-roll footage and images for your video</p>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchBoth()}
          placeholder="Search stock media..."
          className="flex-1 px-4 py-3 rounded-xl text-xs text-foreground placeholder:text-muted-foreground bg-secondary/30 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <button onClick={searchBoth} disabled={loading} className="btn-primary text-xs flex items-center gap-2 px-5">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          Search
        </button>
      </div>

      {/* Quick search suggestions */}
      <div className="flex flex-wrap gap-2">
        {[data.niche, data.topic, `${data.niche} background`, `${data.style} aesthetic`]
          .filter(Boolean)
          .map((term, i) => (
            <button key={i} onClick={() => { setSearchQuery(term!); }} className="text-[10px] px-3 py-1.5 rounded-lg bg-secondary/50 text-muted-foreground border border-border/50 hover:border-primary/20 transition-all">
              {term}
            </button>
          ))}
      </div>

      {/* Tabs */}
      {(photos.length > 0 || videos.length > 0) && (
        <>
          <div className="flex gap-1">
            <button onClick={() => setActiveTab("photos")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all ${activeTab === "photos" ? "bg-primary/15 text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}>
              <Image className="w-3.5 h-3.5" /> Photos ({photos.length})
            </button>
            <button onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all ${activeTab === "videos" ? "bg-primary/15 text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}>
              <Film className="w-3.5 h-3.5" /> Videos ({videos.length})
            </button>
          </div>

          {/* Selected count */}
          {selectedMedia.length > 0 && (
            <div className="surface-raised p-3 flex items-center justify-between rounded-xl">
              <span className="text-xs text-foreground">{selectedMedia.length} items selected for your video</span>
              <button onClick={() => setSelectedMedia([])} className="text-[10px] text-muted-foreground hover:text-foreground">Clear</button>
            </div>
          )}

          {/* Photo grid */}
          {activeTab === "photos" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {photos.map((p) => {
                const id = `photo-${p.id}`;
                const isSelected = selectedMedia.includes(id);
                return (
                  <div key={p.id} onClick={() => toggleSelect(id)}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? "border-primary shadow-lg shadow-primary/10" : "border-transparent hover:border-primary/20"}`}>
                    <img src={p.src?.medium || p.src?.small || ""} alt={p.alt || ""} className="w-full aspect-video object-cover" loading="lazy" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-[9px] text-white/80 truncate">{p.photographer}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-[8px] text-primary-foreground font-bold">✓</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Video grid */}
          {activeTab === "videos" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {videos.map((v) => {
                const id = `video-${v.id}`;
                const isSelected = selectedMedia.includes(id);
                return (
                  <div key={v.id} onClick={() => toggleSelect(id)}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? "border-primary shadow-lg shadow-primary/10" : "border-transparent hover:border-primary/20"}`}>
                    <img src={v.image || ""} alt="" className="w-full aspect-video object-cover" loading="lazy" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 flex justify-between items-end">
                      <p className="text-[9px] text-white/80 truncate">{v.photographer}</p>
                      {v.duration && <span className="text-[9px] text-white/80 font-mono">{v.duration}s</span>}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-[8px] text-primary-foreground font-bold">✓</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-[9px] text-muted-foreground text-center">Free stock media by Pexels · No attribution required</p>
        </>
      )}
    </div>
  );
};

export default StepMedia;
