from fastapi import FastAPI
from app.api.dispersion import router as dispersion_router

app = FastAPI(
    title="Dispersion Engine",
    version="1.0.0"
)

app.include_router(dispersion_router)


@app.get("/")
def health():
    return {
        "service": "dispersion-engine",
        "status": "running"
    }
