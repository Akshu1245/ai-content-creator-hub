/**
 * Background Music Service
 * VORAX — AI Content Intelligence Engine
 * 
 * Provides background music and audio effects for generated videos.
 */

export interface MusicTrack {
  id: string;
  name: string;
  genre: string;
  mood: string;
  duration_seconds: number;
  url: string;
  preview_url: string;
}

// Public domain / royalty-free music sources
const MUSIC_SOURCES = {
  pexels: "https://www.pexels.com/video/",
  pixabay: "https://pixabay.com/music/",
};

// Default tracks using free sources
const DEFAULT_TRACKS: MusicTrack[] = [
  {
    id: "cinematic-1",
    name: "Epic Journey",
    genre: "Cinematic",
    mood: "Inspirational",
    duration_seconds: 180,
    url: "/media/audio/cinematic-1.mp3",
    preview_url: "/media/audio/cinematic-1.mp3",
  },
  {
    id: "upbeat-1",
    name: "Energy Boost",
    genre: "Electronic",
    mood: "Upbeat",
    duration_seconds: 120,
    url: "/media/audio/upbeat-1.mp3",
    preview_url: "/media/audio/upbeat-1.mp3",
  },
  {
    id: "calm-1",
    name: "Peaceful Mind",
    genre: "Ambient",
    mood: "Calm",
    duration_seconds: 240,
    url: "/media/audio/calm-1.mp3",
    preview_url: "/media/audio/calm-1.mp3",
  },
  {
    id: "corporate-1",
    name: "Business Success",
    genre: "Corporate",
    mood: "Professional",
    duration_seconds: 150,
    url: "/media/audio/corporate-1.mp3",
    preview_url: "/media/audio/corporate-1.mp3",
  },
  {
    id: "uplifting-1",
    name: "Rise Up",
    genre: "Pop",
    mood: "Motivational",
    duration_seconds: 135,
    url: "/media/audio/uplifting-1.mp3",
    preview_url: "/media/audio/uplifting-1.mp3",
  },
  {
    id: "lofi-1",
    name: "Focus Flow",
    genre: "Lo-Fi",
    mood: "Relaxed",
    duration_seconds: 180,
    url: "/media/audio/lofi-1.mp3",
    preview_url: "/media/audio/lofi-1.mp3",
  },
  {
    id: "nature-1",
    name: "Nature Sounds",
    genre: "Ambient",
    mood: "Natural",
    duration_seconds: 300,
    url: "/media/audio/nature-1.mp3",
    preview_url: "/media/audio/nature-1.mp3",
  },
  {
    id: "tech-1",
    name: "Future Tech",
    genre: "Electronic",
    mood: "Modern",
    duration_seconds: 160,
    url: "/media/audio/tech-1.mp3",
    preview_url: "/media/audio/tech-1.mp3",
  },
];

export interface MusicSearchParams {
  genre?: string;
  mood?: string;
  duration_max?: number;
}

export interface MusicGenerationResult {
  track_id: string;
  url: string;
  duration_seconds: number;
  trimmed_url: string;
}

/**
 * Get all available background music tracks
 */
export async function getAvailableMusic(): Promise<MusicTrack[]> {
  return DEFAULT_TRACKS;
}

/**
 * Search for music tracks by criteria
 */
export async function searchMusic(params: MusicSearchParams): Promise<MusicTrack[]> {
  let tracks = [...DEFAULT_TRACKS];
  
  if (params.genre) {
    tracks = tracks.filter(
      (t) => t.genre.toLowerCase() === params.genre!.toLowerCase()
    );
  }
  
  if (params.mood) {
    tracks = tracks.filter(
      (t) => t.mood.toLowerCase() === params.mood!.toLowerCase()
    );
  }
  
  if (params.duration_max) {
    tracks = tracks.filter((t) => t.duration_seconds <= params.duration_max!);
  }
  
  return tracks;
}

/**
 * Get track by ID
 */
export async function getTrackById(id: string): Promise<MusicTrack | null> {
  return DEFAULT_TRACKS.find((t) => t.id === id) || null;
}

/**
 * Get music recommendations based on video style
 */
export async function getRecommendationsForStyle(
  style: string
): Promise<MusicTrack[]> {
  const styleMusicMap: Record<string, string[]> = {
    cinematic: ["cinematic-1", "epic-1", "dramatic-1"],
    vlog: ["upbeat-1", "uplifting-1", "lofi-1"],
    tutorial: ["corporate-1", "calm-1", "tech-1"],
    motivational: ["uplifting-1", "epic-1", "corporate-1"],
    documentary: ["cinematic-1", "nature-1", "calm-1"],
    tech: ["tech-1", "corporate-1", "electronic-1"],
    gaming: ["upbeat-1", "electronic-1", "epic-1"],
    default: ["cinematic-1", "uplifting-1", "calm-1"],
  };

  const recommendedIds = styleMusicMap[style.toLowerCase()] || styleMusicMap.default;
  
  return DEFAULT_TRACKS.filter((t) => recommendedIds.includes(t.id));
}

/**
 * Get all unique genres
 */
export function getGenres(): string[] {
  const genres = new Set(DEFAULT_TRACKS.map((t) => t.genre));
  return Array.from(genres);
}

/**
 * Get all unique moods
 */
export function getMoods(): string[] {
  const moods = new Set(DEFAULT_TRACKS.map((t) => t.mood));
  return Array.from(moods);
}

/**
 * Generate background music using AI (placeholder for future implementation)
 * This would integrate with services like:
 * - AIVA (https://aiva.ai)
 * - Soundraw (https://soundraw.io)
 * - Boomy (https://boomy.com)
 */
export async function generateMusicAI(
  prompt: string,
  duration_seconds: number
): Promise<MusicGenerationResult> {
  // Placeholder - would integrate with AI music generation service
  console.log("AI music generation requested:", { prompt, duration_seconds });
  
  return {
    track_id: "ai-generated",
    url: "",
    duration_seconds,
    trimmed_url: "",
  };
}
