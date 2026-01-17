from fastapi import FastAPI
from app.api.optimize import router as optimize_router

app = FastAPI(
    title="Optimization Engine",
    version="1.0.0"
)

app.include_router(optimize_router)


@app.get("/")
def health():
    return {
        "service": "optimizer-service",
        "status": "running"
    }
