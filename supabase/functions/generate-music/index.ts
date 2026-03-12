/**
 * Background Music Generation Edge Function
 * VORAX — AI Content Intelligence Engine
 * 
 * Searches and returns royalty-free background music using Pixabay API
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const PIXABAY_API_URL = 'https://pixabay.com/api/';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data, error: authError } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (authError || !data?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { action, query, genre, mood, page = 1 } = await req.json();

    // Return available music tracks (predefined library)
    if (action === 'list') {
      const tracks = getMusicLibrary(genre, mood);
      return new Response(JSON.stringify({ 
        tracks,
        total: tracks.length 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Search music from Pixabay
    if (action === 'search') {
      const PIXABAY_KEY = Deno.env.get('PIXABAY_API_KEY');
      
      if (!PIXABAY_KEY) {
        // Return local library if no API key
        const tracks = getMusicLibrary(genre, mood);
        return new Response(JSON.stringify({ 
          tracks,
          source: 'library',
          message: 'Using built-in music library'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const searchQuery = query || 'background music cinematic';
      const url = `${PIXABAY_API_URL}?key=${PIXABAY_KEY}&q=${encodeURIComponent(searchQuery)}&category=music&per_page=20&page=${page}`;
      
      const response = await fetch(url);
      const data = await response.json();

      const tracks = (data.hits || []).map((hit: any) => ({
        id: `pixabay-${hit.id}`,
        name: hit.tags?.split(',')[0] || 'Untitled',
        genre: mapGenre(genre),
        mood: mood || 'neutral',
        duration_seconds: hit.duration || 180,
        url: hit.audio,
        preview_url: hit.audio,
        thumbnail: hit.largeImageURL,
        source: 'pixabay',
      }));

      return new Response(JSON.stringify({ 
        tracks,
        total: data.totalHits || 0,
        page,
        source: 'pixabay'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get recommendations based on video style
    if (action === 'recommendations') {
      const recommendations = getRecommendationsForStyle(query);
      return new Response(JSON.stringify({ 
        tracks: recommendations,
        based_on: query 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    
  } catch (error) {
    console.error('Music generation error:', error);
    return new Response(JSON.stringify({ error: "Request failed, please try again" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Built-in music library (royalty-free)
function getMusicLibrary(genre?: string, mood?: string) {
  const tracks = [
    {
      id: "cinematic-1",
      name: "Epic Journey",
      genre: "Cinematic",
      mood: "Inspirational",
      duration_seconds: 180,
      url: "https://cdn.pixabay.com/audio/2022/03/10/audio_c518b5d4f2.mp3",
      preview_url: "https://cdn.pixabay.com/audio/2022/03/10/audio_c518b5d4f2.mp3",
    },
    {
      id: "upbeat-1",
      name: "Energy Boost",
      genre: "Electronic",
      mood: "Upbeat",
      duration_seconds: 120,
      url: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1a94.mp3",
      preview_url: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1a94.mp3",
    },
    {
      id: "calm-1",
      name: "Peaceful Mind",
      genre: "Ambient",
      mood: "Calm",
      duration_seconds: 240,
      url: "https://cdn.pixabay.com/audio/2022/02/07/audio_2dde668d05.mp3",
      preview_url: "https://cdn.pixabay.com/audio/2022/02/07/audio_2dde668d05.mp3",
    },
    {
      id: "corporate-1",
      name: "Business Success",
      genre: "Corporate",
      mood: "Professional",
      duration_seconds: 150,
      url: "https://cdn.pixabay.com/audio/2021/11/04/audio_5c3e91e1ac.mp3",
      preview_url: "https://cdn.pixabay.com/audio/2021/11/04/audio_5c3e91e1ac.mp3",
    },
    {
      id: "uplifting-1",
      name: "Rise Up",
      genre: "Pop",
      mood: "Motivational",
      duration_seconds: 135,
      url: "https://cdn.pixabay.com/audio/2022/10/25/audio_946bc3eb81.mp3",
      preview_url: "https://cdn.pixabay.com/audio/2022/10/25/audio_946bc3eb81.mp3",
    },
    {
      id: "lofi-1",
      name: "Focus Flow",
      genre: "Lo-Fi",
      mood: "Relaxed",
      duration_seconds: 180,
      url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
      preview_url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
    },
    {
      id: "nature-1",
      name: "Nature Sounds",
      genre: "Ambient",
      mood: "Natural",
      duration_seconds: 300,
      url: "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3",
      preview_url: "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3",
    },
    {
      id: "tech-1",
      name: "Future Tech",
      genre: "Electronic",
      mood: "Modern",
      duration_seconds: 160,
      url: "https://cdn.pixabay.com/audio/2021/10/13/audio_dc39bcc8d0.mp3",
      preview_url: "https://cdn.pixabay.com/audio/2021/10/13/audio_dc39bcc8d0.mp3",
    },
    {
      id: "dramatic-1",
      name: "Dramatic Tension",
      genre: "Cinematic",
      mood: "Dramatic",
      duration_seconds: 200,
      url: "https://cdn.pixabay.com/audio/2022/03/15/audio_4a6ee2c08c.mp3",
      preview_url: "https://cdn.pixabay.com/audio/2022/03/15/audio_4a6ee2c08c.mp3",
    },
    {
      id: "happy-1",
      name: "Happy Days",
      genre: "Pop",
      mood: "Happy",
      duration_seconds: 125,
      url: "https://cdn.pixabay.com/audio/2022/01/26/audio_d0c6ff1a94.mp3",
      preview_url: "https://cdn.pixabay.com/audio/2022/01/26/audio_d0c6ff1a94.mp3",
    },
    {
      id: "sad-1",
      name: "Emotional Reflection",
      genre: "Ambient",
      mood: "Sad",
      duration_seconds: 190,
      url: "https://cdn.pixabay.com/audio/2022/04/27/audio_f6d8874f32.mp3",
      preview_url: "https://cdn.pixabay.com/audio/2022/04/27/audio_f6d8874f32.mp3",
    },
    {
      id: "energetic-1",
      name: "Power Drive",
      genre: "Electronic",
      mood: "Energetic",
      duration_seconds: 140,
      url: "https://cdn.pixabay.com/audio/2022/11/22/audio_f6d8874f32.mp3",
      preview_url: "https://cdn.pixabay.com/audio/2022/11/22/audio_f6d8874f32.mp3",
    },
  ];

  let filtered = [...tracks];
  
  if (genre) {
    filtered = filtered.filter(t => t.genre.toLowerCase() === genre.toLowerCase());
  }
  
  if (mood) {
    filtered = filtered.filter(t => t.mood.toLowerCase() === mood.toLowerCase());
  }
  
  return filtered;
}

function getRecommendationsForStyle(style: string) {
  const styleMusicMap: Record<string, string[]> = {
    cinematic: ["cinematic-1", "dramatic-1", "epic-1"],
    vlog: ["upbeat-1", "uplifting-1", "lofi-1"],
    tutorial: ["corporate-1", "calm-1", "tech-1"],
    motivational: ["uplifting-1", "energetic-1", "cinematic-1"],
    documentary: ["cinematic-1", "nature-1", "calm-1"],
    tech: ["tech-1", "corporate-1", "electronic-1"],
    gaming: ["upbeat-1", "energetic-1", "dramatic-1"],
    default: ["cinematic-1", "uplifting-1", "calm-1"],
  };

  const recommendedIds = styleMusicMap[style.toLowerCase()] || styleMusicMap.default;
  const allTracks = getMusicLibrary();
  
  return allTracks.filter(t => recommendedIds.includes(t.id));
}

function mapGenre(genre?: string): string {
  const map: Record<string, string> = {
    'electronic': 'Electronic',
    'pop': 'Pop',
    'rock': 'Rock',
    'classical': 'Classical',
    'jazz': 'Jazz',
    'ambient': 'Ambient',
    'cinematic': 'Cinematic',
  };
  return map[genre?.toLowerCase() || ''] || 'Ambient';
}
