# Upstream services
# DISPERSION_ENGINE_URL = "http://localhost:8002"

import os

def _ensure_http(url: str) -> str:
    if url and not url.startswith("http"):
        return f"http://{url}"
    return url

DISPERSION_ENGINE_URL = _ensure_http(os.getenv(
    "DISPERSION_ENGINE_URL",
    "http://localhost:8002"
))


# Default intervention efficiencies (fractional reduction)
INTERVENTION_LIBRARY = {
    "roadside_capture": {
        "efficiency": 0.25,   # 25% reduction
        "max_units_per_grid": 3
    },
    "vertical_garden": {
        "efficiency": 0.15,
        "max_units_per_grid": 5
    },
    "biofilter": {
        "efficiency": 0.20,
        "max_units_per_grid": 2
    }
}
