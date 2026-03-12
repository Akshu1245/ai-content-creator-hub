import { useState, useEffect, useCallback } from "react";
import { WizardData } from "@/pages/NewProject";
import { Music, Play, Pause, Volume2, Loader2, Search, Sparkles } from "lucide-react";
import { getAvailableMusic, getRecommendationsForStyle, getGenres, getMoods, type MusicTrack } from "@/lib/music";
import { toast } from "sonner";

interface Props {
  data: WizardData;
  updateData: (u: Partial<WizardData>) => void;
}

const StepMusic = ({ data, updateData }: Props) => {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(data.musicTrack || null);
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [volume, setVolume] = useState(data.musicVolume || 30);
  const [loading, setLoading] = useState(true);

  const loadTracks = useCallback(async () => {
    setLoading(true);
    try {
      let musicTracks;
      if (data.style) {
        musicTracks = await getRecommendationsForStyle(data.style);
      } else {
        musicTracks = await getAvailableMusic();
      }
      
      // Apply filters
      if (genre || mood) {
        musicTracks = musicTracks.filter((t: MusicTrack) => {
          if (genre && t.genre.toLowerCase() !== genre.toLowerCase()) return false;
          if (mood && t.mood.toLowerCase() !== mood.toLowerCase()) return false;
          return true;
        });
      }
      
      setTracks(musicTracks);
    } catch (error) {
      console.error("Failed to load music:", error);
      toast.error("Failed to load music tracks");
    } finally {
      setLoading(false);
    }
  }, [genre, mood, data.style]);

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  const handleSelectTrack = (track: MusicTrack) => {
    setSelectedTrack(track.id);
    updateData({ musicTrack: track.id });
    toast.success(`Selected: ${track.name}`);
  };

  const togglePlay = (trackId: string) => {
    setPlayingId(playingId === trackId ? null : trackId);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    updateData({ musicVolume: newVolume });
  };

  const genres = getGenres();
  const moods = getMoods();

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-label text-primary block mb-2">STEP 4 OF 8</span>
          <h2 className="text-xl font-display text-foreground font-bold tracking-tight mb-1">Background Music</h2>
          <p className="text-xs text-muted-foreground">Add royalty-free music to enhance your video</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">All Moods</option>
          {moods.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Volume Control */}
      <div className="surface-raised p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span className="text-xs font-mono text-muted-foreground w-10">{volume}%</span>
        </div>
      </div>

      {/* Track List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : tracks.length === 0 ? (
        <div className="text-center py-12">
          <Music className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-xs text-muted-foreground">No music tracks match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
          {tracks.map((track) => (
            <div
              key={track.id}
              onClick={() => handleSelectTrack(track)}
              className={`surface-raised p-4 rounded-xl cursor-pointer transition-all surface-hover ${
                selectedTrack === track.id ? "ring-2 ring-primary border-primary/30" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay(track.id);
                  }}
                  className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
                >
                  {playingId === track.id ? (
                    <Pause className="w-4 h-4 text-primary" />
                  ) : (
                    <Play className="w-4 h-4 text-primary ml-0.5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground truncate">{track.name}</span>
                    {selectedTrack === track.id && (
                      <Sparkles className="w-3 h-3 text-primary shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">{track.genre}</span>
                    <span className="text-[10px] text-border">•</span>
                    <span className="text-[10px] text-muted-foreground">{track.mood}</span>
                    <span className="text-[10px] text-border">•</span>
                    <span className="text-[10px] text-muted-foreground">{Math.floor(track.duration_seconds / 60)}:{(track.duration_seconds % 60).toString().padStart(2, "0")}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Music Option */}
      <div className="flex items-center gap-3 pt-2">
        <input
          type="radio"
          id="no-music"
          checked={selectedTrack === null || selectedTrack === ""}
          onChange={() => {
            setSelectedTrack(null);
            updateData({ musicTrack: null });
          }}
          className="w-4 h-4 accent-primary"
        />
        <label htmlFor="no-music" className="text-xs text-muted-foreground cursor-pointer">
          No background music (voiceover only)
        </label>
      </div>
    </div>
  );
};

export default StepMusic;
