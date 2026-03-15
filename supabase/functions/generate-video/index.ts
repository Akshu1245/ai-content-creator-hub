import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const JSON2VIDEO_API_BASE = 'https://api.json2video.com/v2';
const KIE_BASE_URL = 'https://api.kie.ai/api/v1';

type Engine = 'kieai' | 'json2video' | 'pexels' | 'replicate' | 'runpod';

const MODELS = {
  "veo3_fast": {
    endpoint: "/veo/generate",
    supportsAudio: true,
  },
  "veo3_quality": {
    endpoint: "/veo/generate",
    supportsAudio: true,
  },
  "runway-duration-5-generate": {
    endpoint: "/runway/generate",
    supportsAudio: false,
  },
  "runway-duration-10-generate": {
    endpoint: "/runway/generate",
    supportsAudio: false,
  },
  "wan2.6-t2v-plus": {
    endpoint: "/wan/generate",
    supportsAudio: true,
  },
} as const;

function sanitizeText(value: unknown, max = 1800): string {
  return String(value ?? "")
    .replace(/[\u0000-\u001f]/g, "")
    .trim()
    .slice(0, max);
}

function autoSelectModel(
  prompt: string,
  niche = "",
  style = "educational",
  qualityPreference = "balanced",
  language = "en",
) {
  const promptLower = `${prompt} ${niche} ${style}`.toLowerCase();

  const indianLanguages = ["hi", "kn", "ta", "te", "bn", "mr"];
  const langCode = String(language).split("-")[0].toLowerCase();
  if (indianLanguages.includes(langCode)) {
    return {
      model: "wan2.6-t2v-plus",
      reason: "Best model for Indian language content",
      endpoint: MODELS["wan2.6-t2v-plus"].endpoint,
      supports_audio: true,
    };
  }

  const creativeKeywords = [
    "fashion", "music", "art", "creative", "gaming",
    "animation", "entertainment", "comedy", "meme",
    "vfx", "cinematic effects", "abstract", "dance",
  ];
  if (creativeKeywords.some((kw) => promptLower.includes(kw))) {
    return {
      model: "runway-duration-5-generate",
      reason: "Runway excels at creative/artistic content",
      endpoint: MODELS["runway-duration-5-generate"].endpoint,
      supports_audio: false,
    };
  }

  const storyKeywords = [
    "story", "vlog", "journey", "day in life",
    "cooking", "recipe", "tutorial", "how to",
    "step by step", "process", "multi", "scene",
  ];
  if (storyKeywords.some((kw) => promptLower.includes(kw))) {
    return {
      model: "wan2.6-t2v-plus",
      reason: "Wan 2.6 best for multi-shot storytelling",
      endpoint: MODELS["wan2.6-t2v-plus"].endpoint,
      supports_audio: true,
    };
  }

  const premiumKeywords = [
    "premium", "ultra", "cinematic", "professional",
    "advertisement", "brand", "commercial", "film",
  ];
  if (qualityPreference === "premium" || premiumKeywords.some((kw) => promptLower.includes(kw))) {
    return {
      model: "veo3_quality",
      reason: "Veo 3 Quality for premium cinematic output",
      endpoint: MODELS["veo3_quality"].endpoint,
      supports_audio: true,
    };
  }

  return {
    model: "veo3_fast",
    reason: "Veo 3 Fast — best balance of quality/speed/cost",
    endpoint: MODELS["veo3_fast"].endpoint,
    supports_audio: true,
  };
}

function enhancePromptForVideo(script: string, niche: string, style: string, model: string): string[] {
  const sentences = String(script)
    .split(".")
    .map((s) => s.trim())
    .filter((s) => s.length > 20)
    .slice(0, 5);

  const styleModifiers: Record<string, string> = {
    educational: "clean professional setting, whiteboard or office background, bright lighting, 4K quality",
    entertainment: "dynamic lighting, vibrant colors, energetic atmosphere, cinematic quality",
    documentary: "realistic environment, natural lighting, documentary style, professional cinematography",
    motivational: "inspiring backdrop, golden hour lighting, cinematic wideshot",
    news: "professional news studio, clean background, sharp focus",
    finance: "modern office, charts and graphs visible, professional corporate setting",
    horror: "dark atmospheric lighting, eerie environment, fog effects",
    comedy: "bright cheerful setting, colorful background, fun atmosphere",
  };

  const modelSuffix: Record<string, string> = {
    veo3_fast: "smooth camera movement, photorealistic, no text overlays",
    veo3_quality: "ultra HD, cinematic depth of field, professional grade, film quality",
    "runway-duration-5-generate": "artistic style, creative motion, stylized visuals",
    "runway-duration-10-generate": "artistic style, creative motion, stylized visuals",
    "wan2.6-t2v-plus": "multi-shot sequence, smooth transitions, narrative flow",
  };

  const modifier = styleModifiers[style] ?? "professional setting, high quality, 4K";
  const suffix = modelSuffix[model] ?? "high quality, professional";

  const prompts = sentences.map((sentence) =>
    sanitizeText(
      `A video about: ${sentence}. Niche: ${niche}. Visual style: ${modifier}. ${suffix}. No text, no subtitles, no watermarks.`,
      1800,
    ),
  );

  if (prompts.length === 0) {
    return [sanitizeText(`${niche} topic video. ${modifier}. ${suffix}. Cinematic quality.`, 1800)];
  }

  return prompts;
}

