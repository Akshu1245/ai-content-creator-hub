import os
import re
import asyncio
from typing import Dict, Any, List

import httpx
from dotenv import load_dotenv

load_dotenv()

KIE_AI_API_KEY = os.getenv("KIE_AI_API_KEY")
KIE_BASE_URL = "https://api.kie.ai/api/v1"

MODELS = {
    "veo3_fast": {
        "endpoint": "/veo/generate",
        "supports_audio": True,
    },
    "veo3_quality": {
        "endpoint": "/veo/generate",
        "supports_audio": True,
    },
    "runway-duration-5-generate": {
        "endpoint": "/runway/generate",
        "supports_audio": False,
    },
    "runway-duration-10-generate": {
        "endpoint": "/runway/generate",
        "supports_audio": False,
    },
    "wan2.6-t2v-plus": {
        "endpoint": "/wan/generate",
        "supports_audio": True,
    },
}


def sanitize_prompt(text: str, max_len: int = 1800) -> str:
    if not text:
        return ""
    clean = re.sub(r"[\x00-\x1f\x7f]", "", text).strip()
    return clean[:max_len]


def auto_select_model(
    prompt: str,
    niche: str = "",
    style: str = "educational",
    quality_preference: str = "balanced",
    language: str = "en",
) -> Dict[str, Any]:
    prompt_lower = f"{prompt} {niche} {style}".lower()

    indian_languages = ["hi", "kn", "ta", "te", "bn", "mr"]
    if language.lower().split("-")[0] in indian_languages:
        return {
            "model": "wan2.6-t2v-plus",
            "reason": "Best model for Indian language content",
            "endpoint": MODELS["wan2.6-t2v-plus"]["endpoint"],
            "supports_audio": True,
        }

    creative_keywords = [
        "fashion", "music", "art", "creative", "gaming",
        "animation", "entertainment", "comedy", "meme",
        "vfx", "cinematic effects", "abstract", "dance",
    ]
    if any(kw in prompt_lower for kw in creative_keywords):
        return {
            "model": "runway-duration-5-generate",
            "reason": "Runway excels at creative/artistic content",
            "endpoint": MODELS["runway-duration-5-generate"]["endpoint"],
            "supports_audio": False,
        }

    story_keywords = [
        "story", "vlog", "journey", "day in life",
        "cooking", "recipe", "tutorial", "how to",
        "step by step", "process", "multi", "scene",
    ]
    if any(kw in prompt_lower for kw in story_keywords):
        return {
            "model": "wan2.6-t2v-plus",
            "reason": "Wan 2.6 best for multi-shot storytelling",
            "endpoint": MODELS["wan2.6-t2v-plus"]["endpoint"],
            "supports_audio": True,
        }

    premium_keywords = [
        "premium", "ultra", "cinematic", "professional",
        "advertisement", "brand", "commercial", "film",
    ]
    if quality_preference == "premium" or any(kw in prompt_lower for kw in premium_keywords):
        return {
            "model": "veo3_quality",
            "reason": "Veo 3 Quality for premium cinematic output",
            "endpoint": MODELS["veo3_quality"]["endpoint"],
            "supports_audio": True,
        }

    return {
        "model": "veo3_fast",
        "reason": "Veo 3 Fast - best balance of quality/speed/cost",
        "endpoint": MODELS["veo3_fast"]["endpoint"],
        "supports_audio": True,
    }


def enhance_prompt_for_video(script: str, niche: str, style: str, model: str) -> List[str]:
    sentences = [s.strip() for s in script.split(".") if len(s.strip()) > 20][:5]

    style_modifiers = {
        "educational": "clean professional setting, whiteboard or office background, bright lighting, 4K quality",
        "entertainment": "dynamic lighting, vibrant colors, energetic atmosphere, cinematic quality",
        "documentary": "realistic environment, natural lighting, documentary style, professional cinematography",
        "motivational": "inspiring backdrop, golden hour lighting, cinematic wideshot",
        "news": "professional news studio, clean background, sharp focus",
        "finance": "modern office, charts and graphs visible, professional corporate setting",
        "horror": "dark atmospheric lighting, eerie environment, fog effects",
        "comedy": "bright cheerful setting, colorful background, fun atmosphere",
    }

    model_suffix = {
        "veo3_fast": "smooth camera movement, photorealistic, no text overlays",
        "veo3_quality": "ultra HD, cinematic depth of field, professional grade, film quality",
        "runway-duration-5-generate": "artistic style, creative motion, stylized visuals",
        "runway-duration-10-generate": "artistic style, creative motion, stylized visuals",
        "wan2.6-t2v-plus": "multi-shot sequence, smooth transitions, narrative flow",
    }

    prompts = []
    for sentence in sentences:
        prompt = (
            f"A video about: {sentence}. "
            f"Niche: {niche}. "
            f"Visual style: {style_modifiers.get(style, 'professional setting, high quality')}. "
            f"{model_suffix.get(model, 'high quality, professional')}. "
            f"No text, no subtitles, no watermarks."
        )
        prompts.append(sanitize_prompt(prompt))

    return prompts if prompts else [sanitize_prompt(f"{niche} topic video. {style_modifiers.get(style, '')}")]


