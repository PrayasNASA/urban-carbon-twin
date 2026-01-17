from fastapi import FastAPI
from app.api.interventions import router as intervention_router

app = FastAPI(
    title="Intervention Engine",
    version="1.0.0"
)

app.include_router(intervention_router)


@app.get("/")
def health():
    return {
        "service": "intervention-engine",
        "status": "running"
    }
