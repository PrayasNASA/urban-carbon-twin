
import os

def _ensure_http(url: str) -> str:
    if url and not url.startswith("http"):
        return f"http://{url}"
    return url

GIS_BASE_URL = _ensure_http(os.getenv(
    "GIS_BASE_URL",
    "http://localhost:8000"
))

EMISSION_ENGINE_URL = _ensure_http(os.getenv(
    "EMISSION_ENGINE_URL",
    "http://localhost:8001"
))

# # Service endpoints
# GIS_BASE_URL = "http://localhost:8000"
# EMISSION_ENGINE_URL = "http://localhost:8001"

# Dispersion parameters
DIFFUSION_FACTOR = 0.15   # % spread to neighbors per step
DECAY_FACTOR = 0.02       # natural loss per step
TIME_STEPS = 5            # simulation iterations