function encodeKieBatch(payload: Record<string, unknown>): string {
  const raw = JSON.stringify(payload);
  return `kie:${btoa(raw)}`;
}

function decodeKieBatch(taskId: string): Record<string, unknown> | null {
  if (!taskId?.startsWith("kie:")) return null;
  try {
    return JSON.parse(atob(taskId.slice(4)));
  } catch {
    return null;
  }
}

async function startKieTask(
  kieApiKey: string,
  prompt: string,
  model: string,
  aspectRatio = "16:9",
  duration = 5,
): Promise<string> {
  const cfg = (MODELS as Record<string, { endpoint: string }>)[model] ?? MODELS.veo3_fast;
  const headers = {
    Authorization: `Bearer ${kieApiKey}`,
    "Content-Type": "application/json",
  };

  let body: Record<string, unknown>;
  if (model.includes("veo")) {
    body = {
      prompt,
      model,
      aspect_ratio: aspectRatio,
      watermark: "",
      enableTranslation: true,
    };
  } else if (model.includes("runway")) {
    body = {
      prompt,
      model,
      waterMark: "",
      duration: Math.min(duration, 10),
      quality: "720p",
    };
  } else {
    body = {
      prompt,
      model,
      aspect_ratio: aspectRatio,
      multi_shots: true,
    };
  }

  const response = await fetch(`${KIE_BASE_URL}${cfg.endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Kie.ai task start failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const taskId = data?.data?.taskId || data?.taskId || data?.data?.task_id;
  if (!taskId) throw new Error("Kie.ai did not return task ID");
  return taskId;
}

async function pollKieTaskOnce(kieApiKey: string, taskId: string, model: string) {
  const headers = { Authorization: `Bearer ${kieApiKey}` };
  const pollUrl = model.includes("veo")
    ? `${KIE_BASE_URL}/veo/task/${taskId}`
    : model.includes("runway")
    ? `${KIE_BASE_URL}/runway/task/${taskId}`
    : `${KIE_BASE_URL}/wan/task/${taskId}`;

  const response = await fetch(pollUrl, { method: "GET", headers });
  if (!response.ok) {
    return { success: false, status: "processing", error: `Poll failed (${response.status})`, video_url: null };
  }

  const data = await response.json();
  const t = data?.data ?? {};
  const status = String(t?.status || t?.state || "processing").toLowerCase();

  if (["completed", "success", "done"].includes(status)) {
    const videoUrl = t?.videoUrl || t?.video_url || t?.url || t?.output?.url || null;
    return { success: true, status: "completed", error: null, video_url: videoUrl };
  }

  if (["failed", "error"].includes(status)) {
    return { success: false, status: "failed", error: t?.errorMessage || "Generation failed", video_url: null };
  }

  return { success: false, status: "processing", error: null, video_url: null };
}

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

    const JSON2VIDEO_API_KEY = Deno.env.get('JSON2VIDEO_API_KEY');
    const KIE_AI_API_KEY = Deno.env.get('KIE_AI_API_KEY');

    const {
      action,
      prompt,
      task_id,
      duration,
      aspect_ratio,
      media_urls,
      model,
      script,
      niche,
      style,
      language,
      quality,
      platform,
      engine,
      engine_config,
    } = await req.json();

    const requestedEngine: Engine = String(engine || engine_config?.engine || 'kieai').toLowerCase() as Engine;
    const useKie = requestedEngine === 'kieai' && !!KIE_AI_API_KEY;

    const apiHeaders = {
      'x-api-key': JSON2VIDEO_API_KEY,
      'Content-Type': 'application/json',
    };

    if (action === 'create') {
      const safePrompt = sanitizeText(prompt, 500);
      if (!safePrompt) {
        return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (useKie) {
        const modelSelection = autoSelectModel(
          sanitizeText(script || safePrompt, 1800),
          sanitizeText(niche || "", 120),
          sanitizeText(style || "educational", 80),
          sanitizeText(quality || "balanced", 20),
          sanitizeText(language || "en-IN", 20),
        );

        const selectedModel = modelSelection.model;
        const aspect = aspect_ratio || ((platform === 'shorts' || platform === 'tiktok' || platform === 'reels') ? '9:16' : '16:9');
        const prompts = enhancePromptForVideo(
          sanitizeText(script || safePrompt, 1800),
          sanitizeText(niche || "general", 120),
          sanitizeText(style || "educational", 80),
          selectedModel,
        ).slice(0, 3);

        const startResults = await Promise.allSettled(
          prompts.map((p) => startKieTask(KIE_AI_API_KEY!, p, selectedModel, aspect, 5)),
        );

        const taskIds = startResults
          .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
          .map((r) => r.value);

        if (taskIds.length === 0) {
          return new Response(JSON.stringify({ error: "Kie.ai failed to create tasks" }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const batchTaskId = encodeKieBatch({
          model: selectedModel,
          reason: modelSelection.reason,
          task_ids: taskIds,
          prompts,
          engine: 'kieai',
        });

        return new Response(JSON.stringify({
          task_id: batchTaskId,
          status: 'submitted',
          engine: 'kieai',
          model_selected: selectedModel,
          model_reason: modelSelection.reason,
          successful_clips: 0,
          total_clips: taskIds.length,
          video_clips: taskIds.map((id, idx) => ({ index: idx, success: false, task_id: id, video_url: null, status: 'processing' })),
          prompts_used: prompts,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!JSON2VIDEO_API_KEY) {
        throw new Error('No video engine API key configured');
      }

      const sceneDuration = duration ? Math.min(Math.max(Number(duration), 1), 60) : 5;
      const urls: string[] = (media_urls || []).slice(0, 20);

      let scenes;
      if (urls.length > 0) {
        const perSceneDuration = Math.max(3, Math.round(sceneDuration * 3 / urls.length));
        scenes = urls.map((url: string, i: number) => {
          const isVideo = url.includes('.mp4') || url.includes('/video/') || url.includes('videos.pexels');
          return {
            duration: perSceneDuration,
            elements: [
              { type: isVideo ? "video" : "image", src: url, duration: perSceneDuration },
              ...(i === 0 ? [{ type: "text", text: safePrompt.slice(0, 120), style: "001", duration: Math.min(3, perSceneDuration) }] : []),
            ],
          };
        });
      } else {
        scenes = [{ duration: sceneDuration, elements: [{ type: "text", text: safePrompt, style: "001", duration: sceneDuration }] }];
      }

      const movieJson = { resolution: "full-hd", scenes };

      const response = await fetch(`${JSON2VIDEO_API_BASE}/movies`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(movieJson),
      });

      if (!response.ok) {
        console.error("JSON2Video create error:", response.status, await response.text());
        throw new Error("Video creation failed");
      }

      const vData = await response.json();
      return new Response(JSON.stringify({ task_id: vData.project, status: 'submitted' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'query') {
      const rawTaskId = sanitizeText(task_id, 5000);
      const kieBatch = decodeKieBatch(rawTaskId);

      if (kieBatch && KIE_AI_API_KEY) {
        const selectedModel = String(kieBatch.model || model || 'veo3_fast');
        const reason = String(kieBatch.reason || 'Auto-selected model');
        const taskIds = Array.isArray(kieBatch.task_ids) ? kieBatch.task_ids.map(String) : [];

        const clips = await Promise.all(
          taskIds.map(async (id, index) => {
            const polled = await pollKieTaskOnce(KIE_AI_API_KEY, id, selectedModel);
            return {
              index,
              task_id: id,
              success: polled.success,
              status: polled.status,
              error: polled.error,
              video_url: polled.video_url,
            };
          }),
        );

        const successful = clips.filter((c) => c.success && c.video_url);
        const hasFailed = clips.some((c) => c.status === 'failed');
        const allDone = clips.every((c) => c.status === 'completed');
        const status = allDone ? 'completed' : hasFailed && successful.length === 0 ? 'failed' : 'processing';

        return new Response(JSON.stringify({
          task_id: rawTaskId,
          status,
          engine: 'kieai',
          model_selected: selectedModel,
          model_reason: reason,
          total_clips: clips.length,
          successful_clips: successful.length,
          video_clips: clips,
          video_url: successful[0]?.video_url || null,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const safeTaskId = rawTaskId.substring(0, 100).replace(/[^a-zA-Z0-9_-]/g, "");
      if (!safeTaskId) {
        return new Response(JSON.stringify({ error: "Missing task_id" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (!JSON2VIDEO_API_KEY) {
        throw new Error('JSON2VIDEO_API_KEY is not configured');
      }

      const response = await fetch(`${JSON2VIDEO_API_BASE}/movies?project=${safeTaskId}`, {
        method: 'GET',
        headers: apiHeaders,
      });

      if (!response.ok) {
        console.error("JSON2Video query error:", response.status, await response.text());
        throw new Error("Video query failed");
      }

      const qData = await response.json();
      const movie = qData.movie || qData;
      let status = movie.status;
      if (status === 'rendering') status = 'processing';
      if (status === 'done') status = 'completed';
      if (status === 'error') status = 'failed';

      return new Response(JSON.stringify({
        task_id: movie.project || safeTaskId,
        status,
        video_url: movie.url || null,
        duration: movie.duration || null,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Video generation error:', error);
    return new Response(JSON.stringify({ error: "Request failed, please try again" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
