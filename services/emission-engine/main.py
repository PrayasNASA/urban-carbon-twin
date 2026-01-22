from fastapi import FastAPI
from app.api.gee import router as gee_router
from app.api.emissions import router as emission_router
from app.api.simulation import router as simulation_router

app = FastAPI(
    title="Emission Engine",
    version="1.0.0"
)

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(emission_router)
app.include_router(gee_router, prefix="/api/v1/gee", tags=["Google Earth Engine"])
app.include_router(simulation_router, prefix="/simulation", tags=["Simulation"])


@app.get("/")
def health():
    return {
        "service": "emission-engine",
        "status": "running"
    }
