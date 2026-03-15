from fastapi import FastAPI

from app.routers.video import router as video_router
from app.routers.compliance import router as compliance_router

app = FastAPI(title="VORAX Backend", version="1.0.0")
app.include_router(video_router)
app.include_router(compliance_router)


@app.get("/")
async def root():
    return {"status": "ok", "service": "vorax-backend"}
