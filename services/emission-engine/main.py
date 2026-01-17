from fastapi import FastAPI
from app.api.emissions import router as emission_router

app = FastAPI(
    title="Emission Engine",
    version="1.0.0"
)

app.include_router(emission_router)


@app.get("/")
def health():
    return {
        "service": "emission-engine",
        "status": "running"
    }
