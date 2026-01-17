from fastapi import FastAPI
from app.api.scenarios import router as scenario_router

app = FastAPI(
    title="API Gateway",
    version="1.0.0"
)

app.include_router(scenario_router)


@app.get("/")
def health():
    return {
        "service": "api-gateway",
        "status": "running"
    }
