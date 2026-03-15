import asyncio
import uuid
from typing import Dict, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.kieai_service import generate_full_video_pipeline

router = APIRouter(prefix="/api", tags=["video"])

jobs: Dict[str, Dict] = {}


class VideoGenerationRequest(BaseModel):
    script: str
    niche: str
    style: str = "educational"
    quality: str = "balanced"
    language: str = "en-IN"
    platform: str = "youtube"
    voice: Optional[str] = "roger"


async def mock_generate_voice(script: str, voice: Optional[str]) -> Dict:
    await asyncio.sleep(0.2)
    return {"voice": voice or "roger", "audio_url": None, "status": "completed"}


async def run_video_pipeline(job_id: str, request: VideoGenerationRequest):
    try:
        jobs[job_id]["status"] = "generating_voice"
        voice_result = await mock_generate_voice(request.script, request.voice)

        jobs[job_id]["status"] = "generating_video"

        # Kie.ai model selection + clip generation (primary engine)
        video_result = await generate_full_video_pipeline(
            script=request.script,
            niche=request.niche,
            style=request.style,
            quality=request.quality,
            language=request.language,
            platform=request.platform,
        )

        jobs[job_id] = {
            "status": "completed" if video_result["generation_success"] else "failed",
            "voice": voice_result,
            "video": {
                "model_used": video_result["model_selected"],
                "model_reason": video_result["model_reason"],
                "clips": video_result["video_clips"],
                "primary_url": video_result["primary_video_url"],
            },
        }
    except Exception as e:
        jobs[job_id] = {"status": "failed", "error": str(e)}


@router.post("/video/pipeline")
async def create_video_pipeline(request: VideoGenerationRequest):
    if not request.script.strip():
        raise HTTPException(status_code=400, detail="Script is required")

    job_id = str(uuid.uuid4())
    jobs[job_id] = {"status": "queued"}
    asyncio.create_task(run_video_pipeline(job_id, request))
    return {"job_id": job_id, "status": "queued"}


@router.get("/video/jobs/{job_id}")
async def get_video_job(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