async def generate_single_clip(
    prompt: str,
    model_config: Dict[str, Any],
    aspect_ratio: str = "16:9",
    duration: int = 5,
) -> Dict[str, Any]:
    if not KIE_AI_API_KEY:
        return {
            "success": False,
            "error": "KIE_AI_API_KEY is not configured",
            "video_url": None,
            "task_id": None,
        }

    headers = {
        "Authorization": f"Bearer {KIE_AI_API_KEY}",
        "Content-Type": "application/json",
    }

    model_name = model_config["model"]

    if "veo" in model_name:
        payload = {
            "prompt": prompt,
            "model": model_name,
            "aspect_ratio": aspect_ratio,
            "watermark": "",
            "enableTranslation": True,
        }
    elif "runway" in model_name:
        payload = {
            "prompt": prompt,
            "model": model_name,
            "waterMark": "",
            "duration": min(duration, 10),
            "quality": "720p",
        }
    else:
        payload = {
            "prompt": prompt,
            "model": model_name,
            "aspect_ratio": aspect_ratio,
            "multi_shots": True,
        }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{KIE_BASE_URL}{model_config['endpoint']}",
                headers=headers,
                json=payload,
            )
            response.raise_for_status()
            data = response.json()

            task_id = data.get("data", {}).get("taskId")
            if not task_id:
                return {
                    "success": False,
                    "error": "No task ID returned",
                    "video_url": None,
                    "task_id": None,
                }

            for _ in range(20):
                await asyncio.sleep(6)
                status_result = await check_task_status(task_id, model_name)

                if status_result["status"] == "completed":
                    return {
                        "success": True,
                        "video_url": status_result["video_url"],
                        "task_id": task_id,
                        "model": model_name,
                    }
                if status_result["status"] == "failed":
                    return {
                        "success": False,
                        "error": status_result.get("error", "Generation failed"),
                        "video_url": None,
                        "task_id": task_id,
                    }

            return {
                "success": False,
                "error": "Generation timeout",
                "video_url": None,
                "task_id": task_id,
            }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "video_url": None,
            "task_id": None,
        }


async def check_task_status(task_id: str, model: str) -> Dict[str, Any]:
    if not KIE_AI_API_KEY:
        return {"status": "failed", "error": "Missing API key", "video_url": None}

    headers = {"Authorization": f"Bearer {KIE_AI_API_KEY}"}

    if "veo" in model:
        endpoint = f"/veo/task/{task_id}"
    elif "runway" in model:
        endpoint = f"/runway/task/{task_id}"
    else:
        endpoint = f"/wan/task/{task_id}"

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(f"{KIE_BASE_URL}{endpoint}", headers=headers)
            response.raise_for_status()
            data = response.json()

            task_data = data.get("data", {})
            status = task_data.get("status", "processing").lower()

            if status in ["completed", "success", "done"]:
                video_url = (
                    task_data.get("videoUrl")
                    or task_data.get("video_url")
                    or task_data.get("url")
                    or task_data.get("output", {}).get("url")
                )
                return {"status": "completed", "video_url": video_url, "error": None}

            if status in ["failed", "error"]:
                return {
                    "status": "failed",
                    "video_url": None,
                    "error": task_data.get("errorMessage", "Generation failed"),
                }

            return {"status": "processing", "video_url": None, "error": None}

    except Exception as e:
        return {"status": "processing", "video_url": None, "error": str(e)}


async def generate_full_video_pipeline(
    script: str,
    niche: str,
    style: str,
    quality: str = "balanced",
    language: str = "en-IN",
    platform: str = "youtube",
) -> Dict[str, Any]:
    model_selection = auto_select_model(
        prompt=script,
        niche=niche,
        style=style,
        quality_preference=quality,
        language=language,
    )

    aspect_ratio = "16:9" if platform in ["youtube", "linkedin"] else "9:16"

    clip_prompts = enhance_prompt_for_video(
        script=script,
        niche=niche,
        style=style,
        model=model_selection["model"],
    )

    clip_prompts = clip_prompts[:3]

    tasks = [
        generate_single_clip(
            prompt=clip_prompt,
            model_config=model_selection,
            aspect_ratio=aspect_ratio,
            duration=5,
        )
        for clip_prompt in clip_prompts
    ]

    clip_results = await asyncio.gather(*tasks)

    successful_clips = [clip for clip in clip_results if clip.get("success")]

    return {
        "model_selected": model_selection["model"],
        "model_reason": model_selection["reason"],
        "total_clips": len(clip_results),
        "successful_clips": len(successful_clips),
        "video_clips": clip_results,
        "primary_video_url": successful_clips[0].get("video_url") if successful_clips else None,
        "generation_success": len(successful_clips) > 0,
    }
