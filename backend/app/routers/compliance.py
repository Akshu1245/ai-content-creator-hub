from fastapi import APIRouter
from pydantic import BaseModel
from app.services.compliance_scorer import (
    score_text, 
    get_model_info
)

router = APIRouter(prefix="/api/compliance", tags=["compliance"])

class ScoreRequest(BaseModel):
    text: str
    context: str = ""

class BatchScoreRequest(BaseModel):
    texts: list[str]


@router.post("/score")
async def score_content(request: ScoreRequest):
    """Score content using trained DistilBERT model."""
    full_text = f"{request.context} {request.text}".strip()
    result = await score_text(full_text)
    return result


@router.post("/score-text")
async def score_text_endpoint(request: ScoreRequest):
    """Alias for /score endpoint."""
    return await score_content(request)


@router.post("/batch-score")
async def batch_score(request: BatchScoreRequest):
    """Score multiple texts at once."""
    import asyncio
    results = await asyncio.gather(*[
        score_text(text) for text in request.texts[:10]
    ])
    return {
        "results": results,
        "count": len(results),
        "avg_score": sum(
            r["score"] for r in results
        ) / len(results) if results else 0
    }


@router.get("/model-info")
async def model_info():
    """Check if trained model is loaded and working."""
    return get_model_info()


@router.get("/health")
async def compliance_health():
    info = get_model_info()
    return {
        "status": "ok" if info["model_loaded"] else "degraded",
        "model": "vorax-distilbert-v2",
        "using_trained_model": info["model_loaded"],
        "fallback": "rule-based" if not info["model_loaded"] else None
    }
