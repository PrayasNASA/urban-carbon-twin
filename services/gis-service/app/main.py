import logging
from fastapi import FastAPI
from app.api.grids import router as grid_router
from app.api.adjacency import router as adjacency_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn")

logger.info("Application startup: GIS Service initializing...")

app = FastAPI(
    title="GIS Service",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    logger.info("Application startup complete. Ready to accept requests.")

app.include_router(grid_router, prefix="/city")
app.include_router(adjacency_router, prefix="/city")


@app.get("/")
def health():
    return {
        "service": "gis-service",
        "status": "running"
    }


if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8080))
    logger.info(f"Starting uvicorn on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port, forwarded_allow_ips="*")
