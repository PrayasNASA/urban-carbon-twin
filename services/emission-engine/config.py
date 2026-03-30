# Emission factors (planning-grade)

TRAFFIC_EMISSION_FACTOR = 0.25   # kg CO2 per meter of road
RESIDENTIAL_EMISSION_FACTOR = 0.8  # kg CO2 per building
INDUSTRIAL_EMISSION_FACTOR = 5.0   # kg CO2 per grid (baseline)

# GIS Service endpoint
# GIS_BASE_URL = "http://localhost:8000"

import os

def _ensure_http(url: str) -> str:
    if url and not url.startswith("http"):
        return f"http://{url}"
    return url

GIS_BASE_URL = _ensure_http(os.getenv(
    "GIS_BASE_URL",
    "http://localhost:8000"
))
